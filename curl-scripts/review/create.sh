#!/bin/bash

API="http://localhost:4741"
URL_PATH="/reviews"

curl "${API}${URL_PATH}" \
  --include \
  --request POST \
  --header "Content-Type: application/json" \
  --header "Authorization: Bearer ${TOKEN}" \
  --data '{
    "review": {
      "head": "'"${HEAD}"'",
      "body": "'"${BODY}"'",
      "rating": "'"${RATING}"'",
      "productId": "'"${PRODUCT_ID}"'"
    }
  }'

echo
