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
import { CV } from '../../entities/cv';

@Injectable()
export class CVsService {
  constructor(@InjectRepository(CV) private repository: Repository<CV>) {}

  async create(entity: DeepPartial<CV>): Promise<CV> {
    const entityCreate = this.repository.create(entity);
    await this.repository.save(entityCreate);
    return entityCreate;
  }

  async createBulk(entities: DeepPartial<CV>[]): Promise<CV[]> {
    const entitiesCreate = this.repository.create(entities);
    await this.repository.save(entitiesCreate);
    return entitiesCreate;
  }

  async findMany(
    options: FindOptionsWhere<CV>,
    relations: FindOptionsRelations<CV> = {},
    order: FindOptionsOrder<CV> = {},
    paginate: { take: number; skip: number } | null = null,
  ): Promise<CV[]> {
    const searchParams: FindManyOptions<CV> = {
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
    options: FindOptionsWhere<CV>,
    relations: FindOptionsRelations<CV> = {},
    order: FindOptionsOrder<CV> = {},
    paginate: { take: number; skip: number } | null = null,
  ): Promise<[CV[], number]> {
    const searchParams: FindManyOptions<CV> = {
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
    options: FindOptionsWhere<CV>,
    relations: FindOptionsRelations<CV> = {},
  ): Promise<CV> {
    const entity = await this.repository.findOne({
      where: options,
      relations,
    });
    return entity;
  }

  async findById(
    id: string,
    relations: FindOptionsRelations<CV> = {},
  ): Promise<CV> {
    const entity = await this.repository.findOne({
      where: { id } as unknown as FindOptionsWhere<CV>,
      relations,
    });
    return entity;
  }

  async findByIdAndUpdate(id: string, entity: Partial<CV>): Promise<CV> {
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
