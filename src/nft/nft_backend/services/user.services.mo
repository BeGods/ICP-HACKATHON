import ExtCore "../../EXT-V2/motoko/ext/Core";
import Principal "mo:base/Principal";
import Result "mo:base/Result";
import Time "mo:base/Time";
import Array "mo:base/Array";
import Debug "mo:base/Debug";
import Nat "mo:base/Nat";
import Nat64 "mo:base/Nat64";
import Text "mo:base/Text";
import TrieMap "mo:base/TrieMap";
import MainTypes "../types/main.types";
import CollectionServices "collection.services";
import Pagin "../utils/pagin.utils";
import MarketplaceServices "marketplace.services";

module {
  public func create_user(
    accountIdentifier : Principal,
    uid : Text,
    usersArray : [MainTypes.User],
    userIdCounter : Nat,
  ) : async Result.Result<(MainTypes.User, Nat), Text> {

    // Check if user already exists
    let existingUser = Array.find<MainTypes.User>(
      usersArray,
      func(u : MainTypes.User) : Bool {
        u.accountIdentifier == accountIdentifier;
      },
    );

    switch (existingUser) {
      case (?_) { return #err("User already exists.") };
      case (null) {
        let newUserId = userIdCounter + 1;
        let currentTime = Time.now();

        let newUser : MainTypes.User = {
          uid = uid;
          id = newUserId;
          accountIdentifier = accountIdentifier;
          createdAt = currentTime;
        };

        return #ok((newUser, newUserId));
      };
    };
  };

  public func updateUserDetails(accountIdentifier : Principal, name : Text, email : Text, telegram : Text, profilePic : ?Blob, userDetailsMap : TrieMap.TrieMap<Principal, MainTypes.UserDetails>, usersArray : [MainTypes.User]) : async Result.Result<Text, Text> {
    // Check if the user exists in the usersArray created by the `create_user` function
    let existingUser = Array.find<MainTypes.User>(
      usersArray,
      func(u : MainTypes.User) : Bool {
        u.accountIdentifier == accountIdentifier;
      },
    );

    // If the user does not exist, return an error
    switch (existingUser) {
      case (null) {
        return #err("User not found. Please create a user before setting details.");
      };
      case (?_) {
        // If the user exists, proceed to store or update the user's name, email, telegram, and profile picture
        let userDetails : MainTypes.UserDetails = {
          name = name;
          email = email;
          telegram = telegram;
          profilepic = profilePic; // Use the renamed parameter
        };

        // Add or update user details in the userDetailsMap
        userDetailsMap.put(accountIdentifier, userDetails);

        return #ok("User details updated successfully.");
      };
    };
  };

  public func getUserDetails(accountIdentifier : Principal, userDetailsMap : TrieMap.TrieMap<Principal, MainTypes.UserDetails>, usersArray : [MainTypes.User]) : Result.Result<(Principal, Text, Nat, Text, Text, Text, ?Blob), Text> {
    // Check if the user exists in the usersArray (created by the create_user function)
    let existingUser = Array.find<MainTypes.User>(
      usersArray,
      func(u : MainTypes.User) : Bool {
        u.accountIdentifier == accountIdentifier;
      },
    );

    // If the user does not exist, return an error
    switch (existingUser) {
      case (null) {
        return #err("User not found.");
      };
      case (?foundUser) {
        // Fetch the user's details from the userDetailsMap
        let userDetails = userDetailsMap.get(accountIdentifier);

        switch (userDetails) {
          case (null) {
            // Return basic user information if additional details are not found
            return #ok((foundUser.accountIdentifier, foundUser.uid, foundUser.id, "No Name", "No Email", "No Telegram", null));
          };
          case (?details) {
            // Return the user's account identifier, uid, id, name, email, telegram, and profile picture
            return #ok((foundUser.accountIdentifier, foundUser.uid, foundUser.id, details.name, details.email, details.telegram, details.profilepic));
          };
        };
      };
    };
  };

  public func getAllUsers(chunkSize : Nat, pageNo : Nat, userDetailsMap : TrieMap.TrieMap<Principal, MainTypes.UserDetails>, usersArray : [MainTypes.User]) : Result.Result<{ data : [(Principal, Nat, Time.Time, Text, Text, ?Blob)]; current_page : Nat; total_pages : Nat }, Text> {

    // Map over the usersArray and extract the relevant fields
    let allUsersDetails = Array.map<MainTypes.User, (Principal, Nat, Time.Time, Text, Text, ?Blob)>(
      usersArray,
      func(u : MainTypes.User) : (Principal, Nat, Time.Time, Text, Text, ?Blob) {
        // Fetch user details from the userDetailsMap
        let userDetails = userDetailsMap.get(u.accountIdentifier);

        // Determine the name to return (if not found, return "No Name")
        let name = switch (userDetails) {
          case (null) "No Name"; // Default to "No Name" if details are not found
          case (?details) details.name; // Return the user's name if available
        };

        // Determine the email to return (if not found, return "No Email")
        let email = switch (userDetails) {
          case (null) "No Email"; // Default to "No Email" if details are not found
          case (?details) details.email; // Return the user's email if available
        };

        // Get the profile picture, if available
        let profilePic = switch (userDetails) {
          case (null) null; // No details found
          case (?details) details.profilepic; // Return the profile picture if available
        };

        // Return the user details including the profile picture
        return (u.accountIdentifier, u.id, u.createdAt, name, email, profilePic);
      },
    );

    // Paginate the results
    let index_pages = Pagin.paginate<(Principal, Nat, Time.Time, Text, Text, ?Blob)>(allUsersDetails, chunkSize);

    // Error handling for invalid page numbers or empty data
    if (index_pages.size() < pageNo) {
      return #err("Page not found");
    };

    if (index_pages.size() == 0) {
      return #err("No users found");
    };

    let users_page = index_pages[pageNo];

    // Return the paginated result
    return #ok({
      data = users_page;
      current_page = pageNo + 1;
      total_pages = index_pages.size();
    });
  };

  public func userNFTcollection(
    _collectionCanisterId : Principal,
    user : MainTypes.AccountIdentifier,
    chunkSize : Nat,
    pageNo : Nat,
  ) : async Result.Result<{ boughtNFTs : [(MainTypes.TokenIdentifier, MainTypes.TokenIndex, MainTypes.Metadata, Text, Principal, ?Nat64)]; unboughtNFTs : [(MainTypes.TokenIdentifier, MainTypes.TokenIndex, MainTypes.Metadata, Text, Principal, ?Nat64)]; current_page : Nat }, MainTypes.CommonError> {

    // Define the canister actor interface
    let collectionCanisterActor = actor (Principal.toText(_collectionCanisterId)) : actor {
      getAllNonFungibleTokenData : () -> async [(MainTypes.TokenIndex, MainTypes.AccountIdentifier, MainTypes.Metadata, ?Nat64)];
      getCollectionDetails : () -> async (Text, Text, Text);
    };

    // Fetch the collection name and details
    let (collectionName, _, _) = await collectionCanisterActor.getCollectionDetails();

    // Fetch all NFTs in the collection
    let allNFTs = await collectionCanisterActor.getAllNonFungibleTokenData();

    // Fetch the listings (unbought NFTs)
    let marketplaceListings = await MarketplaceServices.listings(_collectionCanisterId);

    var boughtNFTs : [(MainTypes.TokenIdentifier, MainTypes.TokenIndex, MainTypes.Metadata, Text, Principal, ?Nat64)] = [];
    var unboughtNFTs : [(MainTypes.TokenIdentifier, MainTypes.TokenIndex, MainTypes.Metadata, Text, Principal, ?Nat64)] = [];

    // Iterate through all NFTs in the collection
    for ((tokenIndex, nftOwner, metadata, price) in allNFTs.vals()) {
      let tokenIdentifier = ExtCore.TokenIdentifier.fromPrincipal(_collectionCanisterId, tokenIndex);

      // Check if the NFT is listed in the marketplace (unbought)
      let isListed = Array.find<(MainTypes.TokenIndex, MainTypes.TokenIdentifier, MainTypes.Listing, MainTypes.Metadata)>(
        marketplaceListings,
        func((listedIndex, _, _, _)) {
          listedIndex == tokenIndex;
        },
      );

      if (nftOwner == user) {
        // If the user owns the NFT, add it to the boughtNFTs list with its price
        boughtNFTs := Array.append(boughtNFTs, [(tokenIdentifier, tokenIndex, metadata, collectionName, _collectionCanisterId, price)]);
      } else if (isListed != null) {
        // Check if an NFT with the same name already exists in boughtNFTs or unboughtNFTs
        let nameExistsInBoughtNFTs = Array.find<((MainTypes.TokenIdentifier, MainTypes.TokenIndex, MainTypes.Metadata, Text, Principal, ?Nat64))>(
          boughtNFTs,
          func((_, _, existingMetadata, _, _, _)) {
            switch (existingMetadata) {
              case (#nonfungible(existingNftData)) {
                switch (metadata) {
                  case (#nonfungible(nftData)) {
                    return existingNftData.name == nftData.name;
                  };
                  case (_) { return false };
                };
              };
              case (_) { return false };
            };
          },
        );

        let nameExistsInUnboughtNFTs = Array.find<((MainTypes.TokenIdentifier, MainTypes.TokenIndex, MainTypes.Metadata, Text, Principal, ?Nat64))>(
          unboughtNFTs,
          func((_, _, existingMetadata, _, _, _)) {
            switch (existingMetadata) {
              case (#nonfungible(existingNftData)) {
                switch (metadata) {
                  case (#nonfungible(nftData)) {
                    return existingNftData.name == nftData.name;
                  };
                  case (_) { return false };
                };
              };
              case (_) { return false };
            };
          },
        );

        // If the name doesn't exist in either list, add the NFT to the unboughtNFTs list
        if (nameExistsInBoughtNFTs == null and nameExistsInUnboughtNFTs == null) {
          unboughtNFTs := Array.append(unboughtNFTs, [(tokenIdentifier, tokenIndex, metadata, collectionName, _collectionCanisterId, price)]);
        };
      };
    };

    // Paginate both boughtNFTs and unboughtNFTs
    let boughtNFTsPaginated = Pagin.paginate<(MainTypes.TokenIdentifier, MainTypes.TokenIndex, MainTypes.Metadata, Text, Principal, ?Nat64)>(boughtNFTs, chunkSize);
    let unboughtNFTsPaginated = Pagin.paginate<(MainTypes.TokenIdentifier, MainTypes.TokenIndex, MainTypes.Metadata, Text, Principal, ?Nat64)>(unboughtNFTs, chunkSize);

    // Check page availability for both lists
    if (boughtNFTsPaginated.size() <= pageNo and unboughtNFTsPaginated.size() <= pageNo) {
      return #err(#Other("Page not found"));
    };

    // Get the pages for both lists
    let boughtNFTsPage = if (pageNo < boughtNFTsPaginated.size()) {
      boughtNFTsPaginated[pageNo];
    } else { [] };
    let unboughtNFTsPage = if (pageNo < unboughtNFTsPaginated.size()) {
      unboughtNFTsPaginated[pageNo];
    } else { [] };

    // Return paginated boughtNFTs and unboughtNFTs
    return #ok({
      boughtNFTs = boughtNFTsPage;
      unboughtNFTs = unboughtNFTsPage;
      current_page = pageNo + 1;
      // total_pages = boughtNFTsPage.size();
      // total_pages_unbought = unboughtNFTsPage.size();
    });
  };

  public func useractivity(_collectionCanisterId : Principal, buyerId : MainTypes.AccountIdentifier) : async [(MainTypes.TokenIndex, MainTypes.TokenIdentifier, MainTypes.Transaction, Text)] {
    let transactionActor = actor (Principal.toText(_collectionCanisterId)) : actor {
      ext_marketplaceTransactions : () -> async [MainTypes.Transaction];
    };

    // Retrieve transactions from the collection canister
    let transactions = await transactionActor.ext_marketplaceTransactions();

    var transformedTransactions : [(MainTypes.TokenIndex, MainTypes.TokenIdentifier, MainTypes.Transaction, Text)] = [];

    // Iterate through each transaction
    for (transaction in transactions.vals()) {
      if (transaction.buyer == buyerId) {
        let tokenIdentifier = ExtCore.TokenIdentifier.fromPrincipal(_collectionCanisterId, transaction.token);

        // Fetch the collection details to get the name
        let collectionCanisterActor = actor (Principal.toText(_collectionCanisterId)) : actor {
          getCollectionDetails : () -> async (Text, Text, Text);
        };

        let (collectionName, _, _) = await collectionCanisterActor.getCollectionDetails();

        // Append the transformed transaction data
        transformedTransactions := Array.append(
          transformedTransactions,
          [(transaction.token, tokenIdentifier, transaction, collectionName)],
        );
      };
    };

    return transformedTransactions;
  };

  public func alluseractivity(buyerId : MainTypes.AccountIdentifier, chunkSize : Nat, pageNo : Nat, usersCollectionMap : TrieMap.TrieMap<Principal, [(Time.Time, Principal)]>) : async Result.Result<{ data : [(MainTypes.TokenIndex, MainTypes.TokenIdentifier, MainTypes.Transaction, Text)]; current_page : Nat; total_pages : Nat }, Text> {

    var allUserActivities : [(MainTypes.TokenIndex, MainTypes.TokenIdentifier, MainTypes.Transaction, Text)] = [];

    // Call getAllCollections to get all collections in the system
    let allCollections = await CollectionServices.getAllCollections(usersCollectionMap);

    // Iterate through each collection's details
    for ((_, collections) in allCollections.vals()) {
      for ((_, collectionCanisterId, collectionName, _, _) in collections.vals()) {
        let transactionActor = actor (Principal.toText(collectionCanisterId)) : actor {
          ext_marketplaceTransactions : () -> async [MainTypes.Transaction];
        };

        // Retrieve transactions from the collection canister
        try {
          let transactions = await transactionActor.ext_marketplaceTransactions();

          // Iterate through each transaction
          for (transaction in transactions.vals()) {
            if (transaction.buyer == buyerId) {
              let tokenIdentifier = ExtCore.TokenIdentifier.fromPrincipal(collectionCanisterId, transaction.token);

              // Append the transformed transaction data
              allUserActivities := Array.append(
                allUserActivities,
                [(transaction.token, tokenIdentifier, transaction, collectionName)],
              );
            };
          };

        } catch (e) {
          // Handle potential errors, but continue to the next collection
          Debug.print(Text.concat("Error fetching transactions from canister: ", Principal.toText(collectionCanisterId)));
        };
      };
    };

    // Apply pagination using the chunkSize and pageNo
    let index_pages = Pagin.paginate<(MainTypes.TokenIndex, MainTypes.TokenIdentifier, MainTypes.Transaction, Text)>(allUserActivities, chunkSize);

    if (index_pages.size() < pageNo) {
      return #err("Page not found");
    };

    if (index_pages.size() == 0) {
      return #err("No user activities found");
    };

    let userActivitiesPage = index_pages[pageNo];

    return #ok({
      data = userActivitiesPage;
      current_page = pageNo + 1;
      total_pages = index_pages.size();
    });
  };

  public func gethardcopy(
    accountIdentifier : Principal,
    uuid : Text,
    collectionCanisterId : Principal,
    phone : Text,
    email : Text,
    address : Text,
    city : Text,
    country : Text,
    pincode : Text,
    landmark : ?Text,
    usersArray : [MainTypes.User],
    orders : [MainTypes.Order],
    orderIdCounter : Nat,
  ) : (Result.Result<Text, Text>, [MainTypes.Order], Nat) {

    // Validate required fields
    if (phone == "") return (#err("Phone number is required."), orders, orderIdCounter);
    if (address == "") return (#err("Address is required."), orders, orderIdCounter);
    if (city == "") return (#err("City is required."), orders, orderIdCounter);
    if (country == "") return (#err("Country is required."), orders, orderIdCounter);
    if (pincode == "") return (#err("Pincode is required."), orders, orderIdCounter);

    // Find the user
    let existingUser = Array.find<MainTypes.User>(
      usersArray,
      func(u : MainTypes.User) : Bool {
        u.accountIdentifier == accountIdentifier;
      },
    );

    switch (existingUser) {
      case (null) {
        return (#err("User not found. Please create a user before placing an order."), orders, orderIdCounter);
      };
      case (?foundUser) {
        let newOrderId = orderIdCounter + 1;

        let newOrder : MainTypes.Order = {
          id = newOrderId;
          accountIdentifier = foundUser.accountIdentifier;
          uuid = uuid;
          collectionCanisterId = collectionCanisterId;
          phone = phone;
          email = email;
          address = address;
          city = city;
          country = country;
          pincode = pincode;
          landmark = landmark;
          orderTime = Time.now();
        };

        let updatedOrders = Array.append(orders, [newOrder]);

        return (
          #ok(
            "Order placed successfully for user with UUID: " # uuid #
            ". Order ID: " # Nat.toText(newOrderId)
          ),
          updatedOrders,
          newOrderId,
        );
      };
    };
  };
};
