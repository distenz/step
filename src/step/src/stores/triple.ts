import { defineStore } from 'pinia'
import { openDB, type IDBPDatabase, type OpenDBCallbacks } from 'idb'
import { useAsyncState } from '@vueuse/core'
import { dehydrateTriple } from '@/utility/triple.utility'

/**
 * Semantic triple entity
 * @link [Triple Wiki](https://en.wikipedia.org/wiki/Semantic_triple)
 */
export type ITriple<MODE = TDefaultMode> = MODE
type TDefaultMode = TOPS
/**
 * ```(Object) - [Predicate] -> (Subject)```
 */
type TOPS = TObject<TPredicate<TSubject<string | number | boolean>>>
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

const tripleStoreConfig: Readonly<IIDBConfig<any>> = {
  name: `__${__APP_NAME__}`,
  version: 4,
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
      store.createIndex('O', 'object', { unique: false })
      store.createIndex('OP', ['object', 'predicate'], { unique: false })
      store.createIndex('OS', ['object', 'subject'], { unique: false })
      store.createIndex('OPS', ['object', 'predicate', 'subject'], {
        unique: false,
      })
      store.createIndex('P', 'predicate', { unique: false })
      store.createIndex('PO', ['predicate', 'object'], { unique: false })
      store.createIndex('PS', ['predicate', 'subject'], {
        unique: false,
      })
      store.createIndex('POS', ['predicate', 'object', 'subject'], {
        unique: false,
      })
      store.createIndex('S', 'subject', { unique: false })
      store.createIndex('SP', ['subject', 'predicate'], { unique: false })
      store.createIndex('SO', ['subject', 'object'], { unique: false })
      store.createIndex('SPO', ['subject', 'predicate', 'object'], {
        unique: false,
      })
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
        openDB<any>(name, version, callbacks),
        null
      )
    return { link: state, ready: isReady, loading: isLoading }
  },
  getters: {},
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
    async get() {
      const tx = this.link?.transaction('triples', 'readonly'),
        store = tx?.store,
        index = store?.index('PS'),
        req = index?.getAll(IDBKeyRange.only(['is', 'good']))
      tx?.done
      return await req
    },
  },
})
