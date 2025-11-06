import { supabaseAdmin } from "#imports";
export default defineEventHandler(async () => {
  try {
    const { data: graveyard, error: graveyardError } = await supabaseAdmin
      .from("graveyard")
      .select("*")
      .limit(20)
      .order("hero_xp", { ascending: false });
    if (!graveyard) {
      throw createError({ statusCode: 400, message: graveyardError.message });
    }

    if (graveyardError) {
      throw createError({
        statusCode: 500,
        message: graveyardError.issues[0].message,
      });
    }

    return graveyard;
  } catch (err) {
    throw err;
  }
});
