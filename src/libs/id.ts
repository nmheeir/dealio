import { customAlphabet } from 'nanoid';

const prefixes = {
  store: 'str',
  product: 'prd',
  category: 'cat',
  subcategory: 'sub',
  cart: 'crt',
  subscription: 'sub',
  payment: 'pay',
  address: 'adr',
  order: 'ord',
  notification: 'not',
};

type GenerateIdOptions = {
  /**
   * The length of the generated ID.
   * @default 16
   * @example 16 => "abc123def456ghi7"
   */
  length?: number;
  /**
   * The separator to use between the prefix and the generated ID.
   * @default "_"
   * @example "_" => "str_abc123"
   */
  separator?: string;
};

/**
 * Generates a unique ID with a given prefix.
 *
 * @param prefix - The prefix to use for the generated ID. It should be a key from `prefixes`.
 * @param options - Options for generating the ID.
 * @param options.length - The length of the random ID portion (default is 12).
 * @param options.separator - The separator between the prefix and the random ID (default is '_').
 *
 * @returns A string containing the prefix (if provided), separator, and a unique random ID.
 *
 * @example
 * generateId("store")
 * // => "str_abc123def456"
 *
 * generateId("store", { length: 8 })
 * // => "str_abc123d"
 *
 * generateId("store", { separator: "-" })
 * // => "str-abc123def456"
 */
export function generateId(
  prefix?: keyof typeof prefixes,
  { length = 12, separator = '_' }: GenerateIdOptions = {},
) {
  const id = customAlphabet(
    '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz',
    length,
  )();
  return prefix ? `${prefixes[prefix]}${separator}${id}` : id;
}
