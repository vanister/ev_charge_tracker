export type Success<T> = {
  readonly success: true;
  readonly data: T;
};

export type Failure = {
  readonly success: false;
  readonly error: string;
};

export type Result<T> = Success<T> | Failure;

export function success<T>(data: T): Success<T> {
  return { success: true, data };
}

export function failure(error: string): Failure {
  return { success: false, error };
}

export function isSuccess<T>(result: Result<T>): result is Success<T> {
  return result.success === true;
}

export function isFailure<T>(result: Result<T>): result is Failure {
  return result.success === false;
}
