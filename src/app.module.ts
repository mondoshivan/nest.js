import { CatsModule } from '@cats/cats.module';
import { Module } from '@nestjs/common';
import { AppController } from '@root/app.controller';

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
export class AppModule {}
