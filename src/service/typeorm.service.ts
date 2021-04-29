import { Provide } from '@midwayjs/decorator';
import { InjectEntityModel } from '@midwayjs/orm';
import { Repository } from 'typeorm';

import User from '../entities/User.entity';
import Post from '../entities/Post.entity';
import Profile from '../entities/Profile.entity';

@Provide()
export class TypeORMService {
  @InjectEntityModel(User)
  userModel: Repository<User>;

  @InjectEntityModel(Post)
  postModel: Repository<Post>;

  @InjectEntityModel(Profile)
  profileModel: Repository<Profile>;

  async getAllUsers(): Promise<User[]> {
    return await this.userModel.find({
      relations: ['posts', 'profile'],
    });
  }

  async getUserById(id: number): Promise<User> {
    console.log('getUserById Invoked With: ', id);
    return await this.userModel.findOne(id, {
      relations: ['posts', 'profile'],
    });
  }

  async getUsersByIds(ids: number[]): Promise<User[]> {
    console.log('getUsersByIds Invoked With: ', ids);
    return await this.userModel.findByIds(ids, {
      relations: ['posts', 'profile'],
    });
  }

  async getAllPosts(): Promise<Post[]> {
    return await this.postModel.find({
      relations: ['user'],
    });
  }

  async getPostById(id: number): Promise<Post> {
    console.log('getPostById Invoked With: ', id);
    return await this.postModel.findOne(id, {
      relations: ['author'],
    });
  }

  async getPostsByIds(ids: number[]): Promise<Post[]> {
    console.log('getPostsByIds Invoked With: ', ids);
    return await this.postModel.findByIds(ids, {
      relations: ['author'],
    });
  }

  async getAllProfiles(): Promise<Profile[]> {
    return await this.profileModel.find({
      relations: ['user'],
    });
  }

  async getProfileById(id: number): Promise<Profile> {
    console.log('getProfileById Invoked With: ', id);
    return await this.profileModel.findOne(id, {
      relations: ['user'],
    });
  }

  async getProfilesByIds(ids: number[]): Promise<Profile[]> {
    return await this.profileModel.findByIds(ids, {
      relations: ['user'],
    });
  }
}
