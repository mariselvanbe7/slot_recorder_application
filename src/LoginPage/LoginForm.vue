<template>
  <q-page class="row items-center justify-evenly">
    <div class="text-center ">
      <q-card class="bg-transparent no-shadow">
        <q-form class="q-px-sm q-mt-xl q-gutter-y-lg" :style="$q.screen.gt.xs ? 'width: 500px' : 'width: 100%'"
          @submit="LoginSuccess">
          <h4 class="custom-heading text-red">Vehicle parking</h4>
          <q-input outlined v-model="username" label="Username" :rules="[
            (username) =>
              (username && username.length > 0) ||
              'Please enter your username',
          ]">
            <template v-slot:prepend>
              <q-icon name="person" class="cursor-pointer" color="red">
              </q-icon>
            </template>
          </q-input>
          <q-input v-model="password" label="Password" square outlined :type="isPwd ? 'password' : 'text'" :rules="[
            (password) =>
              (password && password.length > 0) ||
              'Please enter your password',
          ]">
            <template v-slot:prepend>
              <q-icon name="password" class="cursor-pointer" color="red">
              </q-icon>
            </template>
            <template v-slot:append>
              <q-icon :name="isPwd ? 'visibility_off' : 'visibility'" class="cursor-pointer"
                @click="isPwd = !isPwd"></q-icon>
            </template>
          </q-input>
          <div style="display: flex; justify-content: end">
            <p class="text-black text-weight-medium col-12">
              Forgot password?
            </p>
          </div>
          <div class="row justify-between">
            <q-btn outline size="md" @click="register" no-caps style="border-radius: 10px"
              class="text-black col-5 text-weight-bold" label="Signup"></q-btn>
            <q-btn unelevated size="md" no-caps style="background-color: red; border-radius: 10px"
              class="text-white col-5" label="Login" type="submit"></q-btn>
          </div>
        </q-form>
      </q-card>
    </div>
  </q-page>
</template>

<script lang="ts">
import db from "@/firebase";
import { Cookies, useQuasar } from "quasar";
import { defineComponent, ref } from "vue";
import { find } from "lodash";
//import { Cookies } from 'quasar';

export default defineComponent({
  name: "LoginForm",
  setup() {
    const username = ref("");
    const password = ref("");
    const isPwd = ref(true);
    const users = ref([] as any[]);
    const $q = useQuasar();

    const fetchUsers = async () => {
      try {
        const enteredVehicles = await db.collection("loginAdmin").get();
        const data = [] as any;
        enteredVehicles.forEach((parkedVehicles) => {
          data.push(parkedVehicles.data());
        });
        users.value = data;
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    function register() {
      window.location.href = "/register";
    }

    async function LoginSuccess() {
      await fetchUsers();
      const foundUser = find(users.value, (user) => {
        Cookies.set("userName", user.name);
        Cookies.set("email", user.email);
        Cookies.set("companyId", user.companyId);
        return user.name === username.value && user.password === password.value;
      });

      if (foundUser) {
        window.location.href = "/entry";
      } else {
        $q.notify({
          type: "negative",
          message: "Incorrect Username or Password",
        });
      }
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
