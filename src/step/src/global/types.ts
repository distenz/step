export interface IHasvalue<T = any> {
  value: T
}
export interface IHasID<T = string | number> {
  id: T
}
export type IDocumentNode = IHasID<string> & IHasvalue<string>
export interface ITraversalData {
  offset: 'start' | 'end' | number
  direction: 'start' | 'end'
}
