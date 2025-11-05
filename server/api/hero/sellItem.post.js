import { supabaseAdmin } from "~~/server/utils/supabaseAdmin";
import { serverSupabaseClient } from "#supabase/server";
import { z } from "zod";

const sellItemSchema = z.object({
  id: z.number(),
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
    const result = sellItemSchema.safeParse(body);
    if (!result.success) {
      throw createError({
        statusCode: 400,
        message: result.error.issues[0].message,
      });
    }
  } catch (err) {
    throw err;
  }
});
