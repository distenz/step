import type { IEdge } from './edge.interface'

export interface IVertex {
  id: number
  edges: Array<IEdge['id']>
  value: any
}
