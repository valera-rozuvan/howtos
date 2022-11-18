# aws-test-runner

AWS test runner that can go on running as long as necessary

## Pre-requisites

In the file `run-tests.sh` update the following ENV variables:

```text
ROLE_ARN
DEVICE_SERIAL_NUMBER
```

In the file `run-tests-suite.sh` update the test file name ENV variable:

```text
TEST_FILE_NAME
```

And also the full path to the test in the function invocation on line 26:

```text
show_simplified_logs "functional_tests/jest/aws-lambda-invocation.tests.ts"
```

TODO: Make the above also an ENV variable.

## Running

Simply launch the Bash script `run-tests.sh`.
