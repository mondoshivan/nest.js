import { CatsModule } from '@cats/cats.module';
import { MiddlewareConsumer, NestModule, RequestMethod } from '@nestjs/common';
import { Module } from '@nestjs/common';
import { AppController } from '@root/app.controller';
import { LoggerMiddleware } from '@root/logger.middleware';

/**
 * Each application has at least one module, a root module.
 * The root module is the starting point Nest uses to build the application graph,
 * which is the internal data structure Nest uses to resolve module and provider relationships and dependencies.
 * While very small applications may theoretically have just the root module, this is not the typical case.
 * We want to emphasize that modules are strongly recommended as an effective way to organize your components.
 * Thus, for most applications, the resulting architecture will employ multiple modules,
 * each encapsulating a closely related set of capabilities.
 */
@Module({
  // controllers: the set of controllers defined in this module which have to be instantiated
  controllers: [AppController],

  // providers: the providers that will be instantiated by the Nest injector and that may be shared at least across this module
  providers: [],

  // imports: the list of imported modules that export the providers which are required in this module
  imports: [CatsModule],

  // exports: the subset of providers that are provided by this module and should be available
  //          in other modules which import this module.
  //          You can use either the provider itself or just its token (provide value)
  exports: [],

  /**
   * The module encapsulates providers by default.
   * This means that it's impossible to inject providers that are neither directly part of the current module
   * nor exported from the imported modules.
   * Thus, you may consider the exported providers from a module as the module's public interface, or API.
   */
})
export class AppModule implements NestModule {
  /**
   * There is no place for middleware in the @Module() decorator.
   * Instead, we set them up using the configure() method of the module class.
   * Modules that include middleware have to implement the NestModule interface.
   *
   * We may also further restrict a middleware to a particular request method
   * by passing an object containing the route path and request method to the forRoutes() method
   * when configuring the middleware.
   *
   * The configure() method can be made asynchronous using async/await
   * (e.g., you can await completion of an asynchronous operation inside the configure() method body).
   *
   * Route Wildcards
   * Pattern based routes are supported as well.
   * For instance, the asterisk is used as a wildcard, and will match any combination of characters:
   * forRoutes({ path: 'ab*cd', method: RequestMethod.ALL });
   *
   * Middleware consumer
   * The MiddlewareConsumer is a helper class. It provides several built-in methods to manage middleware.
   * All of them can be simply chained in the fluent style.
   * The forRoutes() method can take a single string, multiple strings, a RouteInfo object,
   * a controller class and even multiple controller classes.
   * In most cases you'll probably just pass a list of controllers separated by commas.
   *
   * Excluding routes
   * At times we want to exclude certain routes from having the middleware applied.
   * We can easily exclude certain routes with the exclude() method.
   * This method can take a single string, multiple strings,
   * or a RouteInfo object identifying routes to be excluded, as shown below:
   * consumer.exclude(
   *   { path: 'cats', method: RequestMethod.GET },
   *   { path: 'cats', method: RequestMethod.POST },
   *   'cats/(.*)',
   * )
   *
   * Multiple middleware
   * As mentioned above, in order to bind multiple middleware that are executed sequentially,
   * simply provide a comma separated list inside the apply() method:
   * consumer.apply(cors(), helmet(), logger).forRoutes(CatsController);
   *
   * @param consumer
   */
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LoggerMiddleware)
      .forRoutes({ path: 'cats', method: RequestMethod.GET });
  }
}
