#!/bin/bash

set -e

CANISTERS=("nft_backend" "nft_frontend")

DEST_DIR="nft/declarations"

mkdir -p "$DEST_DIR"

for CANISTER in "${CANISTERS[@]}"; do
  dfx generate "$CANISTER"

  SRC_DIR="src/declarations/$CANISTER"
  if [ -d "$SRC_DIR" ]; then
    mv "$SRC_DIR" "$DEST_DIR/"
  else
    echo "⚠️ Warning: Declarations for $CANISTER not found in $SRC_DIR"
  fi
done

rm -rf src/declarations

