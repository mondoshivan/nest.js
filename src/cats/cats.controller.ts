import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  SetMetadata,
} from '@nestjs/common';
import { CreateCatDto } from '@cats/dto/create-cat.dto';
import { CatsService } from '@cats/cats.service';
import { Cat } from '@cats/interfaces/cat.interface';
import { CustomValidationPipe } from '@pipes/custom-validation.pipe';
import { RolesGuard } from '@guards/roles.guard';
import { Roles } from '@decorators/roles.decorator';

/**
 * Binding guards
 * Below, we set up a controller-scoped guard using the @UseGuards() decorator.
 * This decorator may take a single argument, or a comma-separated list of arguments.
 * This lets you easily apply the appropriate set of guards with one declaration.
 *
 * We passed the RolesGuard class (instead of an instance),
 * leaving responsibility for instantiation to the framework and enabling dependency injection.
 * As with pipes and exception filters, we can also pass an in-place instance.
 *
 * The CatsController could have different permission schemes for different routes.
 * Some might be available only for an admin user, and others could be open for everyone.
 * How can we match roles to routes in a flexible and reusable way?
 *
 * This is where custom metadata comes into play
 * (learn more here: https://docs.nestjs.com/fundamentals/execution-context#reflection-and-metadata).
 * Nest provides the ability to attach custom metadata to route handlers through the @SetMetadata() decorator.
 * This metadata supplies our missing role data, which a smart guard needs to make decisions.
 * --> Switch to route method createWithGuard() below!
 */
@Controller('cats')
@UseGuards(RolesGuard)
export class CatsController {
  /**
   * In Nest, thanks to TypeScript capabilities, it's extremely easy to manage dependencies
   * because they are resolved just by type.
   * In the example below, Nest will resolve the catsService by creating and returning an instance of CatsService
   * (or, in the normal case of a singleton, returning the existing instance if it has already been requested elsewhere).
   * This dependency is resolved and passed to your controller's constructor (or assigned to the indicated property).
   * @param catsService
   */
  constructor(private catsService: CatsService) {}

  /**
   * With this construction, we attached the roles metadata
   * (roles is a key, while ['admin'] is a particular value) to the create() method.
   * While this works, it's not good practice to use @SetMetadata() directly in your routes.
   * Instead, create your own decorators -> roles.decorators.ts
   * Proceed --> route method createWithGuardAndCustomRole()
   * @param createCatDto
   */
  @Post()
  @SetMetadata('roles', ['admin'])
  async createWithGuard(@Body() createCatDto: CreateCatDto) {
    this.catsService.create(createCatDto);
  }

  /**
   * This approach is much cleaner and more readable, and is strongly typed.
   * Now that we have a custom @Roles() decorator, we can use it to decorate the create() method.
   *
   * When a user with insufficient privileges requests an endpoint,
   * Nest automatically returns the following response:
   * {
   *   "statusCode": 403,
   *   "message": "Forbidden resource",
   *   "error": "Forbidden"
   * }
   * @param createCatDto
   */
  @Post()
  @Roles('admin')
  async createWithGuardAndCustomRole(@Body() createCatDto: CreateCatDto) {
    this.catsService.create(createCatDto);
  }

  /**
   * Custo Pipe with Class Validator
   * We want to ensure that any incoming request to the create method contains a valid body.
   * So we have to validate the three members of the createCatDto object.
   * We could do this inside the route handler method,
   * but doing so is not ideal as it would break the single responsibility rule (SRP).
   *
   * Another approach could be to create a validator class and delegate the task there.
   * This has the disadvantage that we would have to remember to call this validator at the beginning of each method.
   *
   * How about creating validation middleware?
   * This could work, but unfortunately it's not possible to create generic middleware
   * which can be used across all contexts across the whole application.
   * This is because middleware is unaware of the execution context,
   * including the handler that will be called and any of its parameters.
   *
   * This is, of course, exactly the use case for which pipes are designed.
   *
   * Object schema validation
   * There are several approaches available for doing object validation in a clean, DRY way.
   * One common approach is to use schema-based validation.
   * The Joi library allows you to create schemas in a straightforward way, with a readable API,
   * but it needs to add a new source in the create-cat.dto.ts
   *
   * For TypeScript projects it's better to us the class validator library.
   * This powerful library allows you to use decorator-based validation.
   * Decorator-based validation is extremely powerful,
   * especially when combined with Nest's Pipe capabilities since we have access to the metatype of the processed property.
   * $ npm i --save class-validator class-transformer
   *
   * Pipes can be parameter-scoped, method-scoped, controller-scoped, or global-scoped.
   * In the example below, we'll bind the pipe instance to the route handler @Body() decorator
   * so that our pipe is called to validate the post body.
   *
   * Global scoped pipes
   * Since the ValidationPipe was created to be as generic as possible,
   * we can realize it's full utility by setting it up as a global-scoped pipe
   * so that it is applied to every route handler across the entire application.
   *
   * async function bootstrap() {
   *   const app = await NestFactory.create(AppModule);
   *   app.useGlobalPipes(new ValidationPipe());
   *   await app.listen(3000);
   * }
   * bootstrap();
   *
   * As a reminder, you don't have to build a generic validation pipe on your own
   * since the ValidationPipe is provided by Nest out-of-the-box.
   * The built-in ValidationPipe offers more options than the sample we built in this chapter,
   * which has been kept basic for the sake of illustrating the mechanics of a custom-built pipe.
   * You can find full details, along with lots of examples here:
   * https://docs.nestjs.com/techniques/validation
   *
   * @param createCatDto
   */
  @Post()
  async create(@Body(new CustomValidationPipe()) createCatDto: CreateCatDto) {
    this.catsService.create(createCatDto);
  }

  @Get()
  async findAll(): Promise<Cat[]> {
    return this.catsService.findAll();
  }
}
