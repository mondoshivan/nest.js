import { HttpException, HttpStatus } from '@nestjs/common';

/**
 * Nest comes with a built-in exceptions layer
 * which is responsible for processing all unhandled exceptions across an application.
 * When an exception is not handled by your application code, it is caught by this layer,
 * which then automatically sends an appropriate user-friendly response.
 *
 * Out of the box, this action is performed by a built-in global exception filter,
 * which handles exceptions of type HttpException (and subclasses of it).
 * When an exception is unrecognized (is neither HttpException nor a class that inherits from HttpException),
 * the built-in exception filter generates the following default JSON response:
 *
 * Throwing standard exceptions
 * throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
 *
 * There is a third constructor argument (optional) - options - that can be used to provide an error cause.
 * This cause object is not serialized into the response object, but it can be useful for logging purposes,
 * providing valuable information about the inner error that caused the HttpException to be thrown.
 * 
  try {
    await this.service.findAll()
  } catch (error) { 
    throw new HttpException({
      status: HttpStatus.FORBIDDEN,
      error: 'This is a custom message',
    }, HttpStatus.FORBIDDEN, {
      cause: error
    });
  }

 * Custom Exceptions implemented below
 */
export class CustomForbiddenException extends HttpException {
  constructor() {
    super('Forbidden', HttpStatus.FORBIDDEN);
  }
}
