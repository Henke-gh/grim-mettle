import { supabaseAdmin } from "~~/server/utils/supabaseAdmin";
import { serverSupabaseClient } from "#supabase/server";
import { z } from "zod";
import { getItemById } from "~~/utils/itemCatalog";

const sellItemSchema = z.object({
  inventory_id: z.number(),
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
    //Validate the contents of the request, only needs the inventory id.
    const result = sellItemSchema.safeParse(body);
    if (!result.success) {
      throw createError({
        statusCode: 400,
        message: result.error.issues[0].message,
      });
    }
    const itemToSell = result.data;
    //Get hero id from Heroes, verify hero exists
    const { data: hero, error: heroError } = await supabaseAdmin
      .from("heroes")
      .select("id, gold")
      .eq("user_id", user.id)
      .single();

    if (heroError || !hero) {
      throw createError({ statusCode: 400, message: "No hero found." });
    }
    //Get hero_inventory, verify an item with provided id exists.
    //Also grabs the item_id to be able to match ids with the correct item.
    const { data: heroInventory, error: inventoryError } = await supabaseAdmin
      .from("hero_inventory")
      .select("id, item_id")
      .eq("id", itemToSell.inventory_id)
      .eq("hero_id", hero.id)
      .single();

    if (inventoryError || !heroInventory) {
      throw createError({ statusCode: 400, message: "Item does not exist." });
    }
    //Get hero_equipment to double-check item is not currently in use.
    const { data: heroEquipment, error: equipmentError } = await supabaseAdmin
      .from("hero_equipment")
      .select("*")
      .eq("hero_id", hero.id)
      .maybeSingle();

    if (equipmentError || !heroEquipment) {
      throw createError({ statusCode: 400, message: "No hero equipment." });
    }
    //Check if provided id currently occupies an equipment slot.
    const isEquipped = (inventory_id) => {
      const slots = [
        "main_hand",
        "off_hand",
        "armour",
        "trinket_1",
        "trinket_2",
        "trinket_3",
      ];
      return slots.some((slot) => heroEquipment[slot] === inventory_id);
    };

    if (isEquipped(itemToSell.inventory_id)) {
      return { message: "Item is currently equipped." };
    }

    //Get the actual item values based on the item id of inventory item.
    const item = getItemById(heroInventory.item_id);
    //Calculate resale value of the item:
    const resellValue = Math.floor(item.goldCost * 0.55);
    //Update hero gold with resellValue and remove the item from hero inventory.
    const { error: goldUpdateError } = await supabaseAdmin
      .from("heroes")
      .update({ gold: hero.gold + resellValue })
      .eq("id", hero.id);

    if (goldUpdateError) {
      throw createError({
        statusCode: 500,
        message: "Could not transfer payment.",
      });
    }

    const { error: itemDeleteError } = await supabaseAdmin
      .from("hero_inventory")
      .delete()
      .eq("id", itemToSell.inventory_id);

    if (itemDeleteError) {
      throw createError({
        statusCode: 500,
        message: "Item could not be deleted.",
      });
    }

    return { success: true };
  } catch (err) {
    throw err;
  }
});
