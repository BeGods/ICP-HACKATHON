

# REPLY=$(dfx canister call ext_v2  ext_setCollectionMetadata '(
#   "0_front",
#   "bhanu"
# )' )

# echo $REPLY


# LIST=$(dfx canister call ext_v2 ext_marketplaceList '(
#   record {
#     token="0_front";
#   }
# )')

# echo $LIST

# MATKET=$(dfx canister call ext_v2 ext_marketplaceList '(record {token="rrkah-fqaaa-aaaaa-aaaaq-cai"; from_subaccount=opt vec {1}; price=opt 1})')

# echo $MATKET

SALE=$(dfx canister call ext_v2 ext_saleOpen '(vec {}, variant {send="5uy4n-h3luo-2ppfb-uxn23-p6xi7-6gz4p-zszjt-jbdll-rsuai-zeavq-nae"}, vec {})')
echo $SALE