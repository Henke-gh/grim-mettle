import { z } from "zod";
import { serverSupabaseClient } from "#supabase/server";

const loginSchema = z.object({
  email: z.email(),
  password: z.string().min(8),
});

export default defineEventHandler(async (event) => {
  const body = await readBody(event);

  // Input validation
  const result = loginSchema.safeParse(body);
  if (!result.success) {
    return sendError(
      event,
      createError({
        statusCode: 400,
        message: result.error.errors[0].message,
      })
    );
  }

  const { email, password } = result.data;
  const supabase = await serverSupabaseClient(event);

  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      // This handles wrong password, nonexistent user, etc.
      return sendError(
        event,
        createError({
          statusCode: 400,
          message: error.message,
        })
      );
    }

    return data;
  } catch (err) {
    // This handles unexpected Supabase/network exceptions cleanly
    return sendError(
      event,
      createError({
        statusCode: 500,
        message: "Unexpected error during login.",
      })
    );
  }
});
