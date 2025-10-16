import { z } from "zod";
import { serverSupabaseClient, serverSupabaseUser } from "#supabase/server";
//import { supabaseAdmin } from "~~/server/utils/supabaseAdmin";
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
  const supabase = await serverSupabaseClient(event);

  if (!user)
    throw createError({ statusCode: 401, message: "Not authenticated" });

  const result = heroSchema.safeParse(body);
  if (!result.success)
    throw createError({
      statusCode: 400,
      message: result.error.issues[0].message,
    });

  const hero = result.data;

  const pointsSpent = calculateAssignedStartingPoints(hero.stats);
  if (pointsSpent > startingPoints)
    throw createError({ statusCode: 400, message: "Too many points spent." });
  if (pointsSpent < startingPoints)
    ({ statusCode: 400, message: "Only " + pointsSpent + " points spent." });

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

  //Set hp values, both are equal as a hero has full hp on hero creation
  hero.hp_max = getMaxHP;
  hero.hp_current = getMaxHP;

  //Make sure user does not already have an active hero
  const { data: existingHero } = await supabase
    .from("heroes")
    .select("id")
    .eq("user_id", user.id)
    .maybeSingle();

  if (existingHero)
    throw createError({ statusCode: 400, message: "Hero already exists." });

  //If all good, insert new hero! Praise the spread operator
  const { data, error } = await supabase.from("heroes").insert([
    {
      user_id: user.id,
      hero_name: hero.name,
      avatar: hero.avatar,
      level: hero.level,
      xp: hero.xp,
      xp_next_lvl: hero.xp_next_lvl,
      gold: hero.gold,
      hp_max: hero.hp_max,
      hp_current: hero.hp_current,
      grit_max: hero.grit_max,
      grit_current: hero.grit_current,
      ...hero.stats,
    },
  ]);

  if (error) throw createError({ statusCode: 500, message: error.message });

  return { success: true, hero: data[0] };
});
