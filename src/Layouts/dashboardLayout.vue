<template>
  <q-layout view="hHh lpRL fFf">
    <q-header elevated class="bg-red text-white" height-hint="98">
      <q-toolbar>
        <q-btn flat @click="drawer = !drawer" round dense icon="menu"></q-btn>
        <q-toolbar-title>
          <q-avatar> SKP </q-avatar>
          Parking
        </q-toolbar-title>
      </q-toolbar>
    </q-header>
    <q-drawer
    show-if-above
      elevated
      v-model="drawer"
      :mini="miniState"
      @mouseover="miniState = false"
      @mouseout="miniState = true"
      :width="200"
      :breakpoint="500"
      bordered
      :class="$q.dark.isActive ? 'bg-grey-9' : 'bg-grey-3'"
    >
      <q-scroll-area class="fit" :horizontal-thumb-style="{ opacity: 0 }">
        <q-list class="menu-list">
        <template v-for="(menuItem, index) in menuList" :key="index">
          <q-item
            clickable
            @click="activeItem = menuItem.value"
            :active="activeItem === menuItem.value"
            v-ripple
            active-class="active-item bg-red text-black"
            :to="
              menuItem.value === 'dashboard'
                ? `/entry`
                : `/${menuItem.routeTo}`
            "
          >
            <q-item-section avatar>
              <q-icon  :name="menuItem.icon"></q-icon>
            </q-item-section>
            <q-item-section>
              {{ menuItem.label }}
            </q-item-section>
          </q-item>
          <q-separator
            :key="'sep' + index"
            v-if="menuItem.separator"
          ></q-separator>
        </template>
        <q-item v-ripple clickable @click="logout">
          <q-item-section avatar>
            <q-icon name="logout"></q-icon>
          </q-item-section>
          <q-item-section> Logout </q-item-section>
        </q-item>
      </q-list>
      </q-scroll-area>
    </q-drawer>
    <q-drawer
      show-if-above
      side="right"
      elevated
      class="q-gutter-y-sm q-pa-lg"
      :width="337"
    >
      <q-item class="shadow-10">
        <q-item-section top avatar caps>
          <q-avatar > {{ name.charAt(0) }}</q-avatar>
        </q-item-section>

        <q-item-section>
          <q-item-label>{{ name }}</q-item-label>
          <q-item-label caption lines="2">{{ email }}</q-item-label>
        </q-item-section>

        <q-item-section side top>
          <q-badge rounded color="green"></q-badge>
        </q-item-section>
      </q-item>

      <q-date
        class="shadow-20 bg-grey-3 q-pa-md"
        v-model="date"
        minimal
        :default-date="new Date()"
      ></q-date>
     
    </q-drawer>

    <q-page-container style="display: flex; justify-content: center;">
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import { ref } from "vue";
import { Cookies} from "quasar";

export default {
  setup() {
    const name = Cookies.get('userName');
    const email = Cookies.get('email');
    const menuList = [
      {
        icon: "garage",
        label: "Entry",
        value: "dashboard",
        separator: true,
      },
      {
        icon: "forklift",
        label: "Lists",
        routeTo: "lists",
        value: "lists",
        separator: false,
 },
 {
        icon: "repartition",
        label: "Entered-vehicles",
        routeTo: "checkedIn",
        value: "checkedIn",
        separator: false,
 },
  {
        icon: "exit_to_app",
        label: "Exit-vehicles",
        routeTo: "exits",
        value: "exits",
        separator: false,
 },

    ];

    function logout() {
      Cookies.remove('userName', {path:'/'})
      window.location.href = "/";
    }

  
    return {
      drawer: ref(false),
      miniState: ref(true),
      activeItem: ref("dashboard"),
      menuList,
      logout,
      name,
      email
 
 
    };
  },
};
</script>
