<template>
  <v-alert
    :type="alertType"
    :title="alertTitle"
    v-model="showAlert"
  >
    Project "{{ newProject.label }}" with start date "{{ newProject.startDate }}" and page {{ newProject.page }}
  </v-alert>
  <v-sheet width="90%" class="mx-auto">
    <h1>
      Manage Project
    </h1>
    <project-form
      ref="childFormRef"
      @update:formdata="handleFormdataUpdate"
    ></project-form>
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
      alertTitle: "Project was added",
      newProject: {},
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
        console.log("Update data from ProjectForm in addProject with data:", value);
        // Update the parent's data with the value from the child
        this.childFormData = value;
      },
      mydelete() {
        const project = this.$refs.childFormRef.getProject();
        console.log("project: ", project);
        this.newProject = project;

        var response = deleteResource(project);

        // handle
        if (typeof response !== typeof "string") {//should be the other way around but does not work
          this.alertType = "success";
          this.alertTitle = "Project was deleted";
        }
        else {
          this.alertType = "error";
          this.alertTitle = "Failed deleting project";
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
          this.newProject = {};
          this.goBack();
        }, 2000);
      },
      save() {
        const project = this.$refs.childFormRef.getProject();
        console.log("project: ", project);
        this.newProject = project;
        var response = "";
        if (project.id !== '')
          response = deleteResource(project);
        response = createResource(project);

        // handle
        if (typeof response !== typeof "string") {//should be the other way around but does not work
          this.alertType = "success";
          this.alertTitle = "Project was added";
          if (project.id !== '')
            this.alertTitle = "Project was updated";
        }
        else {
          this.alertType = "error";
          this.alertTitle = "Failed adding project";
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
          this.newProject = {};
          this.goBack();
        }, 2000);
      },
    },
  }
</script>
