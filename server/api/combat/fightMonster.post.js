import { z } from "zod";
import { serverSupabaseClient } from "#supabase/server";
import { supabaseAdmin } from "~~/server/utils/supabaseAdmin";
import { monsterCatalog } from "#imports";
import { computeDerivedStatBonus, getItemBonuses } from "~~/utils/heroUtils";
import { doCombat } from "~~/server/utils/combat";
import { getItemByInventoryId, getItemById } from "~~/utils/itemCatalog";

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

    //Get hero equipped items (gets inventory IDs, which have to get matched with correct item id from hero_inventory)
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

    //Get hero inventory
    const { data: inventory, error: inventoryError } = await supabase
      .from("hero_inventory")
      .select("*")
      .eq("hero_id", hero.id);
    if (inventoryError) {
      throw createError({ statusCode: 500, message: inventoryError.message });
    }

    if (!inventory) {
      throw createError({
        statusCode: 400,
        message: "No inventory found.",
      });
    }
    //Get all equipped items
    const heroEquipment = {
      main_hand: getItemByInventoryId(equipment.main_hand, inventory),
      off_hand: getItemByInventoryId(equipment.off_hand, inventory),
      armour: getItemByInventoryId(equipment.armour, inventory),
      trinket_1: getItemByInventoryId(equipment.trinket_1, inventory),
      trinket_2: getItemByInventoryId(equipment.trinket_2, inventory),
      trinket_3: getItemByInventoryId(equipment.trinket_3, inventory),
    };

    //If hero does not have a weapon equipped set main_hand to use a fallback weapon, their fists.
    if (heroEquipment.main_hand === null) {
      const fists = getItemById(400);
      heroEquipment.main_hand = fists;
    }
    //Check equipped items for any item bonuses
    const itemBonuses = getItemBonuses(heroEquipment);

    //Update hero with bonuses, recalculate max HP and current HP, and block, ini and evasion.
    hero.strength += itemBonuses.strength || 0;
    hero.speed += itemBonuses.speed || 0;
    hero.vitality += itemBonuses.vitality || 0;
    hero.swords += itemBonuses.swords || 0;
    hero.axes += itemBonuses.axes || 0;
    hero.hammers += itemBonuses.hammers || 0;
    hero.spears += itemBonuses.spears || 0;
    hero.daggers += itemBonuses.daggers || 0;
    hero.block += itemBonuses.block || 0;
    hero.evasion += itemBonuses.evasion || 0;
    hero.initiative += itemBonuses.initiative || 0;

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

    //Set hp value at which the player hero will retreat/ give up the fight.
    const retreatValue = Math.ceil(
      (combatSettings.retreatValue / 100) * hero.hp_max
    );
    //Run the combat loop
    //Executes all combat related game logic and returns the results
    const combatResult = doCombat(hero, heroEquipment, retreatValue, monster);

    //Add intermediate hero HP-check before updating
    //If hero HP is 0 or lower, the hero died in combat and gets DELETED! So dramatic..
    //If dead, the heroes name, level, and xp is put in the graveyard table.
    if (combatResult.heroHP <= 0) {
      const { error: graveError } = await supabaseAdmin
        .from("graveyard")
        .insert({
          hero_name: hero.hero_name,
          hero_lvl: hero.level,
          hero_xp: hero.xp,
        });

      if (graveError) {
        throw createError({
          statusCode: 500,
          message: graveError.message,
        });
      }

      const { error: heroDeleteError } = await supabaseAdmin
        .from("heroes")
        .delete()
        .eq("id", hero.id);

      if (heroDeleteError) {
        throw createError({
          statusCode: 500,
          message: heroDeleteError.message,
        });
      }

      return combatResult.combatLog;
    }

    const heroWin = combatResult.heroWon;
    const newGrit = (hero.grit_current ?? 0) - combatResult.turnCounter;
    const newGold = (hero.gold ?? 0) + (combatResult.rewards?.gold ?? 0);
    const newXp = (hero.xp ?? 0) + (combatResult.rewards?.xp ?? 0);

    const updatePayload = {
      hp_current: combatResult.heroHP,
      grit_current: newGrit,
      gold: newGold,
      xp: newXp,
    };

    if (heroWin) {
      updatePayload.wins = (hero.wins ?? 0) + 1;
    } else {
      updatePayload.losses = (hero.losses ?? 0) + 1;
    }

    //Update hero in heroes table. Hp, grit - turns in combat, gold and xp
    const { error: updateError } = await supabaseAdmin
      .from("heroes")
      .update(updatePayload)
      .eq("id", hero.id);

    if (updateError) {
      throw createError({ statusCode: 500, message: updateError.message });
    }

    return combatResult.combatLog;
  } catch (err) {
    throw err;
  }
});
