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
import Nat "mo:base/Nat";
import Nat32 "mo:base/Nat32";

module {
  // EXT_ICP_LEDGER interface
  let ExternalService_ICPLedger = actor "ryjl3-tyaaa-aaaaa-aaaba-cai" : actor {
    send_dfx : shared MainTypes.SendArgs -> async Nat64;
    account_balance_dfx : shared query MainTypes.AccountBalanceArgs -> async MainTypes.ICPTs;
  };

  public func listings(_collectionCanisterId : Principal) : async [(MainTypes.TokenIndex, MainTypes.TokenIdentifier, MainTypes.Listing, MainTypes.Metadata)] {
    Debug.print("=== LISTINGS START ===");
    Debug.print("Collection Canister ID: " # Principal.toText(_collectionCanisterId));

    try {
      let priceListings = actor (Principal.toText(_collectionCanisterId)) : actor {
        ext_marketplaceListings : () -> async [(MainTypes.TokenIndex, MainTypes.Listing, MainTypes.Metadata)];
      };

      Debug.print("Calling ext_marketplaceListings...");
      let listingData = await priceListings.ext_marketplaceListings();
      Debug.print("Raw listings count: " # Nat.toText(listingData.size()));

      // Transform listing data to include TokenIdentifier alongside TokenIndex
      let transformedListingData = Array.map<(MainTypes.TokenIndex, MainTypes.Listing, MainTypes.Metadata), (MainTypes.TokenIndex, MainTypes.TokenIdentifier, MainTypes.Listing, MainTypes.Metadata)>(
        listingData,
        func((tokenIndex, listing, metadata) : (MainTypes.TokenIndex, MainTypes.Listing, MainTypes.Metadata)) : (MainTypes.TokenIndex, MainTypes.TokenIdentifier, MainTypes.Listing, MainTypes.Metadata) {
          let tokenIdentifier = ExtCore.TokenIdentifier.fromPrincipal(_collectionCanisterId, tokenIndex);
          Debug.print("TokenIndex: " # Nat32.toText(tokenIndex) # " → TokenIdentifier: " # tokenIdentifier);
          Debug.print("  Price: " # Nat64.toText(listing.price));
          return (tokenIndex, tokenIdentifier, listing, metadata);
        },
      );

      Debug.print("Transformed listings count: " # Nat.toText(transformedListingData.size()));
      Debug.print("=== LISTINGS END ===");
      return transformedListingData;

    } catch (e) {
      Debug.print("ERROR in listings: " # Error.message(e));
      Debug.print("=== LISTINGS FAILED ===");
      return [];
    };
  };

  public func plistings(
    _collectionCanisterId : Principal,
    chunkSize : Nat,
    pageNo : Nat,
  ) : async Result.Result<{ data : [(MainTypes.TokenIndex, MainTypes.TokenIdentifier, MainTypes.Listing, MainTypes.Metadata)]; current_page : Nat; total_pages : Nat }, Text> {

    Debug.print("=== PAGINATED LISTINGS START ===");
    Debug.print("Collection ID: " # Principal.toText(_collectionCanisterId));
    Debug.print("Chunk Size: " # Nat.toText(chunkSize) # ", Page No: " # Nat.toText(pageNo));

    try {
      let priceListings = actor (Principal.toText(_collectionCanisterId)) : actor {
        ext_marketplaceListings : () -> async [(MainTypes.TokenIndex, MainTypes.Listing, MainTypes.Metadata)];
      };

      let listingData = await priceListings.ext_marketplaceListings();
      Debug.print("Retrieved " # Nat.toText(listingData.size()) # " listings");

      // Transform listingData to include TokenIdentifier
      let transformedListingData = Array.map<(MainTypes.TokenIndex, MainTypes.Listing, MainTypes.Metadata), (MainTypes.TokenIndex, MainTypes.TokenIdentifier, MainTypes.Listing, MainTypes.Metadata)>(
        listingData,
        func((tokenIndex, listing, metadata)) {
          let tokenIdentifier = ExtCore.TokenIdentifier.fromPrincipal(_collectionCanisterId, tokenIndex);
          return (tokenIndex, tokenIdentifier, listing, metadata);
        },
      );

      let paginatedListings = Pagin.paginate(transformedListingData, chunkSize);
      Debug.print("Total pages created: " # Nat.toText(paginatedListings.size()));

      if (paginatedListings.size() == 0) {
        Debug.print("ERROR: No listings found");
        return #err("No listings found");
      };

      if (pageNo >= paginatedListings.size()) {
        Debug.print("ERROR: Page " # Nat.toText(pageNo) # " not found. Max pages: " # Nat.toText(paginatedListings.size()));
        return #err("Page not found");
      };

      let listingPage = paginatedListings[pageNo];
      Debug.print("Page " # Nat.toText(pageNo) # " contains " # Nat.toText(listingPage.size()) # " items");
      Debug.print("=== PAGINATED LISTINGS SUCCESS ===");

      return #ok({
        data = listingPage;
        current_page = pageNo + 1;
        total_pages = paginatedListings.size();
      });

    } catch (e) {
      let errorMsg = "Paginated listings failed: " # Error.message(e);
      Debug.print("ERROR: " # errorMsg);
      Debug.print("=== PAGINATED LISTINGS FAILED ===");
      return #err(errorMsg);
    };
  };

  public func purchaseNft(_collectionCanisterId : Principal, tokenid : MainTypes.TokenIdentifier, price : Nat64, buyer : MainTypes.AccountIdentifier) : async Result.Result<(MainTypes.AccountIdentifier, Nat64), MainTypes.CommonError> {
    Debug.print("=== PURCHASE NFT START ===");
    Debug.print("Collection ID: " # Principal.toText(_collectionCanisterId));
    Debug.print("TokenIdentifier: " # tokenid);
    Debug.print("Price: " # Nat64.toText(price));
    Debug.print("Buyer: " # buyer);

    try {
      let buynft = actor (Principal.toText(_collectionCanisterId)) : actor {
        ext_marketplacePurchase : (tokenid : MainTypes.TokenIdentifier, price : Nat64, buyer : MainTypes.AccountIdentifier) -> async Result.Result<(MainTypes.AccountIdentifier, Nat64), MainTypes.CommonError>;
      };

      Debug.print("Calling ext_marketplacePurchase...");
      let result = await buynft.ext_marketplacePurchase(tokenid, price, buyer);

      switch (result) {
        case (#ok(paymentAddress, actualPrice)) {
          Debug.print("Purchase SUCCESS!");
          Debug.print("Payment Address: " # paymentAddress);
          Debug.print("Actual Price: " # Nat64.toText(actualPrice));
          Debug.print("=== PURCHASE NFT SUCCESS ===");
        };
        case (#err error) {
          Debug.print("Purchase FAILED with error: " # debug_show (error));
          Debug.print("=== PURCHASE NFT FAILED ===");
        };
      };

      return result;

    } catch (e) {
      let errorMsg = "Purchase NFT exception: " # Error.message(e);
      Debug.print("ERROR: " # errorMsg);
      Debug.print("=== PURCHASE NFT EXCEPTION ===");
      return #err(#Other(errorMsg));
    };
  };

  public func settlepurchase(_collectionCanisterId : Principal, paymentaddress : MainTypes.AccountIdentifier) : async Result.Result<(), MainTypes.CommonError> {
    Debug.print("=== SETTLE PURCHASE START ===");
    Debug.print("Collection ID: " # Principal.toText(_collectionCanisterId));
    Debug.print("Payment Address: " # paymentaddress);

    try {
      let confirmpurchase = actor (Principal.toText(_collectionCanisterId)) : actor {
        ext_marketplaceSettle : (paymentaddress : MainTypes.AccountIdentifier) -> async Result.Result<(), MainTypes.CommonError>;
      };

      Debug.print("Calling ext_marketplaceSettle...");
      let result = await confirmpurchase.ext_marketplaceSettle(paymentaddress);

      switch (result) {
        case (#ok _) {
          Debug.print("Settlement SUCCESS!");
          Debug.print("=== SETTLE PURCHASE SUCCESS ===");
        };
        case (#err error) {
          Debug.print("Settlement FAILED with error: " # debug_show (error));
          Debug.print("=== SETTLE PURCHASE FAILED ===");
        };
      };

      return result;

    } catch (e) {
      let errorMsg = "Settle purchase exception: " # Error.message(e);
      Debug.print("ERROR: " # errorMsg);
      Debug.print("=== SETTLE PURCHASE EXCEPTION ===");
      return #err(#Other(errorMsg));
    };
  };

  public func transactions(_collectionCanisterId : Principal) : async [(MainTypes.TokenIndex, MainTypes.TokenIdentifier, MainTypes.Transaction)] {
    Debug.print("=== TRANSACTIONS START ===");
    Debug.print("Collection ID: " # Principal.toText(_collectionCanisterId));

    try {
      let transactionActor = actor (Principal.toText(_collectionCanisterId)) : actor {
        ext_marketplaceTransactions : () -> async [MainTypes.Transaction];
      };

      Debug.print("Calling ext_marketplaceTransactions...");
      let transactions = await transactionActor.ext_marketplaceTransactions();
      Debug.print("Retrieved " # Nat.toText(transactions.size()) # " transactions");

      let transformedTransactions = Array.map<MainTypes.Transaction, (MainTypes.TokenIndex, MainTypes.TokenIdentifier, MainTypes.Transaction)>(
        transactions,
        func(transaction : MainTypes.Transaction) : (MainTypes.TokenIndex, MainTypes.TokenIdentifier, MainTypes.Transaction) {
          let tokenIdentifier = ExtCore.TokenIdentifier.fromPrincipal(_collectionCanisterId, transaction.token);
          Debug.print("Transaction - TokenIndex: " # Nat32.toText(transaction.token) # " → TokenIdentifier: " # tokenIdentifier);
          Debug.print("  Seller: " # transaction.seller # " → Buyer: " # transaction.buyer);
          Debug.print("  Price: " # Nat64.toText(transaction.price));
          return (transaction.token, tokenIdentifier, transaction);
        },
      );

      Debug.print("Transformed " # Nat.toText(transformedTransactions.size()) # " transactions");
      Debug.print("=== TRANSACTIONS SUCCESS ===");
      return transformedTransactions;

    } catch (e) {
      Debug.print("ERROR in transactions: " # Error.message(e));
      Debug.print("=== TRANSACTIONS FAILED ===");
      return [];
    };
  };

  public func transfer_balance(
    _collectionCanisterId : Principal,
    paymentAddress : MainTypes.AccountIdentifier,
    amount_e8s : Nat64,
    subaccount : ?MainTypes.SubAccount,
  ) : async Result.Result<Nat64, MainTypes.CommonError> {
    Debug.print("=== TRANSFER BALANCE START ===");
    Debug.print("Collection ID: " # Principal.toText(_collectionCanisterId));
    Debug.print("Payment Address: " # paymentAddress);
    Debug.print("Amount (e8s): " # Nat64.toText(amount_e8s));
    Debug.print("Subaccount: " # debug_show (subaccount));

    try {
      let send_args = {
        memo = 0 : Nat64;
        amount = { e8s = amount_e8s };
        fee = { e8s = 10000 : Nat64 };
        from_subaccount = subaccount;
        to = paymentAddress;
        created_at_time = null : ?MainTypes.Time;
      };

      Debug.print("Send args prepared: " # debug_show (send_args));
      Debug.print("Calling ICP Ledger send_dfx...");

      let block_height = await ExternalService_ICPLedger.send_dfx(send_args);

      Debug.print("Transfer successful! Block height: " # Nat64.toText(block_height));
      Debug.print("=== TRANSFER BALANCE SUCCESS ===");
      return #ok(block_height);

    } catch (err) {
      let errorMessage = "Transfer Failed: " # Error.message(err);
      Debug.print("ERROR: " # errorMessage);
      Debug.print("=== TRANSFER BALANCE FAILED ===");
      return #err(#Other(errorMessage));
    };
  };

  public func send_balance_and_nft(
    _collectionCanisterId : Principal,
    paymentAddress : MainTypes.AccountIdentifier,
    amount_e8s : Nat64,
    subaccount : ?MainTypes.SubAccount,
  ) : async Result.Result<Nat64, MainTypes.CommonError> {
    Debug.print("=== SEND BALANCE AND NFT START ===");
    Debug.print("Collection ID: " # Principal.toText(_collectionCanisterId));
    Debug.print("Payment Address: " # paymentAddress);
    Debug.print("Amount (e8s): " # Nat64.toText(amount_e8s));

    try {
      let send_args = {
        memo = 0 : Nat64;
        amount = { e8s = amount_e8s };
        fee = { e8s = 10000 : Nat64 };
        from_subaccount = subaccount;
        to = paymentAddress;
        created_at_time = null : ?MainTypes.Time;
      };

      Debug.print("Send args: " # debug_show (send_args));
      Debug.print("Step 1: Transferring balance...");

      let block_height : Nat64 = await ExternalService_ICPLedger.send_dfx(send_args);
      Debug.print("Balance transfer successful! Block height: " # Nat64.toText(block_height));

      Debug.print("Step 2: Settling NFT purchase...");
      let marketplaceActor = actor (Principal.toText(_collectionCanisterId)) : actor {
        ext_marketplaceSettle : (paymentAddress : MainTypes.AccountIdentifier) -> async Result.Result<(), MainTypes.CommonError>;
      };

      let settleResult = await marketplaceActor.ext_marketplaceSettle(paymentAddress);

      switch (settleResult) {
        case (#ok _) {
          Debug.print("NFT settle successful!");
          Debug.print("=== SEND BALANCE AND NFT SUCCESS ===");
          return #ok(block_height);
        };
        case (#err e) {
          Debug.print("NFT settle failed: " # debug_show (e));
          Debug.print("=== SEND BALANCE AND NFT - SETTLE FAILED ===");
          return #err(#Other("NFT settle failed"));
        };
      };

    } catch (err) {
      let errorMessage = "Unexpected Transfer Failed: " # Error.message(err);
      Debug.print("ERROR: " # errorMessage);
      Debug.print("=== SEND BALANCE AND NFT EXCEPTION ===");
      return #err(#Other(errorMessage));
    };
  };

  // Keep the existing alltransactions function with added debugging
  public func alltransactions(chunkSize : Nat, pageNo : Nat, usersCollectionMap : TrieMap.TrieMap<Principal, [(Time.Time, Principal)]>) : async Result.Result<{ data : [(MainTypes.TokenIndex, MainTypes.TokenIdentifier, MainTypes.Transaction)]; current_page : Nat; total_pages : Nat }, Text> {
    Debug.print("=== ALL TRANSACTIONS START ===");
    Debug.print("Chunk Size: " # Nat.toText(chunkSize) # ", Page No: " # Nat.toText(pageNo));

    var allTransactions : [(MainTypes.TokenIndex, MainTypes.TokenIdentifier, MainTypes.Transaction)] = [];

    try {
      let allCollections = await CollectionServices.getAllCollections(usersCollectionMap);
      Debug.print("Found " # Nat.toText(allCollections.size()) # " collection groups");

      for ((_, collections) in allCollections.vals()) {
        for ((_, collectionCanisterId, _, _, _) in collections.vals()) {
          Debug.print("Fetching transactions from: " # Principal.toText(collectionCanisterId));

          let transactionActor = actor (Principal.toText(collectionCanisterId)) : actor {
            ext_marketplaceTransactions : () -> async [MainTypes.Transaction];
          };

          try {
            let transactions = await transactionActor.ext_marketplaceTransactions();
            Debug.print("  Retrieved " # Nat.toText(transactions.size()) # " transactions");

            let transformedTransactions = Array.map<MainTypes.Transaction, (MainTypes.TokenIndex, MainTypes.TokenIdentifier, MainTypes.Transaction)>(
              transactions,
              func(transaction : MainTypes.Transaction) : (MainTypes.TokenIndex, MainTypes.TokenIdentifier, MainTypes.Transaction) {
                let tokenIdentifier = ExtCore.TokenIdentifier.fromPrincipal(collectionCanisterId, transaction.token);
                return (transaction.token, tokenIdentifier, transaction);
              },
            );

            allTransactions := Array.append(allTransactions, transformedTransactions);

          } catch (e) {
            Debug.print("  ERROR fetching from " # Principal.toText(collectionCanisterId) # ": " # Error.message(e));
          };
        };
      };

      Debug.print("Total transactions collected: " # Nat.toText(allTransactions.size()));

      let index_pages = Pagin.paginate<(MainTypes.TokenIndex, MainTypes.TokenIdentifier, MainTypes.Transaction)>(allTransactions, chunkSize);
      Debug.print("Created " # Nat.toText(index_pages.size()) # " pages");

      if (index_pages.size() < pageNo) {
        Debug.print("ERROR: Page not found");
        return #err("Page not found");
      };

      if (index_pages.size() == 0) {
        Debug.print("ERROR: No transactions found");
        return #err("No transactions found");
      };

      let transactionsPage = index_pages[pageNo];
      Debug.print("=== ALL TRANSACTIONS SUCCESS ===");

      return #ok({
        data = transactionsPage;
        current_page = pageNo + 1;
        total_pages = index_pages.size();
      });

    } catch (e) {
      let errorMsg = "All transactions failed: " # Error.message(e);
      Debug.print("ERROR: " # errorMsg);
      Debug.print("=== ALL TRANSACTIONS FAILED ===");
      return #err(errorMsg);
    };
  };

};
