import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

/**
 * Middleware is a function which is called before the route handler.
 * Middleware functions have access to the request and response objects,
 * and the next() middleware function in the application’s request-response cycle.
 * The next middleware function is commonly denoted by a variable named next.
 *
 *              HTTP-Request
 * Client Side    ------>      Middleware  ------>  Route Handler
 *
 * Nest middleware are, by default, equivalent to express middleware and they can perform the following tasks:
 * - execute any code
 * - make changes to the request and the response objects
 * - end the request-response cycle
 * - call the next middleware function in the stack
 * - if the current middleware function does not end the request-response cycle,
 *   it must call next() to pass control to the next middleware function.
 *   Otherwise, the request will be left hanging.
 *
 * You implement custom Nest middleware in either a function, or in a class with an @Injectable() decorator.
 * The class should implement the NestMiddleware interface, while the function does not have any special requirements.
 *
 * Dependency Injection
 * Nest middleware fully supports Dependency Injection.
 * Just as with providers and controllers, they are able to inject dependencies that are available within the same module.
 * As usual, this is done through the constructor.
 *
 * Functional middleware
 * This type of middleware is called functional middleware.
 * Let's transform the logger middleware from class-based into functional middleware to illustrate the difference:
 * export function logger(req: Request, res: Response, next: NextFunction) {
 *   console.log(`Request...`);
 *   next();
 * };
 * HINT: Consider using the simpler functional middleware alternative any time your middleware doesn't need any dependencies.
 *
 */
@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    console.log('Request...');
    next();
  }
}
