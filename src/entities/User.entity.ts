import { EntityModel } from '@midwayjs/orm';
import { ObjectType, Field, ID } from 'type-graphql';
import {
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  OneToMany,
  JoinColumn,
  BaseEntity,
} from 'typeorm';

import Profile from './Profile.entity';

import Post from './Post.entity';

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
  profile: Profile;

  @OneToMany(type => Post, post => post.author, {
    cascade: true,
    nullable: true,
  })
  @Field(type => [Post], { nullable: true })
  posts: Post[];
}
