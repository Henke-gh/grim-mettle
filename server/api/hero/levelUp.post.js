import { z } from "zod";
import { serverSupabaseClient } from "#supabase/server";
import { supabaseAdmin } from "~~/server/utils/supabaseAdmin";
import { computeHeroHP } from "~~/utils/heroUtils";

const lvlUpSchema = z.object({
  stats: z.object({
    strength: z.number().min(0),
    speed: z.number().min(0),
    vitality: z.number().min(0),
    swords: z.number().min(0),
    axes: z.number().min(0),
    hammers: z.number().min(0),
    spears: z.number().min(0),
    daggers: z.number().min(0),
    block: z.number().min(0),
    evasion: z.number().min(0),
    initiative: z.number().min(0),
  }),
});

const availablePoints = 20;

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

    const result = lvlUpSchema.safeParse(body);
    if (!result.success) {
      throw createError({
        statusCode: 400,
        message: result.error.issues[0].message,
      });
    }

    const statUpdate = result.data;
  } catch (err) {
    throw err;
  }
});
