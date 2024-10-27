import { Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class PaginateDTO {
    @Expose()
    @ApiProperty()
    pageNumber: number;

    @Expose()
    @ApiProperty()
    pageSize: number;

    @Expose()
    @ApiProperty()
    totalPages: number;

    @Expose()
    @ApiProperty()
    totalItems: number;
}
