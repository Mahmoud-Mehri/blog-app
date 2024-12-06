import {
  BadRequestException,
  ValidationPipe,
  ValidationPipeOptions,
} from '@nestjs/common';

export class CustomValidationPipe extends ValidationPipe {
  constructor(options?: ValidationPipeOptions) {
    super({
      ...options,
      exceptionFactory: (errors) => {
        const customErrors = errors.map((error) => {
          return `${error.property} - ${Object.values(error.constraints).join(', ')}`;
        });

        return new BadRequestException({
          message: 'Validation Failed',
          errors: customErrors,
        });
      },
    });
  }
}
