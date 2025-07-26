# stop any existing local IC replicas
dfx stop

# start a fresh local replica
dfx start --clean --background

# install mokoto dependencies
mops install

# install npm dependencies
npm i

# run the script to deploy the ICP ledger canister (includes init args)
./icp-ledgers.sh

# run the script to deploy the ICP token canister (includes init args)
./icp-token.sh

# deploy backend
dfx deploy nft_backend

# deploy frontend
dfx deploy nft_frontend
