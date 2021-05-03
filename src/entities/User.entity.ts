import { EntityModel } from '@midwayjs/orm';
import { ObjectType, Field, ID, Int } from 'type-graphql';
import {
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  OneToMany,
  JoinColumn,
  BaseEntity,
  RelationId,
} from 'typeorm';

import Profile from './Profile.entity';

import Post from './Post.entity';

import { IntegrationLoader } from '../lib/typegraphql-dataloader';

@ObjectType()
@EntityModel()
export default class ORMUser extends BaseEntity {
  @PrimaryGeneratedColumn()
  @Field(type => ID)
  id: number;

  @Column()
  @Field()
  name: string;

  @OneToOne(type => Profile, profile => profile.user, {
    cascade: true,
    nullable: true,
  })
  @JoinColumn()
  @Field(type => Profile, { nullable: true })
  @IntegrationLoader<Profile, ORMUser>(
    () => Profile,
    (user: ORMUser) => user.profile
  )
  profile?: Profile;

  @RelationId((user: ORMUser) => user.profile)
  profileId?: number;

  @OneToMany(type => Post, post => post.author, {
    cascade: true,
    nullable: true,
  })
  @Field(type => [Post], { nullable: true })
  posts?: Post[];

  @RelationId((user: ORMUser) => user.posts)
  @Field(() => Int)
  postsIds?: number[];
}
