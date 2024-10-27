import { PAGE_SIZE } from 'src/config/conf';

export function paginate(items: any[], pageNumber: number, total: number) {
    const totalPages = Math.ceil(total / PAGE_SIZE);

    return {
        pageNumber,
        pageSize: PAGE_SIZE,
        totalPages,
        totalItems: total,
        items,
    };
}
