import { ServiceResponse } from 'src/common/sharedTypes/response.types';

export interface GatewayResponse<T> extends ServiceResponse<T> {
  status: 'SUCCESS' | 'FAILURE';
}
