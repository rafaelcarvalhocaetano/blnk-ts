export interface BlnkApiErrorDetail {
  code: string;
  message: string;
  details?: unknown;
}

/**
 * Core `error_detail.code` values, mirroring `internal/apierror/codes.go`
 * in Blnk Core 0.15.4. Compare `response.error?.code` — do not branch on
 * message text. Each comment gives the HTTP status Core sends with the code;
 * unlisted codes still pass through.
 *
 * @see https://docs.blnkfinance.com/advanced/error-codes
 */
export const BlnkErrorCode = {
  // GEN

  /** 400, body could not be decoded. */
  GEN_MALFORMED_REQUEST: `GEN_MALFORMED_REQUEST`,
  /** 400. */
  GEN_VALIDATION_ERROR: `GEN_VALIDATION_ERROR`,
  /** 400. */
  GEN_MISSING_PARAMETER: `GEN_MISSING_PARAMETER`,
  /** 400. */
  GEN_BAD_REQUEST: `GEN_BAD_REQUEST`,
  /** 404. */
  GEN_NOT_FOUND: `GEN_NOT_FOUND`,
  /** 409, duplicate GL indicator + currency, or a multi-leg refund that failed part-way (0.15.4+). */
  GEN_CONFLICT: `GEN_CONFLICT`,
  /** 423. */
  GEN_RESOURCE_LOCKED: `GEN_RESOURCE_LOCKED`,
  /** 413. */
  GEN_PAYLOAD_TOO_LARGE: `GEN_PAYLOAD_TOO_LARGE`,
  /** 429. */
  GEN_RATE_LIMITED: `GEN_RATE_LIMITED`,
  /** 500. */
  GEN_INTERNAL: `GEN_INTERNAL`,

  // AUTH

  /** 401. */
  AUTH_MISSING_API_KEY: `AUTH_MISSING_API_KEY`,
  /** 401. */
  AUTH_INVALID_API_KEY: `AUTH_INVALID_API_KEY`,
  /** 401. */
  AUTH_EXPIRED_API_KEY: `AUTH_EXPIRED_API_KEY`,
  /** 401. */
  AUTH_MISSING_PRINCIPAL: `AUTH_MISSING_PRINCIPAL`,
  /** 403. */
  AUTH_INSUFFICIENT_PERMISSIONS: `AUTH_INSUFFICIENT_PERMISSIONS`,
  /** 403. */
  AUTH_UNKNOWN_RESOURCE: `AUTH_UNKNOWN_RESOURCE`,
  /** 403. */
  AUTH_MASTER_KEY_REQUIRED: `AUTH_MASTER_KEY_REQUIRED`,
  /** 403. */
  AUTH_CROSS_OWNER_ACCESS: `AUTH_CROSS_OWNER_ACCESS`,
  /** 403, key granted scopes it does not hold. */
  AUTH_SCOPE_ESCALATION: `AUTH_SCOPE_ESCALATION`,
  /** 401. */
  AUTH_METRICS_TOKEN_REQUIRED: `AUTH_METRICS_TOKEN_REQUIRED`,
  /** 401. */
  AUTH_INVALID_BEARER_TOKEN: `AUTH_INVALID_BEARER_TOKEN`,
  /** 403. */
  AUTH_METRICS_DISABLED: `AUTH_METRICS_DISABLED`,

  // APIKEY

  /** 404. */
  APIKEY_NOT_FOUND: `APIKEY_NOT_FOUND`,
  /** 400. */
  APIKEY_OWNER_REQUIRED: `APIKEY_OWNER_REQUIRED`,
  /** 400. */
  APIKEY_INVALID: `APIKEY_INVALID`,

  // TXN

  /** 404, by id or reference. */
  TXN_NOT_FOUND: `TXN_NOT_FOUND`,
  /** 400, and overdraft is off. */
  TXN_INSUFFICIENT_FUNDS: `TXN_INSUFFICIENT_FUNDS`,
  /** 400. Some Core versions report this as TXN_VALIDATION_ERROR; match either. */
  TXN_INVALID_AMOUNT: `TXN_INVALID_AMOUNT`,
  /** 400. */
  TXN_PRECISION_NOT_INTEGER: `TXN_PRECISION_NOT_INTEGER`,
  /** 400, multi-source/destination legs do not add up. */
  TXN_INVALID_DISTRIBUTION: `TXN_INVALID_DISTRIBUTION`,
  /** 409. */
  TXN_DUPLICATE_REFERENCE: `TXN_DUPLICATE_REFERENCE`,
  /** 400. */
  TXN_NOT_INFLIGHT: `TXN_NOT_INFLIGHT`,
  /** 409. */
  TXN_ALREADY_COMMITTED: `TXN_ALREADY_COMMITTED`,
  /** 409. */
  TXN_ALREADY_VOIDED: `TXN_ALREADY_VOIDED`,
  /** 409, refunding twice or refunding a refund (0.15.4+). */
  TXN_ALREADY_REFUNDED: `TXN_ALREADY_REFUNDED`,
  /** 400. */
  TXN_COMMIT_AMOUNT_EXCEEDED: `TXN_COMMIT_AMOUNT_EXCEEDED`,
  /** 400, status is not `commit` or `void`. */
  TXN_INVALID_STATUS_ACTION: `TXN_INVALID_STATUS_ACTION`,
  /** 400. */
  TXN_BULK_EMPTY: `TXN_BULK_EMPTY`,
  /** 400. */
  TXN_BULK_LIMIT_EXCEEDED: `TXN_BULK_LIMIT_EXCEEDED`,
  /** 400, includes both `sources` and `destinations` on one request (0.15.4+). */
  TXN_VALIDATION_ERROR: `TXN_VALIDATION_ERROR`,

  // BAL

  /** 404. Since 0.15.4 a transaction naming a missing balance returns this, not TXN_NOT_FOUND. */
  BAL_NOT_FOUND: `BAL_NOT_FOUND`,
  /** 404, no history at the requested timestamp. */
  BAL_HISTORY_NOT_FOUND: `BAL_HISTORY_NOT_FOUND`,
  /** 400. */
  BAL_INVALID_TIMESTAMP: `BAL_INVALID_TIMESTAMP`,
  /** 400. */
  BAL_VALIDATION_ERROR: `BAL_VALIDATION_ERROR`,
  /** 404. */
  BAL_MONITOR_NOT_FOUND: `BAL_MONITOR_NOT_FOUND`,

  // LGR

  /** 404. */
  LGR_NOT_FOUND: `LGR_NOT_FOUND`,
  /** 409. */
  LGR_DUPLICATE: `LGR_DUPLICATE`,

  // ACC

  /** 404. */
  ACC_NOT_FOUND: `ACC_NOT_FOUND`,
  /** 409. */
  ACC_DUPLICATE: `ACC_DUPLICATE`,
  /** 500. */
  ACC_GENERATION_FAILED: `ACC_GENERATION_FAILED`,

  // IDT

  /** 404. */
  IDT_NOT_FOUND: `IDT_NOT_FOUND`,
  /** 400. */
  IDT_VALIDATION_ERROR: `IDT_VALIDATION_ERROR`,
  /** 400. */
  IDT_FIELD_NOT_TOKENIZABLE: `IDT_FIELD_NOT_TOKENIZABLE`,
  /** 409. */
  IDT_FIELD_ALREADY_TOKENIZED: `IDT_FIELD_ALREADY_TOKENIZED`,
  /** 400. */
  IDT_FIELD_NOT_TOKENIZED: `IDT_FIELD_NOT_TOKENIZED`,
  /** 400. */
  IDT_FIELD_NOT_FOUND: `IDT_FIELD_NOT_FOUND`,
  /** 403. */
  IDT_TOKENIZATION_DISABLED: `IDT_TOKENIZATION_DISABLED`,

  // RECON

  /** 404. */
  RECON_NOT_FOUND: `RECON_NOT_FOUND`,
  /** 404. */
  RECON_RULE_NOT_FOUND: `RECON_RULE_NOT_FOUND`,
  /** 400. */
  RECON_UPLOAD_FAILED: `RECON_UPLOAD_FAILED`,
  /** 500. */
  RECON_UPLOAD_PROCESSING_FAILED: `RECON_UPLOAD_PROCESSING_FAILED`,
  /** 400. */
  RECON_UPLOAD_URL_INVALID: `RECON_UPLOAD_URL_INVALID`,
  /** 400. */
  RECON_UPLOAD_HOST_NOT_ALLOWED: `RECON_UPLOAD_HOST_NOT_ALLOWED`,
  /** 400. */
  RECON_RULE_INVALID: `RECON_RULE_INVALID`,
  /** 400. */
  RECON_MATCHING_RULES_REQUIRED: `RECON_MATCHING_RULES_REQUIRED`,
  /** 400. */
  RECON_EXTERNAL_TXNS_REQUIRED: `RECON_EXTERNAL_TXNS_REQUIRED`,
  /** 500. */
  RECON_START_FAILED: `RECON_START_FAILED`,

  // META

  /** 404. */
  META_ENTITY_NOT_FOUND: `META_ENTITY_NOT_FOUND`,
  /** 400. */
  META_UNSUPPORTED_ENTITY: `META_UNSUPPORTED_ENTITY`,
  /** 400. */
  META_INVALID_ENTITY_ID: `META_INVALID_ENTITY_ID`,

  // HOOK

  /** 404. */
  HOOK_NOT_FOUND: `HOOK_NOT_FOUND`,
  /** 400. */
  HOOK_INVALID: `HOOK_INVALID`,
  /** 500. */
  HOOK_OPERATION_FAILED: `HOOK_OPERATION_FAILED`,

  // QUEUE

  /** 503, retry later. */
  QUEUE_BACKPRESSURE: `QUEUE_BACKPRESSURE`,

  // SRCH

  /** 400. */
  SRCH_QUERY_INVALID: `SRCH_QUERY_INVALID`,
  /** 500. */
  SRCH_FAILED: `SRCH_FAILED`,
  /** 409. */
  SRCH_REINDEX_IN_PROGRESS: `SRCH_REINDEX_IN_PROGRESS`,
  /** 404. */
  SRCH_REINDEX_NOT_STARTED: `SRCH_REINDEX_NOT_STARTED`,

  // ADMIN

  /** 500. */
  ADMIN_BACKUP_FAILED: `ADMIN_BACKUP_FAILED`,
} as const;

export type BlnkErrorCode = (typeof BlnkErrorCode)[keyof typeof BlnkErrorCode];

/**
 * Extracts structured Blnk API error details from a JSON error body.
 * Supports `error_detail` (current Core API) and legacy `error` string fields.
 */
export function parseBlnkApiErrorBody(
  body: unknown,
): BlnkApiErrorDetail | null {
  if (!body || typeof body !== `object`) {
    return null;
  }

  const record = body as Record<string, unknown>;
  const errorDetail = record.error_detail;

  if (errorDetail && typeof errorDetail === `object`) {
    const detail = errorDetail as Record<string, unknown>;
    if (typeof detail.code === `string` && typeof detail.message === `string`) {
      const parsed: BlnkApiErrorDetail = {
        code: detail.code,
        message: detail.message,
      };
      if (`details` in detail) {
        parsed.details = detail.details;
      }
      return parsed;
    }
  }

  if (typeof record.error === `string` && record.error.length > 0) {
    return {
      code: `UNKNOWN`,
      message: record.error,
    };
  }

  return null;
}
