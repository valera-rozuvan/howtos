#!/bin/bash

TEST_FILE_NAME="aws-lambda-invocation.tests.ts"
TEST_CASE="finishes with OK response"

LOG_FILE_NAME=""

create_log_file () {
  LOG_FILE_NAME="test-run-$(tr -dc A-Za-z0-9 </dev/urandom | head -c 32 ; echo '')"
}

show_simplified_logs () {
  grep -i "${1}" "./${LOG_FILE_NAME}" | grep -i "pass"
  grep -i "${1}" "./${LOG_FILE_NAME}" | grep -i "fail"
  grep -i "expected:" "./${LOG_FILE_NAME}"
  grep -i "received:" "./${LOG_FILE_NAME}"
}

delete_log_file () {
  rm -rf "./${LOG_FILE_NAME}"
}

actual_test_silent () {
  create_log_file
  npm test -- "${TEST_FILE_NAME}" --collect-coverage false --ci --testMatch **/*.tests.ts -t "${TEST_CASE}" > "./${LOG_FILE_NAME}" 2>&1
  show_simplified_logs "functional_tests/jest/aws-lambda-invocation.tests.ts"
  delete_log_file
}

actual_test () {
  npm test -- "${TEST_FILE_NAME}" --collect-coverage false --ci --testMatch **/*.tests.ts -t "${TEST_CASE}"
}

dummy_test () {
  sleep 5s
}

# Comment out 2 out of 3 below, in order to run just 1.
actual_test_silent
# actual_test
# dummy_test

exit 0
