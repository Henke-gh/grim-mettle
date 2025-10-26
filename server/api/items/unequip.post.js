import { supabaseAdmin } from "~~/server/utils/supabaseAdmin";
import { serverSupabaseClient } from "#supabase/server";
import { z } from "zod";

const itemSchema = z.object({
  itemSlot: z.enum(
    "main_hand",
    "off_hand",
    "armour",
    "trinket_1",
    "trinket_2",
    "trinket_3"
  ),
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
        message: result.error.issues.message[0],
      });
    }

    const { item_slot } = result.data;

    const { hero, heroError } = await supabaseAdmin
      .from("heroes")
      .select("id")
      .eq("user_id", user.id)
      .single();

    if (heroError || !hero) {
      throw createError({ statusCode: 404, message: "Hero not found" });
    }

    const { errorMsg } = await supabaseAdmin
      .from("hero_equipment")
      .update({ [item_slot]: null })
      .eq("hero_id", hero.id);

    if (errorMsg) {
      throw createError({ statusCode: 500, message: errorMsg.message });
    }

    return { success: true, message: "Item unequipped." };
  } catch (err) {
    throw err;
  }
});
