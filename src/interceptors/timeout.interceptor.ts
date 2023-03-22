import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  RequestTimeoutException,
} from '@nestjs/common';
import { Observable, throwError, TimeoutError } from 'rxjs';
import { catchError, timeout } from 'rxjs/operators';

/**
 * The possibility of manipulating the stream using RxJS operators gives us many capabilities.
 * Let's consider another common use case. Imagine you would like to handle timeouts on route requests.
 * When your endpoint doesn't return anything after a period of time, you want to terminate with an error response.
 * The following construction enables this.
 *
 * After 5 seconds, request processing will be canceled.
 * You can also add custom logic before throwing RequestTimeoutException (e.g. release resources).
 */
@Injectable()
export class TimeoutInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      timeout(5000),
      catchError((err) => {
        if (err instanceof TimeoutError) {
          return throwError(() => new RequestTimeoutException());
        }
        return throwError(() => err);
      }),
    );
  }
}
