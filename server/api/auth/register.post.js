import { z } from "zod";
import { serverSupabaseClient } from "#supabase/server";
import { supabaseAdmin } from "~~/server/utils/supabaseAdmin";

// Validation schema (uses Zod)
const registerSchema = z.object({
  username: z
    .string()
    .min(3, "Username must be at least 3 characters.")
    .max(16, "Username too long, max 16 characters.")
    .regex(
      /^[\p{L}0-9_]+$/u,
      "Only letters, numbers, and underscores allowed."
    ),
  email: z.email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters long."),
});

export default defineEventHandler(async (event) => {
  const body = await readBody(event);

  // Validate input
  const result = registerSchema.safeParse(body);
  console.log(result);
  if (!result.success) {
    const message = result.error.issues
      .map((index) => index.message)
      .join(", ");
    throw createError({
      statusCode: 400,
      message,
    });
  }
  const { username, email, password } = result.data;
  const supabase = await serverSupabaseClient(event);

  // Check if username already exists
  const { data: existingUsers, error: fetchError } = await supabase
    .from("profiles")
    .select("id")
    .eq("username", username)
    .limit(1);

  if (fetchError) {
    throw createError({ statusCode: 500, message: fetchError.message });
  }

  if (existingUsers.length > 0) {
    throw createError({ statusCode: 400, message: "Username already taken" });
  }

  // Sign up user in auth
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email,
    password,
  });

  if (authError) {
    throw createError({ statusCode: 400, message: authError.message });
  }

  const userId = authData.user.id;

  // Insert user profile
  const { error: profileError } = await supabaseAdmin
    .from("profiles")
    .insert({ id: userId, username });

  if (profileError) {
    // Rrollback auth user if profile insert fails
    await supabaseAdmin.auth.admin.deleteUser(userId);
    throw createError({ statusCode: 400, message: profileError.message });
  }

  return {
    success: true,
    message: "Account created! Press Continue.",
  };
});
