import { Global, Module } from '@nestjs/common';
import { CatsController } from '@cats/cats.controller';
import { CatsService } from '@cats/cats.service';

/**
 * The CatsController and CatsService belong to the same application domain.
 * As they are closely related, it makes sense to move them into a feature module.
 * A feature module simply organizes code relevant for a specific feature,
 * keeping code organized and establishing clear boundaries.
 * This helps us manage complexity and develop with SOLID principles,
 * especially as the size of the application and/or team grow.
 *
 * To create a module using the CLI, simply execute:
 * $ nest g module cats
 *
 * Shared modules
 * In Nest, modules are singletons by default,
 * and thus you can share the same instance of any provider between multiple modules effortlessly.
 * Every module is automatically a shared module.
 * Once created it can be reused by any module.
 * Let's imagine that we want to share an instance of the CatsService between several other modules.
 * In order to do that, we first need to export the CatsService provider
 * by adding it to the module's exports array, as shown below.
 * Now any module that imports the CatsModule has access to the CatsService and
 * will share the same instance with all other modules that import it as well.
 *
 * Module re-exporting
 * As seen above, Modules can export their internal providers.
 * In addition, they can re-export modules that they import.
 *
 * Global modules
 * If you have to import the same set of modules everywhere, it can get tedious.
 * Nest encapsulates providers inside the module scope.
 * You aren't able to use a module's providers elsewhere without first importing the encapsulating module.
 * When you want to provide a set of providers which should be available everywhere out-of-the-box
 * (e.g., helpers, database connections, etc.), make the module global with the @Global() decorator.
 * The @Global() decorator makes the module global-scoped.
 * Global modules should be registered only once, generally by the root or core module.
 * Modules that wish to inject providers from global modules, does not have to import them in the imports array.
 * Hint: Making everything global is not a good design decision.
 * Global modules are available to reduce the amount of necessary boilerplate.
 * The imports array is generally the preferred way to make the module's API available to consumers.
 */
@Module({
  controllers: [CatsController],
  providers: [CatsService],
  exports: [CatsService],
})
export class CatsModule {}

/**
 * Dependency injection
 * A module class can inject providers as well (e.g., for configuration purposes)
 *
 * export class CatsModule {
 *   constructor(private catsService: CatsService) {}
 * }
 */
