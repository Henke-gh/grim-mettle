// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  compatibilityDate: "2025-07-15",
  pages: true,
  nitro: {
    preset: "netlify",
  },

  modules: [
    "@pinia/nuxt",
    [
      "@nuxtjs/supabase",
      {
        redirect: false,
      },
    ],
  ],
  supabase: {
    types: false,
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
