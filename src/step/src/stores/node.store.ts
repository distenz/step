import type { IDocumentNode, IDocumentNodeHashMap } from '@/global/types'
import { nanoid } from 'nanoid'
import { defineStore } from 'pinia'
export function documentNodeFactory(): IDocumentNode {
  return {
    id: nanoid(),
    value: '',
    heads: [],
    tails: [],
    complete: false,
  }
}
/**
 * @todo capability for storing edge data
 */
export const nodeStore = defineStore('nodes', {
  state: () => {
    const root = documentNodeFactory(),
      state = {
        map: <IDocumentNodeHashMap>{},
        order: <Array<IDocumentNode['id']>>[],
      }
    state.map[root.id] = root
    state.order.push(root.id)
    return state
  },
  actions: {
    create(offset?: number) {
      return this.add(documentNodeFactory(), offset)
    },
    add(v: IDocumentNode, offset?: number) {
      offset = offset || this.order.length - 1
      this.map[v.id] = v
      this.order.splice(offset, 0, v.id)
      return { node: v, offset }
    },
    remove(id: IDocumentNode['id']) {
      const offset = this._findOrderOffset(id)
      this.order.splice(offset, 1)
      delete this.map[id]
      return offset
    },
    move(id: IDocumentNode['id'], nextOffset: number) {
      const currOffset = this._findOrderOffset(id)
      this.order.splice(currOffset, 1)
      this.order.splice(nextOffset, 0, id)
    },
    _findOrderOffset(id: IDocumentNode['id']) {
      return this.order.findIndex(idx => idx === id)
    },
  },
  persist: {
    enabled: true,
    strategies: [
      {
        storage: window.localStorage,
        key: `__${__APP_NAME__}__nodes`,
      },
    ],
  },
})
