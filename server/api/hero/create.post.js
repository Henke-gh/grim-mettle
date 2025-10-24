import { z } from "zod";
import { serverSupabaseClient } from "#supabase/server";
import { supabaseAdmin } from "~~/server/utils/supabaseAdmin";
import {
  applyBaseAttributeScores,
  calculateAssignedStartingPoints,
  computeHeroHP,
} from "~~/utils/heroUtils";

const startingPoints = 75;

const heroSchema = z.object({
  name: z
    .string()
    .min(3)
    .max(16)
    .regex(/^[a-zA-Z0-9_]+$/, "Only letters, numbers, and underscores allowed"),
  avatar: z.number(),
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
  try {
    const body = await readBody(event);

    // Get the user-scoped Supabase client (reads the session cookie)
    const supabase = await serverSupabaseClient(event);

    // Verify the user is authenticated
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      throw createError({ statusCode: 401, message: "Not authenticated" });
    }

    console.log("Authenticated user ID:", user.id);

    const result = heroSchema.safeParse(body);
    if (!result.success) {
      throw createError({
        statusCode: 400,
        message: result.error.issues[0].message,
      });
    }

    const hero = result.data;

    const pointsSpent = calculateAssignedStartingPoints(hero.stats);
    if (pointsSpent > startingPoints) {
      throw createError({ statusCode: 400, message: "Too many points spent." });
    }
    if (pointsSpent < startingPoints) {
      throw createError({
        statusCode: 400,
        message: `Only ${pointsSpent} points spent.`,
      });
    }

    // Apply base attribute scores
    const trueBaseAttributes = applyBaseAttributeScores(
      hero.stats.strength,
      hero.stats.speed,
      hero.stats.vitality
    );

    hero.stats.strength = trueBaseAttributes.finalStrength;
    hero.stats.speed = trueBaseAttributes.finalSpeed;
    hero.stats.vitality = trueBaseAttributes.finalVitality;

    // Calculate HP
    const maxHP = computeHeroHP(hero.stats.strength, hero.stats.vitality);

    // Use supabaseAdmin to bypass RLS and check for existing hero
    const { data: existingHero, error: checkError } = await supabaseAdmin
      .from("heroes")
      .select("id")
      .eq("user_id", user.id)
      .maybeSingle();

    if (checkError) {
      throw createError({ statusCode: 500, message: checkError.message });
    }

    if (existingHero) {
      throw createError({ statusCode: 400, message: "Hero already exists." });
    }

    // Use supabaseAdmin to insert (bypasses RLS for secure server-side control)
    const insertData = {
      user_id: user.id,
      hero_name: hero.name,
      avatar: hero.avatar,
      level: 1,
      xp: 0,
      xp_next_lvl: 200,
      gold: 200,
      hp_max: maxHP,
      hp_current: maxHP,
      grit_max: 125,
      grit_current: 125,
      ...hero.stats,
    };

    const { data, error } = await supabaseAdmin
      .from("heroes")
      .insert([insertData])
      .select()
      .single();

    if (error) {
      throw createError({ statusCode: 500, message: error.message });
    }

    //initialise/ insert hero into equipment table.
    //Early insertion here means we can rely purely on UPDATEs later on when the player switches gear on and off.
    const { defaultEquipmentError } = await supabaseAdmin
      .from("hero_equipment")
      .insert({
        user_id: user.id,
        hero_id: data.id,
        id: data.id,
      });

    if (defaultEquipmentError) {
      throw createError({ statusCode: 500, message: error.message });
    }

    return { success: true, hero: data, message: "Hero created!" };
  } catch (err) {
    throw err;
  }
});
