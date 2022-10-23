import type { IUser } from '@/global/types'
import { nanoid } from 'nanoid'
import { defineStore } from 'pinia'

export const users = defineStore('users', {
  state: (): Array<IUser> => [
    {
      id: nanoid(),
      name: 'John',
    },
    {
      id: nanoid(),
      name: 'Peter',
    },
    {
      id: nanoid(),
      name: 'Alexa',
    },
    {
      id: nanoid(),
      name: 'Sara',
    },
  ],
})
