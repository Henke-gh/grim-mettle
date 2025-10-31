import { supabaseAdmin } from "#imports";
import { serverSupabaseClient } from "#supabase/server";

export default defineEventHandler(async (event) => {
  try {
    //Check user is logged in and get the user id
    const supabase = await serverSupabaseClient(event);

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      throw createError({ statusCode: 401, message: "Not authenticated" });
    }
    //Get hero values to update
    const { data: hero, error: heroError } = await supabaseAdmin
      .from("heroes")
      .select("id, hp_current, hp_max, grit_current, grit_max, last_regen")
      .eq("user_id", user.id)
      .single();
    if (heroError || !hero) {
      throw createError({ statusCode: 404, message: "Hero not found" });
    }

    if (heroError) {
      throw createError({ statusCode: 500, message: heroError.message });
    }

    //Check if hero is due for regenerating hp and grit.
    const lastUpdate = new Date(hero.last_regen);
    const currentTime = new Date();
    const elapsedTimeMS = currentTime - lastUpdate;
    const elapsedTimeMinutes = Math.floor(elapsedTimeMS / (1000 * 60));
    //Stores amount of 3 minute intervals since last update
    const regenIntervals = Math.floor(elapsedTimeMinutes / 3);
    //Amounts to regen per 3 minute interval
    const hpAmountToRegen = Math.floor(hero.hp_max / 3);
    const gritAmountToRegen = 12;

    const hpGained = hpAmountToRegen * regenIntervals;
    const gritGained = gritAmountToRegen * regenIntervals;
    //Set new values to not be higher than their respective max value
    const updatedHP = Math.min(hero.hp_current + hpGained, hero.hp_max);
    const updatedGrit = Math.min(hero.grit_current + gritGained, hero.grit_max);

    if (regenIntervals > 0) {
      const { error: regenError } = await supabaseAdmin
        .from("heroes")
        .update({
          hp_current: updatedHP,
          grit_current: updatedGrit,
          last_regen: new Date().toISOString(),
        })
        .eq("id", hero.id);

      if (regenError) {
        throw createError({ statusCode: 500, message: regenError.message });
      }

      return {
        regenerated: true,
        newHP: updatedHP,
        newGrit: updatedGrit,
      };
    }

    return {
      regenerated: false,
    };
  } catch (err) {
    throw err;
  }
});
