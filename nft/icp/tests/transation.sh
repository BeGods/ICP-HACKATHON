#!/bin/bash

# Exit immediately if a command exits with a non-zero status
set -e


dfx canister call  ryjl3-tyaaa-aaaaa-aaaba-cai send_dfx '(record { 
    to = "af110b0d0563339ae4e479ff74de7894afcbc7a32db9dff03ba09b07116632aa";
    from = "ba96ae20af581537415523b29c1ce06228fb19d31043a0a0a61adc31845e15f7"; 
    amount = record { e8s = 1000000000 : nat64 }; 
    fee = record { e8s = 10000 : nat64 }; 
    memo = 0; 
    created_at_time = null;
})'