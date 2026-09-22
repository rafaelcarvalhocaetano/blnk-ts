/* eslint-disable n/no-unpublished-import */
import tap from "tap";
import {
  ValidateBalanceId,
  ValidateMonitorId,
} from "../../../../src/blnk/utils/validators/balanceMonitors";

tap.test(`ValidateMonitorId`, async t => {
  t.equal(ValidateMonitorId(`mon_test_123`), null);
  t.equal(ValidateMonitorId(``), `monitor id is required`);
  t.end();
});

tap.test(`ValidateBalanceId`, async t => {
  t.equal(ValidateBalanceId(`bln_test_123`), null);
  t.equal(ValidateBalanceId(``), `balance id is required`);
  t.equal(ValidateBalanceId(`   `), `balance id is required`);
  t.end();
});
