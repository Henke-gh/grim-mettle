import { supabaseAdmin } from "~~/server/utils/supabaseAdmin";
import { serverSupabaseClient } from "#supabase/server";
import { getItemById } from "~~/utils/itemCatalog";
import { z } from "zod";

const itemSchema = z.object({
  item_id: z.number(),
  item_slot: z.enum([
    "main_hand",
    "off_hand",
    "armour",
    "trinket_1",
    "trinket_2",
    "trinket_3",
  ]),
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
    console.log("Body response: ", body);
    const result = itemSchema.safeParse(body);
    console.log("parseResponse:", result);
    if (!result.success) {
      throw createError({
        statusCode: 400,
        message: result.error.issues[0].message,
      });
    }

    const { item_slot, item_id } = result.data;

    const { data: hero, error: heroError } = await supabaseAdmin
      .from("heroes")
      .select("id, strength")
      .eq("user_id", user.id)
      .single();
    console.log("heroData;", hero);
    console.log("userID:", user.id);
    if (heroError || !hero) {
      throw createError({ statusCode: 404, message: "Hero not found" });
    }

    const { data: inventoryItem } = await supabaseAdmin
      .from("hero_inventory")
      .select("*")
      .eq("hero_id", hero.id)
      .eq("item_id", item_id)
      .single();
    console.log("inventoryItem:", inventoryItem);
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

    /*     const { data: currentEquipment } = await supabaseAdmin
      .from("hero_equipment")
      .select("*")
      .eq("hero_id", hero.id)
      .maybeSingle();
 */
    //const updateData = { [item_slot]: item_id };

    //Equip item
    const { error: errorEquipping } = await supabaseAdmin
      .from("hero_equipment")
      .update({ [item_slot]: item_id })
      .eq("hero_id", hero.id);

    if (errorEquipping) {
      throw createError({ statusCode: 500, message: errorEquipping.message });
    }
    console.log("success");
    return { success: true, message: `${itemToEquip.name} equipped.` };
  } catch (err) {
    throw err;
  }
});
