dfx identity use yyy
PRINCIPAL=$(dfx --identity yyy identity get-principal)
dfx deploy --argument "(principal \"${PRINCIPAL}\")" 
dfx ledger fabricate-cycles --all  

# http://127.0.0.1:8000/?canisterId=rrkah-fqaaa-aaaaa-aaaaq-cai&index=0 

# href="https://rrkah-fqaaa-aaaaa-aaaaq-cai.ic0.app/?index=0"