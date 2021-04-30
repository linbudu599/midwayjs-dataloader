import { Provide, Inject } from '@midwayjs/decorator';
import { Resolver, Query, Arg, Ctx, FieldResolver, Root } from 'type-graphql';

import UserEntity from '../entities/User.entity';
import PostEntity from '../entities/Post.entity';
import ProfileEntity from '../entities/Profile.entity';

import { ApolloContext } from '../types';

import { TypeORMService } from '../service/typeorm.service';

import { PostLoader } from '../decorators/Loader';
import DataLoader from 'dataloader';

@Provide()
@Resolver(() => UserEntity)
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

  @FieldResolver(returns => [PostEntity], { nullable: true })
  async postsField(
    @Root() root: UserEntity,
    @PostLoader() loader: DataLoader<number, PostEntity>,
    @Ctx() context: ApolloContext
  ) {
    const postsIds = root.postsIds;
    console.log('loader: ', loader);
    console.log('metadata loader');

    return loader.loadMany(postsIds);
    // console.log(await context.metadataLoader.loaders.ORMUser.posts.load(root));
    // return context.dataLoader.loaders.postORMLoader.loadMany(postsIds);
  }

  @FieldResolver(returns => ProfileEntity, { nullable: true })
  async profileField(@Root() root: UserEntity, @Ctx() context: ApolloContext) {
    const profileId = root.profileId;
    console.log('metadata loader');
    console.log(
      await context.metadataLoader.loaders.ORMUser.profile.load(root)
    );
    return context.dataLoader.loaders.profileORMLoader.load(profileId);
  }
}
