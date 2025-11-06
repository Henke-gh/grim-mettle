import { supabaseAdmin } from "#imports";
export default defineEventHandler(async () => {
  try {
    const { data: leaderboard, error: leaderboardError } = await supabaseAdmin
      .from("heroes")
      .select("id, hero_name, xp, level")
      .limit(10)
      .order("xp", { ascending: false });

    if (!leaderboard) {
      throw createError({ statusCode: 400, message: leaderboardError.message });
    }

    if (leaderboardError) {
      throw createError({
        statusCode: 500,
        message: leaderboardError.issues[0].message,
      });
    }

    return leaderboard;
  } catch (err) {
    throw err;
  }
});
