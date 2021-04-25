import { User, Pet } from '../graphql/user';
import chalk from 'chalk';

const promiseWrapper = <T>(value: T, indicator: string): Promise<T> =>
  new Promise(resolve => {
    setTimeout(() => {
      console.log(chalk.cyanBright(indicator));
      return resolve(value);
    }, 200);
  });

export const mockService = (() => {
  const users: User[] = [
    { id: 1, name: 'AAA', partnerId: 2, petIds: [2, 3, 4] },
    { id: 2, name: 'BBB', partnerId: 3, petIds: [1, 3, 4, 5] },
    { id: 3, name: 'CCC', partnerId: 4, petIds: [1, 2, 5] },
    { id: 4, name: 'DDD', partnerId: 5, petIds: [1, 2, 5] },
    { id: 5, name: 'EEE', partnerId: 1, petIds: [2, 3, 4] },
  ];
  const pets: Pet[] = [
    {
      id: 1,
      kind: 'Cat',
    },
    {
      id: 2,
      kind: 'Dog',
    },
    {
      id: 3,
      kind: 'Bird',
    },
    {
      id: 4,
      kind: 'Snake',
    },
    {
      id: 5,
      kind: 'Rabbit',
    },
  ];

  return {
    getUserById: (id: number) =>
      promiseWrapper(
        users.find(user => user.id === id),
        `getUserById: ${id}`
      ),

    getUserByName: (name: string) =>
      promiseWrapper(
        users.find(user => user.name === name),
        `getUserByName: ${name}`
      ),

    getUsersByIds: (ids: number[]) =>
      promiseWrapper(
        users.filter(user => ids.includes(user.id)),
        `getUsersByIds: ${ids}`
      ),

    getAllUsers: () => promiseWrapper(users, 'getAllUsers'),

    getPetById: (id: number) =>
      promiseWrapper(
        pets.find(pet => pet.id === id),
        `getPetById: ${id}`
      ),

    getPetsByIds: (ids: number[]) =>
      promiseWrapper(
        pets.filter(pet => ids.includes(pet.id)),
        `getPetsByIds: ${ids}`
      ),

    getAllPets: () => promiseWrapper(pets, 'getAllPtes'),
  };
})();
