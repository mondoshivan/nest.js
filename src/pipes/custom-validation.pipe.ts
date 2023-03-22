import {
  PipeTransform,
  Injectable,
  ArgumentMetadata,
  BadRequestException,
} from '@nestjs/common';
import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';

/**
 * A pipe is a class annotated with the @Injectable() decorator, which implements the PipeTransform interface.
 *
 * Pipes have two typical use cases:
 * - transformation: transform input data to the desired form (e.g., from string to integer)
 * - validation: evaluate input data and if valid, simply pass it through unchanged; otherwise, throw an exception
 *
 * In both cases, pipes operate on the arguments being processed by a controller route handler.
 * Nest interposes a pipe just before a method is invoked,
 * and the pipe receives the arguments destined for the method and operates on them.
 * Any transformation or validation operation takes place at that time,
 * after which the route handler is invoked with any (potentially) transformed arguments.
 *
 * PipeTransform<T, R> is a generic interface that must be implemented by any pipe.
 * The generic interface uses T to indicate the type of the input value,
 * and R to indicate the return type of the transform() method.
 */
@Injectable()
export class CustomValidationPipe implements PipeTransform<any> {
  /**
   * Every pipe must implement the transform() method to fulfill the PipeTransform interface contract.
   *
   * Here is how the ArgumentMetadata looks like:
   * export interface ArgumentMetadata {
   *   type: 'body' | 'query' | 'param' | 'custom';
   *   metatype?: Type<unknown>;
   *   data?: string;
   * }
   *
   * @param value is the currently processed method argument (before it is received by the route handling method)
   * @param metadata is the currently processed method argument's metadata.
   * @returns
   */
  async transform(value: any, { metatype }: ArgumentMetadata) {
    if (!metatype || !this.toValidate(metatype)) {
      return value;
    }

    /**
     * Next, we use the class-transformer function plainToInstance()
     * to transform our plain JavaScript argument object into a typed object so that we can apply validation.
     * The reason we must do this is that the incoming post body object,
     * when deserialized from the network request, does not have any type information
     * (this is the way the underlying platform, such as Express, works).
     * Class-validator needs to use the validation decorators we defined for our DTO earlier,
     * so we need to perform this transformation to treat the incoming body as an appropriately decorated object,
     * not just a plain vanilla object.
     */
    const object = plainToInstance(metatype, value);

    /**
     * Since this is a validation pipe it either returns the value unchanged, or throws an exception.
     */
    const errors = await validate(object);
    if (errors.length > 0) {
      throw new BadRequestException('Validation failed');
    }
    return value;
  }

  /**
   * It's responsible for bypassing the validation step
   * when the current argument being processed is a native JavaScript type
   * (these can't have validation decorators attached, so there's no reason to run them through the validation step).
   * @param metatype
   * @returns
   */
  private toValidate(metatype: Function): boolean {
    const types: Function[] = [String, Boolean, Number, Array, Object];
    return !types.includes(metatype);
  }
}
