<template>
  <v-alert
    :type="alertType"
    :title="alertTitle"
    v-model="showAlert"
  >
    Tool "{{ newTool.label }}"
  </v-alert>
  <v-sheet width="90%" class="mx-auto">
    <h1>
      Manage Tool
    </h1>
    <tool-form
      ref="childFormRef"
      @update:formdata="handleFormdataUpdate"
    ></tool-form>

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
      alertTitle: "Tool was added",
      newTool: {},
      childFormData: {},
      childFormData2: {},
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
        console.log("Update data from ToolForm in manageTool with data:", value);
        // Update the parent's data with the value from the child
        this.childFormData = value;
      },
      handleFormdataUpdate2(value) {
        console.log("Update data from RepositoryForm in manageTool with data:", value);
        // Update the parent's data with the value from the child
        this.childFormData2 = value;
      },
      mydelete() {
        const tool = this.$refs.childFormRef.getTool();
        console.log("tool: ", tool);
        this.newTool = tool;

        var response = deleteResource("tool", tool);

        // handle
        if (typeof response !== typeof "string") {//should be the other way around but does not work
          this.alertType = "success";
          this.alertTitle = "Tool was deleted";
        }
        else {
          this.alertType = "error";
          this.alertTitle = "Failed deleting tool";
        }

        // Show the alert
        this.showAlert = true;
        window.scrollTo({
          top: 0,
          left: 0,
          behavior: 'smooth'
        });

        // Set a timer to hide the alert after 2 seconds
        setTimeout(() => {
          this.showAlert = false;
          this.newTool = {};
          this.goBack();
        }, 2000);
      },
      save() {
        const tool = this.$refs.childFormRef.getTool();
        console.log("tool: ", tool);
        this.newTool = tool;
        var response = "";
        if (tool.id !== '')
          response = deleteResource("tool", tool);
        response = createResource(tool);
        //TODO create Repository

        // handle
        if (typeof response !== typeof "string") {//should be the other way around but does not work
          this.alertType = "success";
          this.alertTitle = "Tool was added";
          if (tool.id !== '')
            this.alertTitle = "Tool was updated";
        }
        else {
          this.alertType = "error";
          this.alertTitle = "Failed adding tool";
        }

        // Show the alert
        this.showAlert = true;
        window.scrollTo({
          top: 0,
          left: 0,
          behavior: 'smooth'
        });

        // Set a timer to hide the alert after 2 seconds
        setTimeout(() => {
          this.showAlert = false;
          this.newTool = {};
          this.goBack();
        }, 2000);
      },
    },
  }
</script>
