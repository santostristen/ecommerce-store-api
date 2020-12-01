#!/bin/bash

API="http://localhost:4741"
URL_PATH="/products"

curl "${API}${URL_PATH}" \
  --include \
  --request POST \
  --header "Content-Type: application/json" \
  --header "Authorization: Bearer ${TOKEN}" \
  --data '{
    "product": {
      "name": "'"${NAME}"'",
      "description": "'"${DESCRIPTION}"'",
      "price": "'"${PRICE}"'",
      "imgSrc": "'"${IMGSRC}"'",
      "imgAlt": "'"${IMGALT}"'"
    }
  }'

echo
