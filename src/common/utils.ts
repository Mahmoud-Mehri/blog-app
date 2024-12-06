import { HttpStatus } from '@nestjs/common';
import { ServiceResponse } from './types';

export function successResponse(
  _data: Object | null,
  _code: number = HttpStatus.OK,
  _message: string = '',
): ServiceResponse {
  return new ServiceResponse(true, _data, _message, _code);
}

export function errorResponse(
  _message: string = 'Internal Server Error',
  _code: number = HttpStatus.INTERNAL_SERVER_ERROR,
): ServiceResponse {
  return new ServiceResponse(false, null, _message, _code);
}
