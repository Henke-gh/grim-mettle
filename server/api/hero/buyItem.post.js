import { supabaseAdmin } from "~~/server/utils/supabaseAdmin";
import { serverSupabaseClient } from "#supabase/server";
import { z } from "zod";
import { itemCatalog } from "../../utils/itemCatalog";

const buyItemSchema = z.object({
  id: z.number(),
  itemType: z.enum(["weapons", "shields", "armour", "trinkets"]),
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

    //Validate the contents of the request, only needs the item id.
    const result = buyItemSchema.safeParse(body);
    if (!result.success) {
      throw createError({
        statusCode: 400,
        message: result.error.issues[0].message,
      });
    }

    const { id, itemType } = result.data;
    console.log(itemType);
    console.log(itemCatalog);
    //Find requested item in itemCatalog
    const itemCollection = itemCatalog[itemType];
    console.log(itemCollection);
    if (!Array.isArray(itemCollection)) {
      throw createError({ statusCode: 400, message: "Invalid item type" });
    }

    const item = itemCollection.find((it) => it.id === id);
    if (!item) {
      throw createError({ statusCode: 404, message: "Item not found" });
    }
    //Get the hero id + gold from the heroes table
    const { data: hero, error: checkError } = await supabaseAdmin
      .from("heroes")
      .select("id, gold")
      .eq("user_id", user.id)
      .maybeSingle();

    if (checkError) {
      throw createError({ statusCode: 500, message: checkError.message });
    }

    if (!hero) {
      throw createError({ statusCode: 404, message: "Hero not found." });
    }
    //Check hero gold
    const cost = item.goldCost ?? item.cost ?? 0;
    if (hero.gold < cost) {
      throw createError({
        statusCode: 400,
        message: "You don't have enough gold.",
      });
    }

    //Deduct gold from player hero
    const { data: updatedHero, error: updateError } = await supabaseAdmin
      .from("heroes")
      .update({ gold: hero.gold - cost })
      .eq("id", hero.id)
      .select()
      .maybeSingle();

    if (updateError) {
      throw createError({ statusCode: 500, message: updateError.message });
    }

    //Insert item into hero inventory
    const { data: inserted, error: insertError } = await supabaseAdmin
      .from("hero_inventory")
      .insert({ hero_id: hero.id, item_id: item.id })
      .select()
      .maybeSingle();

    if (insertError) {
      //If insertion fails here, needs to rollback gold deduction.
      throw createError({ statusCode: 500, message: insertError.message });
    }

    return {
      success: true,
      hero: updatedHero,
      inventoryItem: inserted,
    };
  } catch (err) {
    throw err;
  }
});
