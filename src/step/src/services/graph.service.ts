import { defineStore } from 'pinia'

export interface INodeData<T> {
  id: string
  edges: Array<string>
  value: T
}
export interface IEdgeData<T> {
  id: string
  fromId: string
  toId: string
  value: T
}
export interface IGraph {
  nodes: Record<string, INodeData<any>>
  edges: Record<string, IEdgeData<any>>
}

export const graphService = defineStore('graph', {
  state: (): IGraph => {
    return {
      nodes: {},
      edges: {},
    }
  },
  getters: {
    nodeCount: state => Object.keys(state.nodes).length,
  },
  actions: {
    add<T>(value: T) {
      const id = generateId()
      this.nodes[id] = <INodeData<T>>{
        id,
        edges: [],
        value,
      }
      return id
    },
    connect<T>(
      fromId: INodeData<T>['id'],
      toId?: INodeData<T>['id'],
      value?: T
    ) {
      const id = generateId()
      toId = toId || this.add('')
      this.edges[id] = {
        id,
        fromId,
        toId,
        value,
      }
      this.nodes[fromId].edges.push(id)
      this.nodes[toId].edges.push(id)
    },
  },
})
function generateId() {
  return new Date().getTime().toString()
}
