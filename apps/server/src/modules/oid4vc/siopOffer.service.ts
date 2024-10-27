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
import { SiopOffer } from '../../entities';

@Injectable()
export class SiopOfferService {
    constructor(
        @InjectRepository(SiopOffer) private repository: Repository<SiopOffer>,
    ) {}

    async create(entity: DeepPartial<SiopOffer>): Promise<SiopOffer> {
        const entityCreate = this.repository.create(entity);
        await this.repository.save(entityCreate);
        return entityCreate;
    }

    async createBulk(entities: DeepPartial<SiopOffer>[]): Promise<SiopOffer[]> {
        const entitiesCreate = this.repository.create(entities);
        await this.repository.save(entitiesCreate);
        return entitiesCreate;
    }

    async findMany(
        options: FindOptionsWhere<SiopOffer>,
        relations: FindOptionsRelations<SiopOffer> = {},
        order: FindOptionsOrder<SiopOffer> = {},
        paginate: { take: number; skip: number } | null = null,
    ): Promise<SiopOffer[]> {
        const searchParams: FindManyOptions<SiopOffer> = {
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
        options: FindOptionsWhere<SiopOffer>,
        relations: FindOptionsRelations<SiopOffer> = {},
        order: FindOptionsOrder<SiopOffer> = {},
        paginate: { take: number; skip: number } | null = null,
    ): Promise<[SiopOffer[], number]> {
        const searchParams: FindManyOptions<SiopOffer> = {
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
        options: FindOptionsWhere<SiopOffer>,
        relations: FindOptionsRelations<SiopOffer> = {},
    ): Promise<SiopOffer> {
        const entity = await this.repository.findOne({
            where: options,
            relations,
        });
        return entity;
    }

    async findById(
        id: string,
        relations: FindOptionsRelations<SiopOffer> = {},
    ): Promise<SiopOffer> {
        const entity = await this.repository.findOne({
            where: { id } as unknown as FindOptionsWhere<SiopOffer>,
            relations,
        });
        return entity;
    }

    async findByIdAndUpdate(
        id: string,
        entity: Partial<SiopOffer>,
    ): Promise<SiopOffer> {
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
