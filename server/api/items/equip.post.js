import { supabaseAdmin } from "~~/server/utils/supabaseAdmin";
import { serverSupabaseClient } from "#supabase/server";
import { getItemById } from "~~/utils/itemCatalog";
import { z } from "zod";

const itemSchema = z.object({
  item_id: z.number(),
  inventory_id: z.number(),
  item_slot: z.enum(["main_hand", "off_hand", "armour", "trinket"]),
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
    const result = itemSchema.safeParse(body);
    if (!result.success) {
      throw createError({
        statusCode: 400,
        message: result.error.issues[0].message,
      });
    }
    /* Fetch Hero */
    //Value of item_slot changes if item type is a trinket, it's then set to the specific trinket slot to update.
    let { item_slot, inventory_id, item_id } = result.data;
    const { data: hero, error: heroError } = await supabaseAdmin
      .from("heroes")
      .select("id, strength")
      .eq("user_id", user.id)
      .single();
    if (heroError || !hero) {
      throw createError({ statusCode: 404, message: "Hero not found" });
    }

    /* Fetch equipped trinkets to calculate strength bonus */
    const { data: equippedTrinketsData } = await supabaseAdmin
      .from("hero_equipment")
      .select("trinket_1, trinket_2, trinket_3")
      .eq("hero_id", hero.id)
      .single();

    let strengthBonus = 0;
    if (equippedTrinketsData) {
      const trinketIds = [
        equippedTrinketsData.trinket_1,
        equippedTrinketsData.trinket_2,
        equippedTrinketsData.trinket_3,
      ].filter((id) => id !== null);

      for (const trinketInventoryId of trinketIds) {
        const { data: trinketInventory } = await supabaseAdmin
          .from("hero_inventory")
          .select("item_id")
          .eq("id", trinketInventoryId)
          .single();

        if (trinketInventory) {
          const trinketItem = getItemById(trinketInventory.item_id);
          if (trinketItem?.bonus?.strength) {
            strengthBonus += trinketItem.bonus.strength;
          }
        }
      }
    }
    /* Fetch Inventory */
    const { data: inventoryItem } = await supabaseAdmin
      .from("hero_inventory")
      .select("*")
      .eq("hero_id", hero.id)
      .eq("item_id", item_id)
      .eq("id", inventory_id) //Used for identifying which item if exists multiple of the same item (ie 2 short swords).
      .single();
    if (!inventoryItem) {
      throw createError({
        statusCode: 400,
        message: "You don't own this item.",
      });
    }

    /* Make additional main hand checks if user attempts to equip a shield. 
    Needs to check if equipped weapon is a two handed weapon. */
    let mainHandWeapon = null;

    if (item_slot === "off_hand") {
      /* Fetch Equipped items, need to check if a two-handed weapon should be unequipped if trying to equip an off_hand item */
      const { data: mainhandItem } = await supabaseAdmin
        .from("hero_equipment")
        .select("main_hand")
        .eq("hero_id", hero.id) //Used for identifying which item if exists multiple of the same item (ie 2 short swords).
        .single();

      if (mainhandItem.main_hand !== null) {
        const { data: equippedMainHandItem } = await supabaseAdmin
          .from("hero_inventory")
          .select("item_id")
          .eq("hero_id", hero.id)
          .eq("id", mainhandItem.main_hand) //Used for identifying which item if exists multiple of the same item (ie 2 short swords).
          .single();
        mainHandWeapon = getItemById(equippedMainHandItem.item_id);
      }
    }

    // Get full item data
    const itemToEquip = getItemById(item_id);
    if (!itemToEquip) {
      throw createError({ statusCode: 404, message: "Item not found" });
    }
    //Check if item has a strength requirment and if the hero has enough strength (including trinket bonuses) to equip item
    const totalStrength = hero.strength + strengthBonus;
    if (itemToEquip.strengthReq && totalStrength < itemToEquip.strengthReq) {
      throw createError({ statusCode: 400, message: "Not enough strength." });
    }

    //Handle Trinkets, they can be equipped in one of 3 trinket equipment slots.
    //Check if any are empty, if all are occupied update new trinket into first slot, trinket_1.
    if (itemToEquip.slot === "trinket") {
      const { data: equippedTrinkets, error: trinketError } =
        await supabaseAdmin
          .from("hero_equipment")
          .select("hero_id, trinket_1, trinket_2, trinket_3")
          .eq("hero_id", hero.id)
          .maybeSingle();
      if (trinketError) {
        throw createError({
          statusCode: 500,
          message: trinketError.message,
        });
      }
      if (!equippedTrinkets) {
        throw createError({ statusCode: 400, message: "No hero equipment." });
      }

      /* Also check if a particular trinket is already equipped, can only have one of a certain id/type at once. */
      /*  const equippedTrinketIds = [
        equippedTrinkets.trinket_1,
        equippedTrinkets.trinket_2,
        equippedTrinkets.trinket_3,
      ].filter(boolean);
 */
      if (equippedTrinkets.trinket_1 === null) {
        item_slot = "trinket_1";
      } else if (equippedTrinkets.trinket_2 === null) {
        item_slot = "trinket_2";
      } else if (equippedTrinkets.trinket_3 === null) {
        item_slot = "trinket_3";
      } else {
        item_slot = "trinket_1";
      }
    }

    //Equip item
    //If item to equip is a two-handed weapon unequip off-hand item.
    if (itemToEquip.twoHanded) {
      const { error: errorEquipping } = await supabaseAdmin
        .from("hero_equipment")
        .update({ [item_slot]: inventory_id, off_hand: null }) //inventory id is extracted from hero_equipment and matched to item_id
        .eq("hero_id", hero.id);
      if (errorEquipping) {
        throw createError({ statusCode: 500, message: errorEquipping.message });
      }
      return { success: true, message: `${itemToEquip.name} equipped.` };

      //Unequip two-handed item if item to equip is an off-hand item.
    } else if (
      itemToEquip.slot === "off_hand" &&
      mainHandWeapon !== null &&
      mainHandWeapon?.twoHanded === true
    ) {
      const { error: errorEquipping } = await supabaseAdmin
        .from("hero_equipment")
        .update({ [item_slot]: inventory_id, main_hand: null }) //inventory id is extracted from hero_equipment and matched to item_id
        .eq("hero_id", hero.id);
      if (errorEquipping) {
        throw createError({ statusCode: 500, message: errorEquipping.message });
      }
      return { success: true, message: `${itemToEquip.name} equipped.` };

      //Equip item
    } else {
      const { error: errorEquipping } = await supabaseAdmin
        .from("hero_equipment")
        .update({ [item_slot]: inventory_id }) //inventory id is extracted from hero_equipment and matched to item_id
        .eq("hero_id", hero.id);
      if (errorEquipping) {
        throw createError({ statusCode: 500, message: errorEquipping.message });
      }
      return { success: true, message: `${itemToEquip.name} equipped.` };
    }
  } catch (err) {
    throw err;
  }
});
