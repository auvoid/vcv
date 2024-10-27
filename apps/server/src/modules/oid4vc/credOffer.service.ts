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
import { CredOffer } from '../../entities';

@Injectable()
export class CredOfferService {
    constructor(
        @InjectRepository(CredOffer) private repository: Repository<CredOffer>,
    ) {}

    async create(entity: DeepPartial<CredOffer>): Promise<CredOffer> {
        const entityCreate = this.repository.create(entity);
        await this.repository.save(entityCreate);
        return entityCreate;
    }

    async createBulk(entities: DeepPartial<CredOffer>[]): Promise<CredOffer[]> {
        const entitiesCreate = this.repository.create(entities);
        await this.repository.save(entitiesCreate);
        return entitiesCreate;
    }

    async findMany(
        options: FindOptionsWhere<CredOffer>,
        relations: FindOptionsRelations<CredOffer> = {},
        order: FindOptionsOrder<CredOffer> = {},
        paginate: { take: number; skip: number } | null = null,
    ): Promise<CredOffer[]> {
        const searchParams: FindManyOptions<CredOffer> = {
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
        options: FindOptionsWhere<CredOffer>,
        relations: FindOptionsRelations<CredOffer> = {},
        order: FindOptionsOrder<CredOffer> = {},
        paginate: { take: number; skip: number } | null = null,
    ): Promise<[CredOffer[], number]> {
        const searchParams: FindManyOptions<CredOffer> = {
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
        options: FindOptionsWhere<CredOffer>,
        relations: FindOptionsRelations<CredOffer> = {},
    ): Promise<CredOffer> {
        const entity = await this.repository.findOne({
            where: options,
            relations,
        });
        return entity;
    }

    async findById(
        id: string,
        relations: FindOptionsRelations<CredOffer> = {},
    ): Promise<CredOffer> {
        const entity = await this.repository.findOne({
            where: { id } as unknown as FindOptionsWhere<CredOffer>,
            relations,
        });
        return entity;
    }

    async findByIdAndUpdate(
        id: string,
        entity: Partial<CredOffer>,
    ): Promise<CredOffer> {
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
