// nuxt.config.ts
// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  compatibilityDate: "2025-07-15",
  pages: true,

  nitro: {
    preset: "netlify",
    output: {
      dir: ".output",
      serverDir: ".output/server",
      publicDir: ".output/public",
    },
  },

  modules: [
    "@pinia/nuxt",
    [
      "@nuxtjs/supabase",
      {
        redirect: false,
        cookies: {
          name: "sb",
          lifetime: 60 * 60 * 24 * 7, // 1 week
          domain:
            process.env.NODE_ENV === "production"
              ? "grim-mettle.netlify.app"
              : "", // leave empty for localhost/dev
          sameSite: "lax",
          secure: process.env.NODE_ENV === "production",
        },
      },
    ],
  ],

  supabase: {
    types: false, // disables auto-types generation
  },

  app: {
    head: {
      title: "Grim Mettle",
      htmlAttrs: {
        lang: "en",
      },
      link: [{ rel: "icon", type: "image/x-icon", href: "/favicon.ico" }],
    },
  },
});
