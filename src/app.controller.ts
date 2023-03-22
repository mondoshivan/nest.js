import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  UseFilters,
  UseInterceptors,
} from '@nestjs/common';
import { CustomForbiddenException } from '@exceptions/forbidden.exception';
import { HttpExceptionFilter } from '@filters/http-exception.filter';
import { CatsService } from '@cats/cats.service';
import { LoggingInterceptor } from '@interceptors/logging.interceptor';

/**
 * Binding interceptors
 * In order to set up the interceptor, we use the @UseInterceptors() decorator imported from the @nestjs/common package.
 * Like pipes and guards, interceptors can be controller-scoped, method-scoped, or global-scoped.
 * Using the below construction, each route handler defined in Controller will use LoggingInterceptor.
 *
 * Note that we passed the LoggingInterceptor type (instead of an instance),
 * leaving responsibility for instantiation to the framework and enabling dependency injection.
 * As with pipes, guards, and exception filters, we can also pass an in-place instance.
 *
 * If we want to restrict the interceptor's scope to a single method, we simply apply the decorator at the method level.
 */
@Controller()
@UseInterceptors(LoggingInterceptor)
export class AppController {
  constructor(private catsService: CatsService) {}

  @Get()
  getHello(): string {
    return 'hello';
  }

  /**
   * Pipes
   * To use a pipe, we need to bind an instance of the pipe class to the appropriate context.
   * In our ParseIntPipe example, we want to associate the pipe with a particular route handler method,
   * and make sure it runs before the method is called.
   * We do so with the following construct, which we'll refer to as binding the pipe at the method parameter level.
   *
   * This ensures that one of the following two conditions is true:
   * - either the parameter we receive in the findOne() method is a number
   *   (as expected in our call to this.catsService.findOne())
   * - or an exception is thrown before the route handler is called.
   *
   * In the example below, we pass a class (ParseIntPipe), not an instance, 
   * leaving responsibility for instantiation to the framework and enabling dependency injection. 
   * As with pipes and guards, we can instead pass an in-place instance. 
   * Passing an in-place instance is useful if we want to customize the built-in pipe's behavior by passing options:
     async findOne(
       @Param('id', new ParseIntPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE }))
       id: number,
     )
   *
   * All Parse* pipes work in the context of validating route parameters, query string parameters and request body values.
   * 
   * Available pipes:
   * - ValidationPipe
   * - ParseIntPipe
   * - ParseFloatPipe
   * - ParseBoolPipe
   * - ParseArrayPipe
   * - ParseUUIDPipe
   * - ParseEnumPipe
   * - DefaultValuePipe
   * - ParseFilePipe
   * @param id
   * @returns
   */
  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.catsService.findOne(id);
  }

  /**
   * Exception Filters
   * Binding custom Filter to route method.
   *
   * We have used the @UseFilters() decorator here.
   * Similar to the @Catch() decorator, it can take a single filter instance, or a comma-separated list of filter instances.
   * Here, we created the instance of HttpExceptionFilter in place.
   * Alternatively, you may pass the class (instead of an instance), leaving responsibility for instantiation to the framework,
   * and enabling dependency injection.
   *
   * HINT: Prefer applying filters by using classes instead of instances when possible.
   * It reduces memory usage since Nest can easily reuse instances of the same class across your entire module.
   *
   * In the example above, the HttpExceptionFilter is applied only to the single create() route handler,
   * making it method-scoped. Exception filters can be scoped at different levels: method-scoped,
   * controller-scoped, or global-scoped.
   *
   * Controler scope
   * @UseFilters(new HttpExceptionFilter())
   * export class CatsController {}
   *
   * To create a global-scoped filter, you would do the following:
   * async function bootstrap() {
   *   const app = await NestFactory.create(AppModule);
   *   app.useGlobalFilters(new HttpExceptionFilter());
   *   await app.listen(3000);
   * }
   * bootstrap();
   */
  @Get()
  @UseFilters(new HttpExceptionFilter())
  getException(): string {
    throw new CustomForbiddenException();
  }
}
