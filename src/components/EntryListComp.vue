<template>
  <q-page class="q-pa-xl full-width">
    <div class="text-h6 text-weight-bold q-mb-sm">checked-in-vehicle lists</div>
    <div class="q-mb-md row">
      <div class="col-xs-12 col-md-4">
        <q-input v-model="searchText" debounce="300" outlined placeholder="Search by text" style="border">
          <template v-slot:append v-if="searchText.length > 0">
            <q-icon name="close" @click="searchText = ''" class="cursor-pointer"></q-icon> </template></q-input>
      </div>
      <div class="col-xs-12 col-md-4" :style="$q.screen.lt.md ? 'margin-top: 10px' : 'margin-left: 10px'">
        <q-input outlined v-model="date" mask="date" placeholder="Search by date">
          <template v-slot:append>
            <q-icon name="event" class="cursor-pointer">
              <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                <q-date v-model="date" color="red">
                  <div class="row items-center justify-end">
                    <q-btn no-caps v-close-popup label="Close" color="red" flat></q-btn>
                  </div>
                </q-date>
              </q-popup-proxy>
            </q-icon>
            <q-icon v-if="date.length > 0" name="close" @click="date = ''" class="cursor-pointer"></q-icon>
          </template>
        </q-input>
      </div>
    </div>
    <q-table title="checked-in-vehicle lists" :rows="filteredUsers" :columns="columns" row-key="name">
      <template v-slot:body-cell-checkoutVehicles="props">
        <q-btn color="red" size="0.6rem" class="q-mt-sm" row-key="name" @click="handleToggle(props.row)">
          <template v-slot:loading>
            <q-spinner-gears></q-spinner-gears>
          </template>
          Check-out
        </q-btn>
      </template>
    </q-table>
  </q-page>
</template>

<style>
.row {
  margin-right: 0;
  margin-left: 0;
}
</style>

<script lang="ts">
import { onMounted, ref, computed } from "vue";
import db from "@/firebase";
import { Cookies, Loading, QSpinnerGears, useQuasar } from "quasar";
import jsPDF from "jspdf";

export default {
  name: "VehicleEntry",

  setup() {
    const users = ref([] as any[]);
    const deletedVehicles = ref([] as any[]);
    const $q = useQuasar();
    const searchText = ref("");
    const date = ref("");
    const companyId = Cookies.get("companyId");
    const logoutBy = Cookies.get("userName");

    const calculateUpdatedRupees = (val: number, row: any) => {
      const enteredDate = new Date(row.date);
      const currentDate = new Date();
      const timeDiff = Math.abs(currentDate.getTime() - enteredDate.getTime());
      const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));
      let updatedRupees = val;

      if (!row.status) {
        updatedRupees += daysDiff * 10 - 20; // Assuming each day adds 10 rupees
      }

      return `${updatedRupees} ₹ `;
    };

    const columns = [
      {
        name: "Entered By",
        required: true,
        label: "Entered By",
        align: "left",
        field: "LoggedUser",
        sortable: true,
      },
      {
        name: "selectedOption",
        required: true,
        label: "Vehicle type",
        align: "left",
        field: "selectedOption",
        sortable: true,
      },
      {
        name: "text",
        required: true,
        label: "Vehicle number",
        align: "left",
        field: "text",
        sortable: true,
      },
      {
        name: "rupees",
        required: true,
        label: "Rupees",
        align: "left",
        field: "rupees",
        sortable: true,
      },
      {
        name: "timeWithSeconds",
        required: true,
        label: "Time",
        align: "left",
        field: "timeWithSeconds",
        sortable: true,
      },
      {
        name: "date",
        required: true,
        label: "Date",
        align: "left",
        field: "date",
        sortable: true,
        format: (val: string | number | Date) => {
          const enteredDate = new Date(val);
          const currentDate = new Date();
          const timeDiff = Math.abs(
            currentDate.getTime() - enteredDate.getTime()
          );
          const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));
          return `${daysDiff} day${daysDiff > 1 ? "s" : ""} ago`;
        },
      },
      {
        name: "checkoutVehicles",
        required: true,
        label: "Check out",
        align: "left",
        field: "checkoutVehicles",
        sortable: true,
        // hide the column header when using checkboxes
        "header-props": { class: "invisible" },
      },
    ];

    const fetchUsers = async () => {
      Loading.show({
        spinner: QSpinnerGears,
      });
      try {
        const enteredVehicles = await db
          .collection("users")
          .where("companyId", "==", companyId)
          .get();
        const data = [] as any[];
        const deletedData = [] as any[];

        enteredVehicles.forEach((parkedVehicles) => {
          const user = parkedVehicles.data();
          user.delete = ""; // Add empty field for delete button
          user.rupees = calculateUpdatedRupees(user.rupees, user); // Calculate updated rupees initially
          user.id = parkedVehicles.id;

          if (user.status) {
            deletedData.push(user);
          } else {
            data.push(user);
          }
        });

        deletedVehicles.value = deletedData;
        users.value = data;
        $q.loading.hide();
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    const handleToggle = async (user: any) => {
      try {
        if (!user.status) {
          // Update the exit date to the current system date
          const currentDate = new Date().toISOString().substr(0, 10);
          await db.collection("users").doc(user.id).update({
            status: true,
            rupees: user.rupees,
            exitDate: currentDate,
          });

          // Remove the user from the local array and add it to the deletedVehicles array
          users.value = users.value.filter((u: any) => u.id !== user.id);
          deletedVehicles.value.push(user);
          generateBill({
            rupees: user.rupees,
            text: user.text,
            date: user.date,
            exitDate: currentDate,
          });
        }
        await db
          .collection("users")
          .doc(user.id)
          .update({ status: true, rupees: user.rupees, LogoutBy: logoutBy });
        // Remove the user from the local array and add it to the deletedVehicles array
        users.value = users.value.filter((u: any) => u.id !== user.id);
        deletedVehicles.value.push(user);
      } catch (error) {
        console.error("Error updating user status:", error);
      }
    };

    const filteredUsers = computed(() => {
      const search = searchText.value.toLowerCase();
      const selectedDate = date.value ? new Date(date.value) : null;

      return users.value.filter((user) => {
        // Filter based on the search text matching any of the relevant fields
        const matchesSearch =
          user.LoggedUser.toLowerCase().includes(search) ||
          user.selectedOption.toLowerCase().includes(search) ||
          user.text.toLowerCase().includes(search) ||
          user.date.toLowerCase().includes(search);

        // Filter based on the selected date
        const matchesDate = selectedDate
          ? new Date(user.date).toDateString() === new Date(date.value).toDateString()
          : true;

        return matchesSearch && matchesDate;
      });
    });

    const generateBill = (vehicle: {
      text: string;
      date: string;
      exitDate: string;
      rupees: string;
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
      doc.text("Exit Date: " + vehicle.exitDate, 10, 50);
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
      fetchUsers();
    });

    return {
      users,
      columns,
      handleToggle,
      deletedVehicles,
      searchText,
      filteredUsers,
      date,
      generateBill,
      companyId,
      logoutBy,
    };
  },
};
</script>
