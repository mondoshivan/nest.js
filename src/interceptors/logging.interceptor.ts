import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

/**
 * An interceptor is a class annotated with the @Injectable() decorator and implements the NestInterceptor interface.
 * Interceptors have a set of useful capabilities which are inspired by the Aspect Oriented Programming (AOP) technique.
 * https://en.wikipedia.org/wiki/Aspect-oriented_programming
 *
 * They make it possible to:
 * - bind extra logic before / after method execution
 * - transform the result returned from a function
 * - transform the exception thrown from a function
 * - extend the basic function behavior
 * - completely override a function depending on specific conditions (e.g., for caching purposes)
 *
 * HINT: The NestInterceptor<T, R> is a generic interface
 * in which T indicates the type of an Observable<T> (supporting the response stream),
 * and R is the type of the value wrapped by Observable<R>.
 */
@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  /**
   * Each interceptor implements the intercept() method, which takes two arguments.
   *
   * The intercept() method effectively wraps the request/response stream.
   * As a result, you may implement custom logic both before and after the execution of the final route handler.
   * --> next.handle() invokes the route handler
   *
   * It's clear that you can write code in your intercept() method that executes before calling handle(),
   * but how do you affect what happens afterward?
   * Because the handle() method returns an Observable,
   * we can use powerful RxJS operators to further manipulate the response.
   * Using Aspect Oriented Programming terminology,
   * the invocation of the route handler (i.e., calling handle()) is called a Pointcut,
   * indicating that it's the point at which our additional logic is inserted.
   *
   * @param context ExecutionContext instance (exactly the same object as for guards).
   *                The ExecutionContext inherits from ArgumentsHost.
   *                It's a wrapper around arguments that have been passed to the original handler,
   *                and contains different arguments arrays based on the type of the application.
   *                You can refer back to the exception filters for more on this topic.
   *                By extending ArgumentsHost, ExecutionContext also adds several new helper methods
   *                that provide additional details about the current execution process.
   *                These details can be helpful in building more generic interceptors
   *                that can work across a broad set of controllers, methods, and execution contexts.
   *                Learn more about ExecutionContext: https://docs.nestjs.com/fundamentals/execution-context
   * @param next is a CallHandler. The CallHandler interface implements the handle() method,
   *             which you can use to invoke the route handler method at some point in your interceptor.
   *             If you don't call the handle() method in your implementation of the intercept() method,
   *             the route handler method won't be executed at all.
   * @returns
   */
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    console.log('Before...');

    const now = Date.now();

    /**
     * Since handle() returns an RxJS Observable, we have a wide choice of operators we can use to manipulate the stream.
     */
    return next
      .handle()
      .pipe(tap(() => console.log(`After... ${Date.now() - now}ms`)));
  }
}
