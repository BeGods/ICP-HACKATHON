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
#   principal "bw4dl-smaaa-aaaaa-qaacq-cai",
# )

COLLECTION_ID="bw4dl-smaaa-aaaaa-qaacq-cai"
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

# dfx canister call "$CANISTER" getNftTokenId "(principal \"$COLLECTION_ID\", $NFTID)"

# Getting Result Like this
# ("yxwtr-bqkor-uwjaa-aaaaa-aeaaa-uaqca-aaaaa-a")



# STEP-4
# Set Price and List the NFT

TOKENIDENTIFIER='yxwtr-bqkor-uwjaa-aaaaa-aeaaa-uaqca-aaaaa-a'
TOKENID='0'
PRICE=100_000_000  # No underscores in the number for bash scripting
echo "TOKENIDENTIFIER: $TOKENIDENTIFIER"
echo "PRICE: $PRICE"



# dfx canister call $CANISTER listprice '(principal "'$COLLECTION_ID'", record {token="'$TOKENIDENTIFIER'"; from_subaccount=null; price= opt '$PRICE'})';


# STEP-5
# Get the All NFT listing

dfx canister call $CANISTER listings '(principal "'$COLLECTION_ID'")';





# STEP-6
# Purchase NFT
BUYERIDENTIFIER='2ipdv-mwghn-c5x64-fkchv-hbvge-yobre-szmep-6ntkb-d3a3h-w5jg6-zqe';

# dfx canister call $CANISTER purchaseNft '(principal "'$COLLECTION_ID'","'$TOKENIDENTIFIER'",'$PRICE',"'$BUYERIDENTIFIER'")';

# (
#   variant {
#     ok = record {
#       "0b98262a0be0b89c30709980fa282263d29c9f2d8ff465135f466a0eb4a93834";
#       100_000_000 : nat64;
#     }
#   },
# )


# STEP-7
# Settelment NFT

