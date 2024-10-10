#/bin/bash

# Number of users to create
num_users=20
output_file="user_principals.txt"

# Ensure the output file is empty before we start
> $output_file

# Function to create a user
create_user() {
    local account_identifier=$1
    local uid=$2

    # Call the Motoko function via dfx
    dfx canister call BeGod_backend create_user "(principal \"$account_identifier\", \"$uid\")"
}

# Loop to create multiple users
for i in $(seq 1 $num_users); do
    # Create a new identity with a unique name, without encryption to avoid passphrase prompts
    identity_name="user_$i"
    dfx identity new $identity_name --disable-encryption

    # Switch to the newly created identity
    dfx identity use $identity_name

    # Get the principal associated with this identity
    account_identifier=$(dfx identity get-principal)

    # Generate a unique uid
    uid="user_$i"

    # Create the user
    echo "Creating user $i with UID: $uid and Account ID: $account_identifier"
    create_user $account_identifier $uid

    # Save the principal to the output file
    echo "$identity_name: $account_identifier" >> $output_file

    # Optional: Add a small delay if needed
    sleep 1
done

# Switch back to the original identity after the loop
dfx identity use default

echo "User creation complete. Principals stored in $output_file."