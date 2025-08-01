# stop any existing local IC replicas
dfx stop

# start a fresh local replica
dfx start --clean --background

# install mokoto dependencies
mops install

# install npm dependencies
npm i

# run the script to deploy the ICP ledger canister (includes init args)
./scripts/icp-ledgers.sh

# run the script to deploy the ICP token canister (includes init args)
./scripts/icp-token.sh

# deploy internet identity locally
dfx deploy internet_identity

# deploy frontend
dfx deploy nft_frontend
