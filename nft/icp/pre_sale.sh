#!/bin/bash

# Define variables for the parameters
GROUPS=$(cat <<EOF
  record {
    name = "0_front";
    limit = (1, 1);
    start = 1625190000000;
    end = 1627791600000;
    pricing = vec {1,1};
    participants = vec {"aaaaa-aa"};
  };
EOF
)

REMAINING='variant { send = "5uy4n-h3luo-2ppfb-uxn23-p6xi7-6gz4p-zszjt-jbdll-rsuai-zeavq-nae" }'

AIRDROP=$(cat <<EOF
vec {
  "5uy4n-h3luo-2ppfb-uxn23-p6xi7-6gz4p-zszjt-jbdll-rsuai-zeavq-nae";
  "5uy4n-h3luo-2ppfb-uxn23-p6xi7-6gz4p-zszjt-jbdll-rsuai-zeavq-nae"
}
EOF
)

# Call the ext_saleOpen function
response=$(dfx canister call ext_v2 ext_saleOpen "(
  record {
    
  }
)")

# Print the response
echo "$response"