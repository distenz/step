import type { IEdge } from './edge.interface'

export function isEdge(edge: any): edge is IEdge {
  return (
    typeof edge === 'object' &&
    'id' in edge &&
    'tailId' in edge &&
    'headId' in edge
  )
}