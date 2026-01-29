import { z } from "zod";
import { serverSupabaseClient } from "#supabase/server";
import { supabaseAdmin } from "~~/server/utils/supabaseAdmin";

const heroDeletionSchema = z.object({
  id: z.number().int().positive(),
});

export default defineEventHandler(async (event) => {
  try {
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

    const result = heroDeletionSchema.safeParse(body);
    if (!result.success) {
      throw createError({
        statusCode: 400,
        message: result.error.issues[0].message,
      });
    }

    const { id: heroID } = result.data;

    // Verify the hero belongs to the authenticated user before deleting
    const { data: heroData, error: heroCheckError } = await supabase
      .from("heroes")
      .select("id")
      .eq("id", heroID)
      .eq("user_id", user.id)
      .single();

    if (heroCheckError || !heroData) {
      throw createError({
        statusCode: 404,
        message: "Hero not found or not owned by user",
      });
    }

    // Delete the hero
    const { error: heroDeleteError } = await supabaseAdmin
      .from("heroes")
      .delete()
      .eq("id", heroID)
      .eq("user_id", user.id);

    if (heroDeleteError) {
      throw createError({ statusCode: 500, message: heroDeleteError.message });
    }

    return { success: true };
  } catch (error) {
    throw error;
  }
});
