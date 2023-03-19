import "floating-vue/dist/style.css"

import { defineNuxtPlugin } from "#app"
import FloatingVue from "floating-vue"

export default defineNuxtPlugin(({ vueApp }) => {
  vueApp.use(FloatingVue)
})
