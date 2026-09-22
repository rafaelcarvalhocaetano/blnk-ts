/* eslint-disable n/no-unpublished-import */
import tap from "tap";
import {Search} from "../../../../src/blnk/endpoints/search";
import {
  createMockBlnkRequest,
  createMockLogger,
} from "../../../mocks/blnkClientMocks";
import {FormatResponse} from "../../../../src/blnk/utils/httpClient";
import {MultiSearchParams} from "../../../../src/types/search";

tap.test(`Search.multiSearch`, async t => {
  t.test(
    `posts a searches array with collection beside each entry's params`,
    async tt => {
      const mockLogger = createMockLogger();
      const thirdPartyRequest = createMockBlnkRequest(true, undefined, 200);
      const capturedRequest = tt.captureFn(thirdPartyRequest);
      const search = new Search(capturedRequest, mockLogger, FormatResponse);

      const params: MultiSearchParams = {
        searches: [
          {collection: `transactions`, q: `ref_001`, query_by: `reference`},
          {
            collection: `balances`,
            q: `*`,
            filter_by: `currency:USD`,
            per_page: 50,
          },
        ],
      };

      const response = await search.multiSearch(params);

      tt.match(capturedRequest.args(), [[`multi-search`, params, `POST`]]);
      tt.same(params, {
        searches: [
          {collection: `transactions`, q: `ref_001`, query_by: `reference`},
          {
            collection: `balances`,
            q: `*`,
            filter_by: `currency:USD`,
            per_page: 50,
          },
        ],
      });
      tt.equal(response.status, 200);
      tt.end();
    },
  );

  t.test(`rejects an empty searches list without calling the API`, async tt => {
    const mockLogger = createMockLogger();
    const thirdPartyRequest = createMockBlnkRequest(true, undefined, 200);
    const capturedRequest = tt.captureFn(thirdPartyRequest);
    const search = new Search(capturedRequest, mockLogger, FormatResponse);

    const response = await search.multiSearch({searches: []});

    tt.match(capturedRequest.args(), []);
    tt.equal(response.status, 400);
    tt.equal(response.message, `searches must be a non-empty array`);
    tt.end();
  });

  t.test(`rejects an unknown collection and names the entry`, async tt => {
    const mockLogger = createMockLogger();
    const thirdPartyRequest = createMockBlnkRequest(true, undefined, 200);
    const capturedRequest = tt.captureFn(thirdPartyRequest);
    const search = new Search(capturedRequest, mockLogger, FormatResponse);

    const response = await search.multiSearch({
      searches: [
        {collection: `ledgers`, q: `savings`},
        {
          collection:
            `accounts` as MultiSearchParams[`searches`][number][`collection`],
          q: `x`,
        },
      ],
    });

    tt.match(capturedRequest.args(), []);
    tt.equal(response.status, 400);
    tt.equal(
      response.message,
      `searches[1].collection must be ledgers, transactions, balances, or identities`,
    );
    tt.end();
  });

  t.test(`rejects a missing q and names the entry`, async tt => {
    const mockLogger = createMockLogger();
    const thirdPartyRequest = createMockBlnkRequest(true, undefined, 200);
    const capturedRequest = tt.captureFn(thirdPartyRequest);
    const search = new Search(capturedRequest, mockLogger, FormatResponse);

    const response = await search.multiSearch({
      searches: [
        {collection: `ledgers`} as MultiSearchParams[`searches`][number],
      ],
    });

    tt.match(capturedRequest.args(), []);
    tt.equal(response.status, 400);
    tt.equal(response.message, `searches[0]: Field "q" must be filled`);
    tt.end();
  });

  t.test(`rejects null params`, async tt => {
    const mockLogger = createMockLogger();
    const thirdPartyRequest = createMockBlnkRequest(true, undefined, 200);
    const capturedRequest = tt.captureFn(thirdPartyRequest);
    const search = new Search(capturedRequest, mockLogger, FormatResponse);

    const response = await search.multiSearch(
      null as unknown as MultiSearchParams,
    );

    tt.match(capturedRequest.args(), []);
    tt.equal(response.status, 400);
    tt.equal(response.message, `Multi-search params must be a valid object`);
    tt.end();
  });

  t.test(`handles thrown errors gracefully`, async tt => {
    const mockLogger = createMockLogger();
    const thirdPartyRequest = createMockBlnkRequest(true, `Network Error`);
    const capturedRequest = tt.captureFn(thirdPartyRequest);
    const search = new Search(capturedRequest, mockLogger, FormatResponse);

    const response = await search.multiSearch({
      searches: [{collection: `ledgers`, q: `a`}],
    });

    tt.equal(response.status, 500);
    tt.equal(response.message, `Network Error`);
    tt.end();
  });
});
