import { z } from "zod";
import { serverSupabaseClient } from "#supabase/server";
import { supabaseAdmin } from "~~/server/utils/supabaseAdmin";
import {
  calculateAssignedStartingPoints,
  computeHeroHP,
} from "~~/utils/heroUtils";
import { getXpForNextLevel } from "~~/server/utils/levels";

const lvlUpSchema = z.object({
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

const availablePoints = 20;

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

    const result = lvlUpSchema.safeParse(body);
    if (!result.success) {
      throw createError({
        statusCode: 400,
        message: result.error.issues[0].message,
      });
    }

    const statUpdate = result.data;

    const pointsSpent = calculateAssignedStartingPoints(statUpdate.stats);
    if (pointsSpent > availablePoints) {
      throw createError({ statusCode: 400, message: "Too many points spent." });
    }
    if (pointsSpent < availablePoints) {
      throw createError({
        statusCode: 400,
        message: `Only ${pointsSpent} points spent.`,
      });
    }

    //Fetch hero
    const { data: hero, error: heroError } = await supabaseAdmin
      .from("heroes")
      .select(
        `
    id, level, strength, speed, vitality,
    swords, axes, hammers, spears, daggers,
    block, evasion, initiative
    `
      )
      .eq("user_id", user.id)
      .maybeSingle();

    if (heroError) {
      throw createError({ statusCode: 500, message: checkError.message });
    }

    if (!hero) {
      throw createError({
        statusCode: 400,
        message: "No hero found.",
      });
    }

    //Prepare the update, filter only updated stats
    const updates = {};
    for (const [key, value] of Object.entries(statUpdate.stats)) {
      // Only update if points were assigned to this stat
      if (value > 0) {
        updates[key] = hero[key] + value;
      }
    }

    console.log("Updates:", updates);

    //Re-calculate max HP
    const maxHP = computeHeroHP(
      updates.strength ?? hero.strength,
      updates.vitality ?? hero.vitality
    );

    console.log("New hp: ", maxHP);

    //get XP to next level
    const newXpThreshold = getXpForNextLevel(hero.level);
  } catch (err) {
    throw err;
  }
});
