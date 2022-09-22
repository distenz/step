import { isEdge } from '@/utility/edge.guard'
import type { IEdge } from '@/utility/edge.interface'
import { isVertex } from '@/utility/vertex.guard'
import type { IVertex } from '@/utility/vertex.interface'
import { defineStore } from 'pinia'

export interface IGraph {
  V: Map<IVertex['id'], IVertex>
  E: Map<IEdge['id'], IEdge>
}

export const graphService = defineStore('graph', {
  state: (): IGraph & { lastId: number } => {
    return {
      V: new Map<IVertex['id'], IVertex>(),
      E: new Map<IEdge['id'], IEdge>(),
      lastId: 0,
    }
  },
  getters: {
    vertexCount: state => state.V.size,
    onlyHeadV: state => {
      const res: Map<IVertex['id'], IVertex> = new Map()
      state.V.forEach(v => {
        if (
          v.edges
            .map(eId => state.E.get(eId))
            .filter(isEdge)
            .filter(e => v.id === e.tailId).length === v.edges.length
        )
          res.set(v.id, v)
      })
      return res
    },
    /**
     * Gets the vertice with the highest degree.
     * The degree or valency of a vertex is the number of edges that are incident to it
     * @param state
     */
    topDegreeV: state => {
      let max: IVertex | undefined = undefined
      const res = new Map<IVertex['id'], IVertex>()
      for (const v of state.V.values()) {
        max = !max ? v : v.edges.length > max.edges.length ? v : max
      }
      if (!isVertex(max)) throw new Error('graph has no vertices')
      res.set(max.id, max)
      return res
    },
  },
  actions: {
    next() {
      this.lastId = this.lastId + 1
      return this.lastId
    },
    getV(v: IVertex | IVertex['id']) {
      const vertice = isVertex(v) ? v : this.V.get(v)
      if (!isVertex(vertice)) throw new Error('could not find vertice')
      else return vertice
    },
    addV<T>(value: T) {
      const id = this.next()

      this.V.set(id, <IVertex>{
        id,
        edges: [],
        value,
      })
      return id
    },
    connect<T>(tailId: IVertex['id'], headId?: IVertex['id'], value?: T) {
      const id = this.next()
      headId = headId || this.addV('')
      this.E.set(id, {
        id,
        tailId: tailId,
        headId: headId,
        value,
      })
      this.V.get(tailId)?.edges.push(id)
      this.V.get(headId)?.edges.push(id)
    },
    heads(v: IVertex | IVertex['id']) {
      const vertice = this.getV(v)
      return vertice.edges
        .map(eId => this.E.get(eId))
        .filter(isEdge)
        .filter(e => e.tailId === vertice.id)
        .map(e => this.V.get(e.headId))
        .filter(isVertex)
    },
    tails(v: IVertex | IVertex['id']) {
      const vertice = this.getV(v)
      return vertice.edges
        .map(eId => this.E.get(eId))
        .filter(isEdge)
        .filter(e => e.headId === vertice.id)
        .map(e => this.V.get(e.tailId))
        .filter(isVertex)
    },
  },
})
