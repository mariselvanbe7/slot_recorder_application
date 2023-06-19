// MyComponent.vue

<template>
    <q-page  style="display: flex; justify-content: center; padding-top: 15rem;">
  <span>
    <q-file
    
      v-model="file"
      label="Select a file"
      @change="handleFileChange"
      class="q-mb-md"
    
    ></q-file>
    <q-btn label="Upload" @click="handleSubmit" />
  </span>
</q-page>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
//import { storage } from '@/firebase';

export default defineComponent({
  setup() {
    const file = ref<File | null>(null);

    const handleFileChange = (newFile: File | null) => {
      file.value = newFile;
    };

    // const handleSubmit = async () => {
    //   if (file.value) {
    //     // Create a reference to the file in Firebase Storage
    //     const storageRef = storage.ref(`quasar-form/${file.value.name}`);

    //     try {
    //       // Upload the file to Firebase Storage
    //       await storageRef.put(file.value);
    //       console.log('File uploaded successfully!');
    //     } catch (error) {
    //       console.error('Error uploading file:', error);
    //     }
    //   }
    // };

    return {
      file,
      handleFileChange,
    //  handleSubmit,
    };
  },
});
</script>
