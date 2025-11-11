import { supabaseAdmin } from "~~/server/utils/supabaseAdmin";
import { serverSupabaseClient } from "#supabase/server";
import { z } from "zod";
import { healingItems } from "~~/utils/healingItems";
const buyHealingSchema = z.object({
  item_id: z.number(),
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
    const result = buyHealingSchema.safeParse(body);
    if (!result.success) {
      throw createError({
        statusCode: 400,
        message: result.error.issues[0].message,
      });
    }

    const id = result.data.item_id;
    //Find requested item in itemCatalog
    const itemCollection = healingItems;
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
      .select("id, gold, hp_current, hp_max")
      .eq("user_id", user.id)
      .maybeSingle();

    if (checkError) {
      throw createError({ statusCode: 500, message: checkError.message });
    }

    if (!hero) {
      throw createError({ statusCode: 404, message: "Hero not found." });
    }
    //Check hero gold
    const cost = item.cost ?? 0;
    if (hero.gold < cost) {
      throw createError({
        statusCode: 400,
        message: "You don't have enough gold.",
      });
    }

    let newCurrentHP = hero.hp_current + item.healingValue;
    if (newCurrentHP > hero.hp_max) {
      newCurrentHP = hero.hp_max;
    }

    //Deduct gold from player hero and update hp_current
    const { data: updatedHero, error: updateError } = await supabaseAdmin
      .from("heroes")
      .update({ gold: hero.gold - cost, hp_current: newCurrentHP })
      .eq("id", hero.id)
      .select()
      .maybeSingle();

    if (updateError) {
      throw createError({ statusCode: 500, message: updateError.message });
    }

    return {
      success: true,
      hero: updatedHero,
    };
  } catch (err) {
    throw err;
  }
});
