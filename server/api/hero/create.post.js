import { z } from "zod";
import { serverSupabaseUser } from "#supabase/server";
import { supabaseAdmin } from "~~/server/utils/supabaseAdmin";
import {
  applyBaseAttributeScores,
  calculateAssignedStartingPoints,
  computeHeroHP,
} from "~~/server/utils/heroUtils";

const startingPoints = 75;
const xpToLevelTwo = 200;

const heroSchema = z.object({
  name: z
    .string()
    .min(3)
    .max(16)
    .regex(/^[a-zA-Z0-9_]+$/, "Only letters, numbers, and underscores allowed"),
  avatar: z.number(),
  gold: z.number(150),
  level: z.number(1),
  xp: z.number(0),
  xp_next_lvl: z.number(xpToLevelTwo),
  hp_current: z.number(),
  hp_max: z.number(),
  grit_current: z.number(125), //Assign Grit
  grit_max: z.number(125),
  stats: z.object({
    strength: z.number().min(0),
    speed: z.number().min(0),
    vitality: z.number().min(0),
    swords: z.number().min(0),
    axes: z.number().min(0),
    hammers: z.number().min(0),
    spears: z.number().min(0),
    daggers: z.number().min(0),
    block: z.number().min(0),
    evasion: z.number().min(0),
    initiative: z.number().min(0),
  }),
});

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const user = await serverSupabaseUser(event);

  if (!user)
    throw createError({ statusCode: 401, message: "Not authenticated" });

  const result = heroSchema.safeParse(body);
  console.log(result); //remove log
  if (!result.success)
    throw createError({
      statusCode: 400,
      message: result.error.issues[0].message,
    });

  const hero = result.data;

  hero.stats = Object.fromEntries(
    Object.entries(hero.stats).map(([k, v]) => [k, Number(v)])
  );

  const pointsSpent = calculateAssignedStartingPoints(hero.stats);
  if (pointsSpent > startingPoints)
    throw createError({ statusCode: 400, message: "Too many points spent." });
  if (pointsSpent < startingPoints)
    throw createError({
      statusCode: 400,
      message: "Only " + pointsSpent + " points spent.",
    });

  //Apply a base value of 5 and set updated attribute values
  const trueBaseAttributes = applyBaseAttributeScores(
    hero.stats.strength,
    hero.stats.speed,
    hero.stats.vitality
  );

  hero.stats.strength = trueBaseAttributes.finalStrength;
  hero.stats.speed = trueBaseAttributes.finalSpeed;
  hero.stats.vitality = trueBaseAttributes.finalVitality;

  //Get Hero hitpoints calculation
  const getMaxHP = computeHeroHP(hero.stats.strength, hero.stats.vitality);
  const currentHP = getMaxHP;
  console.log(getMaxHP);
  console.log(typeof getMaxHP);
  //Make sure user does not already have an active hero
  const { data: existingHero } = await supabaseAdmin
    .from("heroes")
    .select("id")
    .eq("user_id", user.id)
    .maybeSingle();

  if (existingHero)
    throw createError({ statusCode: 400, message: "Hero already exists." });

  console.log({
    user_id: user.id,
    hero_name: hero.name,
    hp_max: getMaxHP,
    hp_current: currentHP,
    ...hero.stats,
  });
  //If all good, insert new hero! Praise the spread operator
  const { data, error } = await supabaseAdmin
    .from("heroes")
    .insert([
      {
        user_id: user.id,
        hero_name: hero.name,
        avatar: hero.avatar,
        level: hero.level,
        xp: hero.xp,
        xp_next_lvl: hero.xp_next_lvl,
        gold: hero.gold,
        hp_max: getMaxHP,
        hp_current: currentHP,
        grit_max: hero.grit_max,
        grit_current: hero.grit_current,
        ...hero.stats,
      },
    ])
    .select()
    .single();

  if (error) throw createError({ statusCode: 500, message: error.message });

  return { success: true, hero: data, message: "Hero created!" };
});
