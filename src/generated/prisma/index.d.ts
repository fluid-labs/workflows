
/**
 * Client
**/

import * as runtime from './runtime/library.js';
import $Types = runtime.Types // general types
import $Public = runtime.Types.Public
import $Utils = runtime.Types.Utils
import $Extensions = runtime.Types.Extensions
import $Result = runtime.Types.Result

export type PrismaPromise<T> = $Public.PrismaPromise<T>


/**
 * Model TwitterMonitor
 * 
 */
export type TwitterMonitor = $Result.DefaultSelection<Prisma.$TwitterMonitorPayload>
/**
 * Model TweetRecord
 * 
 */
export type TweetRecord = $Result.DefaultSelection<Prisma.$TweetRecordPayload>

/**
 * ##  Prisma Client ʲˢ
 *
 * Type-safe database client for TypeScript & Node.js
 * @example
 * ```
 * const prisma = new PrismaClient()
 * // Fetch zero or more TwitterMonitors
 * const twitterMonitors = await prisma.twitterMonitor.findMany()
 * ```
 *
 *
 * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
 */
export class PrismaClient<
  ClientOptions extends Prisma.PrismaClientOptions = Prisma.PrismaClientOptions,
  U = 'log' extends keyof ClientOptions ? ClientOptions['log'] extends Array<Prisma.LogLevel | Prisma.LogDefinition> ? Prisma.GetEvents<ClientOptions['log']> : never : never,
  ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
