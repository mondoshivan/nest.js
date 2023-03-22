import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface Response<T> {
  data: T;
}

/**
 * Response mapping
 * We already know that handle() returns an Observable.
 * The stream contains the value returned from the route handler,
 * and thus we can easily mutate it using RxJS's map() operator.
 *
 * The TransformInterceptor will modify each response in a trivial way to demonstrate the process.
 * It will use RxJS's map() operator to assign the response object to the data property of a newly created object,
 * returning the new object to the client.
 */
@Injectable()
export class TransformInterceptor<T>
  implements NestInterceptor<T, Response<T>>
{
  /**
   * Nest interceptors work with both synchronous and asynchronous intercept() methods.
   * You can simply switch the method to async if necessary.
   *
   * With the below construction the response would look like the following
   * (assuming that route handler returns an empty array []):
   * {
   *   "data": []
   * }
   *
   * Interceptors have great value in creating re-usable solutions to requirements
   * that occur across an entire application.
   * For example, imagine we need to transform each occurrence of a null value to an empty string ''.
   * We can do it using one line of code and bind the interceptor globally
   * so that it will automatically be used by each registered handler.
   *
   * @param context
   * @param next
   * @returns
   */
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<Response<T>> {
    return next.handle().pipe(map((data) => ({ data })));
  }
}
