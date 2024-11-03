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
import { Experience } from '../../entities/experience';

@Injectable()
export class ExperiencesService {
  constructor(
    @InjectRepository(Experience) private repository: Repository<Experience>,
  ) {}

  async create(entity: DeepPartial<Experience>): Promise<Experience> {
    const entityCreate = this.repository.create(entity);
    await this.repository.save(entityCreate);
    return entityCreate;
  }

  async createBulk(entities: DeepPartial<Experience>[]): Promise<Experience[]> {
    const entitiesCreate = this.repository.create(entities);
    await this.repository.save(entitiesCreate);
    return entitiesCreate;
  }

  async findMany(
    options: FindOptionsWhere<Experience>,
    relations: FindOptionsRelations<Experience> = {},
    order: FindOptionsOrder<Experience> = {},
    paginate: { take: number; skip: number } | null = null,
  ): Promise<Experience[]> {
    const searchParams: FindManyOptions<Experience> = {
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
    options: FindOptionsWhere<Experience>,
    relations: FindOptionsRelations<Experience> = {},
    order: FindOptionsOrder<Experience> = {},
    paginate: { take: number; skip: number } | null = null,
  ): Promise<[Experience[], number]> {
    const searchParams: FindManyOptions<Experience> = {
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
    options: FindOptionsWhere<Experience>,
    relations: FindOptionsRelations<Experience> = {},
  ): Promise<Experience> {
    const entity = await this.repository.findOne({
      where: options,
      relations,
    });
    return entity;
  }

  async findById(
    id: string,
    relations: FindOptionsRelations<Experience> = {},
  ): Promise<Experience> {
    const entity = await this.repository.findOne({
      where: { id } as unknown as FindOptionsWhere<Experience>,
      relations,
    });
    return entity;
  }

  async findByIdAndUpdate(
    id: string,
    entity: Partial<Experience>,
  ): Promise<Experience> {
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
