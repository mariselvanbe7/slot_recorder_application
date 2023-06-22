<template>
  <q-page class="flex flex-center">
          <div class="text-center">
            <q-card class="bg-transparent no-shadow">
                <q-form
                  @submit="createLoginUser"
                  class="q-px-sm q-mt-xl q-gutter-y-lg"
                  style="width: 500px"
                >
                  <q-card-section
                    class="text-center text-red"
                    style="border-radius: 10px 10px 0 0"
                  >
                    <div class="custom-heading">Registere in pvc</div>
                  </q-card-section>
                  <div class="q-pa-lg q-col-gutter-lg">
                    <q-input
                      outlined
                      type="email"
                      v-model="email"
                      label="Email"
                      class="q-my-md"
                    >
                      <template v-slot:prepend>
                        <q-icon name="email" color="red"></q-icon>
                      </template>
                    </q-input>
                    <q-input
                      outlined
                      v-model="name"
                      label="Username"
                      :rules="[
                        (val) =>
                          (val && val.length > 0) || 'Please Enter Username',
                      ]"
                    >
                      <template v-slot:prepend>
                        <q-icon
                          name="person"
                          class="cursor-pointer"
                          color="red"
                        >
                        </q-icon>
                      </template>
                    </q-input>
                    <q-input
                      outlined
                      v-model="companyId"
                      :type="isPwd ? 'password' : 'text'"
                      label="companyId"
                      :rules="[
                        (val) =>
                          (val && val.length > 0) || 'Please Enter companyId',
                        (val) =>
                          validatecompanyId(val) ||
                          `Please enter 8-10 digits, that includes at least one capital letter, one numeric and one special character`,
                      ]"
                    >
                      <template v-slot:prepend>
                        <q-icon
                          name="private_connectivity"
                          class="cursor-pointer"
                          color="red"
                        >
                        </q-icon>
                      </template>
                      <template v-slot:append>
                        <q-icon
                          :name="isPwd ? 'visibility_off' : 'visibility'"
                          class="cursor-pointer"
                          @click="isPwd = !isPwd"
                        ></q-icon>
                      </template>
                    </q-input>
                    <q-input
                      outlined
                      v-model="password"
                      label="Password"
                      :type="isPwd ? 'password' : 'text'"
                      :rules="[
                        (val) =>
                          (val && val.length > 0) || 'Please Enter Password',
                      ]"
                    >
                      <template v-slot:prepend>
                        <q-icon
                          name="password"
                          class="cursor-pointer"
                          color="red"
                        >
                        </q-icon>
                      </template>
                      <template v-slot:append>
                        <q-icon
                          :name="isPwd ? 'visibility_off' : 'visibility'"
                          class="cursor-pointer"
                          @click="isPwd = !isPwd"
                        ></q-icon>
                      </template>
                    </q-input>
                  </div>
                  <div class="row justify-between q-px-lg q-pt-md">
                    <q-btn
                      @click="cancel"
                      push
                      outline
                      size="md"
                      no-caps
                      style="border-radius: 10px"
                      class="text-black col-4 text-weight-bold"
                      label="Cancel"
                    ></q-btn>
                    <q-btn
                      push
                      unelevated
                      size="md"
                      no-caps
                      style="background-color: red; border-radius: 10px"
                      class="text-white col-4"
                      label="Register"
                      type="submit"
                    ></q-btn>
                  </div>
                </q-form>
            </q-card>
          </div> 
  </q-page>
</template>

<script lang="ts">
import { ref } from "vue";
import db from "@/firebase";
import { useQuasar } from "quasar";

export default {
  name: "RegistrationForm",

  setup() {
    const email = ref("");
    const name = ref("");
    const password = ref("");
    const companyId = ref("");
    const $q = useQuasar();
    const isPwd = ref(true);

    function validatecompanyId(password: string): boolean {
      const passwdPattern =
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])(?=.{8,})/;
      return passwdPattern.test(password);
    }

    const createLoginUser = async () => {
      try {
        await db
          .collection("loginAdmin")
          .add({
            email: email.value,
            name: name.value,
            password: password.value,
            companyId: companyId.value,
          })
          .then(() => {
            $q.notify({
              type: "positive",
              message: "Registration is added successfully",
            });
            window.location.href = "/";
          });
      } catch (error) {
        console.error("Error creating user:", error);
      }
    };

    function cancel() {
      window.location.href = "/";
    }

    return {
      email,
      name,
      password,
      companyId,
      isPwd,
      createLoginUser,
      validatecompanyId,
      cancel,
    };
  },
};
</script>
<style>
@import url("https://fonts.googleapis.com/css2?family=Lobster&display=swap");

.custom-heading {
  font-family: "Lobster", cursive;
  font-size: 24px;
  font-weight: bold;
}
</style>
