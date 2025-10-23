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
    console.log("=== START: Hero Create API ===");
    const body = await readBody(event);
    console.log("Request body:", JSON.stringify(body, null, 2));

    // Get the user-scoped Supabase client (reads the session cookie)
    const supabase = await serverSupabaseClient(event);

    // Verify the user is authenticated
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      console.error("Auth error:", userError);
      throw createError({ statusCode: 401, message: "Not authenticated" });
    }

    console.log("Authenticated user ID:", user.id);

    const result = heroSchema.safeParse(body);
    console.log("Zod validation result:", result.success ? "PASSED" : "FAILED");
    if (!result.success) {
      console.error("Validation errors:", result.error.issues);
      throw createError({
        statusCode: 400,
        message: result.error.issues[0].message,
      });
    }

    const hero = result.data;
    console.log("Validated hero data:", hero);

    const pointsSpent = calculateAssignedStartingPoints(hero.stats);
    console.log("Points spent:", pointsSpent);
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
    console.log("Applying base attribute scores...");
    const trueBaseAttributes = applyBaseAttributeScores(
      hero.stats.strength,
      hero.stats.speed,
      hero.stats.vitality
    );
    console.log("Base attributes applied:", trueBaseAttributes);

    hero.stats.strength = trueBaseAttributes.finalStrength;
    hero.stats.speed = trueBaseAttributes.finalSpeed;
    hero.stats.vitality = trueBaseAttributes.finalVitality;
    console.log("Updated hero stats:", hero.stats);

    // Calculate HP
    const maxHP = computeHeroHP(hero.stats.strength, hero.stats.vitality);
    console.log("Calculated maxHP:", maxHP);

    // Use supabaseAdmin to bypass RLS and check for existing hero
    console.log("Checking for existing hero...");
    const { data: existingHero, error: checkError } = await supabaseAdmin
      .from("heroes")
      .select("id")
      .eq("user_id", user.id)
      .maybeSingle();

    if (checkError) {
      console.error("Error checking existing hero:", checkError);
      throw createError({ statusCode: 500, message: checkError.message });
    }

    console.log("Existing hero check result:", existingHero ? "Found" : "None");

    if (existingHero) {
      throw createError({ statusCode: 400, message: "Hero already exists." });
    }

    console.log(
      "🔥 About to insert - checking supabaseAdmin:",
      !!supabaseAdmin
    );

    // Use supabaseAdmin to insert (bypasses RLS for secure server-side control)
    console.log("🔥 Attempting to insert hero...");
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
    console.log("🔥 Insert data:", JSON.stringify(insertData, null, 2));

    const { data, error } = await supabaseAdmin
      .from("heroes")
      .insert([insertData])
      .select()
      .single();

    if (error) {
      console.error("❌ Supabase insert error:", error);
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

    console.log("✅ Hero created successfully:", data);
    console.log("=== END: Hero Create API ===");
    return { success: true, hero: data, message: "Hero created!" };
  } catch (err) {
    console.error("=== CAUGHT ERROR ===", err);
    throw err;
  }
});
