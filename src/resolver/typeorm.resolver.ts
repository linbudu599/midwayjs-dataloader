import { Provide, Inject } from '@midwayjs/decorator';
import { Resolver, Query, Arg, Ctx, FieldResolver, Root } from 'type-graphql';

import UserEntity from '../entities/User.entity';
import PostEntity from '../entities/Post.entity';
import ProfileEntity from '../entities/Profile.entity';

import { ApolloContext, RegisteredPlainDataLoader } from '../types';

import { TypeORMService } from '../service/typeorm.service';

import { PostLoader, ProfileLoader } from '../decorators/Loader';
import DataLoader from 'dataloader';

@Provide()
@Resolver(() => UserEntity)
export default class TypeORMResolver {
  @Inject()
  service: TypeORMService;

  @Inject('LOADER')
  loader: RegisteredPlainDataLoader;

  @Query(() => [UserEntity], { nullable: true })
  ORMGetAllUsers() {
    return this.service.getAllUsers();
  }

  @Query(() => UserEntity, { nullable: true })
  ORMGetUserById(@Arg('id') id: number) {
    return this.service.getUserById(id);
  }

  @Query(() => [PostEntity], { nullable: true })
  ORMGetAllPosts() {
    return this.service.getAllPosts();
  }

  @Query(() => PostEntity, { nullable: true })
  ORMGetPostById(@Arg('postId') id: number) {
    return this.service.getPostById(id);
  }

  @Query(() => [ProfileEntity], { nullable: true })
  ORMGetAllProfiles() {
    return this.service.getAllProfiles();
  }

  @Query(() => ProfileEntity, { nullable: true })
  ORMGetProfileById(@Arg('profileId') id: number) {
    return this.service.getProfileById(id);
  }

  // Field Resolver on User.posts (1-n relation)

  @FieldResolver(() => [PostEntity], { nullable: true })
  async postsOrigin(@Root() root: UserEntity) {
    const postsIds = root.postsIds;
    return await this.service.getPostsByIds(postsIds);
  }

  @FieldResolver(() => [PostEntity], { nullable: true })
  async postsFromContextLoader(
    @Root() root: UserEntity,
    @Ctx() context: ApolloContext
  ) {
    const postsIds = root.postsIds;
    return context.dataLoader.loaders.postORMLoader.loadMany(postsIds);
  }

  @FieldResolver(() => [PostEntity], { nullable: true })
  async postsFromDecoratorLoader(
    @Root() root: UserEntity,
    @PostLoader() loader: DataLoader<number, PostEntity>
  ) {
    const postsIds = root.postsIds;
    return loader.loadMany(postsIds);
  }

  @FieldResolver(() => [PostEntity], { nullable: true })
  async postsFromMetadataLoader(
    @Root() root: UserEntity,
    @Ctx() context: ApolloContext
  ) {
    return await context.metadataLoader.loaders.ORMUser.posts.load(root);
  }

  // Field Resolver on User.profile (1-1 relation)

  @FieldResolver(() => ProfileEntity, { nullable: true })
  async profileOrigin(@Root() root: UserEntity) {
    const profileId = root.profileId;
    return await this.service.getProfileById(profileId);
  }

  @FieldResolver(() => ProfileEntity, { nullable: true })
  async profileFromContextLoader(
    @Root() root: UserEntity,
    @Ctx() context: ApolloContext
  ) {
    const profileId = root.profileId;
    return context.dataLoader.loaders.profileORMLoader.load(profileId);
  }

  @FieldResolver(() => ProfileEntity, { nullable: true })
  async profileFromDecoratorLoader(
    @Root() root: UserEntity,
    @ProfileLoader() loader: DataLoader<number, ProfileEntity>
  ) {
    const profileId = root.profileId;

    return loader.load(profileId);
  }

  @FieldResolver(() => ProfileEntity, { nullable: true })
  async profileFromMetadataLoader(
    @Root() root: UserEntity,
    @Ctx() context: ApolloContext
  ) {
    return await context.metadataLoader.loaders.ORMUser.profile.load(root);
  }

  // @FieldResolver(() => ProfileEntity, { nullable: true })
  // async profileField(@Root() root: UserEntity, @Ctx() context: ApolloContext) {
  //   const profileId = root.profileId;
  //   console.log('metadata loader');
  //   console.log(
  //     await context.metadataLoader.loaders.ORMUser.profile.load(root)
  //   );
  //   return context.dataLoader.loaders.profileORMLoader.load(profileId);
  // }
}
