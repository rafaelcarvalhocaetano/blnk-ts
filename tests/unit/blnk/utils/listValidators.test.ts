/* eslint-disable n/no-unpublished-import */
import tap from "tap";
import {
  ListOptionsQueryString,
  ValidateListOptions,
} from "../../../../src/blnk/utils/validators/listValidators";

tap.test(`ValidateListOptions`, async t => {
  t.equal(ValidateListOptions(), null);
  t.equal(ValidateListOptions({}), null);
  t.equal(ValidateListOptions({limit: 1, offset: 0}), null);
  t.equal(
    ValidateListOptions(null as unknown as undefined),
    `Data must be a valid object of type ListOptions`,
  );
  t.equal(ValidateListOptions({limit: 0}), `limit must be at least 1`);
  t.equal(
    ValidateListOptions({limit: 2.5}),
    `limit must be an integer if provided`,
  );
  t.equal(
    ValidateListOptions({limit: `10` as unknown as number}),
    `limit must be an integer if provided`,
  );
  t.equal(ValidateListOptions({offset: -5}), `offset must be at least 0`);
  t.equal(
    ValidateListOptions({offset: `0` as unknown as number}),
    `offset must be an integer if provided`,
  );
  t.equal(
    ValidateListOptions({limit: 0, offset: -1}),
    `limit must be at least 1`,
  );
  t.end();
});

tap.test(`ListOptionsQueryString`, async t => {
  t.equal(ListOptionsQueryString(), ``);
  t.equal(ListOptionsQueryString({}), ``);
  t.equal(ListOptionsQueryString({limit: 5}), `?limit=5`);
  t.equal(
    ListOptionsQueryString({limit: 10, offset: 30}),
    `?limit=10&offset=30`,
  );
  t.equal(
    ListOptionsQueryString({offset: 30, limit: 10}),
    `?limit=10&offset=30`,
  );
  t.end();
});
