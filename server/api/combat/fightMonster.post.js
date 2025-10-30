import { z } from "zod";
import { serverSupabaseClient } from "#supabase/server";
import { supabaseAdmin } from "~~/server/utils/supabaseAdmin";
import { monsterCatalog } from "#imports";
import { computeDerivedStatBonus } from "~~/utils/heroUtils";
import { doCombat } from "~~/server/utils/combat";
import { getItemById } from "~~/utils/itemCatalog";

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

    //get monster based on submitted id.
    const monster = monsterCatalog.find(
      (m) => m.id === combatSettings.monsterID
    );

    //get hero from heroes table.
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

    //Get hero equipped items (gets item IDs)
    const { data: equipment, error: equipError } = await supabase
      .from("hero_equipment")
      .select("*")
      .eq("hero_id", hero.id)
      .maybeSingle();

    if (equipError) {
      throw createError({ statusCode: 500, message: equipError.message });
    }

    if (!equipment) {
      throw createError({ statusCode: 400, message: "No equipment found." });
    }

    //Get all equipped items
    const heroEquipment = {
      main_hand: getItemById(equipment.main_hand),
      off_hand: getItemById(equipment.off_hand),
      armour: getItemById(equipment.armour),
      trinket_1: getItemById(equipment.trinket_1),
      trinket_2: getItemById(equipment.trinket_2),
      trinket_3: getItemById(equipment.trinket_3),
    };

    //Set hp value at which the player hero will retreat/ give up the fight.
    const retreatValue = Math.ceil(
      (combatSettings.retreatValue / 100) * hero.hp_max
    );
    //Run the combat loop
    //Executes all combat related game logic and returns the results
    const combatResult = doCombat(hero, heroEquipment, retreatValue, monster);

    return combatResult.combatLog;
  } catch (err) {
    throw err;
  }
});
