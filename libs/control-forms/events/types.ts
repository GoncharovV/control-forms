/* eslint-disable @typescript-eslint/no-empty-object-type */

export type Prettify<T> = { [TKey in keyof T]: T[TKey] } & {};

type Payload<TPayload> =
    [TPayload] extends [never] | [void] | [undefined]
      ? {}
      : [Extract<TPayload, undefined>] extends [never]
        ? { payload: TPayload; }
        : { payload?: TPayload; };


export type FormEvent<TEventType extends string = string, TPayload = void> =
    Prettify<{ type: TEventType; } & Payload<TPayload>>;
