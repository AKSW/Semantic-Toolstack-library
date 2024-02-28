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
      Add new Tag
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
  import { createResource, deleteResource } from '@/utils/helper';

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

        var response = deleteResource("tag", tag);

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

        // Set a timer to hide the alert after 5 seconds
        setTimeout(() => {
          this.showAlert = false;
          this.newTag = {};
          this.goBack();
        }, 5000);
      },
      save() {
        const tag = this.$refs.childFormRef.getTag();
        console.log("tag: ", tag);
        this.newTag = tag;
        var response = "";
        if (tag.id !== '')
          response = deleteResource("tag", tag);
        response = createResource("tag", tag);

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

        // Set a timer to hide the alert after 5 seconds
        setTimeout(() => {
          this.showAlert = false;
          this.newTag = {};
          this.goBack();
        }, 5000);
      },
    },
  }
</script>
