import { isEdge } from '@/utility/edge.guard'
import type { IEdge } from '@/utility/edge.interface'
import { isVertex } from '@/utility/vertex.guard'
import type { IVertex } from '@/utility/vertex.interface'
import { defineStore } from 'pinia'
import { packageService } from './package.service'

export interface IGraph {
  V: Array<IVertex>
  E: Array<IEdge>
  lastVId: number
  lastEId?: number
}

export const graphService = defineStore('graph', {
  state: (): IGraph => {
    return {
      V: [
        {
          id: 0,
          edges: [],
          value: undefined,
        },
      ],
      E: [],
      lastVId: 0,
      lastEId: undefined,
    }
  },
  getters: {
    vertexCount: state => state.V.length,
    onlyHeadV: state => {
      const res: Array<IVertex> = []
      state.V.filter(isVertex).forEach(v => {
        if (
          v.edges
            .map(eId => state.E[eId])
            .filter(isEdge)
            .filter(e => v.id === e.tailId).length === v.edges.length
        )
          res.push(v)
      })
      return res
    },
    /**
     * Gets the vertice with the highest degree.
     * The degree or valency of a vertex is the number of edges that are incident to it
     * @param state
     */
    topDegreeV: (state): IVertex => {
      let max: IVertex | undefined = undefined
      for (const v of state.V.filter(isVertex).values()) {
        max = !max ? v : v.edges.length > max.edges.length ? v : max
      }
      if (!isVertex(max)) throw new Error('graph has no vertices')

      return max
    },
  },
  actions: {
    nextV() {
      this.lastVId = this.lastVId + 1
      return this.lastVId
    },
    nextE() {
      this.lastEId = this.lastEId === undefined ? 0 : this.lastEId + 1
      return this.lastEId
    },
    getV(v: IVertex | IVertex['id']) {
      const vertice = isVertex(v) ? v : this.V[v]
      if (!isVertex(vertice)) throw new Error('could not find vertice')
      else return vertice
    },
    getBFSHead(fromId: IVertex['id'], searchId: IVertex['id']) {
      if (fromId === searchId) return true
      for (const v of this.heads(fromId)) {
        if (v.id === searchId) return true
        this.getBFSHead(v.id, searchId)
      }
      return false
    },
    addV<T>(value: T) {
      const id = this.nextV()

      this.V[id] = {
        id,
        edges: [],
        value,
      }
      return id
    },
    removeV(id: IVertex['id']) {
      this.V[id].edges.forEach(eId => this.E.splice(eId, 1))
      this.V.splice(id, 1)
    },
    connect<T>(
      tailId: IVertex['id'],
      headId?: IVertex['id'],
      value?: T
    ): IVertex {
      const id = this.nextE()
      headId = headId || this.addV('')
      this.E[id] = {
        id,
        tailId: tailId,
        headId: headId,
        value,
      }
      const tail = this.V[tailId],
        head = this.V[headId]
      tail.edges.push(id)
      head.edges.push(id)
      return head
    },
    heads(v: IVertex | IVertex['id']) {
      const vertice = this.getV(v)
      return vertice.edges
        .map(eId => this.E[eId])
        .filter(isEdge)
        .filter(e => e.tailId === vertice.id)
        .map(e => this.V[e.headId])
        .filter(isVertex)
    },
    tails(v: IVertex | IVertex['id']) {
      const vertice = this.getV(v)
      return vertice.edges
        .map(eId => this.E[eId])
        .filter(isEdge)
        .filter(e => e.headId === vertice.id)
        .map(e => this.V[e.tailId])
        .filter(isVertex)
    },
  },
  persist: {
    enabled: true,
    strategies: [
      { key: packageService().storagePrefix + 'graph', storage: localStorage },
    ],
  },
})
