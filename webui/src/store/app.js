// Utilities
import { defineStore } from 'pinia'

export const useAppStore = defineStore('app', {
  state: () => ({
    //
  }),
})

export const useRouteDataStore = defineStore('routeData', {
  state: () => ({
    data: {}, // This will hold the data you want to pass between components
  }),
  actions: {
    setData(data) {
      this.data = data
    },
    clearData() {
      this.data = {}
    }
  }
})
