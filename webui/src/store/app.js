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
  }),
  actions: {
    setTag(tag) {
      this.tag = tag
    },
    clearTag() {
      this.tag = {}
    }
  }
})
