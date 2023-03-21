import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
} from '@nestjs/common';
import { Request, Response } from 'express';

/**
 * While the base (built-in) exception filter can automatically handle many cases for you,
 * you may want full control over the exceptions layer.
 * For example, you may want to add logging or use a different JSON schema based on some dynamic factors.
 * Exception filters are designed for exactly this purpose.
 * They let you control the exact flow of control and the content of the response sent back to the client.
 *
 * Let's create an exception filter that is responsible for catching exceptions
 * which are an instance of the HttpException class, and implementing custom response logic for them.
 * To do this, we'll need to access the underlying platform Request and Response objects.
 * We'll access the Request object so we can pull out the original url and include that in the logging information.
 * We'll use the Response object to take direct control of the response that is sent, using the response.json() method.
 *
 * HINT: All exception filters should implement the generic ExceptionFilter<T> interface.
 * This requires you to provide the catch(exception: T, host: ArgumentsHost) method with its indicated signature.
 * T indicates the type of the exception.
 */
@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();

    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }
}
