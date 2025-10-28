import { z } from "zod";
import { serverSupabaseClient } from "#supabase/server";
import { supabaseAdmin } from "~~/server/utils/supabaseAdmin";
import { monsterCatalog } from "#imports";
import { computeDerivedStatBonus } from "~~/utils/heroUtils";

const combatSubmitSchema = z.object({
  monsterID: z.number(),
  stance: z.enum(["balanced", "offensive", "defensive"]),
  retreatValue: z.number().min(0).max(100),
});

export default defineEventHandler(async (event) => {
  try {
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

    const body = await readBody(event);

    const result = combatSubmitSchema.safeParse(body);
    if (!result.success) {
      throw createError({
        statusCode: 400,
        message: result.error.issues[0].message,
      });
    }

    const combatSettings = result.data;
    console.log("combat settings:", combatSettings);

    //get monster based on submitted id.
    const monster = monsterCatalog.find(
      (m) => m.id === combatSettings.monsterID
    );
    console.log("monster data:", monster);

    //get hero from heroes table and update modified/ derived stat values.
    const { data: hero, error: heroError } = await supabaseAdmin
      .from("heroes")
      .select("*")
      .eq("user_id", user.id)
      .maybeSingle();

    if (heroError) {
      throw createError({ statusCode: 500, message: heroError.message });
    }

    if (!hero) {
      throw createError({ statusCode: 400, message: "Hero not found." });
    }

    console.log("hero from DB:", hero);

    //Apply derived stat bonuses
    const statBonuses = computeDerivedStatBonus({
      speed: hero.speed,
      block: hero.block,
      evasion: hero.evasion,
      initiative: hero.initiative,
    });

    hero.evasion = statBonuses.trueEvasion;
    hero.block = statBonuses.trueBlock;
    hero.initiative = statBonuses.trueInitiative;

    console.log("Hero with bonuses:", hero);
  } catch (err) {
    throw err;
  }
});
