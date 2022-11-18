#!/bin/bash

run_test () {
  ./run-tests-suite.sh
}

# set a new timestamp in the future
NOW=$(date)
TIME_STAMP=$(date -d "${NOW} +50 min")
TIME_STAMP_PLUS_FIFTY_MINUTES=$(date -d "${TIME_STAMP} +50 min")

NOW=$(date -d "${NOW}" +'%Y-%m-%d:%H:%M:%S')
TIME_STAMP=$(date -d "${TIME_STAMP}" +'%Y-%m-%d:%H:%M:%S')
TIME_STAMP_PLUS_FIFTY_MINUTES=$(date -d "${TIME_STAMP_PLUS_FIFTY_MINUTES}" +'%Y-%m-%d:%H:%M:%S')

TOTAL_LOOP_RUNS=10
loop_count=1
while [ $loop_count -le $TOTAL_LOOP_RUNS ]; do
  NOW=$(date)
  NOW=$(date -d "${NOW}" +'%Y-%m-%d:%H:%M:%S')

  # If 50 minutes passed since last time we fetched a token...
  if [[ "$NOW" < "$TIME_STAMP" ]] || [[ "$NOW" > "$TIME_STAMP_PLUS_FIFTY_MINUTES" ]]; then
    echo "Time to retrieve a new token ..."

    status=0
    while [ $status -eq 0 ]; do
      unset AWS_SESSION_TOKEN AWS_SECRET_KEY AWS_ACCESS_KEY_ID AWS_SECRET_ACCESS_KEY ROLE_SESSION_NAME ROLE_ARN DEVICE_SERIAL_NUMBER OTP

      # ROLE_ARN example "arn:aws:iam::123456789012:role/OrgAccAccessRole"
      ROLE_ARN="!!!!!!!!! to fill in !!!!!!!!!"
      ROLE_SESSION_NAME="val-$(tr -dc A-Za-z0-9 </dev/urandom | head -c 32 ; echo '')"
      # DEVICE_SERIAL_NUMBER example "arn:aws:iam::123456789012:mfa/user@example.com"
      DEVICE_SERIAL_NUMBER="!!!!!!!!! to fill in !!!!!!!!!"

      OTP=$(python3 ~/bin/otp.py)

      # try to fetch a new token
      touch "./${ROLE_SESSION_NAME}"
      export $(aws sts assume-role --serial-number $DEVICE_SERIAL_NUMBER --token-code "${OTP}" --role-arn ${ROLE_ARN} --role-session-name "${ROLE_SESSION_NAME}" --output text --query "[['AWS_ACCESS_KEY_ID',Credentials.AccessKeyId],['AWS_SECRET_ACCESS_KEY',Credentials.SecretAccessKey],['AWS_SESSION_TOKEN',Credentials.SessionToken]][*].join(\`=\`,@)" >> "./${ROLE_SESSION_NAME}" 2>&1) > /dev/null 2>&1
      grep -i "An error occurred" "./${ROLE_SESSION_NAME}" > /dev/null 2>&1
      status=$?

      if [[ $status -ne 0 ]]; then
        echo "New token retrieved!"
        source "./${ROLE_SESSION_NAME}"
        export AWS_ACCESS_KEY_ID AWS_SECRET_ACCESS_KEY AWS_SESSION_TOKEN
      else
        echo "Token retrieval failed ... sleeping for 100 seconds ..."
        sleep 100s
      fi

      rm -rf "./${ROLE_SESSION_NAME}"
    done

    # set a new timestamp
    TIME_STAMP=$(date)
    TIME_STAMP_PLUS_FIFTY_MINUTES=$(date -d "${TIME_STAMP} +50 min")

    TIME_STAMP=$(date -d "${TIME_STAMP}" +'%Y-%m-%d:%H:%M:%S')
    TIME_STAMP_PLUS_FIFTY_MINUTES=$(date -d "${TIME_STAMP_PLUS_FIFTY_MINUTES}" +'%Y-%m-%d:%H:%M:%S')
  fi

  echo "---------------------- [current test run is ${loop_count} of ${TOTAL_LOOP_RUNS}] ----------------------"
  run_test

  loop_count=$((loop_count+1))
done

exit 0
