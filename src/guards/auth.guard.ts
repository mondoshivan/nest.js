import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Observable } from 'rxjs';

/**
 * A guard is a class annotated with the @Injectable() decorator, which implements the CanActivate interface.
 *
 * Guards have a single responsibility.
 * They determine whether a given request will be handled by the route handler or not,
 * depending on certain conditions (like permissions, roles, ACLs, etc.) present at run-time.
 * This is often referred to as authorization.
 * Authorization (and its cousin, authentication, with which it usually collaborates)
 * has typically been handled by middleware in traditional Express applications.
 * Middleware is a fine choice for authentication, since things like token validation
 * and attaching properties to the request object are not strongly connected
 * with a particular route context (and its metadata).
 *
 * But middleware, by its nature, is dumb.
 * It doesn't know which handler will be executed after calling the next() function.
 * On the other hand, Guards have access to the ExecutionContext instance,
 * and thus know exactly what's going to be executed next.
 * They're designed, much like exception filters, pipes, and interceptors,
 * to let you interpose processing logic at exactly the right point in the request/response cycle,
 * and to do so declaratively. This helps keep your code DRY and declarative.
 *
 * HINT: Guards are executed after all middleware, but before any interceptor or pipe.
 *
 * Authorization is a great use case for Guards
 * because specific routes should be available only
 * when the caller (usually a specific authenticated user) has sufficient permissions.
 * The AuthGuard that we'll build now assumes an authenticated user
 * (and that, therefore, a token is attached to the request headers).
 * It will extract and validate the token, and use the extracted information to determine
 * whether the request can proceed or not.
 *
 * HITN: If you are looking for a real-world example on
 * how to implement an authentication mechanism in your application, visit this chapter:
 * https://docs.nestjs.com/security/authentication
 *
 */
@Injectable()
export class AuthGuard implements CanActivate {
  /**
   * Every guard must implement a canActivate() function.
   * This function should return a boolean, indicating whether the current request is allowed or not.
   * It can return the response either synchronously or asynchronously (via a Promise or Observable).
   * Nest uses the return value to control the next action:
   * - if it returns true, the request will be processed.
   * - if it returns false, Nest will deny the request.
   *
   * @param context inherits from ArgumentsHost.
   *                We saw ArgumentsHost previously in the exception filters chapter.
   *                In the sample below, we are just using the same helper methods
   *                defined on ArgumentsHost that we used earlier, to get a reference to the Request object.
   *                You can refer back to the Arguments host section of the exception filters chapter
   *                for more on this topic: https://docs.nestjs.com/exception-filters
   *
   *                By extending ArgumentsHost, ExecutionContext also adds several new helper methods
   *                that provide additional details about the current execution process.
   *                These details can be helpful in building more generic guards
   *                that can work across a broad set of controllers, methods, and execution contexts.
   *                Learn more about ExecutionContext here: https://docs.nestjs.com/fundamentals/execution-context
   * @returns
   */
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    return this.validateRequest(request);
  }

  /**
   * Just a sample implementation to get it compiling.
   * @param request
   * @returns always true
   */
  private validateRequest(request: any): boolean {
    return true;
  }
}
