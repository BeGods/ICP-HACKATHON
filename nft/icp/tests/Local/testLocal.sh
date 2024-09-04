#!/bin/bash

# Exit immediately if a command exits with a non-zero status
set -e


USER_PRINCIPAL=$(dfx identity get-principal)
CANISTER=$(dfx canister id BeGod_backend)
echo "USER_PRINCIPAL: $USER_PRINCIPAL"
echo "CANISTER: $CANISTER"






# STEP-1
# creating new collection



# dfx canister call "$CANISTER" createExtCollection '("Celtic", "https://picsum.photos/200/300", "{\"Name\":\"chandan\"}")'

# Getting Result Like this
# (
#   principal "oz7jj-hclyb-5r7nw-ehlam-34yct-ktxcg-2wsq2-53not-tbxed-ru5vq-eae",
#   principal "a3shf-5eaaa-aaaaa-qaafa-cai",
# )

COLLECTION_ID="a3shf-5eaaa-aaaaa-qaafa-cai"
echo "COLLECTION_ID: $COLLECTION_ID"






# STEP-2
# add nft in the collection

# dfx canister call "$CANISTER" mintExtNonFungible '(
#   principal "'$COLLECTION_ID'",
#   "first nft",
#   "this is the my first nft",
#   "new data",
#   "https://thisisthdata.jpg",
#   opt variant {
#     json = "{\"name\":\"vishwakarma\"}"
#   },
#   10
# )'

# Getting Result Like this of same NFT 10 data
# # (vec {
#     0 : nat32;
#     1 : nat32;
#     2 : nat32;
#     3 : nat32;
#     4 : nat32;
#     5 : nat32;
#     6 : nat32;
#     7 : nat32;
#     8 : nat32;
#     9 : nat32;
#   })

NFTID="0"
echo "NFTID: $NFTID"







# STEP-3
# Getting actual NFT ID TokenIdentifier

dfx canister call "$CANISTER" getNftTokenId "(principal \"$COLLECTION_ID\", $NFTID)"

# Getting Result Like this
# ("gosuq-3ykor-uwjaa-aaaaa-aeaab-iaqca-aaaaa-a")






# STEP 4
# listing the price of the NFT

TOKENID='0';
PRICE=100_000_000;

dfx canister call "$CANISTER" checkOwnership "(principal \"$COLLECTION_ID\", $TOKENID)";
