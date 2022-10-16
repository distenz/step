import type { IVertex } from '@/utility/vertex.interface'
import { defineStore } from 'pinia'
import { graphService } from './graph.service'
import { packageService } from './package.service'

export interface ICursor {
  current: IVertex | null
  previous: ICursor['current']
  heads: Map<IVertex['id'], IVertex>
  tails: Map<IVertex['id'], IVertex>
  path: Array<IVertex['id']>
}

export const cursorService = defineStore('cursor', {
  state: (): ICursor => ({
    current: null,
    previous: null,
    heads: new Map(),
    tails: new Map(),
    path: [],
  }),
  actions: {
    start() {
      this.current = graphService().topDegreeV
      return this.current
    },
    next(v: IVertex | IVertex['id'], path: Array<IVertex['id']> = []) {
      this.previous = this.current
      this.current = graphService().getV(v)
      this.path = path
      return this.current
    },
  },
  persist: {
    enabled: true,
    strategies: [
      { key: packageService().storagePrefix + 'cursor', storage: localStorage },
    ],
  },
})
