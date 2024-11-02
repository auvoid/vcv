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
import { Credential } from '../../entities/credential';

@Injectable()
export class CredentialsService {
  constructor(
    @InjectRepository(Credential) private repository: Repository<Credential>,
  ) {}

  async create(entity: DeepPartial<Credential>): Promise<Credential> {
    const entityCreate = this.repository.create(entity);
    await this.repository.save(entityCreate);
    return entityCreate;
  }

  async createBulk(entities: DeepPartial<Credential>[]): Promise<Credential[]> {
    const entitiesCreate = this.repository.create(entities);
    await this.repository.save(entitiesCreate);
    return entitiesCreate;
  }

  async findMany(
    options: FindOptionsWhere<Credential>,
    relations: FindOptionsRelations<Credential> = {},
    order: FindOptionsOrder<Credential> = {},
    paginate: { take: number; skip: number } | null = null,
  ): Promise<Credential[]> {
    const searchParams: FindManyOptions<Credential> = {
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
    options: FindOptionsWhere<Credential>,
    relations: FindOptionsRelations<Credential> = {},
    order: FindOptionsOrder<Credential> = {},
    paginate: { take: number; skip: number } | null = null,
  ): Promise<[Credential[], number]> {
    const searchParams: FindManyOptions<Credential> = {
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
    options: FindOptionsWhere<Credential>,
    relations: FindOptionsRelations<Credential> = {},
  ): Promise<Credential> {
    const entity = await this.repository.findOne({
      where: options,
      relations,
    });
    return entity;
  }

  async findById(
    id: string,
    relations: FindOptionsRelations<Credential> = {},
  ): Promise<Credential> {
    const entity = await this.repository.findOne({
      where: { id } as unknown as FindOptionsWhere<Credential>,
      relations,
    });
    return entity;
  }

  async findByIdAndUpdate(
    id: string,
    entity: Partial<Credential>,
  ): Promise<Credential> {
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