> {
  [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['other'] }

    /**
   * ##  Prisma Client ʲˢ
   *
   * Type-safe database client for TypeScript & Node.js
   * @example
   * ```
   * const prisma = new PrismaClient()
   * // Fetch zero or more TwitterMonitors
   * const twitterMonitors = await prisma.twitterMonitor.findMany()
   * ```
   *
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
   */

  constructor(optionsArg ?: Prisma.Subset<ClientOptions, Prisma.PrismaClientOptions>);
  $on<V extends U>(eventType: V, callback: (event: V extends 'query' ? Prisma.QueryEvent : Prisma.LogEvent) => void): PrismaClient;

  /**
   * Connect with the database
   */
  $connect(): $Utils.JsPromise<void>;

  /**
   * Disconnect from the database
   */
  $disconnect(): $Utils.JsPromise<void>;

  /**
   * Add a middleware
   * @deprecated since 4.16.0. For new code, prefer client extensions instead.
   * @see https://pris.ly/d/extensions
   */
  $use(cb: Prisma.Middleware): void

/**
   * Executes a prepared raw query and returns the number of affected rows.
   * @example
   * ```
   * const result = await prisma.$executeRaw`UPDATE User SET cool = ${true} WHERE email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Executes a raw query and returns the number of affected rows.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$executeRawUnsafe('UPDATE User SET cool = $1 WHERE email = $2 ;', true, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Performs a prepared raw query and returns the `SELECT` data.
   * @example
   * ```
   * const result = await prisma.$queryRaw`SELECT * FROM User WHERE id = ${1} OR email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<T>;

  /**
   * Performs a raw query and returns the `SELECT` data.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$queryRawUnsafe('SELECT * FROM User WHERE id = $1 OR email = $2;', 1, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<T>;


  /**
   * Allows the running of a sequence of read/write operations that are guaranteed to either succeed or fail as a whole.
   * @example
   * ```
   * const [george, bob, alice] = await prisma.$transaction([
   *   prisma.user.create({ data: { name: 'George' } }),
   *   prisma.user.create({ data: { name: 'Bob' } }),
   *   prisma.user.create({ data: { name: 'Alice' } }),
   * ])
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/concepts/components/prisma-client/transactions).
   */
  $transaction<P extends Prisma.PrismaPromise<any>[]>(arg: [...P], options?: { isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<runtime.Types.Utils.UnwrapTuple<P>>

  $transaction<R>(fn: (prisma: Omit<PrismaClient, runtime.ITXClientDenyList>) => $Utils.JsPromise<R>, options?: { maxWait?: number, timeout?: number, isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<R>


  $extends: $Extensions.ExtendsHook<"extends", Prisma.TypeMapCb<ClientOptions>, ExtArgs, $Utils.Call<Prisma.TypeMapCb<ClientOptions>, {
    extArgs: ExtArgs
  }>>

      /**
   * `prisma.twitterMonitor`: Exposes CRUD operations for the **TwitterMonitor** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more TwitterMonitors
    * const twitterMonitors = await prisma.twitterMonitor.findMany()
    * ```
    */
  get twitterMonitor(): Prisma.TwitterMonitorDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.tweetRecord`: Exposes CRUD operations for the **TweetRecord** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more TweetRecords
    * const tweetRecords = await prisma.tweetRecord.findMany()
    * ```
    */
  get tweetRecord(): Prisma.TweetRecordDelegate<ExtArgs, ClientOptions>;
}

export namespace Prisma {
  export import DMMF = runtime.DMMF

  export type PrismaPromise<T> = $Public.PrismaPromise<T>

  /**
   * Validator
   */
  export import validator = runtime.Public.validator

  /**
   * Prisma Errors
   */
  export import PrismaClientKnownRequestError = runtime.PrismaClientKnownRequestError
  export import PrismaClientUnknownRequestError = runtime.PrismaClientUnknownRequestError
  export import PrismaClientRustPanicError = runtime.PrismaClientRustPanicError
  export import PrismaClientInitializationError = runtime.PrismaClientInitializationError
  export import PrismaClientValidationError = runtime.PrismaClientValidationError

  /**
   * Re-export of sql-template-tag
   */
  export import sql = runtime.sqltag
  export import empty = runtime.empty
  export import join = runtime.join
  export import raw = runtime.raw
  export import Sql = runtime.Sql



  /**
   * Decimal.js
   */
  export import Decimal = runtime.Decimal

  export type DecimalJsLike = runtime.DecimalJsLike

  /**
   * Metrics
   */
  export type Metrics = runtime.Metrics
  export type Metric<T> = runtime.Metric<T>
  export type MetricHistogram = runtime.MetricHistogram
  export type MetricHistogramBucket = runtime.MetricHistogramBucket

  /**
  * Extensions
  */
  export import Extension = $Extensions.UserArgs
  export import getExtensionContext = runtime.Extensions.getExtensionContext
  export import Args = $Public.Args
  export import Payload = $Public.Payload
  export import Result = $Public.Result
  export import Exact = $Public.Exact

  /**
   * Prisma Client JS version: 6.10.1
   * Query Engine version: 9b628578b3b7cae625e8c927178f15a170e74a9c
   */
  export type PrismaVersion = {
    client: string
  }

  export const prismaVersion: PrismaVersion

  /**
   * Utility Types
   */


  export import JsonObject = runtime.JsonObject
  export import JsonArray = runtime.JsonArray
  export import JsonValue = runtime.JsonValue
  export import InputJsonObject = runtime.InputJsonObject
  export import InputJsonArray = runtime.InputJsonArray
  export import InputJsonValue = runtime.InputJsonValue

  /**
   * Types of the values used to represent different kinds of `null` values when working with JSON fields.
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  namespace NullTypes {
    /**
    * Type of `Prisma.DbNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.DbNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class DbNull {
      private DbNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.JsonNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.JsonNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class JsonNull {
      private JsonNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.AnyNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.AnyNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class AnyNull {
      private AnyNull: never
      private constructor()
    }
  }

  /**
   * Helper for filtering JSON entries that have `null` on the database (empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const DbNull: NullTypes.DbNull

  /**
   * Helper for filtering JSON entries that have JSON `null` values (not empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const JsonNull: NullTypes.JsonNull

  /**
   * Helper for filtering JSON entries that are `Prisma.DbNull` or `Prisma.JsonNull`
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const AnyNull: NullTypes.AnyNull

  type SelectAndInclude = {
    select: any
    include: any
  }

  type SelectAndOmit = {
    select: any
    omit: any
  }

  /**
   * Get the type of the value, that the Promise holds.
   */
  export type PromiseType<T extends PromiseLike<any>> = T extends PromiseLike<infer U> ? U : T;

  /**
   * Get the return type of a function which returns a Promise.
   */
  export type PromiseReturnType<T extends (...args: any) => $Utils.JsPromise<any>> = PromiseType<ReturnType<T>>

  /**
   * From T, pick a set of properties whose keys are in the union K
   */
  type Prisma__Pick<T, K extends keyof T> = {
      [P in K]: T[P];
  };


  export type Enumerable<T> = T | Array<T>;

  export type RequiredKeys<T> = {
    [K in keyof T]-?: {} extends Prisma__Pick<T, K> ? never : K
  }[keyof T]

  export type TruthyKeys<T> = keyof {
    [K in keyof T as T[K] extends false | undefined | null ? never : K]: K
  }

  export type TrueKeys<T> = TruthyKeys<Prisma__Pick<T, RequiredKeys<T>>>

  /**
   * Subset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection
   */
  export type Subset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never;
  };

  /**
   * SelectSubset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection.
   * Additionally, it validates, if both select and include are present. If the case, it errors.
   */
  export type SelectSubset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    (T extends SelectAndInclude
      ? 'Please either choose `select` or `include`.'
      : T extends SelectAndOmit
        ? 'Please either choose `select` or `omit`.'
        : {})

  /**
   * Subset + Intersection
   * @desc From `T` pick properties that exist in `U` and intersect `K`
   */
  export type SubsetIntersection<T, U, K> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    K

  type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };

  /**
   * XOR is needed to have a real mutually exclusive union type
   * https://stackoverflow.com/questions/42123407/does-typescript-support-mutually-exclusive-types
   */
  type XOR<T, U> =
    T extends object ?
    U extends object ?
      (Without<T, U> & U) | (Without<U, T> & T)
    : U : T


  /**
   * Is T a Record?
   */
  type IsObject<T extends any> = T extends Array<any>
  ? False
  : T extends Date
  ? False
  : T extends Uint8Array
  ? False
  : T extends BigInt
  ? False
  : T extends object
  ? True
  : False


  /**
   * If it's T[], return T
   */
  export type UnEnumerate<T extends unknown> = T extends Array<infer U> ? U : T

  /**
   * From ts-toolbelt
   */

  type __Either<O extends object, K extends Key> = Omit<O, K> &
    {
      // Merge all but K
      [P in K]: Prisma__Pick<O, P & keyof O> // With K possibilities
    }[K]

  type EitherStrict<O extends object, K extends Key> = Strict<__Either<O, K>>

  type EitherLoose<O extends object, K extends Key> = ComputeRaw<__Either<O, K>>

  type _Either<
    O extends object,
    K extends Key,
    strict extends Boolean
  > = {
    1: EitherStrict<O, K>
    0: EitherLoose<O, K>
  }[strict]

  type Either<
    O extends object,
    K extends Key,
    strict extends Boolean = 1
  > = O extends unknown ? _Either<O, K, strict> : never

  export type Union = any

  type PatchUndefined<O extends object, O1 extends object> = {
    [K in keyof O]: O[K] extends undefined ? At<O1, K> : O[K]
  } & {}

  /** Helper Types for "Merge" **/
  export type IntersectOf<U extends Union> = (
    U extends unknown ? (k: U) => void : never
  ) extends (k: infer I) => void
    ? I
    : never

  export type Overwrite<O extends object, O1 extends object> = {
      [K in keyof O]: K extends keyof O1 ? O1[K] : O[K];
  } & {};

  type _Merge<U extends object> = IntersectOf<Overwrite<U, {
      [K in keyof U]-?: At<U, K>;
  }>>;

  type Key = string | number | symbol;
  type AtBasic<O extends object, K extends Key> = K extends keyof O ? O[K] : never;
  type AtStrict<O extends object, K extends Key> = O[K & keyof O];
  type AtLoose<O extends object, K extends Key> = O extends unknown ? AtStrict<O, K> : never;
  export type At<O extends object, K extends Key, strict extends Boolean = 1> = {
      1: AtStrict<O, K>;
      0: AtLoose<O, K>;
  }[strict];

  export type ComputeRaw<A extends any> = A extends Function ? A : {
    [K in keyof A]: A[K];
  } & {};

  export type OptionalFlat<O> = {
    [K in keyof O]?: O[K];
  } & {};

  type _Record<K extends keyof any, T> = {
    [P in K]: T;
  };

  // cause typescript not to expand types and preserve names
  type NoExpand<T> = T extends unknown ? T : never;

  // this type assumes the passed object is entirely optional
  type AtLeast<O extends object, K extends string> = NoExpand<
    O extends unknown
    ? | (K extends keyof O ? { [P in K]: O[P] } & O : O)
      | {[P in keyof O as P extends K ? P : never]-?: O[P]} & O
    : never>;

  type _Strict<U, _U = U> = U extends unknown ? U & OptionalFlat<_Record<Exclude<Keys<_U>, keyof U>, never>> : never;

  export type Strict<U extends object> = ComputeRaw<_Strict<U>>;
  /** End Helper Types for "Merge" **/

  export type Merge<U extends object> = ComputeRaw<_Merge<Strict<U>>>;

  /**
  A [[Boolean]]
  */
  export type Boolean = True | False

  // /**
  // 1
  // */
  export type True = 1

  /**
  0
  */
  export type False = 0

  export type Not<B extends Boolean> = {
    0: 1
    1: 0
  }[B]

  export type Extends<A1 extends any, A2 extends any> = [A1] extends [never]
    ? 0 // anything `never` is false
    : A1 extends A2
    ? 1
    : 0

  export type Has<U extends Union, U1 extends Union> = Not<
    Extends<Exclude<U1, U>, U1>
  >

  export type Or<B1 extends Boolean, B2 extends Boolean> = {
    0: {
      0: 0
      1: 1
    }
    1: {
      0: 1
      1: 1
    }
  }[B1][B2]

  export type Keys<U extends Union> = U extends unknown ? keyof U : never

  type Cast<A, B> = A extends B ? A : B;

  export const type: unique symbol;



  /**
   * Used by group by
   */

  export type GetScalarType<T, O> = O extends object ? {
    [P in keyof T]: P extends keyof O
      ? O[P]
      : never
  } : never

  type FieldPaths<
    T,
    U = Omit<T, '_avg' | '_sum' | '_count' | '_min' | '_max'>
  > = IsObject<T> extends True ? U : T

  type GetHavingFields<T> = {
    [K in keyof T]: Or<
      Or<Extends<'OR', K>, Extends<'AND', K>>,
      Extends<'NOT', K>
    > extends True
      ? // infer is only needed to not hit TS limit
        // based on the brilliant idea of Pierre-Antoine Mills
        // https://github.com/microsoft/TypeScript/issues/30188#issuecomment-478938437
        T[K] extends infer TK
        ? GetHavingFields<UnEnumerate<TK> extends object ? Merge<UnEnumerate<TK>> : never>
        : never
      : {} extends FieldPaths<T[K]>
      ? never
      : K
  }[keyof T]

  /**
   * Convert tuple to union
   */
  type _TupleToUnion<T> = T extends (infer E)[] ? E : never
  type TupleToUnion<K extends readonly any[]> = _TupleToUnion<K>
  type MaybeTupleToUnion<T> = T extends any[] ? TupleToUnion<T> : T

  /**
   * Like `Pick`, but additionally can also accept an array of keys
   */
  type PickEnumerable<T, K extends Enumerable<keyof T> | keyof T> = Prisma__Pick<T, MaybeTupleToUnion<K>>

  /**
   * Exclude all keys with underscores
   */
  type ExcludeUnderscoreKeys<T extends string> = T extends `_${string}` ? never : T


  export type FieldRef<Model, FieldType> = runtime.FieldRef<Model, FieldType>

  type FieldRefInputType<Model, FieldType> = Model extends never ? never : FieldRef<Model, FieldType>


  export const ModelName: {
    TwitterMonitor: 'TwitterMonitor',
    TweetRecord: 'TweetRecord'
  };

  export type ModelName = (typeof ModelName)[keyof typeof ModelName]


  export type Datasources = {
    db?: Datasource
  }

  interface TypeMapCb<ClientOptions = {}> extends $Utils.Fn<{extArgs: $Extensions.InternalArgs }, $Utils.Record<string, any>> {
    returns: Prisma.TypeMap<this['params']['extArgs'], ClientOptions extends { omit: infer OmitOptions } ? OmitOptions : {}>
  }

  export type TypeMap<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> = {
    globalOmitOptions: {
      omit: GlobalOmitOptions
    }
    meta: {
      modelProps: "twitterMonitor" | "tweetRecord"
      txIsolationLevel: Prisma.TransactionIsolationLevel
    }
    model: {
      TwitterMonitor: {
        payload: Prisma.$TwitterMonitorPayload<ExtArgs>
        fields: Prisma.TwitterMonitorFieldRefs
        operations: {
          findUnique: {
            args: Prisma.TwitterMonitorFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TwitterMonitorPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.TwitterMonitorFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TwitterMonitorPayload>
          }
          findFirst: {
            args: Prisma.TwitterMonitorFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TwitterMonitorPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.TwitterMonitorFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TwitterMonitorPayload>
          }
          findMany: {
            args: Prisma.TwitterMonitorFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TwitterMonitorPayload>[]
          }
          create: {
            args: Prisma.TwitterMonitorCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TwitterMonitorPayload>
          }
          createMany: {
            args: Prisma.TwitterMonitorCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.TwitterMonitorCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TwitterMonitorPayload>[]
          }
          delete: {
            args: Prisma.TwitterMonitorDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TwitterMonitorPayload>
          }
          update: {
            args: Prisma.TwitterMonitorUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TwitterMonitorPayload>
          }
          deleteMany: {
            args: Prisma.TwitterMonitorDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.TwitterMonitorUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.TwitterMonitorUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TwitterMonitorPayload>[]
          }
          upsert: {
            args: Prisma.TwitterMonitorUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TwitterMonitorPayload>
          }
          aggregate: {
            args: Prisma.TwitterMonitorAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateTwitterMonitor>
          }
          groupBy: {
            args: Prisma.TwitterMonitorGroupByArgs<ExtArgs>
            result: $Utils.Optional<TwitterMonitorGroupByOutputType>[]
          }
          count: {
            args: Prisma.TwitterMonitorCountArgs<ExtArgs>
            result: $Utils.Optional<TwitterMonitorCountAggregateOutputType> | number
          }
        }
      }
      TweetRecord: {
        payload: Prisma.$TweetRecordPayload<ExtArgs>
        fields: Prisma.TweetRecordFieldRefs
        operations: {
          findUnique: {
            args: Prisma.TweetRecordFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TweetRecordPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.TweetRecordFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TweetRecordPayload>
          }
          findFirst: {
            args: Prisma.TweetRecordFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TweetRecordPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.TweetRecordFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TweetRecordPayload>
          }
          findMany: {
            args: Prisma.TweetRecordFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TweetRecordPayload>[]
          }
          create: {
            args: Prisma.TweetRecordCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TweetRecordPayload>
          }
          createMany: {
            args: Prisma.TweetRecordCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.TweetRecordCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TweetRecordPayload>[]
          }
          delete: {
            args: Prisma.TweetRecordDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TweetRecordPayload>
          }
          update: {
            args: Prisma.TweetRecordUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TweetRecordPayload>
          }
          deleteMany: {
            args: Prisma.TweetRecordDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.TweetRecordUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.TweetRecordUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TweetRecordPayload>[]
          }
          upsert: {
            args: Prisma.TweetRecordUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TweetRecordPayload>
          }
          aggregate: {
            args: Prisma.TweetRecordAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateTweetRecord>
          }
          groupBy: {
            args: Prisma.TweetRecordGroupByArgs<ExtArgs>
            result: $Utils.Optional<TweetRecordGroupByOutputType>[]
          }
          count: {
            args: Prisma.TweetRecordCountArgs<ExtArgs>
            result: $Utils.Optional<TweetRecordCountAggregateOutputType> | number
          }
        }
      }
    }
  } & {
    other: {
      payload: any
      operations: {
        $executeRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $executeRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
        $queryRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $queryRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
      }
    }
  }
  export const defineExtension: $Extensions.ExtendsHook<"define", Prisma.TypeMapCb, $Extensions.DefaultArgs>
  export type DefaultPrismaClient = PrismaClient
  export type ErrorFormat = 'pretty' | 'colorless' | 'minimal'
  export interface PrismaClientOptions {
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasources?: Datasources
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasourceUrl?: string
    /**
     * @default "colorless"
     */
    errorFormat?: ErrorFormat
    /**
     * @example
     * ```
     * // Defaults to stdout
     * log: ['query', 'info', 'warn', 'error']
     * 
     * // Emit as events
     * log: [
     *   { emit: 'stdout', level: 'query' },
     *   { emit: 'stdout', level: 'info' },
     *   { emit: 'stdout', level: 'warn' }
     *   { emit: 'stdout', level: 'error' }
     * ]
     * ```
     * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/logging#the-log-option).
     */
    log?: (LogLevel | LogDefinition)[]
    /**
     * The default values for transactionOptions
     * maxWait ?= 2000
     * timeout ?= 5000
     */
    transactionOptions?: {
      maxWait?: number
      timeout?: number
      isolationLevel?: Prisma.TransactionIsolationLevel
    }
    /**
     * Global configuration for omitting model fields by default.
     * 
     * @example
     * ```
     * const prisma = new PrismaClient({
     *   omit: {
     *     user: {
     *       password: true
     *     }
     *   }
     * })
     * ```
     */
    omit?: Prisma.GlobalOmitConfig
  }
  export type GlobalOmitConfig = {
    twitterMonitor?: TwitterMonitorOmit
    tweetRecord?: TweetRecordOmit
  }

  /* Types for Logging */
  export type LogLevel = 'info' | 'query' | 'warn' | 'error'
  export type LogDefinition = {
    level: LogLevel
    emit: 'stdout' | 'event'
  }

  export type GetLogType<T extends LogLevel | LogDefinition> = T extends LogDefinition ? T['emit'] extends 'event' ? T['level'] : never : never
  export type GetEvents<T extends any> = T extends Array<LogLevel | LogDefinition> ?
    GetLogType<T[0]> | GetLogType<T[1]> | GetLogType<T[2]> | GetLogType<T[3]>
    : never

  export type QueryEvent = {
    timestamp: Date
    query: string
    params: string
    duration: number
    target: string
  }

  export type LogEvent = {
    timestamp: Date
    message: string
    target: string
  }
  /* End Types for Logging */


  export type PrismaAction =
    | 'findUnique'
    | 'findUniqueOrThrow'
    | 'findMany'
    | 'findFirst'
    | 'findFirstOrThrow'
    | 'create'
    | 'createMany'
    | 'createManyAndReturn'
    | 'update'
    | 'updateMany'
    | 'updateManyAndReturn'
    | 'upsert'
    | 'delete'
    | 'deleteMany'
    | 'executeRaw'
    | 'queryRaw'
    | 'aggregate'
    | 'count'
    | 'runCommandRaw'
    | 'findRaw'
    | 'groupBy'

  /**
   * These options are being passed into the middleware as "params"
   */
  export type MiddlewareParams = {
    model?: ModelName
    action: PrismaAction
    args: any
    dataPath: string[]
    runInTransaction: boolean
  }

  /**
   * The `T` type makes sure, that the `return proceed` is not forgotten in the middleware implementation
   */
  export type Middleware<T = any> = (
    params: MiddlewareParams,
    next: (params: MiddlewareParams) => $Utils.JsPromise<T>,
  ) => $Utils.JsPromise<T>

  // tested in getLogLevel.test.ts
  export function getLogLevel(log: Array<LogLevel | LogDefinition>): LogLevel | undefined;

  /**
   * `PrismaClient` proxy available in interactive transactions.
   */
  export type TransactionClient = Omit<Prisma.DefaultPrismaClient, runtime.ITXClientDenyList>

  export type Datasource = {
    url?: string
  }

  /**
   * Count Types
   */


  /**
   * Count Type TwitterMonitorCountOutputType
   */

  export type TwitterMonitorCountOutputType = {
    tweets: number
  }

  export type TwitterMonitorCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    tweets?: boolean | TwitterMonitorCountOutputTypeCountTweetsArgs
  }

  // Custom InputTypes
  /**
   * TwitterMonitorCountOutputType without action
   */
  export type TwitterMonitorCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TwitterMonitorCountOutputType
     */
    select?: TwitterMonitorCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * TwitterMonitorCountOutputType without action
   */
  export type TwitterMonitorCountOutputTypeCountTweetsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: TweetRecordWhereInput
  }


  /**
   * Models
   */

  /**
   * Model TwitterMonitor
   */

  export type AggregateTwitterMonitor = {
    _count: TwitterMonitorCountAggregateOutputType | null
    _min: TwitterMonitorMinAggregateOutputType | null
    _max: TwitterMonitorMaxAggregateOutputType | null
  }

  export type TwitterMonitorMinAggregateOutputType = {
    id: string | null
    username: string | null
    chatId: string | null
    lastCheckedAt: Date | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type TwitterMonitorMaxAggregateOutputType = {
    id: string | null
    username: string | null
    chatId: string | null
    lastCheckedAt: Date | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type TwitterMonitorCountAggregateOutputType = {
    id: number
    username: number
    chatId: number
    lastCheckedAt: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type TwitterMonitorMinAggregateInputType = {
    id?: true
    username?: true
    chatId?: true
    lastCheckedAt?: true
    createdAt?: true
    updatedAt?: true
  }

  export type TwitterMonitorMaxAggregateInputType = {
    id?: true
    username?: true
    chatId?: true
    lastCheckedAt?: true
    createdAt?: true
    updatedAt?: true
  }

  export type TwitterMonitorCountAggregateInputType = {
    id?: true
    username?: true
    chatId?: true
    lastCheckedAt?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type TwitterMonitorAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which TwitterMonitor to aggregate.
     */
    where?: TwitterMonitorWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of TwitterMonitors to fetch.
     */
    orderBy?: TwitterMonitorOrderByWithRelationInput | TwitterMonitorOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: TwitterMonitorWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` TwitterMonitors from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` TwitterMonitors.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned TwitterMonitors
    **/
    _count?: true | TwitterMonitorCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: TwitterMonitorMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: TwitterMonitorMaxAggregateInputType
  }

  export type GetTwitterMonitorAggregateType<T extends TwitterMonitorAggregateArgs> = {
        [P in keyof T & keyof AggregateTwitterMonitor]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateTwitterMonitor[P]>
      : GetScalarType<T[P], AggregateTwitterMonitor[P]>
  }




  export type TwitterMonitorGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: TwitterMonitorWhereInput
    orderBy?: TwitterMonitorOrderByWithAggregationInput | TwitterMonitorOrderByWithAggregationInput[]
    by: TwitterMonitorScalarFieldEnum[] | TwitterMonitorScalarFieldEnum
    having?: TwitterMonitorScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: TwitterMonitorCountAggregateInputType | true
    _min?: TwitterMonitorMinAggregateInputType
    _max?: TwitterMonitorMaxAggregateInputType
  }

  export type TwitterMonitorGroupByOutputType = {
    id: string
    username: string
    chatId: string
    lastCheckedAt: Date
    createdAt: Date
    updatedAt: Date
    _count: TwitterMonitorCountAggregateOutputType | null
    _min: TwitterMonitorMinAggregateOutputType | null
    _max: TwitterMonitorMaxAggregateOutputType | null
  }

  type GetTwitterMonitorGroupByPayload<T extends TwitterMonitorGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<TwitterMonitorGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof TwitterMonitorGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], TwitterMonitorGroupByOutputType[P]>
            : GetScalarType<T[P], TwitterMonitorGroupByOutputType[P]>
        }
      >
    >


  export type TwitterMonitorSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    username?: boolean
    chatId?: boolean
    lastCheckedAt?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    tweets?: boolean | TwitterMonitor$tweetsArgs<ExtArgs>
    _count?: boolean | TwitterMonitorCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["twitterMonitor"]>

  export type TwitterMonitorSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    username?: boolean
    chatId?: boolean
    lastCheckedAt?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["twitterMonitor"]>

  export type TwitterMonitorSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    username?: boolean
    chatId?: boolean
    lastCheckedAt?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["twitterMonitor"]>

  export type TwitterMonitorSelectScalar = {
    id?: boolean
    username?: boolean
    chatId?: boolean
    lastCheckedAt?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type TwitterMonitorOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "username" | "chatId" | "lastCheckedAt" | "createdAt" | "updatedAt", ExtArgs["result"]["twitterMonitor"]>
  export type TwitterMonitorInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    tweets?: boolean | TwitterMonitor$tweetsArgs<ExtArgs>
    _count?: boolean | TwitterMonitorCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type TwitterMonitorIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}
  export type TwitterMonitorIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $TwitterMonitorPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "TwitterMonitor"
    objects: {
      tweets: Prisma.$TweetRecordPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      username: string
      chatId: string
      lastCheckedAt: Date
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["twitterMonitor"]>
    composites: {}
  }

  type TwitterMonitorGetPayload<S extends boolean | null | undefined | TwitterMonitorDefaultArgs> = $Result.GetResult<Prisma.$TwitterMonitorPayload, S>

  type TwitterMonitorCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<TwitterMonitorFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: TwitterMonitorCountAggregateInputType | true
    }

  export interface TwitterMonitorDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['TwitterMonitor'], meta: { name: 'TwitterMonitor' } }
    /**
     * Find zero or one TwitterMonitor that matches the filter.
     * @param {TwitterMonitorFindUniqueArgs} args - Arguments to find a TwitterMonitor
     * @example
     * // Get one TwitterMonitor
     * const twitterMonitor = await prisma.twitterMonitor.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends TwitterMonitorFindUniqueArgs>(args: SelectSubset<T, TwitterMonitorFindUniqueArgs<ExtArgs>>): Prisma__TwitterMonitorClient<$Result.GetResult<Prisma.$TwitterMonitorPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one TwitterMonitor that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {TwitterMonitorFindUniqueOrThrowArgs} args - Arguments to find a TwitterMonitor
     * @example
     * // Get one TwitterMonitor
     * const twitterMonitor = await prisma.twitterMonitor.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends TwitterMonitorFindUniqueOrThrowArgs>(args: SelectSubset<T, TwitterMonitorFindUniqueOrThrowArgs<ExtArgs>>): Prisma__TwitterMonitorClient<$Result.GetResult<Prisma.$TwitterMonitorPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first TwitterMonitor that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TwitterMonitorFindFirstArgs} args - Arguments to find a TwitterMonitor
     * @example
     * // Get one TwitterMonitor
     * const twitterMonitor = await prisma.twitterMonitor.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends TwitterMonitorFindFirstArgs>(args?: SelectSubset<T, TwitterMonitorFindFirstArgs<ExtArgs>>): Prisma__TwitterMonitorClient<$Result.GetResult<Prisma.$TwitterMonitorPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first TwitterMonitor that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TwitterMonitorFindFirstOrThrowArgs} args - Arguments to find a TwitterMonitor
     * @example
     * // Get one TwitterMonitor
     * const twitterMonitor = await prisma.twitterMonitor.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends TwitterMonitorFindFirstOrThrowArgs>(args?: SelectSubset<T, TwitterMonitorFindFirstOrThrowArgs<ExtArgs>>): Prisma__TwitterMonitorClient<$Result.GetResult<Prisma.$TwitterMonitorPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more TwitterMonitors that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TwitterMonitorFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all TwitterMonitors
     * const twitterMonitors = await prisma.twitterMonitor.findMany()
     * 
     * // Get first 10 TwitterMonitors
     * const twitterMonitors = await prisma.twitterMonitor.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const twitterMonitorWithIdOnly = await prisma.twitterMonitor.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends TwitterMonitorFindManyArgs>(args?: SelectSubset<T, TwitterMonitorFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TwitterMonitorPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a TwitterMonitor.
     * @param {TwitterMonitorCreateArgs} args - Arguments to create a TwitterMonitor.
     * @example
     * // Create one TwitterMonitor
     * const TwitterMonitor = await prisma.twitterMonitor.create({
     *   data: {
     *     // ... data to create a TwitterMonitor
     *   }
     * })
     * 
     */
    create<T extends TwitterMonitorCreateArgs>(args: SelectSubset<T, TwitterMonitorCreateArgs<ExtArgs>>): Prisma__TwitterMonitorClient<$Result.GetResult<Prisma.$TwitterMonitorPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many TwitterMonitors.
     * @param {TwitterMonitorCreateManyArgs} args - Arguments to create many TwitterMonitors.
     * @example
     * // Create many TwitterMonitors
     * const twitterMonitor = await prisma.twitterMonitor.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends TwitterMonitorCreateManyArgs>(args?: SelectSubset<T, TwitterMonitorCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many TwitterMonitors and returns the data saved in the database.
     * @param {TwitterMonitorCreateManyAndReturnArgs} args - Arguments to create many TwitterMonitors.
     * @example
     * // Create many TwitterMonitors
     * const twitterMonitor = await prisma.twitterMonitor.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many TwitterMonitors and only return the `id`
     * const twitterMonitorWithIdOnly = await prisma.twitterMonitor.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends TwitterMonitorCreateManyAndReturnArgs>(args?: SelectSubset<T, TwitterMonitorCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TwitterMonitorPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a TwitterMonitor.
     * @param {TwitterMonitorDeleteArgs} args - Arguments to delete one TwitterMonitor.
     * @example
     * // Delete one TwitterMonitor
     * const TwitterMonitor = await prisma.twitterMonitor.delete({
     *   where: {
     *     // ... filter to delete one TwitterMonitor
     *   }
     * })
     * 
     */
    delete<T extends TwitterMonitorDeleteArgs>(args: SelectSubset<T, TwitterMonitorDeleteArgs<ExtArgs>>): Prisma__TwitterMonitorClient<$Result.GetResult<Prisma.$TwitterMonitorPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one TwitterMonitor.
     * @param {TwitterMonitorUpdateArgs} args - Arguments to update one TwitterMonitor.
     * @example
     * // Update one TwitterMonitor
     * const twitterMonitor = await prisma.twitterMonitor.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends TwitterMonitorUpdateArgs>(args: SelectSubset<T, TwitterMonitorUpdateArgs<ExtArgs>>): Prisma__TwitterMonitorClient<$Result.GetResult<Prisma.$TwitterMonitorPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more TwitterMonitors.
     * @param {TwitterMonitorDeleteManyArgs} args - Arguments to filter TwitterMonitors to delete.
     * @example
     * // Delete a few TwitterMonitors
     * const { count } = await prisma.twitterMonitor.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends TwitterMonitorDeleteManyArgs>(args?: SelectSubset<T, TwitterMonitorDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more TwitterMonitors.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TwitterMonitorUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many TwitterMonitors
     * const twitterMonitor = await prisma.twitterMonitor.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends TwitterMonitorUpdateManyArgs>(args: SelectSubset<T, TwitterMonitorUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more TwitterMonitors and returns the data updated in the database.
     * @param {TwitterMonitorUpdateManyAndReturnArgs} args - Arguments to update many TwitterMonitors.
     * @example
     * // Update many TwitterMonitors
     * const twitterMonitor = await prisma.twitterMonitor.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more TwitterMonitors and only return the `id`
     * const twitterMonitorWithIdOnly = await prisma.twitterMonitor.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends TwitterMonitorUpdateManyAndReturnArgs>(args: SelectSubset<T, TwitterMonitorUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TwitterMonitorPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one TwitterMonitor.
     * @param {TwitterMonitorUpsertArgs} args - Arguments to update or create a TwitterMonitor.
     * @example
     * // Update or create a TwitterMonitor
     * const twitterMonitor = await prisma.twitterMonitor.upsert({
     *   create: {
     *     // ... data to create a TwitterMonitor
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the TwitterMonitor we want to update
     *   }
     * })
     */
    upsert<T extends TwitterMonitorUpsertArgs>(args: SelectSubset<T, TwitterMonitorUpsertArgs<ExtArgs>>): Prisma__TwitterMonitorClient<$Result.GetResult<Prisma.$TwitterMonitorPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of TwitterMonitors.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TwitterMonitorCountArgs} args - Arguments to filter TwitterMonitors to count.
     * @example
     * // Count the number of TwitterMonitors
     * const count = await prisma.twitterMonitor.count({
     *   where: {
     *     // ... the filter for the TwitterMonitors we want to count
     *   }
     * })
    **/
    count<T extends TwitterMonitorCountArgs>(
      args?: Subset<T, TwitterMonitorCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], TwitterMonitorCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a TwitterMonitor.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TwitterMonitorAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends TwitterMonitorAggregateArgs>(args: Subset<T, TwitterMonitorAggregateArgs>): Prisma.PrismaPromise<GetTwitterMonitorAggregateType<T>>

    /**
     * Group by TwitterMonitor.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TwitterMonitorGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends TwitterMonitorGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: TwitterMonitorGroupByArgs['orderBy'] }
        : { orderBy?: TwitterMonitorGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, TwitterMonitorGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetTwitterMonitorGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the TwitterMonitor model
   */
  readonly fields: TwitterMonitorFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for TwitterMonitor.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__TwitterMonitorClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    tweets<T extends TwitterMonitor$tweetsArgs<ExtArgs> = {}>(args?: Subset<T, TwitterMonitor$tweetsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TweetRecordPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the TwitterMonitor model
   */
  interface TwitterMonitorFieldRefs {
    readonly id: FieldRef<"TwitterMonitor", 'String'>
    readonly username: FieldRef<"TwitterMonitor", 'String'>
    readonly chatId: FieldRef<"TwitterMonitor", 'String'>
    readonly lastCheckedAt: FieldRef<"TwitterMonitor", 'DateTime'>
    readonly createdAt: FieldRef<"TwitterMonitor", 'DateTime'>
    readonly updatedAt: FieldRef<"TwitterMonitor", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * TwitterMonitor findUnique
   */
  export type TwitterMonitorFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TwitterMonitor
     */
    select?: TwitterMonitorSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TwitterMonitor
     */
    omit?: TwitterMonitorOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TwitterMonitorInclude<ExtArgs> | null
    /**
     * Filter, which TwitterMonitor to fetch.
     */
    where: TwitterMonitorWhereUniqueInput
  }

  /**
   * TwitterMonitor findUniqueOrThrow
   */
  export type TwitterMonitorFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TwitterMonitor
     */
    select?: TwitterMonitorSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TwitterMonitor
     */
    omit?: TwitterMonitorOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TwitterMonitorInclude<ExtArgs> | null
    /**
     * Filter, which TwitterMonitor to fetch.
     */
    where: TwitterMonitorWhereUniqueInput
  }

  /**
   * TwitterMonitor findFirst
   */
  export type TwitterMonitorFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TwitterMonitor
     */
    select?: TwitterMonitorSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TwitterMonitor
     */
    omit?: TwitterMonitorOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TwitterMonitorInclude<ExtArgs> | null
    /**
     * Filter, which TwitterMonitor to fetch.
     */
    where?: TwitterMonitorWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of TwitterMonitors to fetch.
     */
    orderBy?: TwitterMonitorOrderByWithRelationInput | TwitterMonitorOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for TwitterMonitors.
     */
    cursor?: TwitterMonitorWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` TwitterMonitors from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` TwitterMonitors.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of TwitterMonitors.
     */
    distinct?: TwitterMonitorScalarFieldEnum | TwitterMonitorScalarFieldEnum[]
  }

  /**
   * TwitterMonitor findFirstOrThrow
   */
  export type TwitterMonitorFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TwitterMonitor
     */
    select?: TwitterMonitorSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TwitterMonitor
     */
    omit?: TwitterMonitorOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TwitterMonitorInclude<ExtArgs> | null
    /**
     * Filter, which TwitterMonitor to fetch.
     */
    where?: TwitterMonitorWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of TwitterMonitors to fetch.
     */
    orderBy?: TwitterMonitorOrderByWithRelationInput | TwitterMonitorOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for TwitterMonitors.
     */
    cursor?: TwitterMonitorWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` TwitterMonitors from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` TwitterMonitors.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of TwitterMonitors.
     */
    distinct?: TwitterMonitorScalarFieldEnum | TwitterMonitorScalarFieldEnum[]
  }

  /**
   * TwitterMonitor findMany
   */
  export type TwitterMonitorFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TwitterMonitor
     */
    select?: TwitterMonitorSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TwitterMonitor
     */
    omit?: TwitterMonitorOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TwitterMonitorInclude<ExtArgs> | null
    /**
     * Filter, which TwitterMonitors to fetch.
     */
    where?: TwitterMonitorWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of TwitterMonitors to fetch.
     */
    orderBy?: TwitterMonitorOrderByWithRelationInput | TwitterMonitorOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing TwitterMonitors.
     */
    cursor?: TwitterMonitorWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` TwitterMonitors from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` TwitterMonitors.
     */
    skip?: number
    distinct?: TwitterMonitorScalarFieldEnum | TwitterMonitorScalarFieldEnum[]
  }

  /**
   * TwitterMonitor create
   */
  export type TwitterMonitorCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TwitterMonitor
     */
    select?: TwitterMonitorSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TwitterMonitor
     */
    omit?: TwitterMonitorOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TwitterMonitorInclude<ExtArgs> | null
    /**
     * The data needed to create a TwitterMonitor.
     */
    data: XOR<TwitterMonitorCreateInput, TwitterMonitorUncheckedCreateInput>
  }

  /**
   * TwitterMonitor createMany
   */
  export type TwitterMonitorCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many TwitterMonitors.
     */
    data: TwitterMonitorCreateManyInput | TwitterMonitorCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * TwitterMonitor createManyAndReturn
   */
  export type TwitterMonitorCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TwitterMonitor
     */
    select?: TwitterMonitorSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the TwitterMonitor
     */
    omit?: TwitterMonitorOmit<ExtArgs> | null
    /**
     * The data used to create many TwitterMonitors.
     */
    data: TwitterMonitorCreateManyInput | TwitterMonitorCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * TwitterMonitor update
   */
  export type TwitterMonitorUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TwitterMonitor
     */
    select?: TwitterMonitorSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TwitterMonitor
     */
    omit?: TwitterMonitorOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TwitterMonitorInclude<ExtArgs> | null
    /**
     * The data needed to update a TwitterMonitor.
     */
    data: XOR<TwitterMonitorUpdateInput, TwitterMonitorUncheckedUpdateInput>
    /**
     * Choose, which TwitterMonitor to update.
     */
    where: TwitterMonitorWhereUniqueInput
  }

  /**
   * TwitterMonitor updateMany
   */
  export type TwitterMonitorUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update TwitterMonitors.
     */
    data: XOR<TwitterMonitorUpdateManyMutationInput, TwitterMonitorUncheckedUpdateManyInput>
    /**
     * Filter which TwitterMonitors to update
     */
    where?: TwitterMonitorWhereInput
    /**
     * Limit how many TwitterMonitors to update.
     */
    limit?: number
  }

  /**
   * TwitterMonitor updateManyAndReturn
   */
  export type TwitterMonitorUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TwitterMonitor
     */
    select?: TwitterMonitorSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the TwitterMonitor
     */
    omit?: TwitterMonitorOmit<ExtArgs> | null
    /**
     * The data used to update TwitterMonitors.
     */
    data: XOR<TwitterMonitorUpdateManyMutationInput, TwitterMonitorUncheckedUpdateManyInput>
    /**
     * Filter which TwitterMonitors to update
     */
    where?: TwitterMonitorWhereInput
    /**
     * Limit how many TwitterMonitors to update.
     */
    limit?: number
  }

  /**
   * TwitterMonitor upsert
   */
  export type TwitterMonitorUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TwitterMonitor
     */
    select?: TwitterMonitorSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TwitterMonitor
     */
    omit?: TwitterMonitorOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TwitterMonitorInclude<ExtArgs> | null
    /**
     * The filter to search for the TwitterMonitor to update in case it exists.
     */
    where: TwitterMonitorWhereUniqueInput
    /**
     * In case the TwitterMonitor found by the `where` argument doesn't exist, create a new TwitterMonitor with this data.
     */
    create: XOR<TwitterMonitorCreateInput, TwitterMonitorUncheckedCreateInput>
    /**
     * In case the TwitterMonitor was found with the provided `where` argument, update it with this data.
     */
    update: XOR<TwitterMonitorUpdateInput, TwitterMonitorUncheckedUpdateInput>
  }

  /**
   * TwitterMonitor delete
   */
  export type TwitterMonitorDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TwitterMonitor
     */
    select?: TwitterMonitorSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TwitterMonitor
     */
    omit?: TwitterMonitorOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TwitterMonitorInclude<ExtArgs> | null
    /**
     * Filter which TwitterMonitor to delete.
     */
    where: TwitterMonitorWhereUniqueInput
  }

  /**
   * TwitterMonitor deleteMany
   */
  export type TwitterMonitorDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which TwitterMonitors to delete
     */
    where?: TwitterMonitorWhereInput
    /**
     * Limit how many TwitterMonitors to delete.
     */
    limit?: number
  }

  /**
   * TwitterMonitor.tweets
   */
  export type TwitterMonitor$tweetsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TweetRecord
     */
    select?: TweetRecordSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TweetRecord
     */
    omit?: TweetRecordOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TweetRecordInclude<ExtArgs> | null
    where?: TweetRecordWhereInput
    orderBy?: TweetRecordOrderByWithRelationInput | TweetRecordOrderByWithRelationInput[]
    cursor?: TweetRecordWhereUniqueInput
    take?: number
    skip?: number
    distinct?: TweetRecordScalarFieldEnum | TweetRecordScalarFieldEnum[]
  }

  /**
   * TwitterMonitor without action
   */
  export type TwitterMonitorDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TwitterMonitor
     */
    select?: TwitterMonitorSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TwitterMonitor
     */
    omit?: TwitterMonitorOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TwitterMonitorInclude<ExtArgs> | null
  }


  /**
   * Model TweetRecord
   */

  export type AggregateTweetRecord = {
    _count: TweetRecordCountAggregateOutputType | null
    _min: TweetRecordMinAggregateOutputType | null
    _max: TweetRecordMaxAggregateOutputType | null
  }

  export type TweetRecordMinAggregateOutputType = {
    id: string | null
    monitorId: string | null
    text: string | null
    createdAt: Date | null
    notifiedAt: Date | null
  }

  export type TweetRecordMaxAggregateOutputType = {
    id: string | null
    monitorId: string | null
    text: string | null
    createdAt: Date | null
    notifiedAt: Date | null
  }

  export type TweetRecordCountAggregateOutputType = {
    id: number
    monitorId: number
    text: number
    createdAt: number
    notifiedAt: number
    metrics: number
    mediaUrls: number
    _all: number
  }


  export type TweetRecordMinAggregateInputType = {
    id?: true
    monitorId?: true
    text?: true
    createdAt?: true
    notifiedAt?: true
  }

  export type TweetRecordMaxAggregateInputType = {
    id?: true
    monitorId?: true
    text?: true
    createdAt?: true
    notifiedAt?: true
  }

  export type TweetRecordCountAggregateInputType = {
    id?: true
    monitorId?: true
    text?: true
    createdAt?: true
    notifiedAt?: true
    metrics?: true
    mediaUrls?: true
    _all?: true
  }

  export type TweetRecordAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which TweetRecord to aggregate.
     */
    where?: TweetRecordWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of TweetRecords to fetch.
     */
    orderBy?: TweetRecordOrderByWithRelationInput | TweetRecordOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: TweetRecordWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` TweetRecords from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` TweetRecords.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned TweetRecords
    **/
    _count?: true | TweetRecordCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: TweetRecordMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: TweetRecordMaxAggregateInputType
  }

  export type GetTweetRecordAggregateType<T extends TweetRecordAggregateArgs> = {
        [P in keyof T & keyof AggregateTweetRecord]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateTweetRecord[P]>
      : GetScalarType<T[P], AggregateTweetRecord[P]>
  }




  export type TweetRecordGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: TweetRecordWhereInput
    orderBy?: TweetRecordOrderByWithAggregationInput | TweetRecordOrderByWithAggregationInput[]
    by: TweetRecordScalarFieldEnum[] | TweetRecordScalarFieldEnum
    having?: TweetRecordScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: TweetRecordCountAggregateInputType | true
    _min?: TweetRecordMinAggregateInputType
    _max?: TweetRecordMaxAggregateInputType
  }

  export type TweetRecordGroupByOutputType = {
    id: string
    monitorId: string
    text: string
    createdAt: Date
    notifiedAt: Date
    metrics: JsonValue
    mediaUrls: string[]
    _count: TweetRecordCountAggregateOutputType | null
    _min: TweetRecordMinAggregateOutputType | null
    _max: TweetRecordMaxAggregateOutputType | null
  }

  type GetTweetRecordGroupByPayload<T extends TweetRecordGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<TweetRecordGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof TweetRecordGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], TweetRecordGroupByOutputType[P]>
            : GetScalarType<T[P], TweetRecordGroupByOutputType[P]>
        }
      >
    >


  export type TweetRecordSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    monitorId?: boolean
    text?: boolean
    createdAt?: boolean
    notifiedAt?: boolean
    metrics?: boolean
    mediaUrls?: boolean
    twitterMonitor?: boolean | TwitterMonitorDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["tweetRecord"]>

  export type TweetRecordSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    monitorId?: boolean
    text?: boolean
    createdAt?: boolean
    notifiedAt?: boolean
    metrics?: boolean
    mediaUrls?: boolean
    twitterMonitor?: boolean | TwitterMonitorDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["tweetRecord"]>

  export type TweetRecordSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    monitorId?: boolean
    text?: boolean
    createdAt?: boolean
    notifiedAt?: boolean
    metrics?: boolean
    mediaUrls?: boolean
    twitterMonitor?: boolean | TwitterMonitorDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["tweetRecord"]>

  export type TweetRecordSelectScalar = {
    id?: boolean
    monitorId?: boolean
    text?: boolean
    createdAt?: boolean
    notifiedAt?: boolean
    metrics?: boolean
    mediaUrls?: boolean
  }

  export type TweetRecordOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "monitorId" | "text" | "createdAt" | "notifiedAt" | "metrics" | "mediaUrls", ExtArgs["result"]["tweetRecord"]>
  export type TweetRecordInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    twitterMonitor?: boolean | TwitterMonitorDefaultArgs<ExtArgs>
  }
  export type TweetRecordIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    twitterMonitor?: boolean | TwitterMonitorDefaultArgs<ExtArgs>
  }
  export type TweetRecordIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    twitterMonitor?: boolean | TwitterMonitorDefaultArgs<ExtArgs>
  }

  export type $TweetRecordPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "TweetRecord"
    objects: {
      twitterMonitor: Prisma.$TwitterMonitorPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      monitorId: string
      text: string
      createdAt: Date
      notifiedAt: Date
      metrics: Prisma.JsonValue
      mediaUrls: string[]
    }, ExtArgs["result"]["tweetRecord"]>
    composites: {}
  }

  type TweetRecordGetPayload<S extends boolean | null | undefined | TweetRecordDefaultArgs> = $Result.GetResult<Prisma.$TweetRecordPayload, S>

  type TweetRecordCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<TweetRecordFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: TweetRecordCountAggregateInputType | true
    }

  export interface TweetRecordDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['TweetRecord'], meta: { name: 'TweetRecord' } }
    /**
     * Find zero or one TweetRecord that matches the filter.
     * @param {TweetRecordFindUniqueArgs} args - Arguments to find a TweetRecord
     * @example
     * // Get one TweetRecord
     * const tweetRecord = await prisma.tweetRecord.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends TweetRecordFindUniqueArgs>(args: SelectSubset<T, TweetRecordFindUniqueArgs<ExtArgs>>): Prisma__TweetRecordClient<$Result.GetResult<Prisma.$TweetRecordPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one TweetRecord that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {TweetRecordFindUniqueOrThrowArgs} args - Arguments to find a TweetRecord
     * @example
     * // Get one TweetRecord
     * const tweetRecord = await prisma.tweetRecord.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends TweetRecordFindUniqueOrThrowArgs>(args: SelectSubset<T, TweetRecordFindUniqueOrThrowArgs<ExtArgs>>): Prisma__TweetRecordClient<$Result.GetResult<Prisma.$TweetRecordPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first TweetRecord that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TweetRecordFindFirstArgs} args - Arguments to find a TweetRecord
     * @example
     * // Get one TweetRecord
     * const tweetRecord = await prisma.tweetRecord.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends TweetRecordFindFirstArgs>(args?: SelectSubset<T, TweetRecordFindFirstArgs<ExtArgs>>): Prisma__TweetRecordClient<$Result.GetResult<Prisma.$TweetRecordPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first TweetRecord that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TweetRecordFindFirstOrThrowArgs} args - Arguments to find a TweetRecord
     * @example
     * // Get one TweetRecord
     * const tweetRecord = await prisma.tweetRecord.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends TweetRecordFindFirstOrThrowArgs>(args?: SelectSubset<T, TweetRecordFindFirstOrThrowArgs<ExtArgs>>): Prisma__TweetRecordClient<$Result.GetResult<Prisma.$TweetRecordPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more TweetRecords that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TweetRecordFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all TweetRecords
     * const tweetRecords = await prisma.tweetRecord.findMany()
     * 
     * // Get first 10 TweetRecords
     * const tweetRecords = await prisma.tweetRecord.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const tweetRecordWithIdOnly = await prisma.tweetRecord.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends TweetRecordFindManyArgs>(args?: SelectSubset<T, TweetRecordFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TweetRecordPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a TweetRecord.
     * @param {TweetRecordCreateArgs} args - Arguments to create a TweetRecord.
     * @example
     * // Create one TweetRecord
     * const TweetRecord = await prisma.tweetRecord.create({
     *   data: {
     *     // ... data to create a TweetRecord
     *   }
     * })
     * 
     */
    create<T extends TweetRecordCreateArgs>(args: SelectSubset<T, TweetRecordCreateArgs<ExtArgs>>): Prisma__TweetRecordClient<$Result.GetResult<Prisma.$TweetRecordPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many TweetRecords.
     * @param {TweetRecordCreateManyArgs} args - Arguments to create many TweetRecords.
     * @example
     * // Create many TweetRecords
     * const tweetRecord = await prisma.tweetRecord.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends TweetRecordCreateManyArgs>(args?: SelectSubset<T, TweetRecordCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many TweetRecords and returns the data saved in the database.
     * @param {TweetRecordCreateManyAndReturnArgs} args - Arguments to create many TweetRecords.
     * @example
     * // Create many TweetRecords
     * const tweetRecord = await prisma.tweetRecord.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many TweetRecords and only return the `id`
     * const tweetRecordWithIdOnly = await prisma.tweetRecord.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends TweetRecordCreateManyAndReturnArgs>(args?: SelectSubset<T, TweetRecordCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TweetRecordPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a TweetRecord.
     * @param {TweetRecordDeleteArgs} args - Arguments to delete one TweetRecord.
     * @example
     * // Delete one TweetRecord
     * const TweetRecord = await prisma.tweetRecord.delete({
     *   where: {
     *     // ... filter to delete one TweetRecord
     *   }
     * })
     * 
     */
    delete<T extends TweetRecordDeleteArgs>(args: SelectSubset<T, TweetRecordDeleteArgs<ExtArgs>>): Prisma__TweetRecordClient<$Result.GetResult<Prisma.$TweetRecordPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one TweetRecord.
     * @param {TweetRecordUpdateArgs} args - Arguments to update one TweetRecord.
     * @example
     * // Update one TweetRecord
     * const tweetRecord = await prisma.tweetRecord.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends TweetRecordUpdateArgs>(args: SelectSubset<T, TweetRecordUpdateArgs<ExtArgs>>): Prisma__TweetRecordClient<$Result.GetResult<Prisma.$TweetRecordPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more TweetRecords.
     * @param {TweetRecordDeleteManyArgs} args - Arguments to filter TweetRecords to delete.
     * @example
     * // Delete a few TweetRecords
     * const { count } = await prisma.tweetRecord.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends TweetRecordDeleteManyArgs>(args?: SelectSubset<T, TweetRecordDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more TweetRecords.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TweetRecordUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many TweetRecords
     * const tweetRecord = await prisma.tweetRecord.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends TweetRecordUpdateManyArgs>(args: SelectSubset<T, TweetRecordUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more TweetRecords and returns the data updated in the database.
     * @param {TweetRecordUpdateManyAndReturnArgs} args - Arguments to update many TweetRecords.
     * @example
     * // Update many TweetRecords
     * const tweetRecord = await prisma.tweetRecord.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more TweetRecords and only return the `id`
     * const tweetRecordWithIdOnly = await prisma.tweetRecord.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends TweetRecordUpdateManyAndReturnArgs>(args: SelectSubset<T, TweetRecordUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TweetRecordPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one TweetRecord.
     * @param {TweetRecordUpsertArgs} args - Arguments to update or create a TweetRecord.
     * @example
     * // Update or create a TweetRecord
     * const tweetRecord = await prisma.tweetRecord.upsert({
     *   create: {
     *     // ... data to create a TweetRecord
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the TweetRecord we want to update
     *   }
     * })
     */
    upsert<T extends TweetRecordUpsertArgs>(args: SelectSubset<T, TweetRecordUpsertArgs<ExtArgs>>): Prisma__TweetRecordClient<$Result.GetResult<Prisma.$TweetRecordPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of TweetRecords.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TweetRecordCountArgs} args - Arguments to filter TweetRecords to count.
     * @example
     * // Count the number of TweetRecords
     * const count = await prisma.tweetRecord.count({
     *   where: {
     *     // ... the filter for the TweetRecords we want to count
     *   }
     * })
    **/
    count<T extends TweetRecordCountArgs>(
      args?: Subset<T, TweetRecordCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], TweetRecordCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a TweetRecord.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TweetRecordAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends TweetRecordAggregateArgs>(args: Subset<T, TweetRecordAggregateArgs>): Prisma.PrismaPromise<GetTweetRecordAggregateType<T>>

    /**
     * Group by TweetRecord.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TweetRecordGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends TweetRecordGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: TweetRecordGroupByArgs['orderBy'] }
        : { orderBy?: TweetRecordGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, TweetRecordGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetTweetRecordGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the TweetRecord model
   */
  readonly fields: TweetRecordFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for TweetRecord.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__TweetRecordClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    twitterMonitor<T extends TwitterMonitorDefaultArgs<ExtArgs> = {}>(args?: Subset<T, TwitterMonitorDefaultArgs<ExtArgs>>): Prisma__TwitterMonitorClient<$Result.GetResult<Prisma.$TwitterMonitorPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the TweetRecord model
   */
  interface TweetRecordFieldRefs {
    readonly id: FieldRef<"TweetRecord", 'String'>
    readonly monitorId: FieldRef<"TweetRecord", 'String'>
    readonly text: FieldRef<"TweetRecord", 'String'>
    readonly createdAt: FieldRef<"TweetRecord", 'DateTime'>
    readonly notifiedAt: FieldRef<"TweetRecord", 'DateTime'>
    readonly metrics: FieldRef<"TweetRecord", 'Json'>
    readonly mediaUrls: FieldRef<"TweetRecord", 'String[]'>
  }
    

  // Custom InputTypes
  /**
   * TweetRecord findUnique
   */
  export type TweetRecordFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TweetRecord
     */
    select?: TweetRecordSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TweetRecord
     */
    omit?: TweetRecordOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TweetRecordInclude<ExtArgs> | null
    /**
     * Filter, which TweetRecord to fetch.
     */
    where: TweetRecordWhereUniqueInput
  }

  /**
   * TweetRecord findUniqueOrThrow
   */
  export type TweetRecordFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TweetRecord
     */
    select?: TweetRecordSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TweetRecord
     */
    omit?: TweetRecordOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TweetRecordInclude<ExtArgs> | null
    /**
     * Filter, which TweetRecord to fetch.
     */
    where: TweetRecordWhereUniqueInput
  }

  /**
   * TweetRecord findFirst
   */
  export type TweetRecordFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TweetRecord
     */
    select?: TweetRecordSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TweetRecord
     */
    omit?: TweetRecordOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TweetRecordInclude<ExtArgs> | null
    /**
     * Filter, which TweetRecord to fetch.
     */
    where?: TweetRecordWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of TweetRecords to fetch.
     */
    orderBy?: TweetRecordOrderByWithRelationInput | TweetRecordOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for TweetRecords.
     */
    cursor?: TweetRecordWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` TweetRecords from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` TweetRecords.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of TweetRecords.
     */
    distinct?: TweetRecordScalarFieldEnum | TweetRecordScalarFieldEnum[]
  }

  /**
   * TweetRecord findFirstOrThrow
   */
  export type TweetRecordFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TweetRecord
     */
    select?: TweetRecordSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TweetRecord
     */
    omit?: TweetRecordOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TweetRecordInclude<ExtArgs> | null
    /**
     * Filter, which TweetRecord to fetch.
     */
    where?: TweetRecordWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of TweetRecords to fetch.
     */
    orderBy?: TweetRecordOrderByWithRelationInput | TweetRecordOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for TweetRecords.
     */
    cursor?: TweetRecordWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` TweetRecords from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` TweetRecords.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of TweetRecords.
     */
    distinct?: TweetRecordScalarFieldEnum | TweetRecordScalarFieldEnum[]
  }

  /**
   * TweetRecord findMany
   */
  export type TweetRecordFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TweetRecord
     */
    select?: TweetRecordSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TweetRecord
     */
    omit?: TweetRecordOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TweetRecordInclude<ExtArgs> | null
    /**
     * Filter, which TweetRecords to fetch.
     */
    where?: TweetRecordWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of TweetRecords to fetch.
     */
    orderBy?: TweetRecordOrderByWithRelationInput | TweetRecordOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing TweetRecords.
     */
    cursor?: TweetRecordWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` TweetRecords from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` TweetRecords.
     */
    skip?: number
    distinct?: TweetRecordScalarFieldEnum | TweetRecordScalarFieldEnum[]
  }

  /**
   * TweetRecord create
   */
  export type TweetRecordCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TweetRecord
     */
    select?: TweetRecordSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TweetRecord
     */
    omit?: TweetRecordOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TweetRecordInclude<ExtArgs> | null
    /**
     * The data needed to create a TweetRecord.
     */
    data: XOR<TweetRecordCreateInput, TweetRecordUncheckedCreateInput>
  }

  /**
   * TweetRecord createMany
   */
  export type TweetRecordCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many TweetRecords.
     */
    data: TweetRecordCreateManyInput | TweetRecordCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * TweetRecord createManyAndReturn
   */
  export type TweetRecordCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TweetRecord
     */
    select?: TweetRecordSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the TweetRecord
     */
    omit?: TweetRecordOmit<ExtArgs> | null
    /**
     * The data used to create many TweetRecords.
     */
    data: TweetRecordCreateManyInput | TweetRecordCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TweetRecordIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * TweetRecord update
   */
  export type TweetRecordUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TweetRecord
     */
    select?: TweetRecordSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TweetRecord
     */
    omit?: TweetRecordOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TweetRecordInclude<ExtArgs> | null
    /**
     * The data needed to update a TweetRecord.
     */
    data: XOR<TweetRecordUpdateInput, TweetRecordUncheckedUpdateInput>
    /**
     * Choose, which TweetRecord to update.
     */
    where: TweetRecordWhereUniqueInput
  }

  /**
   * TweetRecord updateMany
   */
  export type TweetRecordUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update TweetRecords.
     */
    data: XOR<TweetRecordUpdateManyMutationInput, TweetRecordUncheckedUpdateManyInput>
    /**
     * Filter which TweetRecords to update
     */
    where?: TweetRecordWhereInput
    /**
     * Limit how many TweetRecords to update.
     */
    limit?: number
  }

  /**
   * TweetRecord updateManyAndReturn
   */
  export type TweetRecordUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TweetRecord
     */
    select?: TweetRecordSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the TweetRecord
     */
    omit?: TweetRecordOmit<ExtArgs> | null
    /**
     * The data used to update TweetRecords.
     */
    data: XOR<TweetRecordUpdateManyMutationInput, TweetRecordUncheckedUpdateManyInput>
    /**
     * Filter which TweetRecords to update
     */
    where?: TweetRecordWhereInput
    /**
     * Limit how many TweetRecords to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TweetRecordIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * TweetRecord upsert
   */
  export type TweetRecordUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TweetRecord
     */
    select?: TweetRecordSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TweetRecord
     */
    omit?: TweetRecordOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TweetRecordInclude<ExtArgs> | null
    /**
     * The filter to search for the TweetRecord to update in case it exists.
     */
    where: TweetRecordWhereUniqueInput
    /**
     * In case the TweetRecord found by the `where` argument doesn't exist, create a new TweetRecord with this data.
     */
    create: XOR<TweetRecordCreateInput, TweetRecordUncheckedCreateInput>
    /**
     * In case the TweetRecord was found with the provided `where` argument, update it with this data.
     */
    update: XOR<TweetRecordUpdateInput, TweetRecordUncheckedUpdateInput>
  }

  /**
   * TweetRecord delete
   */
  export type TweetRecordDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TweetRecord
     */
    select?: TweetRecordSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TweetRecord
     */
    omit?: TweetRecordOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TweetRecordInclude<ExtArgs> | null
    /**
     * Filter which TweetRecord to delete.
     */
    where: TweetRecordWhereUniqueInput
  }

  /**
   * TweetRecord deleteMany
   */
  export type TweetRecordDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which TweetRecords to delete
     */
    where?: TweetRecordWhereInput
    /**
     * Limit how many TweetRecords to delete.
     */
    limit?: number
  }

  /**
   * TweetRecord without action
   */
  export type TweetRecordDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TweetRecord
     */
    select?: TweetRecordSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TweetRecord
     */
    omit?: TweetRecordOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TweetRecordInclude<ExtArgs> | null
  }


  /**
   * Enums
   */

  export const TransactionIsolationLevel: {
    ReadUncommitted: 'ReadUncommitted',
    ReadCommitted: 'ReadCommitted',
    RepeatableRead: 'RepeatableRead',
    Serializable: 'Serializable'
  };

  export type TransactionIsolationLevel = (typeof TransactionIsolationLevel)[keyof typeof TransactionIsolationLevel]


  export const TwitterMonitorScalarFieldEnum: {
    id: 'id',
    username: 'username',
    chatId: 'chatId',
    lastCheckedAt: 'lastCheckedAt',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type TwitterMonitorScalarFieldEnum = (typeof TwitterMonitorScalarFieldEnum)[keyof typeof TwitterMonitorScalarFieldEnum]


  export const TweetRecordScalarFieldEnum: {
    id: 'id',
    monitorId: 'monitorId',
    text: 'text',
    createdAt: 'createdAt',
    notifiedAt: 'notifiedAt',
    metrics: 'metrics',
    mediaUrls: 'mediaUrls'
  };

  export type TweetRecordScalarFieldEnum = (typeof TweetRecordScalarFieldEnum)[keyof typeof TweetRecordScalarFieldEnum]


  export const SortOrder: {
    asc: 'asc',
    desc: 'desc'
  };

  export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder]


  export const JsonNullValueInput: {
    JsonNull: typeof JsonNull
  };

  export type JsonNullValueInput = (typeof JsonNullValueInput)[keyof typeof JsonNullValueInput]


  export const QueryMode: {
    default: 'default',
    insensitive: 'insensitive'
  };

  export type QueryMode = (typeof QueryMode)[keyof typeof QueryMode]


  export const JsonNullValueFilter: {
    DbNull: typeof DbNull,
    JsonNull: typeof JsonNull,
    AnyNull: typeof AnyNull
  };

  export type JsonNullValueFilter = (typeof JsonNullValueFilter)[keyof typeof JsonNullValueFilter]


  /**
   * Field references
   */


  /**
   * Reference to a field of type 'String'
   */
  export type StringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String'>
    


  /**
   * Reference to a field of type 'String[]'
   */
  export type ListStringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String[]'>
    


  /**
   * Reference to a field of type 'DateTime'
   */
  export type DateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime'>
    


  /**
   * Reference to a field of type 'DateTime[]'
   */
  export type ListDateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime[]'>
    


  /**
   * Reference to a field of type 'Json'
   */
  export type JsonFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Json'>
    


  /**
   * Reference to a field of type 'QueryMode'
   */
  export type EnumQueryModeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'QueryMode'>
    


  /**
   * Reference to a field of type 'Int'
   */
  export type IntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int'>
    


  /**
   * Reference to a field of type 'Int[]'
   */
  export type ListIntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int[]'>
    
  /**
   * Deep Input Types
   */


  export type TwitterMonitorWhereInput = {
    AND?: TwitterMonitorWhereInput | TwitterMonitorWhereInput[]
    OR?: TwitterMonitorWhereInput[]
    NOT?: TwitterMonitorWhereInput | TwitterMonitorWhereInput[]
    id?: StringFilter<"TwitterMonitor"> | string
    username?: StringFilter<"TwitterMonitor"> | string
    chatId?: StringFilter<"TwitterMonitor"> | string
    lastCheckedAt?: DateTimeFilter<"TwitterMonitor"> | Date | string
    createdAt?: DateTimeFilter<"TwitterMonitor"> | Date | string
    updatedAt?: DateTimeFilter<"TwitterMonitor"> | Date | string
    tweets?: TweetRecordListRelationFilter
  }

  export type TwitterMonitorOrderByWithRelationInput = {
    id?: SortOrder
    username?: SortOrder
    chatId?: SortOrder
    lastCheckedAt?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    tweets?: TweetRecordOrderByRelationAggregateInput
  }

  export type TwitterMonitorWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    username?: string
    AND?: TwitterMonitorWhereInput | TwitterMonitorWhereInput[]
    OR?: TwitterMonitorWhereInput[]
    NOT?: TwitterMonitorWhereInput | TwitterMonitorWhereInput[]
    chatId?: StringFilter<"TwitterMonitor"> | string
    lastCheckedAt?: DateTimeFilter<"TwitterMonitor"> | Date | string
    createdAt?: DateTimeFilter<"TwitterMonitor"> | Date | string
    updatedAt?: DateTimeFilter<"TwitterMonitor"> | Date | string
    tweets?: TweetRecordListRelationFilter
  }, "id" | "username">

  export type TwitterMonitorOrderByWithAggregationInput = {
    id?: SortOrder
    username?: SortOrder
    chatId?: SortOrder
    lastCheckedAt?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: TwitterMonitorCountOrderByAggregateInput
    _max?: TwitterMonitorMaxOrderByAggregateInput
    _min?: TwitterMonitorMinOrderByAggregateInput
  }

  export type TwitterMonitorScalarWhereWithAggregatesInput = {
    AND?: TwitterMonitorScalarWhereWithAggregatesInput | TwitterMonitorScalarWhereWithAggregatesInput[]
    OR?: TwitterMonitorScalarWhereWithAggregatesInput[]
    NOT?: TwitterMonitorScalarWhereWithAggregatesInput | TwitterMonitorScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"TwitterMonitor"> | string
    username?: StringWithAggregatesFilter<"TwitterMonitor"> | string
    chatId?: StringWithAggregatesFilter<"TwitterMonitor"> | string
    lastCheckedAt?: DateTimeWithAggregatesFilter<"TwitterMonitor"> | Date | string
    createdAt?: DateTimeWithAggregatesFilter<"TwitterMonitor"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"TwitterMonitor"> | Date | string
  }

  export type TweetRecordWhereInput = {
    AND?: TweetRecordWhereInput | TweetRecordWhereInput[]
    OR?: TweetRecordWhereInput[]
    NOT?: TweetRecordWhereInput | TweetRecordWhereInput[]
    id?: StringFilter<"TweetRecord"> | string
    monitorId?: StringFilter<"TweetRecord"> | string
    text?: StringFilter<"TweetRecord"> | string
    createdAt?: DateTimeFilter<"TweetRecord"> | Date | string
    notifiedAt?: DateTimeFilter<"TweetRecord"> | Date | string
    metrics?: JsonFilter<"TweetRecord">
    mediaUrls?: StringNullableListFilter<"TweetRecord">
    twitterMonitor?: XOR<TwitterMonitorScalarRelationFilter, TwitterMonitorWhereInput>
  }

  export type TweetRecordOrderByWithRelationInput = {
    id?: SortOrder
    monitorId?: SortOrder
    text?: SortOrder
    createdAt?: SortOrder
    notifiedAt?: SortOrder
    metrics?: SortOrder
    mediaUrls?: SortOrder
    twitterMonitor?: TwitterMonitorOrderByWithRelationInput
  }

  export type TweetRecordWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: TweetRecordWhereInput | TweetRecordWhereInput[]
    OR?: TweetRecordWhereInput[]
    NOT?: TweetRecordWhereInput | TweetRecordWhereInput[]
    monitorId?: StringFilter<"TweetRecord"> | string
    text?: StringFilter<"TweetRecord"> | string
    createdAt?: DateTimeFilter<"TweetRecord"> | Date | string
    notifiedAt?: DateTimeFilter<"TweetRecord"> | Date | string
    metrics?: JsonFilter<"TweetRecord">
    mediaUrls?: StringNullableListFilter<"TweetRecord">
    twitterMonitor?: XOR<TwitterMonitorScalarRelationFilter, TwitterMonitorWhereInput>
  }, "id">

  export type TweetRecordOrderByWithAggregationInput = {
    id?: SortOrder
    monitorId?: SortOrder
    text?: SortOrder
    createdAt?: SortOrder
    notifiedAt?: SortOrder
    metrics?: SortOrder
    mediaUrls?: SortOrder
    _count?: TweetRecordCountOrderByAggregateInput
    _max?: TweetRecordMaxOrderByAggregateInput
    _min?: TweetRecordMinOrderByAggregateInput
  }

  export type TweetRecordScalarWhereWithAggregatesInput = {
    AND?: TweetRecordScalarWhereWithAggregatesInput | TweetRecordScalarWhereWithAggregatesInput[]
    OR?: TweetRecordScalarWhereWithAggregatesInput[]
    NOT?: TweetRecordScalarWhereWithAggregatesInput | TweetRecordScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"TweetRecord"> | string
    monitorId?: StringWithAggregatesFilter<"TweetRecord"> | string
    text?: StringWithAggregatesFilter<"TweetRecord"> | string
    createdAt?: DateTimeWithAggregatesFilter<"TweetRecord"> | Date | string
    notifiedAt?: DateTimeWithAggregatesFilter<"TweetRecord"> | Date | string
    metrics?: JsonWithAggregatesFilter<"TweetRecord">
    mediaUrls?: StringNullableListFilter<"TweetRecord">
  }

  export type TwitterMonitorCreateInput = {
    id?: string
    username: string
    chatId: string
    lastCheckedAt?: Date | string
    createdAt?: Date | string
    updatedAt?: Date | string
    tweets?: TweetRecordCreateNestedManyWithoutTwitterMonitorInput
  }

  export type TwitterMonitorUncheckedCreateInput = {
    id?: string
    username: string
    chatId: string
    lastCheckedAt?: Date | string
    createdAt?: Date | string
    updatedAt?: Date | string
    tweets?: TweetRecordUncheckedCreateNestedManyWithoutTwitterMonitorInput
  }

  export type TwitterMonitorUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    chatId?: StringFieldUpdateOperationsInput | string
    lastCheckedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    tweets?: TweetRecordUpdateManyWithoutTwitterMonitorNestedInput
  }

  export type TwitterMonitorUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    chatId?: StringFieldUpdateOperationsInput | string
    lastCheckedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    tweets?: TweetRecordUncheckedUpdateManyWithoutTwitterMonitorNestedInput
  }

  export type TwitterMonitorCreateManyInput = {
    id?: string
    username: string
    chatId: string
    lastCheckedAt?: Date | string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type TwitterMonitorUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    chatId?: StringFieldUpdateOperationsInput | string
    lastCheckedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TwitterMonitorUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    chatId?: StringFieldUpdateOperationsInput | string
    lastCheckedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TweetRecordCreateInput = {
    id: string
    text: string
    createdAt: Date | string
    notifiedAt?: Date | string
    metrics: JsonNullValueInput | InputJsonValue
    mediaUrls?: TweetRecordCreatemediaUrlsInput | string[]
    twitterMonitor: TwitterMonitorCreateNestedOneWithoutTweetsInput
  }

  export type TweetRecordUncheckedCreateInput = {
    id: string
    monitorId: string
    text: string
    createdAt: Date | string
    notifiedAt?: Date | string
    metrics: JsonNullValueInput | InputJsonValue
    mediaUrls?: TweetRecordCreatemediaUrlsInput | string[]
  }

  export type TweetRecordUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    text?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    notifiedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    metrics?: JsonNullValueInput | InputJsonValue
    mediaUrls?: TweetRecordUpdatemediaUrlsInput | string[]
    twitterMonitor?: TwitterMonitorUpdateOneRequiredWithoutTweetsNestedInput
  }

  export type TweetRecordUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    monitorId?: StringFieldUpdateOperationsInput | string
    text?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    notifiedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    metrics?: JsonNullValueInput | InputJsonValue
    mediaUrls?: TweetRecordUpdatemediaUrlsInput | string[]
  }

  export type TweetRecordCreateManyInput = {
    id: string
    monitorId: string
    text: string
    createdAt: Date | string
    notifiedAt?: Date | string
    metrics: JsonNullValueInput | InputJsonValue
    mediaUrls?: TweetRecordCreatemediaUrlsInput | string[]
  }

  export type TweetRecordUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    text?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    notifiedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    metrics?: JsonNullValueInput | InputJsonValue
    mediaUrls?: TweetRecordUpdatemediaUrlsInput | string[]
  }

  export type TweetRecordUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    monitorId?: StringFieldUpdateOperationsInput | string
    text?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    notifiedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    metrics?: JsonNullValueInput | InputJsonValue
    mediaUrls?: TweetRecordUpdatemediaUrlsInput | string[]
  }

  export type StringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type DateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type TweetRecordListRelationFilter = {
    every?: TweetRecordWhereInput
    some?: TweetRecordWhereInput
    none?: TweetRecordWhereInput
  }

  export type TweetRecordOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type TwitterMonitorCountOrderByAggregateInput = {
    id?: SortOrder
    username?: SortOrder
    chatId?: SortOrder
    lastCheckedAt?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type TwitterMonitorMaxOrderByAggregateInput = {
    id?: SortOrder
    username?: SortOrder
    chatId?: SortOrder
    lastCheckedAt?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type TwitterMonitorMinOrderByAggregateInput = {
    id?: SortOrder
    username?: SortOrder
    chatId?: SortOrder
    lastCheckedAt?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type StringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type DateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }
  export type JsonFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<JsonFilterBase<$PrismaModel>>, Exclude<keyof Required<JsonFilterBase<$PrismaModel>>, 'path'>>,
        Required<JsonFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<JsonFilterBase<$PrismaModel>>, 'path'>>

  export type JsonFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
  }

  export type StringNullableListFilter<$PrismaModel = never> = {
    equals?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    has?: string | StringFieldRefInput<$PrismaModel> | null
    hasEvery?: string[] | ListStringFieldRefInput<$PrismaModel>
    hasSome?: string[] | ListStringFieldRefInput<$PrismaModel>
    isEmpty?: boolean
  }

  export type TwitterMonitorScalarRelationFilter = {
    is?: TwitterMonitorWhereInput
    isNot?: TwitterMonitorWhereInput
  }

  export type TweetRecordCountOrderByAggregateInput = {
    id?: SortOrder
    monitorId?: SortOrder
    text?: SortOrder
    createdAt?: SortOrder
    notifiedAt?: SortOrder
    metrics?: SortOrder
    mediaUrls?: SortOrder
  }

  export type TweetRecordMaxOrderByAggregateInput = {
    id?: SortOrder
    monitorId?: SortOrder
    text?: SortOrder
    createdAt?: SortOrder
    notifiedAt?: SortOrder
  }

  export type TweetRecordMinOrderByAggregateInput = {
    id?: SortOrder
    monitorId?: SortOrder
    text?: SortOrder
    createdAt?: SortOrder
    notifiedAt?: SortOrder
  }
  export type JsonWithAggregatesFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<JsonWithAggregatesFilterBase<$PrismaModel>>, Exclude<keyof Required<JsonWithAggregatesFilterBase<$PrismaModel>>, 'path'>>,
        Required<JsonWithAggregatesFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<JsonWithAggregatesFilterBase<$PrismaModel>>, 'path'>>

  export type JsonWithAggregatesFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedJsonFilter<$PrismaModel>
    _max?: NestedJsonFilter<$PrismaModel>
  }

  export type TweetRecordCreateNestedManyWithoutTwitterMonitorInput = {
    create?: XOR<TweetRecordCreateWithoutTwitterMonitorInput, TweetRecordUncheckedCreateWithoutTwitterMonitorInput> | TweetRecordCreateWithoutTwitterMonitorInput[] | TweetRecordUncheckedCreateWithoutTwitterMonitorInput[]
    connectOrCreate?: TweetRecordCreateOrConnectWithoutTwitterMonitorInput | TweetRecordCreateOrConnectWithoutTwitterMonitorInput[]
    createMany?: TweetRecordCreateManyTwitterMonitorInputEnvelope
    connect?: TweetRecordWhereUniqueInput | TweetRecordWhereUniqueInput[]
  }

  export type TweetRecordUncheckedCreateNestedManyWithoutTwitterMonitorInput = {
    create?: XOR<TweetRecordCreateWithoutTwitterMonitorInput, TweetRecordUncheckedCreateWithoutTwitterMonitorInput> | TweetRecordCreateWithoutTwitterMonitorInput[] | TweetRecordUncheckedCreateWithoutTwitterMonitorInput[]
    connectOrCreate?: TweetRecordCreateOrConnectWithoutTwitterMonitorInput | TweetRecordCreateOrConnectWithoutTwitterMonitorInput[]
    createMany?: TweetRecordCreateManyTwitterMonitorInputEnvelope
    connect?: TweetRecordWhereUniqueInput | TweetRecordWhereUniqueInput[]
  }

  export type StringFieldUpdateOperationsInput = {
    set?: string
  }

  export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string
  }

  export type TweetRecordUpdateManyWithoutTwitterMonitorNestedInput = {
    create?: XOR<TweetRecordCreateWithoutTwitterMonitorInput, TweetRecordUncheckedCreateWithoutTwitterMonitorInput> | TweetRecordCreateWithoutTwitterMonitorInput[] | TweetRecordUncheckedCreateWithoutTwitterMonitorInput[]
    connectOrCreate?: TweetRecordCreateOrConnectWithoutTwitterMonitorInput | TweetRecordCreateOrConnectWithoutTwitterMonitorInput[]
    upsert?: TweetRecordUpsertWithWhereUniqueWithoutTwitterMonitorInput | TweetRecordUpsertWithWhereUniqueWithoutTwitterMonitorInput[]
    createMany?: TweetRecordCreateManyTwitterMonitorInputEnvelope
    set?: TweetRecordWhereUniqueInput | TweetRecordWhereUniqueInput[]
    disconnect?: TweetRecordWhereUniqueInput | TweetRecordWhereUniqueInput[]
    delete?: TweetRecordWhereUniqueInput | TweetRecordWhereUniqueInput[]
    connect?: TweetRecordWhereUniqueInput | TweetRecordWhereUniqueInput[]
    update?: TweetRecordUpdateWithWhereUniqueWithoutTwitterMonitorInput | TweetRecordUpdateWithWhereUniqueWithoutTwitterMonitorInput[]
    updateMany?: TweetRecordUpdateManyWithWhereWithoutTwitterMonitorInput | TweetRecordUpdateManyWithWhereWithoutTwitterMonitorInput[]
    deleteMany?: TweetRecordScalarWhereInput | TweetRecordScalarWhereInput[]
  }

  export type TweetRecordUncheckedUpdateManyWithoutTwitterMonitorNestedInput = {
    create?: XOR<TweetRecordCreateWithoutTwitterMonitorInput, TweetRecordUncheckedCreateWithoutTwitterMonitorInput> | TweetRecordCreateWithoutTwitterMonitorInput[] | TweetRecordUncheckedCreateWithoutTwitterMonitorInput[]
    connectOrCreate?: TweetRecordCreateOrConnectWithoutTwitterMonitorInput | TweetRecordCreateOrConnectWithoutTwitterMonitorInput[]
    upsert?: TweetRecordUpsertWithWhereUniqueWithoutTwitterMonitorInput | TweetRecordUpsertWithWhereUniqueWithoutTwitterMonitorInput[]
    createMany?: TweetRecordCreateManyTwitterMonitorInputEnvelope
    set?: TweetRecordWhereUniqueInput | TweetRecordWhereUniqueInput[]
    disconnect?: TweetRecordWhereUniqueInput | TweetRecordWhereUniqueInput[]
    delete?: TweetRecordWhereUniqueInput | TweetRecordWhereUniqueInput[]
    connect?: TweetRecordWhereUniqueInput | TweetRecordWhereUniqueInput[]
    update?: TweetRecordUpdateWithWhereUniqueWithoutTwitterMonitorInput | TweetRecordUpdateWithWhereUniqueWithoutTwitterMonitorInput[]
    updateMany?: TweetRecordUpdateManyWithWhereWithoutTwitterMonitorInput | TweetRecordUpdateManyWithWhereWithoutTwitterMonitorInput[]
    deleteMany?: TweetRecordScalarWhereInput | TweetRecordScalarWhereInput[]
  }

  export type TweetRecordCreatemediaUrlsInput = {
    set: string[]
  }

  export type TwitterMonitorCreateNestedOneWithoutTweetsInput = {
    create?: XOR<TwitterMonitorCreateWithoutTweetsInput, TwitterMonitorUncheckedCreateWithoutTweetsInput>
    connectOrCreate?: TwitterMonitorCreateOrConnectWithoutTweetsInput
    connect?: TwitterMonitorWhereUniqueInput
  }

  export type TweetRecordUpdatemediaUrlsInput = {
    set?: string[]
    push?: string | string[]
  }

  export type TwitterMonitorUpdateOneRequiredWithoutTweetsNestedInput = {
    create?: XOR<TwitterMonitorCreateWithoutTweetsInput, TwitterMonitorUncheckedCreateWithoutTweetsInput>
    connectOrCreate?: TwitterMonitorCreateOrConnectWithoutTweetsInput
    upsert?: TwitterMonitorUpsertWithoutTweetsInput
    connect?: TwitterMonitorWhereUniqueInput
    update?: XOR<XOR<TwitterMonitorUpdateToOneWithWhereWithoutTweetsInput, TwitterMonitorUpdateWithoutTweetsInput>, TwitterMonitorUncheckedUpdateWithoutTweetsInput>
  }

  export type NestedStringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type NestedDateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type NestedStringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type NestedIntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type NestedDateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }
  export type NestedJsonFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<NestedJsonFilterBase<$PrismaModel>>, Exclude<keyof Required<NestedJsonFilterBase<$PrismaModel>>, 'path'>>,
        Required<NestedJsonFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<NestedJsonFilterBase<$PrismaModel>>, 'path'>>

  export type NestedJsonFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
  }

  export type TweetRecordCreateWithoutTwitterMonitorInput = {
    id: string
    text: string
    createdAt: Date | string
    notifiedAt?: Date | string
    metrics: JsonNullValueInput | InputJsonValue
    mediaUrls?: TweetRecordCreatemediaUrlsInput | string[]
  }

  export type TweetRecordUncheckedCreateWithoutTwitterMonitorInput = {
    id: string
    text: string
    createdAt: Date | string
    notifiedAt?: Date | string
    metrics: JsonNullValueInput | InputJsonValue
    mediaUrls?: TweetRecordCreatemediaUrlsInput | string[]
  }

  export type TweetRecordCreateOrConnectWithoutTwitterMonitorInput = {
    where: TweetRecordWhereUniqueInput
    create: XOR<TweetRecordCreateWithoutTwitterMonitorInput, TweetRecordUncheckedCreateWithoutTwitterMonitorInput>
  }

  export type TweetRecordCreateManyTwitterMonitorInputEnvelope = {
    data: TweetRecordCreateManyTwitterMonitorInput | TweetRecordCreateManyTwitterMonitorInput[]
    skipDuplicates?: boolean
  }

  export type TweetRecordUpsertWithWhereUniqueWithoutTwitterMonitorInput = {
    where: TweetRecordWhereUniqueInput
    update: XOR<TweetRecordUpdateWithoutTwitterMonitorInput, TweetRecordUncheckedUpdateWithoutTwitterMonitorInput>
    create: XOR<TweetRecordCreateWithoutTwitterMonitorInput, TweetRecordUncheckedCreateWithoutTwitterMonitorInput>
  }

  export type TweetRecordUpdateWithWhereUniqueWithoutTwitterMonitorInput = {
    where: TweetRecordWhereUniqueInput
    data: XOR<TweetRecordUpdateWithoutTwitterMonitorInput, TweetRecordUncheckedUpdateWithoutTwitterMonitorInput>
  }

  export type TweetRecordUpdateManyWithWhereWithoutTwitterMonitorInput = {
    where: TweetRecordScalarWhereInput
    data: XOR<TweetRecordUpdateManyMutationInput, TweetRecordUncheckedUpdateManyWithoutTwitterMonitorInput>
  }

  export type TweetRecordScalarWhereInput = {
    AND?: TweetRecordScalarWhereInput | TweetRecordScalarWhereInput[]
    OR?: TweetRecordScalarWhereInput[]
    NOT?: TweetRecordScalarWhereInput | TweetRecordScalarWhereInput[]
    id?: StringFilter<"TweetRecord"> | string
    monitorId?: StringFilter<"TweetRecord"> | string
    text?: StringFilter<"TweetRecord"> | string
    createdAt?: DateTimeFilter<"TweetRecord"> | Date | string
    notifiedAt?: DateTimeFilter<"TweetRecord"> | Date | string
    metrics?: JsonFilter<"TweetRecord">
    mediaUrls?: StringNullableListFilter<"TweetRecord">
  }

  export type TwitterMonitorCreateWithoutTweetsInput = {
    id?: string
    username: string
    chatId: string
    lastCheckedAt?: Date | string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type TwitterMonitorUncheckedCreateWithoutTweetsInput = {
    id?: string
    username: string
    chatId: string
    lastCheckedAt?: Date | string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type TwitterMonitorCreateOrConnectWithoutTweetsInput = {
    where: TwitterMonitorWhereUniqueInput
    create: XOR<TwitterMonitorCreateWithoutTweetsInput, TwitterMonitorUncheckedCreateWithoutTweetsInput>
  }

  export type TwitterMonitorUpsertWithoutTweetsInput = {
    update: XOR<TwitterMonitorUpdateWithoutTweetsInput, TwitterMonitorUncheckedUpdateWithoutTweetsInput>
    create: XOR<TwitterMonitorCreateWithoutTweetsInput, TwitterMonitorUncheckedCreateWithoutTweetsInput>
    where?: TwitterMonitorWhereInput
  }

  export type TwitterMonitorUpdateToOneWithWhereWithoutTweetsInput = {
    where?: TwitterMonitorWhereInput
    data: XOR<TwitterMonitorUpdateWithoutTweetsInput, TwitterMonitorUncheckedUpdateWithoutTweetsInput>
  }

  export type TwitterMonitorUpdateWithoutTweetsInput = {
    id?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    chatId?: StringFieldUpdateOperationsInput | string
    lastCheckedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TwitterMonitorUncheckedUpdateWithoutTweetsInput = {
    id?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    chatId?: StringFieldUpdateOperationsInput | string
    lastCheckedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TweetRecordCreateManyTwitterMonitorInput = {
    id: string
    text: string
    createdAt: Date | string
    notifiedAt?: Date | string
    metrics: JsonNullValueInput | InputJsonValue
    mediaUrls?: TweetRecordCreatemediaUrlsInput | string[]
  }

  export type TweetRecordUpdateWithoutTwitterMonitorInput = {
    id?: StringFieldUpdateOperationsInput | string
    text?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    notifiedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    metrics?: JsonNullValueInput | InputJsonValue
    mediaUrls?: TweetRecordUpdatemediaUrlsInput | string[]
  }

  export type TweetRecordUncheckedUpdateWithoutTwitterMonitorInput = {
    id?: StringFieldUpdateOperationsInput | string
    text?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    notifiedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    metrics?: JsonNullValueInput | InputJsonValue
    mediaUrls?: TweetRecordUpdatemediaUrlsInput | string[]
  }

  export type TweetRecordUncheckedUpdateManyWithoutTwitterMonitorInput = {
    id?: StringFieldUpdateOperationsInput | string
    text?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    notifiedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    metrics?: JsonNullValueInput | InputJsonValue
    mediaUrls?: TweetRecordUpdatemediaUrlsInput | string[]
  }



  /**
   * Batch Payload for updateMany & deleteMany & createMany
   */

  export type BatchPayload = {
    count: number
  }

  /**
   * DMMF
   */
  export const dmmf: runtime.BaseDMMF
}