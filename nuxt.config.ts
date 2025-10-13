// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  compatibilityDate: "2025-07-15",

  modules: [
    [
      "@nuxtjs/supabase",
      {
        redirect: false,
      },
    ],
  ],

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
