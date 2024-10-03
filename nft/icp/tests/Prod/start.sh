
# dfx stop

# dfx start --clean --background


dfx identity use chandan;
dfx wallet balance --network ic;
./icrc2.sh
dfx deploy --network ic
# dfx deploy BeGod_frontend --network ic