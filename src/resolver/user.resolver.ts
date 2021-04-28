import { Provide } from '@midwayjs/decorator';
import { Resolver, Query, Arg, Ctx, FieldResolver, Root } from 'type-graphql';

import { User, Pet } from '../graphql/user';

import { mockService } from '../utils/mock';
import { ApolloContext } from '../types';

@Provide()
@Resolver(of => User)
export default class UserResolver {
  @Query(returns => [User], { nullable: true })
  GetAllUsers(@Ctx() context: ApolloContext) {
    return context.service.getAllUsers();
  }

  @Query(returns => User, { nullable: true })
  GetUserByName(@Arg('name') name: string, @Ctx() context: ApolloContext) {
    return context.service.getUserByName(name);
  }

  @FieldResolver(returns => User, { nullable: true })
  partner(@Root() root: User, @Ctx() context: ApolloContext) {
    const partnerId = root.partnerId;
    // return context.service.getUserById(partnerId);
    return context.dataLoader.loaders.userLoader.load(partnerId);
  }

  @FieldResolver(returns => [Pet], { nullable: true })
  pets(@Root() root: User, @Ctx() context: ApolloContext) {
    const petIds = root.petIds;
    // return context.service.getPetsByIds(petIds);
    return context.dataLoader.loaders.petLoader.loadMany(petIds);
  }
}
