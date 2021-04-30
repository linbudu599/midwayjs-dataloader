import { Provide, Inject } from '@midwayjs/decorator';
import { Resolver, Query, Arg, Ctx, FieldResolver, Root } from 'type-graphql';

import { User, Pet } from '../graphql/user';

import { mockService } from '../utils/mock';
import { ApolloContext, RegisteredPlainDataLoader } from '../types';

@Provide()
@Resolver(of => User)
export default class UserResolver {
  @Inject('LOADER')
  loader: RegisteredPlainDataLoader;

  @Query(() => [User], { nullable: true })
  GetAllUsers(@Ctx() context: ApolloContext) {
    return context.service.getAllUsers();
  }

  @Query(() => User, { nullable: true })
  GetUserByName(@Arg('name') name: string, @Ctx() context: ApolloContext) {
    return context.service.getUserByName(name);
  }

  // Field Resolver on User.partner (1-1 relation)

  @FieldResolver(() => User, { nullable: true })
  partnerOrigin(@Root() root: User, @Ctx() context: ApolloContext) {
    const partnerId = root.partnerId;
    return context.service.getUserById(partnerId);
  }

  @FieldResolver(() => User, { nullable: true })
  partnerFromCtxLoader(@Root() root: User, @Ctx() context: ApolloContext) {
    const partnerId = root.partnerId;
    return context.dataLoader.loaders.userLoader.load(partnerId);
  }

  @FieldResolver(() => User, { nullable: true })
  partnerFromRegisteredLoader(@Root() root: User) {
    const partnerId = root.partnerId;
    return this.loader.userLoader.load(partnerId);
  }

  // Field Resolver on User.pets (1-n relation)

  @FieldResolver(() => [Pet], { nullable: true })
  petsOrigin(@Root() root: User, @Ctx() context: ApolloContext) {
    const petIds = root.petIds;
    return context.service.getPetsByIds(petIds);
  }

  @FieldResolver(() => [Pet], { nullable: true })
  petsFromCtxLoader(@Root() root: User, @Ctx() context: ApolloContext) {
    const petIds = root.petIds;
    return context.dataLoader.loaders.petLoader.loadMany(petIds);
  }

  @FieldResolver(() => [Pet], { nullable: true })
  petsFromRegisteredLoader(@Root() root: User) {
    const petIds = root.petIds;
    return this.loader.petLoader.loadMany(petIds);
  }
}
