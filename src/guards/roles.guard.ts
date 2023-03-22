import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

/**
 * Role-based authentication
 * Let's build a more functional guard that permits access only to users with a specific role.
 *
 * Like pipes and exception filters, guards can be controller-scoped, method-scoped, or global-scoped.
 * See CatsController
 *
 * Note that behind the scenes, when a guard returns false, the framework throws a ForbiddenException.
 * If you want to return a different error response, you should throw your own specific exception. For example:
 * throw new UnauthorizedException();
 */
@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  /**
   * We want to make the return value conditional based on the comparing:
   * - the roles assigned to the current user
   * - to the actual roles required by the current route being processed.
   *
   * In order to access the route's role(s) (custom metadata), we'll use the Reflector helper class,
   * which is provided out of the box by the framework and exposed from the @nestjs/core package.
   * @param context
   * @returns
   */
  canActivate(context: ExecutionContext): boolean {
    /**
     * Refer to the Reflection and metadata section of the Execution context chapter
     * for more details on utilizing Reflector in a context-sensitive way:
     * https://docs.nestjs.com/fundamentals/execution-context#reflection-and-metadata
     */
    const roles = this.reflector.get<string[]>('roles', context.getHandler());
    if (!roles) {
      return true;
    }

    /**
     * HINT: In the node.js world, it's common practice to attach the authorized user to the request object.
     *       Thus, we are assuming that request.user contains the user instance and allowed roles.
     *       In your app, you will probably make that association in your custom authentication guard (or middleware).
     *       Check this chapter for more information on this topic:
     *       https://docs.nestjs.com/security/authentication
     */
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    return this.matchRoles(roles, user.roles);
  }

  /**
   * The logic inside the matchRoles() function can be as simple or sophisticated as needed.
   * The main point of this example is to show how guards fit into the request/response cycle.
   */
  private matchRoles(decoratorRoles: string[], userRoles: string[]): boolean {
    return true;
  }
}
