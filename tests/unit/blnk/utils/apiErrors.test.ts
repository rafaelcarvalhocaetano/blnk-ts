/* eslint-disable n/no-unpublished-import */
import tap from "tap";
import {
  BlnkErrorCode,
  parseBlnkApiErrorBody,
} from "../../../../src/types/errors";

const KNOWN_PREFIXES = new Set([
  `GEN`,
  `AUTH`,
  `APIKEY`,
  `TXN`,
  `BAL`,
  `LGR`,
  `ACC`,
  `IDT`,
  `RECON`,
  `META`,
  `HOOK`,
  `QUEUE`,
  `SRCH`,
  `ADMIN`,
]);

tap.test(`BlnkErrorCode`, t => {
  t.test(
    `every constant's value equals its name, is unique, and uses a Core prefix`,
    tt => {
      const entries = Object.entries(BlnkErrorCode);
      const seen = new Set<string>();

      for (const [name, value] of entries) {
        tt.equal(value, name, `constant name and value must match`);
        tt.ok(!seen.has(value), `duplicate error code ${value}`);
        seen.add(value);
        const prefix = value.slice(0, value.indexOf(`_`));
        tt.ok(KNOWN_PREFIXES.has(prefix), `unknown Core prefix on ${value}`);
      }

      tt.equal(entries.length, 79, `expected the full Core 0.15.4 catalogue`);
      tt.end();
    },
  );

  t.test(`Core 0.15.4 codes are present`, tt => {
    tt.equal(BlnkErrorCode.TXN_ALREADY_REFUNDED, `TXN_ALREADY_REFUNDED`);
    tt.equal(BlnkErrorCode.BAL_NOT_FOUND, `BAL_NOT_FOUND`);
    tt.equal(BlnkErrorCode.TXN_VALIDATION_ERROR, `TXN_VALIDATION_ERROR`);
    tt.equal(BlnkErrorCode.GEN_CONFLICT, `GEN_CONFLICT`);
    tt.end();
  });

  t.test(`pre-1.5.0 constants are unchanged`, tt => {
    tt.equal(BlnkErrorCode.TXN_INVALID_AMOUNT, `TXN_INVALID_AMOUNT`);
    tt.equal(BlnkErrorCode.GEN_CONFLICT, `GEN_CONFLICT`);
    tt.equal(BlnkErrorCode.TXN_VALIDATION_ERROR, `TXN_VALIDATION_ERROR`);
    tt.end();
  });

  t.end();
});

tap.test(`parseBlnkApiErrorBody`, t => {
  t.test(`parses error_detail from Core API responses`, tt => {
    const parsed = parseBlnkApiErrorBody({
      error: `ledger not found`,
      error_detail: {
        code: `LGR_NOT_FOUND`,
        message: `ledger not found`,
        details: {ledger_id: `ldg_missing`},
      },
    });

    tt.same(parsed, {
      code: `LGR_NOT_FOUND`,
      message: `ledger not found`,
      details: {ledger_id: `ldg_missing`},
    });
    tt.end();
  });

  t.test(
    `omits details when error_detail has no details field (issue #132)`,
    tt => {
      const parsed = parseBlnkApiErrorBody({
        error: `bad request`,
        error_detail: {
          code: `GEN_BAD_REQUEST`,
          message: `bad request`,
        },
      });

      tt.same(parsed, {
        code: `GEN_BAD_REQUEST`,
        message: `bad request`,
      });
      tt.equal(parsed && `details` in parsed, false);
      tt.end();
    },
  );

  t.test(`falls back to legacy error string`, tt => {
    const parsed = parseBlnkApiErrorBody({error: `invalid request`});
    tt.same(parsed, {code: `UNKNOWN`, message: `invalid request`});
    tt.end();
  });

  t.test(`returns null for non-object bodies`, tt => {
    tt.equal(parseBlnkApiErrorBody(null), null);
    tt.equal(parseBlnkApiErrorBody(`oops`), null);
    tt.end();
  });

  t.test(`surfaces Core 0.15.3 codes callers should recognize`, tt => {
    const cases = [
      {
        code: BlnkErrorCode.TXN_INVALID_AMOUNT,
        message: `precise_amount must be positive`,
      },
      {
        code: BlnkErrorCode.GEN_CONFLICT,
        message: `internal balance already exists for this indicator and currency`,
      },
      {
        code: BlnkErrorCode.TXN_VALIDATION_ERROR,
        message: `source and destination cannot be the same balance`,
      },
    ];

    for (const expected of cases) {
      const parsed = parseBlnkApiErrorBody({
        error: expected.message,
        error_detail: expected,
      });
      tt.equal(parsed?.code, expected.code);
      tt.equal(parsed?.message, expected.message);
    }
    tt.end();
  });

  t.test(
    `surfaces TXN_ALREADY_REFUNDED from a Core 0.15.4 duplicate refund`,
    tt => {
      const parsed = parseBlnkApiErrorBody({
        error: `transaction txn_1 has already been refunded`,
        error_detail: {
          code: BlnkErrorCode.TXN_ALREADY_REFUNDED,
          message: `transaction txn_1 has already been refunded`,
          details: {transaction_id: `txn_1`},
        },
      });

      tt.equal(parsed?.code, BlnkErrorCode.TXN_ALREADY_REFUNDED);
      tt.same(parsed?.details, {transaction_id: `txn_1`});
      tt.end();
    },
  );

  t.test(
    `surfaces BAL_NOT_FOUND when a transaction names a missing balance`,
    tt => {
      const parsed = parseBlnkApiErrorBody({
        error: `balance bln_missing not found`,
        error_detail: {
          code: BlnkErrorCode.BAL_NOT_FOUND,
          message: `balance bln_missing not found`,
        },
      });

      tt.equal(parsed?.code, BlnkErrorCode.BAL_NOT_FOUND);
      tt.end();
    },
  );

  t.end();
});
