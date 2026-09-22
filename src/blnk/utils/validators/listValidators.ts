import {ListOptions} from "../../../types/list";

/**
 * Validates `ListOptions`. Same rules Core applies on ledgers/balances
 * (`limit >= 1`, `offset >= 0`), checked before the request is sent.
 * Transactions Core silently falls back on invalid pagination; the SDK
 * still rejects those values with a 400 so caller mistakes stay visible.
 */
export function ValidateListOptions(options?: ListOptions): string | null {
  if (options === undefined) {
    return null;
  }

  if (!options || typeof options !== `object`) {
    return `Data must be a valid object of type ListOptions`;
  }

  if (Object.prototype.hasOwnProperty.call(options, `limit`)) {
    if (typeof options.limit !== `number` || !Number.isInteger(options.limit)) {
      return `limit must be an integer if provided`;
    }
    if (options.limit < 1) {
      return `limit must be at least 1`;
    }
  }

  if (Object.prototype.hasOwnProperty.call(options, `offset`)) {
    if (
      typeof options.offset !== `number` ||
      !Number.isInteger(options.offset)
    ) {
      return `offset must be an integer if provided`;
    }
    if (options.offset < 0) {
      return `offset must be at least 0`;
    }
  }

  return null;
}

/** `?limit=10&offset=20` for set fields, or `""` when nothing is set. */
export function ListOptionsQueryString(options?: ListOptions): string {
  if (!options) {
    return ``;
  }

  const params: string[] = [];
  if (options.limit !== undefined) {
    params.push(`limit=${options.limit}`);
  }
  if (options.offset !== undefined) {
    params.push(`offset=${options.offset}`);
  }
  return params.length > 0 ? `?${params.join(`&`)}` : ``;
}
