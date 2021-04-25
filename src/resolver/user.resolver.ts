import { Provide } from '@midwayjs/decorator';
import { Resolver, Query, Arg, Ctx, FieldResolver, Root } from 'type-graphql';

import { User, Pet } from '../graphql/user';

import { mockService } from '../utils/mock';

type Context = {
  service: typeof mockService;
};

@Provide()
@Resolver(of => User)
export default class UserResolver {
  @Query(returns => [User], { nullable: true })
  GetAllUsers(@Ctx() context: Context) {
    return context.service.getAllUsers();
  }

  @Query(returns => User, { nullable: true })
  GetUserByName(@Arg('name') name: string, @Ctx() context: Context) {
    return context.service.getUserByName(name);
  }

  @FieldResolver(returns => User, { nullable: true })
  partner(@Root() root: User, @Ctx() context: Context) {
    const partnerId = root.partnerId;
    return context.service.getUserById(partnerId);
  }

  @FieldResolver(returns => [Pet], { nullable: true })
  pets(@Root() root: User, @Ctx() context: Context) {
    const petIds = root.petIds;
    return context.service.getPetsByIds(petIds);
  }
}
