import "@oruga-ui/oruga-next/dist/oruga.css"

import Oruga from "@oruga-ui/oruga-next"

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.use(Oruga, {
    dropdown: { mobileModal: true },
  })
})
