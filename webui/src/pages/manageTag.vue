<template>
  <v-alert
    :type="alertType"
    :title="alertTitle"
    v-model="showAlert"
  >
    Tag "{{ newTag.label }}" in group "{{ newTag.group }}" and hex color {{ newTag.color }}
  </v-alert>
  <v-sheet width="90%" class="mx-auto">
    <h1>
      Manage Tag
    </h1>
    <tag-form
      ref="childFormRef"
      @update:formdata="handleFormdataUpdate"
    ></tag-form>
    <v-btn
      block
      class="mt-2"
      prepend-icon="mdi-check-circle"
      @click="save">
      <template v-slot:prepend>
        <v-icon color="success"></v-icon>
      </template>
      Submit
    </v-btn>
    <br>
    <v-btn
      variant="tonal"
      block
      color="red"
      prepend-icon="mdi-delete"
      v-if="childFormData.id"
      @click="mydelete">
      <template v-slot:prepend>
        <v-icon color="delete"></v-icon>
      </template>
      Delete
    </v-btn>
    <br>
    <v-btn
      variant="tonal"
      block
      color="red"
      prepend-icon="mdi-cancel"
      @click="goBack">
      <template v-slot:prepend>
        <v-icon color="cancel"></v-icon>
      </template>
      Cancel
    </v-btn>
  </v-sheet>
</template>

<script>
  import { createResource, deleteResource } from '@/utils/sparql';

  export default {
    data: () => ({
      showAlert: false,
      alertType: "success",
      alertTitle: "Tag was added",
      newTag: {},
      childFormData: {},
    }),
    setup() {
      const router = useRouter();

      function goBack() {
        router.back();
      }

      return { goBack };
    },
    methods: {
      handleFormdataUpdate(value) {
        console.log("Update data from TagForm in addTag with data:", value);
        // Update the parent's data with the value from the child
        this.childFormData = value;
      },
      mydelete() {
        const tag = this.$refs.childFormRef.getTag();
        console.log("tag: ", tag);
        this.newTag = tag;

        var response = deleteResource(tag);

        // handle
        if (typeof response !== typeof "string") {//should be the other way around but does not work
          this.alertType = "success";
          this.alertTitle = "Tag was deleted";
        }
        else {
          this.alertType = "error";
          this.alertTitle = "Failed deleting tag";
        }

        // Show the alert
        this.showAlert = true;
        window.scrollTo({
          top: 0,
          left: 0,
          behavior: 'smooth'
        });

        // Set a timer to hide the alert after 1 seconds
        setTimeout(() => {
          this.showAlert = false;
          this.newTag = {};
          this.goBack();
        }, 1000);
      },
      save() {
        const tag = this.$refs.childFormRef.getTag();
        console.log("tag: ", tag);
        this.newTag = tag;
        var response = "";
        if (tag.id !== '')
          response = deleteResource(tag);
        response = createResource(tag);

        // handle
        if (typeof response !== typeof "string") {//should be the other way around but does not work
          this.alertType = "success";
          this.alertTitle = "Tag was added";
          if (tag.id !== '')
            this.alertTitle = "Tag was updated";
        }
        else {
          this.alertType = "error";
          this.alertTitle = "Failed adding tag";
        }

        // Show the alert
        this.showAlert = true;
        window.scrollTo({
          top: 0,
          left: 0,
          behavior: 'smooth'
        });

        // Set a timer to hide the alert after 1 seconds
        setTimeout(() => {
          this.showAlert = false;
          this.newTag = {};
          this.goBack();
        }, 1000);
      },
    },
  }
</script>
