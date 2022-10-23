export interface IHasvalue<T = any> {
  value: T
}
export interface IHasID {
  id: string
}
export interface IDocumentNode extends IHasID, IHasvalue {
  complete: boolean
  user?: IUser
  tails: Array<IDocumentNode['id']>
  heads: Array<IDocumentNode['id']>
}
export type IDocumentNodeHashMap = Record<IDocumentNode['id'], IDocumentNode>
export interface ITraversalData {
  offset: 'start' | 'end' | number
  direction: 'start' | 'end'
}
export interface IUser {
  id: string
  name: string
}
