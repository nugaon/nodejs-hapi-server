export type Resolution<T> = (value?: T | PromiseLike<T>) => void;

export type Rejection = (reason: Error) => void;
