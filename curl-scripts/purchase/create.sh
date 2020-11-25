#!/bin/bash

API="http://localhost:4741"
URL_PATH="/purchases"

curl "${API}${URL_PATH}" \
  --include \
  --request POST \
  --header "Content-Type: application/json" \
  --header "Authorization: Bearer ${TOKEN}" \
  --data '{
    "purchase": {
      "name": "'"${NAME}"'",
      "price": "'"${PRICE}"'",
      "description": "'"${DESCRIPTION}"'"
    }
  }'

echo
