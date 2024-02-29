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
    tool: {},
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
    setTool(tool) {
      this.tool = tool
    },
    clearTool() {
      this.tool = {}
    },
  }
})

export const useSelectorStore = defineStore('selectors', {
  state: () => ({
    tags: [],
    projects: [],
  }),
  actions: {
    setTags(tags) {
      this.tags = tags
    },
    setProjects(projects) {
      this.projects = projects
    },
  }
})
