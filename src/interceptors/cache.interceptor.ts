import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable, of } from 'rxjs';

/**
 * Stream overriding
 * There are several reasons why we may sometimes want to completely prevent calling the handler
 * and return a different value instead. An obvious example is to implement a cache to improve response time.
 * Let's take a look at a simple cache interceptor that returns its response from a cache.
 * In a realistic example, we'd want to consider other factors like TTL, cache invalidation, cache size, etc.,
 * but that's beyond the scope of this discussion. Here we'll provide a basic example that demonstrates the main concept.
 *
 * Our CacheInterceptor has a hardcoded isCached variable and a hardcoded response [] as well.
 * The key point to note is that we return a new stream here, created by the RxJS of() operator,
 * therefore the route handler won't be called at all.
 * When someone calls an endpoint that makes use of CacheInterceptor,
 * the response (a hardcoded, empty array) will be returned immediately.
 * In order to create a generic solution, you can take advantage of Reflector and create a custom decorator.
 * The Reflector is well described in the guards chapter.
 */
@Injectable()
export class CacheInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const isCached = true;
    if (isCached) {
      return of([]);
    }
    return next.handle();
  }
}
