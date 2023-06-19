
<template>
  <div id="app">
    <q-layout view="hHh lpR fFf">
      <q-header>
        <!-- your header content -->
      </q-header>
      <q-page-container>
        <router-view />
      </q-page-container>
      <q-footer>
        <!-- your footer content -->
      </q-footer>
    </q-layout>
  </div>
</template>


<script lang="ts">
import { defineComponent } from 'vue';
import { QLayout, QHeader, QPageContainer, QFooter } from 'quasar';
import router from './router/routes';

export default defineComponent({
  name: 'App',
  components: {
    QLayout,
    QHeader,
    QPageContainer,
    QFooter
  },
  setup() {
    return { router };
  }
});
</script>

<style>
#q-app::-webkit-scrollbar {
  display: none;
}
</style>
