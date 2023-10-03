<template>
  <q-page class="q-pa-xl full-width">
    <p style="font-size: large;" class="text-bold">Checkedout vehicle details</p>
    <div class="q-mb-md row">
      <div class="col-12 col-sm-6 col-md-4">
        <q-input v-model="searchText" debounce="300" outlined placeholder="Search by text" style="border">
          <template v-slot:append v-if="searchText.length > 0">
            <q-icon name="close" @click="searchText = ''" class="cursor-pointer"></q-icon>
          </template>
        </q-input>
      </div>
      <div class="col-12 col-sm-6 col-md-4" :style="$q.screen.lt.md ? 'margin-top: 10px' : 'margin-left: 10px'">
        <q-input outlined v-model="selectedDate" mask="date" placeholder="Search by date">
          <template v-slot:append>
            <q-icon name="event" class="cursor-pointer">
              <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                <q-date v-model="selectedDate" color="red">
                  <div class="row items-center justify-end">
                    <q-btn v-close-popup label="Close" color="red" no-caps flat></q-btn>
                  </div>
                </q-date>
              </q-popup-proxy>
            </q-icon>
            <q-icon v-if="selectedDate.length > 0" name="close" @click="selectedDate = ''"
              class="cursor-pointer"></q-icon>
          </template>
        </q-input>
      </div>
    </div>
    <q-card v-for="(group, index) in groupedVehicles" :key="index" class="q-mt-md q-col-xs-12 col-sm-6 col-md-4">
      <q-card-section>
        <div class="group-heading">{{ group.exitDate }}</div>
        <q-list>
          <q-item v-for="vehicle in group.vehicles" :key="vehicle.id">
            <q-item-section>{{ vehicle.LogoutBy }}</q-item-section>
            <q-item-section>{{ vehicle.text }}</q-item-section>
            <q-item-section side>₹ {{ vehicle.rupees }}</q-item-section>
          </q-item>
        </q-list>
      </q-card-section>
      <q-card-actions align="right">
        <q-icon name="picture_as_pdf" class="cursor-pointer" color="red" size="1.5rem"
          @click="generatePDF(group)"></q-icon>
        <q-card-section class="text-blue-10 text-bold">Total Rupees: {{ group.totalRupees }}</q-card-section>
      </q-card-actions>
    </q-card>
  </q-page>
</template>
<script lang="ts">
import { defineComponent, onMounted, ref, watch } from "vue";
import db from "@/firebase";
import { useQuasar, Loading, QSpinnerGears, Cookies } from "quasar";
import jsPDF from 'jspdf';


export default defineComponent({
  name: "CheckoutVehiclesComp",

  setup() {
    const groupedVehicles = ref([] as any[]);
    const searchText = ref("");
    const selectedDate = ref("");
    const $q = useQuasar();
    const companyId = Cookies.get('companyId')

    const fetchUsers = async () => {
      Loading.show({
        spinner: QSpinnerGears,
      });
      try {
        const enteredVehicles = await db.collection("users").where("companyId", "==", companyId).get();
        const deletedData = [] as any[];

        enteredVehicles.forEach((parkedVehicles) => {
          const user = parkedVehicles.data();
          if (user.status) {
            deletedData.push(user);
          }
        });

        // Filter vehicles based on search text and selected date
        const filteredData = deletedData.filter((vehicle) => {
          const searchTextMatch = vehicle.text
            .toLowerCase()
            .includes(searchText.value.toLowerCase());
          const dateMatch = selectedDate.value
            ? new Date(vehicle.exitDate).toDateString() ===
            new Date(selectedDate.value).toDateString()
            : true;
          return searchTextMatch && dateMatch;
        });

        // Group vehicles by exitDate
        const groups = {} as any;
        filteredData.forEach((vehicle) => {
          const exitDate = vehicle.exitDate;
          if (!groups[exitDate]) {
            groups[exitDate] = {
              exitDate,
              vehicles: [],
              totalRupees: 0,
            };
          }
          groups[exitDate].vehicles.push(vehicle);
          groups[exitDate].totalRupees += parseFloat(vehicle.rupees);
        });

        // Convert groups object to an array
        groupedVehicles.value = Object.values(groups);
        $q.loading.hide();
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    const generatePDF = (group: {
      exitDate: string;
      vehicles: any[];
      totalRupees: string;
    }) => {
      const doc = new jsPDF();

      // Generate PDF content
      let yPos = 10;
      doc.setFontSize(18);
      doc.text("Group Heading: " + group.exitDate, 10, yPos);
      yPos += 10;

      group.vehicles.forEach((vehicle: { text: any; rupees: string }) => {
        doc.setFontSize(12);
        doc.text(vehicle.text, 10, yPos);
        doc.text("₹ " + vehicle.rupees, 100, yPos);
        yPos += 10;
      });

      doc.text("Total Rupees: " + group.totalRupees, 10, yPos);

      // Save the PDF
      doc.save(`checkout-vehicles-${group.exitDate}.pdf`);
    };

    onMounted(() => {
      fetchUsers();
    });

    watch([searchText, selectedDate], () => {
      fetchUsers();
    });

    return {
      groupedVehicles,
      searchText,
      selectedDate,
      generatePDF,
      companyId
    };
  },
});
</script>

<style scoped>
.group-heading {
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 10px;
  color: red;
}
</style>
