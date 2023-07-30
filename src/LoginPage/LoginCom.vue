<template>
  <q-layout view="hHh 1pR ff">
    <q-page class="row items-center justify-evenly">
      <q-header elevated class="bg-red text-white" height-hint="98">
      <q-toolbar>
        <q-toolbar-title>
             Vehicle Parking
        </q-toolbar-title>
      </q-toolbar>
    </q-header>
      <div class="col-6 q-mr-xl" :style="$q.screen.gt.xs ? '' : 'display:none'">
        <img
        style="width: 100%; "
          src="Parking-pana.png"
          alt="LoginPage image"
        />
      </div>
     <router-view></router-view>
    </q-page>
  </q-layout>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";

export default defineComponent({
  name: "LoginComp",
  setup() {
    const username = ref("");
    const password = ref("");
    const isPwd = ref(true);

    function register() {
      window.location.href = "/register";
    }

    function LoginSuccess() {
      window.location.href = "/entry";
    }

    return {
      username,
      password,
      register,
      isPwd,
      LoginSuccess,
    };
  },
});
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Lobster&display=swap");

.custom-heading {
  font-family: "Lobster", cursive;
  font-size: 24px;
  font-weight: bold;
}
</style>
