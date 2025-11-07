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
    console.log("Request Bdy:", body);
    const result = itemSchema.safeParse(body);
    if (!result.success) {
      throw createError({
        statusCode: 400,
        message: result.error.issues[0].message,
      });
    }
    /* Fetch Hero */
    const { item_slot, inventory_id, item_id } = result.data;
    const { data: hero, error: heroError } = await supabaseAdmin
      .from("heroes")
      .select("id, strength")
      .eq("user_id", user.id)
      .single();
    if (heroError || !hero) {
      throw createError({ statusCode: 404, message: "Hero not found" });
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

    // Get full item data
    const itemToEquip = getItemById(item_id);
    if (!itemToEquip) {
      throw createError({ statusCode: 404, message: "Item not found" });
    }
    //Check if item has a strength requirment and if the hero has enough strength to equip item
    if (itemToEquip.strengthReq && hero.strength < itemToEquip.strengthReq) {
      throw createError({ statusCode: 400, message: "Not enough strength." });
    }

    console.log("ItmToEquip:", itemToEquip);
    //Handle Trinkets, they can be equipped in one of 3 trinket equipment slots.
    //Check if any are empty, if all are occupied update new trinket into first slot, trinket_1.
    console.log("ItemSlotType:", itemToEquip.slot);
    if (itemToEquip.slot === "trinket") {
      console.log("Handle it!");
    }

    //Equip item
    const { error: errorEquipping } = await supabaseAdmin
      .from("hero_equipment")
      .update({ [item_slot]: inventory_id }) //inventory id is extracted from hero_equipment and matched to item_id
      .eq("hero_id", hero.id);
    if (errorEquipping) {
      throw createError({ statusCode: 500, message: errorEquipping.message });
    }
    return { success: true, message: `${itemToEquip.name} equipped.` };
  } catch (err) {
    throw err;
  }
});
