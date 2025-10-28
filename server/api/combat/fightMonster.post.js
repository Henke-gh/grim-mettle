import { z } from "zod";
import { serverSupabaseClient } from "#supabase/server";
import { supabaseAdmin } from "~~/server/utils/supabaseAdmin";

const combatSubmitSchema = z.object({
  monsterID: z.number(),
  stance: z.enum(["balanced", "offensive", "defensive"]),
  retreatValue: z.number().min(0).max(100),
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
    console.log(body);

    const result = combatSubmitSchema.safeParse(body);
    if (!result.success) {
      throw createError({
        statusCode: 400,
        message: result.error.issues[0].message,
      });
    }

    const combatSettings = result.data;
    console.log(combatSettings);
  } catch (err) {
    throw err;
  }
});
