import type { Success, Failure } from '../types/shared-types';

export function success(): Success<void>;
export function success<T>(data: T): Success<T>;
export function success<T>(data?: T): Success<T | void> {
  return { success: true, data: data as T };
}

export function failure(error: string): Failure {
  return { success: false, error };
}
