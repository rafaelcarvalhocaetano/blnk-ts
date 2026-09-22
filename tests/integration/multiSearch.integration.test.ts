/* eslint-disable n/no-unpublished-import */
/**
 * Live coverage of `Search.multiSearch` against Core's `POST /multi-search`
 * (in Core since v0.10.0; this SDK is aligned with 0.15.4).
 * Gated on `BLNK_E2E=1`.
 *
 * Run: BLNK_E2E=1 npx tap tests/integration/multiSearch.integration.test.ts
 */
import tap from "tap";
import {randomUUID} from "node:crypto";
import {BlnkInit} from "../../src";
import {CreateLedger} from "../../src/types/ledger";
import {MultiSearchParams} from "../../src/types/search";
import {BASE_URL, BLNK_API_KEY, Sleep} from "../utils.test";

const liveEnabled = process.env.BLNK_E2E === `1`;

tap.test(
  `multiSearch — live mixed collections`,
  {
    skip: liveEnabled ? false : `requires BLNK_E2E=1 and a running Core`,
  },
  async t => {
    const client = BlnkInit(BLNK_API_KEY, {baseUrl: BASE_URL});
    const ledgerName = `TS MultiSearch ${randomUUID()}`;

    const created = await client.Ledgers.create({
      name: ledgerName,
    } as CreateLedger<Record<string, never>>);
    t.equal(created.status, 201, created.message);

    const params: MultiSearchParams = {
      searches: [
        {collection: `ledgers`, q: ledgerName, query_by: `name`, per_page: 5},
        {collection: `balances`, q: `*`, query_by: `currency`, per_page: 1},
      ],
    };

    const deadline = Date.now() + 30_000;
    let response = await client.Search.multiSearch(params);
    while (Date.now() <= deadline) {
      const results = response.data?.results;
      if (
        response.status === 200 &&
        Array.isArray(results) &&
        results.length === 2 &&
        (results[0]?.found ?? 0) > 0
      ) {
        break;
      }
      await Sleep(0.5);
      response = await client.Search.multiSearch(params);
    }

    const results = response.data?.results;
    t.equal(response.status, 200, response.message);
    t.ok(response.data, `expected multi-search data`);
    t.ok(Array.isArray(results), JSON.stringify(response.data));
    t.equal(results?.length, 2, JSON.stringify(response.data));
    t.ok(
      (results?.[0]?.found ?? 0) > 0,
      `expected indexed ledger in first results bucket: ${JSON.stringify(response.data)}`,
    );
    t.ok((results?.[1]?.found ?? -1) >= 0);
  },
);
