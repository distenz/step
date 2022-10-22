import { defineStore } from 'pinia'
import {
  openDB,
  type DBSchema,
  type IDBPDatabase,
  type OpenDBCallbacks,
} from 'idb'
import { useAsyncState } from '@vueuse/core'
import {
  dehydrateTriple,
  type IDehidratedTriple,
} from '@/utility/triple.utility'

/**
 * Semantic triple entity
 * @link [Triple Wiki](https://en.wikipedia.org/wiki/Semantic_triple)
 */
export type ITriple<MODE = TDefaultMode> = MODE
type TDefaultMode = TOPS
/**
 * ```(Object) - [Predicate] -> (Subject)```
 */
type TOPS = TObject<TPredicate<TSubject<any>>>
type TObject<Contains> = Record<string, Contains>
type TPredicate<Contains> = Record<string, Contains>
type TSubject<Contains> = Record<string, Contains>

/**
 * `idb` package config
 * @link [Documentation](https://github.com/jakearchibald/idb)
 */
interface IIDBConfig<T> {
  name: string
  version: number
  callbacks?: OpenDBCallbacks<T>
}
interface ITripleStore extends DBSchema {
  triples: {
    value: IDehidratedTriple
    key: number
    indexes: {
      OXX: string
      XPX: string
      XXS: string
      OPX: string
      OXS: string
      XOS: string
      OPS: string
    }
  }
}

const tripleStoreConfig: Readonly<IIDBConfig<any>> = {
  name: `__${__APP_NAME__}`,
  version: 7,
  callbacks: {
    upgrade(db: IDBPDatabase) {
      console.log(
        'upgrading step idb version to',
        db.version,
        'recreating triples store'
      )
      if (db.objectStoreNames.contains('triples')) {
        db.deleteObjectStore('triples')
      }
      const store = db.createObjectStore('triples', { autoIncrement: true })
      store.createIndex('OXX', 'object', { unique: false })
      store.createIndex('XPX', 'predicate', { unique: false })
      store.createIndex('XXS', 'subject', { unique: false })
      store.createIndex('OPX', ['object', 'predicate'], { unique: false })
      store.createIndex('XPS', ['predicate', 'subject'], { unique: false })
      store.createIndex('OXS', ['object', 'subject'], { unique: false })
      store.createIndex('OPS', ['object', 'predicate', 'subject'], {
        unique: false,
      })

      store.put({ object: 'root', predicate: 'is', subject: 'root' })
    },
  },
}

/**
 * `ts-except-error` around state.link are needed due to the type change after hidration
 */
export const tripleStore = defineStore('idb', {
  state: () => {
    const { name, version, callbacks } = tripleStoreConfig,
      { state, isReady, isLoading } = useAsyncState(
        openDB<ITripleStore>(name, version, callbacks),
        null
      )
    return { link: state, ready: isReady, loading: isLoading }
  },
  getters: {
    // ready: state => state.ready,
  },
  actions: {
    async push(triple: ITriple) {
      if (!this.ready) throw new Error('idb not ready')
      const triples = dehydrateTriple(triple)
      const tx = this.link?.transaction('triples', 'readwrite', {
        durability: 'strict',
      })
      triples.forEach(triple => tx?.store?.put(triple))
      return await tx?.done
    },
    async get(
      mode: keyof ITripleStore['triples']['indexes'],
      params: Array<string>
    ) {
      const tx = this.link?.transaction('triples', 'readonly'),
        store = tx?.store,
        index = store?.index(mode),
        req = index?.get(IDBKeyRange.only(params))
      tx?.done
      return await req
    },
    async list(
      mode: keyof ITripleStore['triples']['indexes'],
      params: Array<string>
    ) {
      const tx = this.link?.transaction('triples', 'readonly'),
        store = tx?.store,
        index = store?.index(mode),
        req = index?.getAll(IDBKeyRange.only(params))
      tx?.done
      return await req
    },
  },
})
