import { validate } from 'class-validator';
import {
  createParamDecorator,
  createMethodDecorator,
  ClassType,
  ArgumentValidationError,
  MiddlewareFn,
} from 'type-graphql';
import { ApolloContext } from '../types';
import DataLoader from 'dataloader';

export const PostLoader = () =>
  createParamDecorator<ApolloContext>(
    ({ context }) => context.dataLoader.loaders['postORMLoader']
  );

export const ProfileLoader = () =>
  createParamDecorator<ApolloContext>(
    ({ context }) => context.dataLoader.loaders['profileORMLoader']
  );
