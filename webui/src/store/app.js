// Utilities
import { defineStore } from 'pinia'

export const useAppStore = defineStore('app', {
  state: () => ({
    //
  }),
})

export const useRouteDataStore = defineStore('routeData', {
  state: () => ({
    tag: {},
    project: {},
  }),
  actions: {
    setTag(tag) {
      this.tag = tag
    },
    clearTag() {
      this.tag = {}
    },
    setProject(project) {
      this.project = project
    },
    clearProject() {
      this.project = {}
    },
  }
})
