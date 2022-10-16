import * as packageFile from '@/../package.json'
import { defineStore } from 'pinia'

export const packageService = defineStore('package', {
  state: () => ({
    data: packageFile,
  }),
  getters: {
    storagePrefix: state => `${state.data.name.toUpperCase()}__`,
  },
})
