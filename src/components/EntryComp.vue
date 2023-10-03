<template>
  <q-page class="flex flex-center">
    <q-card style="border-radius: 5px;" :style="$q.screen.gt.sm ? 'width: 700px; height:550px' : 'width:100%'">
      <q-form style="width: 100%; height: 100%" @submit="createUser">
        <q-card-section class="text-center text-red" style="border-radius: 10px 10px 0 0">
          <div class="text-h6 text-weight-bold text-black">Check-in-vehicles</div>
        </q-card-section>
        <q-card-section class="q-pa-lg q-col-gutter-lg">
          <q-input outlined v-model="text" label="Vehicle Number" :rules="[
            (text) =>
              vehicleNumberValidation(text) || 'Enter a valid vehicle number',
          ]" placeholder="AA-99-A-9999">
            <template v-slot:prepend>
              <q-icon name="pin" color="red"></q-icon>
            </template>
          </q-input>

          <q-select outlined v-model="selectedOption" :options="options" label="Vehicle" :rules="[
            (val) => (val && val !== null) || 'Please select a vehicle',
          ]">
            <template v-slot:prepend>
              <q-icon name="two_wheeler" color="red"></q-icon>
            </template>
          </q-select>
          <q-input outlined v-model="date" mask="date" label="Date" class="q-mb-lg">
            <template v-slot:prepend>
              <q-icon name="event" class="cursor-pointer" color="red">
                <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                  <q-date v-model="date">
                    <div class="row items-center justify-end">
                      <q-btn v-close-popup label="Close" color="primary" flat></q-btn>
                    </div>
                  </q-date>
                </q-popup-proxy>
              </q-icon>
            </template>
          </q-input>
          <q-input outlined v-model="timeWithSeconds" mask="fulltime" label="Time">
            <template v-slot:prepend>
              <q-icon name="access_time" class="cursor-pointer" color="red">
                <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                  <q-time v-model="timeWithSeconds" with-seconds format24h>
                    <div class="row items-center justify-end">
                      <q-btn v-close-popup label="Close" color="red" flat></q-btn>
                    </div>
                  </q-time>
                </q-popup-proxy>
              </q-icon>
            </template>
          </q-input>
        </q-card-section>
        <div class="row justify-end q-pr-lg q-py-md">
          <q-btn push unelevated size="md" no-caps style="background-color: red; border-radius: 10px"
            class="text-white col-4" label="Check-in" type="submit"></q-btn>
        </div>
      </q-form>
    </q-card>
  </q-page>
</template>

<style></style>

<script lang="ts">
import { ref, onMounted } from "vue";
import db from "@/firebase";
import { Cookies, useQuasar, Loading, QSpinnerGears } from "quasar";
import jsPDF from "jspdf";

export default {
  name: "VehicleEntry",

  setup() {
    const options = ["Bike", "Car"];
    const text = ref("");
    const selectedOption = ref([]);
    const date = new Date().toISOString().substr(0, 10);
    const timeWithSeconds = ref("");
    const rupees = ref(10);
    const LogoutBy = ref('')
    const $q = useQuasar();
    const status = ref(false);
    const LoggedUser = Cookies.get("userName");
    const companyId = Cookies.get("companyId");

    function vehicleNumberValidation(vechicleNumber: string): boolean {
      const vehicleNumberValidations =
        /^([A-Z]{2}-\d{2}-[A-Z]{1}-\d{4})|([A-Z]{2}-\d{2}-[A-Z]{2}-\d{4})$/;
      return vehicleNumberValidations.test(vechicleNumber);
    }

    const updateTime = () => {
      const currentTime = new Date();
      const hours = currentTime.getHours();
      const minutes = currentTime.getMinutes();
      const seconds = currentTime.getSeconds();

      const timeString = `${hours.toString().padStart(2, "0")}:${minutes
        .toString()
        .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
      timeWithSeconds.value = timeString;
    };

    const createUser = async () => {
      Loading.show({
        spinner: QSpinnerGears,
      });
      try {
        await db
          .collection("users")
          .add({
            text: text.value,
            selectedOption: selectedOption.value,
            date: date,
            timeWithSeconds: timeWithSeconds.value,
            rupees: rupees.value,
            LoggedUser: LoggedUser,
            status: status.value,
            companyId: companyId,
            LogoutBy: LogoutBy.value
          })
          .then(() => {
            generateBill({
              rupees: rupees.value,
              text: text.value,
              date: date,
              vehicleType: selectedOption.value,
            });
            db.collection("enteredVehicles").add({
              text: text.value,
              selectedOption: selectedOption.value,
              date: date,
              timeWithSeconds: timeWithSeconds.value,
              rupees: rupees.value,
              LoggedUser: LoggedUser,
              status: status.value,
              companyId: companyId,
              LogoutBy: LogoutBy.value
            });
            $q.loading.hide();
            $q.notify({
              type: "positive",
              message: "Entry is added successfully",
            });
          });
      } catch (error) {
        console.error("Error creating user:", error);
      }
    };

    const generateBill = (vehicle: {
      text: string;
      date: string;
      vehicleType: never[];
      rupees: number;
    }) => {
      const doc = new jsPDF();

      // Company Name, Phone Number, and Address
      const companyName = "SKP parking";
      const phoneNumber = "48764 87348";
      const address = "123 Main St, City, State";

      // Generate PDF content
      doc.setFontSize(18);
      doc.text("Vehicle: " + vehicle.text, 10, 30);
      doc.text("Date: " + vehicle.date, 10, 40);
      doc.text("Vehicle Type: " + vehicle.vehicleType, 10, 50);
      doc.text("₹ " + vehicle.rupees, 10, 60);

      // Add Company Name
      doc.setFontSize(12);
      doc.setTextColor(128);
      doc.text(companyName, doc.internal.pageSize.getWidth() - 10, 10, {
        align: "right",
      });

      // Add Phone Number and Address
      doc.setTextColor(0);
      doc.text(
        "Phone: " + phoneNumber,
        doc.internal.pageSize.getWidth() - 10,
        20,
        { align: "right" }
      );
      doc.text(
        "Address: " + address,
        doc.internal.pageSize.getWidth() - 10,
        30,
        { align: "right" }
      );

      // Save the PDF
      doc.save(`${companyName}-vehicle-bill-${vehicle.text}.pdf`);
    };

    onMounted(() => {
      updateTime();
      setInterval(updateTime, 1000); // Update every second
    });

    return {
      options,
      text,
      selectedOption,
      date,
      timeWithSeconds,
      rupees,
      createUser,
      LoggedUser,
      status,
      vehicleNumberValidation,
      generateBill,
      companyId,
      LogoutBy
    };
  },
};
</script>
