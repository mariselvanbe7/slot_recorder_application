import { createApp } from "vue";
import App from "./App.vue";
import router from "./router/routes";
import "@quasar/extras/material-icons/material-icons.css";
import "@quasar/extras/fontawesome-v5/fontawesome-v5.css";
import "quasar/dist/quasar.css";
import { Quasar, QLayout, Notify,Loading,Dialog } from "quasar";

createApp(App)
  .use(Quasar, {
    config: {
      notify: {
        /* Notify configuration options */
      },
      // Other Quasar config options ...
    },
    components: { QLayout },
    plugins: { Notify,Loading,Dialog },
  })
  .use(router)
  .mount("#app");
  