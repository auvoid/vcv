import {
  UseInterceptors,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { plainToInstance } from 'class-transformer';

/**
 * A bit of a hacky way to get any class (or so said stackoverflow)
 */
interface AnyClass {
  new (...args: any[]): unknown;
}

/**
 * Decorator to add the interceptor to a controller
 *
 * @param {AnyClass} dto
 */
export function Serialize(dto: AnyClass) {
  return UseInterceptors(new SerializeInterceptor(dto));
}
/**
 * Serialize the data and then return only the values marked as expose
 */
export class SerializeInterceptor implements NestInterceptor {
  constructor(private serializationDto: any) {}

  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> {
    return next.handle().pipe(
      map((data: any) => {
        const serialized = plainToInstance(this.serializationDto, data, {
          excludeExtraneousValues: true,
        });

        return serialized;
      }),
    );
  }
}
