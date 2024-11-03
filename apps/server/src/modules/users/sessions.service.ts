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
import { Session } from '../../entities';

@Injectable()
export class SessionsService {
  constructor(
    @InjectRepository(Session) private repository: Repository<Session>,
  ) {}

  async create(entity: DeepPartial<Session>): Promise<Session> {
    const entityCreate = this.repository.create(entity);
    await this.repository.save(entityCreate);
    return entityCreate;
  }

  async createBulk(entities: DeepPartial<Session>[]): Promise<Session[]> {
    const entitiesCreate = this.repository.create(entities);
    await this.repository.save(entitiesCreate);
    return entitiesCreate;
  }

  async findMany(
    options: FindOptionsWhere<Session>,
    relations: FindOptionsRelations<Session> = {},
    order: FindOptionsOrder<Session> = {},
    paginate: { take: number; skip: number } | null = null,
  ): Promise<Session[]> {
    const searchParams: FindManyOptions<Session> = {
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
    options: FindOptionsWhere<Session>,
    relations: FindOptionsRelations<Session> = {},
    order: FindOptionsOrder<Session> = {},
    paginate: { take: number; skip: number } | null = null,
  ): Promise<[Session[], number]> {
    const searchParams: FindManyOptions<Session> = {
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
    options: FindOptionsWhere<Session>,
    relations: FindOptionsRelations<Session> = {},
  ): Promise<Session> {
    const entity = await this.repository.findOne({
      where: options,
      relations,
    });
    return entity;
  }

  async findById(
    id: string,
    relations: FindOptionsRelations<Session> = {},
  ): Promise<Session> {
    const entity = await this.repository.findOne({
      where: { id } as unknown as FindOptionsWhere<Session>,
      relations,
    });
    return entity;
  }

  async findByIdAndUpdate(
    id: string,
    entity: Partial<Session>,
  ): Promise<Session> {
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
