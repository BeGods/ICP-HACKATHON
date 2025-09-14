import Array "mo:base/Array";
import Principal "mo:base/Principal";
import Result "mo:base/Result";
import ExtCore "../../EXT-V2/motoko/ext/Core";
import Pagin "../utils/pagin.utils";
import MainTypes "../types/main.types";
import CollectionServices "collection.services";
import Debug "mo:base/Debug";
import Nat64 "mo:base/Nat64";
import Error "mo:base/Error";
import Text "mo:base/Text";
import TrieMap "mo:base/TrieMap";
import Time "mo:base/Time";

module {
  // EXT_ICP_LEDGER interface
  let ExternalService_ICPLedger = actor "ryjl3-tyaaa-aaaaa-aaaba-cai" : actor {
    send_dfx : shared MainTypes.SendArgs -> async Nat64;
    account_balance_dfx : shared query MainTypes.AccountBalanceArgs -> async MainTypes.ICPTs;
  };

  public func listings(_collectionCanisterId : Principal) : async [(MainTypes.TokenIndex, MainTypes.TokenIdentifier, MainTypes.Listing, MainTypes.Metadata)] {
    let priceListings = actor (Principal.toText(_collectionCanisterId)) : actor {
      ext_marketplaceListings : () -> async [(MainTypes.TokenIndex, MainTypes.Listing, MainTypes.Metadata)];
    };

    // Retrieve listings from the collection canister
    let listingData = await priceListings.ext_marketplaceListings();

    // Transform listing data to include TokenIdentifier alongside TokenIndex
    let transformedListingData = Array.map<(MainTypes.TokenIndex, MainTypes.Listing, MainTypes.Metadata), (MainTypes.TokenIndex, MainTypes.TokenIdentifier, MainTypes.Listing, MainTypes.Metadata)>(
      listingData,
      func((tokenIndex, listing, metadata) : (MainTypes.TokenIndex, MainTypes.Listing, MainTypes.Metadata)) : (MainTypes.TokenIndex, MainTypes.TokenIdentifier, MainTypes.Listing, MainTypes.Metadata) {
        let tokenIdentifier = ExtCore.TokenIdentifier.fromPrincipal(_collectionCanisterId, tokenIndex);
        return (tokenIndex, tokenIdentifier, listing, metadata);
      },
    );

    return transformedListingData;
  };

  public func plistings(
    _collectionCanisterId : Principal,
    chunkSize : Nat,
    pageNo : Nat,
  ) : async Result.Result<{ data : [(MainTypes.TokenIndex, MainTypes.TokenIdentifier, MainTypes.Listing, MainTypes.Metadata)]; current_page : Nat; total_pages : Nat }, Text> {
    let priceListings = actor (Principal.toText(_collectionCanisterId)) : actor {
      ext_marketplaceListings : () -> async [(MainTypes.TokenIndex, MainTypes.Listing, MainTypes.Metadata)];
    };

    // Retrieve listings from the collection canister
    let listingData = await priceListings.ext_marketplaceListings();

    // Transform listing data to include TokenIdentifier alongside TokenIndex
    let transformedListingData = Array.map<(MainTypes.TokenIndex, MainTypes.Listing, MainTypes.Metadata), (MainTypes.TokenIndex, MainTypes.TokenIdentifier, MainTypes.Listing, MainTypes.Metadata)>(
      listingData,
      func((tokenIndex, listing, metadata) : (MainTypes.TokenIndex, MainTypes.Listing, MainTypes.Metadata)) : (MainTypes.TokenIndex, MainTypes.TokenIdentifier, MainTypes.Listing, MainTypes.Metadata) {
        let tokenIdentifier = ExtCore.TokenIdentifier.fromPrincipal(_collectionCanisterId, tokenIndex);
        return (tokenIndex, tokenIdentifier, listing, metadata);
      },
    );

    // Apply pagination
    let paginatedListings = Pagin.paginate<(MainTypes.TokenIndex, MainTypes.TokenIdentifier, MainTypes.Listing, MainTypes.Metadata)>(transformedListingData, chunkSize);

    if (paginatedListings.size() < pageNo) {
      return #err("Page not found");
    };

    if (paginatedListings.size() == 0) {
      return #err("No listings found");
    };

    let listingPage = paginatedListings[pageNo];

    return #ok({
      data = listingPage;
      current_page = pageNo + 1;
      total_pages = paginatedListings.size();
    });
  };

  public func purchaseNft(_collectionCanisterId : Principal, tokenid : MainTypes.TokenIdentifier, price : Nat64, buyer : MainTypes.AccountIdentifier) : async Result.Result<(MainTypes.AccountIdentifier, Nat64), MainTypes.CommonError> {
    let buynft = actor (Principal.toText(_collectionCanisterId)) : actor {
      ext_marketplacePurchase : (tokenid : MainTypes.TokenIdentifier, price : Nat64, buyer : MainTypes.AccountIdentifier) -> async Result.Result<(MainTypes.AccountIdentifier, Nat64), MainTypes.CommonError>;
    };
    return await buynft.ext_marketplacePurchase(tokenid, price, buyer);
  };

  public func settlepurchase(_collectionCanisterId : Principal, paymentaddress : MainTypes.AccountIdentifier) : async Result.Result<(), MainTypes.CommonError> {

    let confirmpurchase = actor (Principal.toText(_collectionCanisterId)) : actor {
      ext_marketplaceSettle : (paymentaddress : MainTypes.AccountIdentifier) -> async Result.Result<(), MainTypes.CommonError>;
    };
    return await confirmpurchase.ext_marketplaceSettle(paymentaddress);
  };

  public func transactions(_collectionCanisterId : Principal) : async [(MainTypes.TokenIndex, MainTypes.TokenIdentifier, MainTypes.Transaction)] {
    let transactionActor = actor (Principal.toText(_collectionCanisterId)) : actor {
      ext_marketplaceTransactions : () -> async [MainTypes.Transaction];
    };

    // Retrieve transactions from the collection canister
    let transactions = await transactionActor.ext_marketplaceTransactions();

    // Transform transaction data to include TokenIdentifier alongside TokenIndex
    let transformedTransactions = Array.map<MainTypes.Transaction, (MainTypes.TokenIndex, MainTypes.TokenIdentifier, MainTypes.Transaction)>(
      transactions,
      func(transaction : MainTypes.Transaction) : (MainTypes.TokenIndex, MainTypes.TokenIdentifier, MainTypes.Transaction) {
        let tokenIdentifier = ExtCore.TokenIdentifier.fromPrincipal(_collectionCanisterId, transaction.token);
        return (transaction.token, tokenIdentifier, transaction);
      },
    );

    return transformedTransactions;
  };

  public func alltransactions(chunkSize : Nat, pageNo : Nat, usersCollectionMap : TrieMap.TrieMap<Principal, [(Time.Time, Principal)]>) : async Result.Result<{ data : [(MainTypes.TokenIndex, MainTypes.TokenIdentifier, MainTypes.Transaction)]; current_page : Nat; total_pages : Nat }, Text> {

    var allTransactions : [(MainTypes.TokenIndex, MainTypes.TokenIdentifier, MainTypes.Transaction)] = [];

    // Call getAllCollections to get all collections in the system
    let allCollections = await CollectionServices.getAllCollections(usersCollectionMap);

    // Iterate through each collection's details
    for ((_, collections) in allCollections.vals()) {
      for ((_, collectionCanisterId, _, _, _) in collections.vals()) {
        let transactionActor = actor (Principal.toText(collectionCanisterId)) : actor {
          ext_marketplaceTransactions : () -> async [MainTypes.Transaction];
        };

        // Retrieve transactions from the collection canister
        try {
          let transactions = await transactionActor.ext_marketplaceTransactions();

          // Transform transaction data to include TokenIdentifier alongside TokenIndex
          let transformedTransactions = Array.map<MainTypes.Transaction, (MainTypes.TokenIndex, MainTypes.TokenIdentifier, MainTypes.Transaction)>(
            transactions,
            func(transaction : MainTypes.Transaction) : (MainTypes.TokenIndex, MainTypes.TokenIdentifier, MainTypes.Transaction) {
              let tokenIdentifier = ExtCore.TokenIdentifier.fromPrincipal(collectionCanisterId, transaction.token);
              return (transaction.token, tokenIdentifier, transaction);
            },
          );

          // Append the transformed transactions to the allTransactions list
          allTransactions := Array.append(allTransactions, transformedTransactions);

        } catch (e) {
          // Handle potential errors, but continue to the next collection
          Debug.print(Text.concat("Error fetching transactions from canister: ", Principal.toText(collectionCanisterId)));
        };
      };
    };

    // Apply pagination using the chunkSize and pageNo
    let index_pages = Pagin.paginate<(MainTypes.TokenIndex, MainTypes.TokenIdentifier, MainTypes.Transaction)>(allTransactions, chunkSize);

    if (index_pages.size() < pageNo) {
      return #err("Page not found");
    };

    if (index_pages.size() == 0) {
      return #err("No transactions found");
    };

    let transactionsPage = index_pages[pageNo];

    return #ok({
      data = transactionsPage;
      current_page = pageNo + 1;
      total_pages = index_pages.size();
    });
  };

  public func transfer_balance(
    _collectionCanisterId : Principal,
    paymentAddress : MainTypes.AccountIdentifier,
    amount_e8s : Nat64,
    subaccount : ?MainTypes.SubAccount,
  ) : async Result.Result<Nat64, MainTypes.CommonError> {

    try {
      // Prepare the arguments for the ICP ledger transfer
      let send_args = {
        memo = 0 : Nat64; // Memo set to 0, explicitly typed as Nat64
        amount = { e8s = amount_e8s }; // Transfer amount in e8s
        fee = { e8s = 10000 : Nat64 }; // Transaction fee in e8s (0.0001 ICP)
        from_subaccount = subaccount; // Subaccount for the buyer, if any
        to = paymentAddress; // Recipient is the seller's account
        created_at_time = null : ?MainTypes.Time; // Optional timestamp, explicitly typed as null
      };

      // Debugging the send arguments
      Debug.print("Sending args: ");

      // Call the ledger's send_dfx method to transfer funds
      let block_height = await ExternalService_ICPLedger.send_dfx(send_args);

      // Return the block height upon successful transaction
      Debug.print("Transfer successful, block height: " # debug_show (block_height));
      return #ok(block_height);

    } catch (err) {
      // Handle the error and return an appropriate CommonError variant
      Debug.print("Transfer failed with error.");
      // Here we check if the error is related to an invalid token or some other issue
      let errorMessage = "Transfer Failed: " # Error.message(err);
      return #err(#Other(errorMessage));
    };
  };

  public func send_balance_and_nft(
    _collectionCanisterId : Principal,
    paymentAddress : MainTypes.AccountIdentifier,
    amount_e8s : Nat64,
    subaccount : ?MainTypes.SubAccount,
  ) : async Result.Result<Nat64, MainTypes.CommonError> {
    try {
      // Prepare the arguments for the ICP ledger transfer
      let send_args = {
        memo = 0 : Nat64; // Memo set to 0, explicitly typed as Nat64
        amount = { e8s = amount_e8s }; // Transfer amount in e8s
        fee = { e8s = 10000 : Nat64 }; // Transaction fee in e8s (0.0001 ICP)
        from_subaccount = subaccount; // Subaccount for the buyer, if any
        to = paymentAddress; // Recipient is the seller's account
        created_at_time = null : ?MainTypes.Time; // Optional timestamp, explicitly typed as null
      };

      // Debugging the send arguments
      Debug.print("Sending args: " # debug_show (send_args));

      // Call the ledger's send_dfx method to transfer funds
      let block_height : Nat64 = await ExternalService_ICPLedger.send_dfx(send_args);
      Debug.print("Transfer successful, block height: " # Nat64.toText(block_height));

      // Call the marketplace settle method after successful transfer
      let marketplaceActor = actor (Principal.toText(_collectionCanisterId)) : actor {
        ext_marketplaceSettle : (paymentAddress : MainTypes.AccountIdentifier) -> async Result.Result<(), MainTypes.CommonError>;
      };

      switch (await marketplaceActor.ext_marketplaceSettle(paymentAddress)) {
        case (#ok _) {
          Debug.print("NFT settle successful.");
          return #ok(block_height); // Return block height upon successful transaction and NFT settle
        };
        case (#err e) {
          return #err(#Other("NFT settle failed:"));
        };
      };

    } catch (err) {
      // Handle any unexpected errors and return an appropriate error message
      Debug.print("Unexpected error occurred during transfer and NFT settle.");
      let errorMessage = "Unexpected Transfer Failed: " # Error.message(err);
      return #err(#Other(errorMessage));
    };
  };

};
