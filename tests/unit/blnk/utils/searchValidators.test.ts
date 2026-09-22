/* eslint-disable n/no-unpublished-import */
import tap from "tap";
import {
  ValidateMultiSearchParams,
  ValidateSearchCollection,
  ValidateSearchParams,
} from "../../../../src/blnk/utils/validators/searchValidators";
import {MultiSearchParams} from "../../../../src/types/search";

tap.test(`Issue #51 — search validators`, t => {
  t.test(`ValidateSearchCollection accepts identities`, tt => {
    tt.equal(ValidateSearchCollection(`identities`), null);
    tt.equal(ValidateSearchCollection(`ledgers`), null);
    tt.end();
  });

  t.test(`ValidateSearchCollection rejects unknown collection`, tt => {
    tt.equal(
      ValidateSearchCollection(`accounts`),
      `collection must be ledgers, transactions, balances, or identities`,
    );
    tt.end();
  });

  t.test(`ValidateSearchParams accepts API-valid payload`, tt => {
    tt.equal(
      ValidateSearchParams({
        q: `*`,
        query_by: `first_name,last_name,email_address`,
        filter_by: `identity_type:=individual`,
        sort_by: `created_at:desc`,
        page: 1,
        per_page: 25,
      }),
      null,
    );
    tt.end();
  });

  t.test(`ValidateSearchParams rejects empty q`, tt => {
    tt.equal(ValidateSearchParams({q: ``}), `Field "q" must be filled`);
    tt.end();
  });

  t.test(`ValidateSearchParams rejects invalid page`, tt => {
    tt.equal(
      ValidateSearchParams({q: `*`, page: 0}),
      `page must be a positive integer if provided`,
    );
    tt.end();
  });

  t.test(`ValidateMultiSearchParams accepts a well-formed body`, tt => {
    tt.equal(
      ValidateMultiSearchParams({
        searches: [
          {collection: `ledgers`, q: `savings`},
          {collection: `identities`, q: `jane`, per_page: 5},
        ],
      }),
      null,
    );
    tt.end();
  });

  t.test(
    `ValidateMultiSearchParams rejects null, missing, and empty searches`,
    tt => {
      tt.equal(
        ValidateMultiSearchParams(null),
        `Multi-search params must be a valid object`,
      );
      tt.equal(
        ValidateMultiSearchParams({} as MultiSearchParams),
        `searches must be a non-empty array`,
      );
      tt.equal(
        ValidateMultiSearchParams({searches: []}),
        `searches must be a non-empty array`,
      );
      tt.equal(
        ValidateMultiSearchParams({
          searches: `ledgers`,
        } as unknown as MultiSearchParams),
        `searches must be a non-empty array`,
      );
      tt.end();
    },
  );

  t.test(`ValidateMultiSearchParams rejects a non-object entry`, tt => {
    tt.equal(
      ValidateMultiSearchParams({
        searches: [`ledgers`],
      } as unknown as MultiSearchParams),
      `searches[0] must be a valid object`,
    );
    tt.end();
  });

  t.test(
    `ValidateMultiSearchParams rejects a missing or unknown collection`,
    tt => {
      tt.equal(
        ValidateMultiSearchParams({
          searches: [{q: `x`} as MultiSearchParams[`searches`][number]],
        }),
        `searches[0].collection must be ledgers, transactions, balances, or identities`,
      );
      tt.equal(
        ValidateMultiSearchParams({
          searches: [
            {collection: `ledgers`, q: `x`},
            {
              collection:
                `Ledgers` as MultiSearchParams[`searches`][number][`collection`],
              q: `x`,
            },
          ],
        }),
        `searches[1].collection must be ledgers, transactions, balances, or identities`,
      );
      tt.end();
    },
  );

  t.test(`ValidateMultiSearchParams prefixes per-entry param errors`, tt => {
    tt.equal(
      ValidateMultiSearchParams({
        searches: [
          {collection: `ledgers`, q: `x`},
          {collection: `balances`, q: `x`, per_page: 500},
        ],
      }),
      `searches[1]: per_page must be an integer between 1 and 250 if provided`,
    );
    tt.end();
  });

  t.end();
});
