import type { Character } from '../../engine/types'

export const personajes: Record<string, Character> = {
  lupita: {
    name: 'Lupita',
    color: '#F3B61F',
    look: { skin: '#C68863', hair: '#2A1A12', shirt: '#C2185B', hairStyle: 'trenzas' },
  },
  chepa: {
    name: 'Doña Chepa',
    color: '#2EC4B6',
    look: {
      skin: '#A86B48',
      hair: '#D8D2CC',
      shirt: '#1F7A8C',
      hairStyle: 'canas',
      accessory: 'delantal',
    },
  },
  beto: {
    name: 'Don Beto',
    color: '#FF8C61',
    look: {
      skin: '#8D5A3B',
      hair: '#2A1A12',
      shirt: '#6A994E',
      hairStyle: 'corto',
      accessory: 'sombrero',
    },
  },
}
