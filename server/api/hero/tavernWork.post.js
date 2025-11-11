import { supabaseAdmin } from "~~/server/utils/supabaseAdmin";
import { serverSupabaseClient } from "#supabase/server";
import { z } from "zod";
import { tavernShifts } from "~~/utils/tavernShifts";
const tavernSchema = z.object({
  shift_id: z.number(),
});

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    console.log("body", body);
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
    const result = tavernSchema.safeParse(body);
    console.log("reslut:", result);
    if (!result.success) {
      throw createError({
        statusCode: 400,
        message: result.error.issues[0].message,
      });
    }

    const id = result.data.shift_id;
    console.log("id;", id);
    //Find requested item in itemCatalog
    const shiftCollection = tavernShifts;
    console.log(tavernShifts);
    if (!Array.isArray(shiftCollection)) {
      throw createError({ statusCode: 400, message: "Invalid shift type" });
    }

    const shift = shiftCollection.find((it) => it.id === id);
    if (!shift) {
      throw createError({ statusCode: 404, message: "Shift not found" });
    }
    //Get the hero id + gold and current grit from the heroes table
    const { data: hero, error: checkError } = await supabaseAdmin
      .from("heroes")
      .select("id, gold, grit_current")
      .eq("user_id", user.id)
      .maybeSingle();

    if (checkError) {
      throw createError({ statusCode: 500, message: checkError.message });
    }

    if (!hero) {
      throw createError({ statusCode: 404, message: "Hero not found." });
    }
    //Check hero gold
    const cost = shift.gritCost ?? 0;
    if (hero.grit_current < gritCost) {
      throw createError({
        statusCode: 400,
        message: "You're too tired to work this shift.",
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
