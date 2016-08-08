// State
export interface FetchError {
  // The type of action that produced the error
  type: string;
  // If the error concerns a specific entity, the id of that entity
  id: string;
  // The error message
  error: string;
}

export type ErrorState = FetchError[];

export const isError = (obj: any): obj is FetchError => {
  const possiblyError = (<FetchError> obj);
  return possiblyError && possiblyError.type !== undefined && possiblyError.error !== undefined;
};
