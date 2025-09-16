import ExtTokenClass "../../EXT-V2/ext_v2/v2";
import ExtCore "../../EXT-V2/motoko/ext/Core";
import Queue "../../EXT-V2/motoko/util/Queue";
import Types "../../EXT-V2/Types";
import V2 "../../EXT-V2/ext_v2/v2";
import _owners "../../EXT-V2/ext_v2/v2";
import ExtCommon "../../EXT-V2/motoko/ext/Common";
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
import MainUtils "../utils/main.utils";
import Buffer "mo:base/Buffer";

module {
  public func create_user(
    accountIdentifier : Principal,
    uid : Text,
    usersArray : [MainTypes.User],
    userIdCounter : Nat,
  ) : async Result.Result<(MainTypes.User, Nat), Text> {
    Debug.print("Creating user - Account: " # Principal.toText(accountIdentifier));

    try {
      let existingUser = Array.find<MainTypes.User>(
        usersArray,
        func(u : MainTypes.User) : Bool {
          u.accountIdentifier == accountIdentifier;
        },
      );

      switch (existingUser) {
        case (?_) {
          Debug.print("User already exists");
          return #err("User already exists.");
        };
        case (null) {
          let newUserId = userIdCounter + 1;
          let currentTime = Time.now();

          let newUser : MainTypes.User = {
            uid = uid;
            id = newUserId;
            accountIdentifier = accountIdentifier;
            createdAt = currentTime;
          };

          Debug.print("User created successfully - ID: " # Nat.toText(newUserId));
          return #ok((newUser, newUserId));
        };
      };
    } catch (e) {
      return #err("Failed to create user");
    };
  };

  public func updateUserDetails(
    accountIdentifier : Principal,
    name : Text,
    email : Text,
    telegram : Text,
    profilePic : ?Blob,
    userDetailsMap : TrieMap.TrieMap<Principal, MainTypes.UserDetails>,
    usersArray : [MainTypes.User],
  ) : async Result.Result<Text, Text> {
    Debug.print("Updating user details - Account: " # Principal.toText(accountIdentifier));

    try {
      let existingUser = Array.find<MainTypes.User>(
        usersArray,
        func(u : MainTypes.User) : Bool {
          u.accountIdentifier == accountIdentifier;
        },
      );

      switch (existingUser) {
        case (null) {
          Debug.print("User not found for update");
          return #err("User not found. Please create a user before setting details.");
        };
        case (?_) {
          let userDetails : MainTypes.UserDetails = {
            name = name;
            email = email;
            telegram = telegram;
            profilepic = profilePic;
          };

          userDetailsMap.put(accountIdentifier, userDetails);
          Debug.print("User details updated successfully");
          return #ok("User details updated successfully.");
        };
      };
    } catch (e) {
      return #err("Failed to update user details");
    };
  };

  public func getUserDetails(
    accountIdentifier : Principal,
    userDetailsMap : TrieMap.TrieMap<Principal, MainTypes.UserDetails>,
    usersArray : [MainTypes.User],
  ) : Result.Result<(Principal, Text, Nat, Text, Text, Text, ?Blob), Text> {
    Debug.print("Getting user details - Account: " # Principal.toText(accountIdentifier));

    let existingUser = Array.find<MainTypes.User>(
      usersArray,
      func(u : MainTypes.User) : Bool {
        u.accountIdentifier == accountIdentifier;
      },
    );

    switch (existingUser) {
      case (null) {
        Debug.print("User not found");
        return #err("User not found.");
      };
      case (?foundUser) {
        let userDetails = userDetailsMap.get(accountIdentifier);

        switch (userDetails) {
          case (null) {
            Debug.print("Basic user info returned - no additional details");
            return #ok((foundUser.accountIdentifier, foundUser.uid, foundUser.id, "No Name", "No Email", "No Telegram", null));
          };
          case (?details) {
            Debug.print("Full user details returned");
            return #ok((foundUser.accountIdentifier, foundUser.uid, foundUser.id, details.name, details.email, details.telegram, details.profilepic));
          };
        };
      };
    };

  };

  public func getAllUsers(
    chunkSize : Nat,
    pageNo : Nat,
    userDetailsMap : TrieMap.TrieMap<Principal, MainTypes.UserDetails>,
    usersArray : [MainTypes.User],
  ) : Result.Result<{ data : [(Principal, Nat, Time.Time, Text, Text, ?Blob)]; current_page : Nat; total_pages : Nat }, Text> {
    Debug.print("Getting all users - Chunk: " # Nat.toText(chunkSize) # ", Page: " # Nat.toText(pageNo));

    let allUsersDetails = Array.map<MainTypes.User, (Principal, Nat, Time.Time, Text, Text, ?Blob)>(
      usersArray,
      func(u : MainTypes.User) : (Principal, Nat, Time.Time, Text, Text, ?Blob) {
        let userDetails = userDetailsMap.get(u.accountIdentifier);

        let name = switch (userDetails) {
          case (null) "No Name";
          case (?details) details.name;
        };

        let email = switch (userDetails) {
          case (null) "No Email";
          case (?details) details.email;
        };

        let profilePic = switch (userDetails) {
          case (null) null;
          case (?details) details.profilepic;
        };

        return (u.accountIdentifier, u.id, u.createdAt, name, email, profilePic);
      },
    );

    let index_pages = Pagin.paginate<(Principal, Nat, Time.Time, Text, Text, ?Blob)>(allUsersDetails, chunkSize);
    Debug.print("Total users: " # Nat.toText(allUsersDetails.size()) # ", Pages: " # Nat.toText(index_pages.size()));

    if (index_pages.size() < pageNo) {
      Debug.print("Page not found");
      return #err("Page not found");
    };

    if (index_pages.size() == 0) {
      Debug.print("No users found");
      return #err("No users found");
    };

    let users_page = index_pages[pageNo];
    Debug.print("Returning " # Nat.toText(users_page.size()) # " users for page " # Nat.toText(pageNo));

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
    Debug.print("Getting NFTs for user: " # user # " in collection: " # Principal.toText(_collectionCanisterId));

    try {
      let collectionCanisterActor = actor (Principal.toText(_collectionCanisterId)) : actor {
        getAllNonFungibleTokenData : () -> async [(MainTypes.TokenIndex, MainTypes.AccountIdentifier, MainTypes.Metadata, ?Nat64)];
        getCollectionDetails : () -> async (Text, Text, Text);
      };

      let (collectionName, _, _) = await collectionCanisterActor.getCollectionDetails();
      Debug.print("Collection name: " # collectionName);

      let allNFTs = await collectionCanisterActor.getAllNonFungibleTokenData();
      Debug.print("Total NFTs in collection: " # Nat.toText(allNFTs.size()));

      let marketplaceListings = await MarketplaceServices.listings(_collectionCanisterId);
      Debug.print("Total listings: " # Nat.toText(marketplaceListings.size()));

      var boughtNFTs : [(MainTypes.TokenIdentifier, MainTypes.TokenIndex, MainTypes.Metadata, Text, Principal, ?Nat64)] = [];
      var unboughtNFTs : [(MainTypes.TokenIdentifier, MainTypes.TokenIndex, MainTypes.Metadata, Text, Principal, ?Nat64)] = [];

      for ((tokenIndex, nftOwner, metadata, price) in allNFTs.vals()) {
        let tokenIdentifier = ExtCore.TokenIdentifier.fromPrincipal(_collectionCanisterId, tokenIndex);

        let isListed = Array.find<(MainTypes.TokenIndex, MainTypes.TokenIdentifier, MainTypes.Listing, MainTypes.Metadata)>(
          marketplaceListings,
          func((listedIndex, _, _, _)) {
            listedIndex == tokenIndex;
          },
        );

        if (nftOwner == user) {
          // Append every bought NFT without deduplication by name
          boughtNFTs := Array.append(boughtNFTs, [(tokenIdentifier, tokenIndex, metadata, collectionName, _collectionCanisterId, price)]);
        } else if (isListed != null) {
          // Append every unbought NFT listed, no deduplication by name
          unboughtNFTs := Array.append(unboughtNFTs, [(tokenIdentifier, tokenIndex, metadata, collectionName, _collectionCanisterId, price)]);
        };
      };

      Debug.print("Bought NFTs: " # Nat.toText(boughtNFTs.size()) # ", Unbought NFTs: " # Nat.toText(unboughtNFTs.size()));

      let boughtNFTsPaginated = Pagin.paginate<(MainTypes.TokenIdentifier, MainTypes.TokenIndex, MainTypes.Metadata, Text, Principal, ?Nat64)>(boughtNFTs, chunkSize);
      let unboughtNFTsPaginated = Pagin.paginate<(MainTypes.TokenIdentifier, MainTypes.TokenIndex, MainTypes.Metadata, Text, Principal, ?Nat64)>(unboughtNFTs, chunkSize);

      if (boughtNFTsPaginated.size() <= pageNo and unboughtNFTsPaginated.size() <= pageNo) {
        Debug.print("Page not found");
        return #err(#Other("Page not found"));
      };

      let boughtNFTsPage = if (pageNo < boughtNFTsPaginated.size()) {
        boughtNFTsPaginated[pageNo];
      } else { [] };
      let unboughtNFTsPage = if (pageNo < unboughtNFTsPaginated.size()) {
        unboughtNFTsPaginated[pageNo];
      } else { [] };

      return #ok({
        boughtNFTs = boughtNFTsPage;
        unboughtNFTs = unboughtNFTsPage;
        current_page = pageNo + 1;
      });

    } catch (e) {
      return #err(#Other("Failed to get user NFTs"));
    };
  };

  public func useractivity(_collectionCanisterId : Principal, buyerId : MainTypes.AccountIdentifier) : async [(MainTypes.TokenIndex, MainTypes.TokenIdentifier, MainTypes.Transaction, Text)] {
    Debug.print("Getting user activity for: " # buyerId # " in collection: " # Principal.toText(_collectionCanisterId));

    try {
      let transactionActor = actor (Principal.toText(_collectionCanisterId)) : actor {
        ext_marketplaceTransactions : () -> async [MainTypes.Transaction];
      };

      let transactions = await transactionActor.ext_marketplaceTransactions();
      Debug.print("Total transactions: " # Nat.toText(transactions.size()));

      var transformedTransactions : [(MainTypes.TokenIndex, MainTypes.TokenIdentifier, MainTypes.Transaction, Text)] = [];
      var userTransactionCount = 0;

      for (transaction in transactions.vals()) {
        if (transaction.buyer == buyerId) {
          userTransactionCount += 1;
          let tokenIdentifier = ExtCore.TokenIdentifier.fromPrincipal(_collectionCanisterId, transaction.token);

          let collectionCanisterActor = actor (Principal.toText(_collectionCanisterId)) : actor {
            getCollectionDetails : () -> async (Text, Text, Text);
          };

          let (collectionName, _, _) = await collectionCanisterActor.getCollectionDetails();

          transformedTransactions := Array.append(
            transformedTransactions,
            [(transaction.token, tokenIdentifier, transaction, collectionName)],
          );
        };
      };

      Debug.print("User transactions found: " # Nat.toText(userTransactionCount));
      return transformedTransactions;

    } catch (e) {
      return [];
    };
  };

  public func alluseractivity(
    buyerId : MainTypes.AccountIdentifier,
    chunkSize : Nat,
    pageNo : Nat,
    usersCollectionMap : TrieMap.TrieMap<Principal, [(Time.Time, Principal)]>,
  ) : async Result.Result<{ data : [(MainTypes.TokenIndex, MainTypes.TokenIdentifier, MainTypes.Transaction, Text)]; current_page : Nat; total_pages : Nat }, Text> {
    Debug.print("Getting all user activity for: " # buyerId);

    try {
      var allUserActivities : [(MainTypes.TokenIndex, MainTypes.TokenIdentifier, MainTypes.Transaction, Text)] = [];

      let allCollections = await CollectionServices.getAllCollections(usersCollectionMap);
      Debug.print("Total collection groups: " # Nat.toText(allCollections.size()));

      for ((_, collections) in allCollections.vals()) {
        for ((_, collectionCanisterId, collectionName, _, _) in collections.vals()) {
          Debug.print("Checking collection: " # Principal.toText(collectionCanisterId));

          let transactionActor = actor (Principal.toText(collectionCanisterId)) : actor {
            ext_marketplaceTransactions : () -> async [MainTypes.Transaction];
          };

          try {
            let transactions = await transactionActor.ext_marketplaceTransactions();

            for (transaction in transactions.vals()) {
              if (transaction.buyer == buyerId) {
                let tokenIdentifier = ExtCore.TokenIdentifier.fromPrincipal(collectionCanisterId, transaction.token);

                allUserActivities := Array.append(
                  allUserActivities,
                  [(transaction.token, tokenIdentifier, transaction, collectionName)],
                );
              };
            };

          } catch (e) {
            Debug.print("Error fetching from collection " # Principal.toText(collectionCanisterId));
          };
        };
      };

      Debug.print("Total user activities found: " # Nat.toText(allUserActivities.size()));

      let index_pages = Pagin.paginate<(MainTypes.TokenIndex, MainTypes.TokenIdentifier, MainTypes.Transaction, Text)>(allUserActivities, chunkSize);

      if (index_pages.size() < pageNo) {
        Debug.print("Page not found");
        return #err("Page not found");
      };

      if (index_pages.size() == 0) {
        Debug.print("No user activities found");
        return #err("No user activities found");
      };

      let userActivitiesPage = index_pages[pageNo];
      Debug.print("Returning " # Nat.toText(userActivitiesPage.size()) # " activities for page " # Nat.toText(pageNo));

      return #ok({
        data = userActivitiesPage;
        current_page = pageNo + 1;
        total_pages = index_pages.size();
      });

    } catch (e) {
      return #err("Failed to get user activity");
    };
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
    Debug.print("Processing hard copy order for user: " # Principal.toText(accountIdentifier));

    if (phone == "") {
      Debug.print("Phone number missing");
      return (#err("Phone number is required."), orders, orderIdCounter);
    };
    if (address == "") {
      Debug.print("Address missing");
      return (#err("Address is required."), orders, orderIdCounter);
    };
    if (city == "") {
      Debug.print("City missing");
      return (#err("City is required."), orders, orderIdCounter);
    };
    if (country == "") {
      Debug.print("Country missing");
      return (#err("Country is required."), orders, orderIdCounter);
    };
    if (pincode == "") {
      Debug.print("Pincode missing");
      return (#err("Pincode is required."), orders, orderIdCounter);
    };

    let existingUser = Array.find<MainTypes.User>(
      usersArray,
      func(u : MainTypes.User) : Bool {
        u.accountIdentifier == accountIdentifier;
      },
    );

    switch (existingUser) {
      case (null) {
        Debug.print("User not found for order");
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
        Debug.print("Order created successfully - ID: " # Nat.toText(newOrderId));

        return (
          #ok("Order placed successfully for user with UUID: " # uuid # ". Order ID: " # Nat.toText(newOrderId)),
          updatedOrders,
          newOrderId,
        );
      };
    };
  };

  public func userNFTsAllCollections(
    user : MainTypes.AccountIdentifier,
    chunkSize : Nat,
    pageNo : Nat,
    NFTcollections : TrieMap.TrieMap<Text, Principal>,
  ) : async Result.Result<{ boughtNFTs : [(MainTypes.TokenIdentifier, MainTypes.TokenIndex, MainTypes.Metadata, Text, Principal, ?Nat64)]; current_page : Nat }, MainTypes.CommonError> {
    Debug.print("Getting all NFTs for user: " # user);

    try {
      let allCollections : [Principal] = await MainUtils.getAllCollectionCanisterIds(NFTcollections);
      Debug.print("Total collections to check: " # Nat.toText(allCollections.size()));

      let allBoughtNFTsBuffer = Buffer.Buffer<(MainTypes.TokenIdentifier, MainTypes.TokenIndex, MainTypes.Metadata, Text, Principal, ?Nat64)>(0);

      for (collectionCanisterId in allCollections.vals()) {
        Debug.print("Checking collection: " # Principal.toText(collectionCanisterId));

        let result = await userNFTcollection(collectionCanisterId, user, 1000, 0);

        switch (result) {
          case (#ok(data)) {
            Debug.print("Found " # Nat.toText(data.boughtNFTs.size()) # " NFTs in collection");

            for (nft in data.boughtNFTs.vals()) {
              allBoughtNFTsBuffer.add(nft);
            };
          };
          case (#err(error)) {
            Debug.print("Error fetching from collection: " # debug_show (error));
          };
        };
      };

      let allBoughtNFTs = Buffer.toArray(allBoughtNFTsBuffer);
      Debug.print("Total NFTs found: " # Nat.toText(allBoughtNFTs.size()));

      let boughtNFTsPaginated = Pagin.paginate(allBoughtNFTs, chunkSize);
      Debug.print("Total pages: " # Nat.toText(boughtNFTsPaginated.size()));

      if (boughtNFTsPaginated.size() <= pageNo) {
        Debug.print("Page not found - Available pages: " # Nat.toText(boughtNFTsPaginated.size()));
        return #err(#Other("Page not found"));
      };

      let boughtNFTsPage = boughtNFTsPaginated[pageNo];
      Debug.print("Returning " # Nat.toText(boughtNFTsPage.size()) # " NFTs for page " # Nat.toText(pageNo));

      return #ok({
        boughtNFTs = boughtNFTsPage;
        current_page = pageNo + 1;
      });

    } catch (e) {
      return #err(#Other("Failed to get user NFTs"));
    };
  };

};
