import type { IVertex } from './vertex.interface'

export function isVertex(vertex: any): vertex is IVertex {
  return (
    typeof vertex === 'object' &&
    vertex !== null &&
    'id' in vertex &&
    'edges' in vertex
  )
}
