import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  Repository,
  FindOptionsOrder,
  FindOptionsWhere,
  FindOptionsRelations,
  FindManyOptions,
  DeepPartial,
} from 'typeorm';
import { User } from '../../entities/user';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private repository: Repository<User>,
  ) {}

  async create(entity: DeepPartial<User>): Promise<User> {
    const entityCreate = this.repository.create(entity);
    await this.repository.save(entityCreate);
    return entityCreate;
  }

  async createBulk(entities: DeepPartial<User>[]): Promise<User[]> {
    const entitiesCreate = this.repository.create(entities);
    await this.repository.save(entitiesCreate);
    return entitiesCreate;
  }

  async findMany(
    options: FindOptionsWhere<User>,
    relations: FindOptionsRelations<User> = {},
    order: FindOptionsOrder<User> = {},
    paginate: { take: number; skip: number } | null = null,
  ): Promise<User[]> {
    const searchParams: FindManyOptions<User> = {
      where: options,
      relations,
      order,
    };
    if (paginate) {
      searchParams.take = paginate.take;
      searchParams.skip = paginate.skip;
    }
    const entities = await this.repository.find(searchParams);
    return entities;
  }

  async findManyAndCount(
    options: FindOptionsWhere<User>,
    relations: FindOptionsRelations<User> = {},
    order: FindOptionsOrder<User> = {},
    paginate: { take: number; skip: number } | null = null,
  ): Promise<[User[], number]> {
    const searchParams: FindManyOptions<User> = {
      where: options,
      relations,
      order,
    };
    if (paginate) {
      searchParams.take = paginate.take;
      searchParams.skip = paginate.skip;
    }
    const entities = await this.repository.findAndCount(searchParams);
    return entities;
  }

  async findOne(
    options: FindOptionsWhere<User>,
    relations: FindOptionsRelations<User> = {},
  ): Promise<User> {
    const entity = await this.repository.findOne({
      where: options,
      relations,
    });
    return entity;
  }

  async findById(
    id: string,
    relations: FindOptionsRelations<User> = {},
  ): Promise<User> {
    const entity = await this.repository.findOne({
      where: {
        id,
      } as unknown as FindOptionsWhere<User>,
      relations,
    });
    return entity;
  }

  async findByIdAndUpdate(id: string, entity: Partial<User>): Promise<User> {
    const current = await this.findById(id);
    const toSave = this.repository.create({
      ...current,
      ...entity,
    });

    const updated = await this.repository.save(toSave);
    return updated;
  }

  async findByIdAndDelete(id: string): Promise<void> {
    await this.repository.delete(id);
  }
}
