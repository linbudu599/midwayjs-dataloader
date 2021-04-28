import { Provide, Inject } from '@midwayjs/decorator';
import { Resolver, Query, Arg, Ctx, FieldResolver, Root } from 'type-graphql';

import UserEntity from '../entities/User.entity';
import PostEntity from '../entities/Post.entity';
import ProfileEntity from '../entities/Profile.entity';

import { ApolloContext } from '../types';

import { TypeORMService } from '../service/typeorm.service';

@Provide()
@Resolver()
export default class TypeORMResolver {
  @Inject()
  service: TypeORMService;

  @Query(type => [UserEntity], { nullable: true })
  ORMGetAllUsers(@Ctx() context: ApolloContext) {
    return this.service.getAllUsers();
  }

  @Query(type => UserEntity, { nullable: true })
  ORMGetUserById(@Arg('id') id: number, @Ctx() context: ApolloContext) {
    return this.service.getUserById(id);
  }

  @Query(type => [PostEntity], { nullable: true })
  ORMGetAllPosts(@Ctx() context: ApolloContext) {
    return this.service.getAllPosts();
  }

  @Query(type => PostEntity, { nullable: true })
  ORMGetPostById(@Arg('postId') id: number, @Ctx() context: ApolloContext) {
    return this.service.getPostById(id);
  }

  @Query(type => [ProfileEntity], { nullable: true })
  ORMGetAllProfiles(@Ctx() context: ApolloContext) {
    return this.service.getAllProfiles();
  }

  @Query(type => ProfileEntity, { nullable: true })
  ORMGetProfileById(
    @Arg('profileId') id: number,
    @Ctx() context: ApolloContext
  ) {
    return this.service.getProfileById(id);
  }

  // @FieldResolver(() => User, { nullable: true })
  // posts(@Root() root: User, @Ctx() context: ApolloContext) {
  //   const postIds = root.posts;
  // }
}
