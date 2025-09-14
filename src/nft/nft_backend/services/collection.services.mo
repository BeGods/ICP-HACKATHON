import Cycles "mo:base/ExperimentalCycles";
import Array "mo:base/Array";
import Debug "mo:base/Debug";
import Text "mo:base/Text";
import Principal "mo:base/Principal";
import TrieMap "mo:base/TrieMap";
import List "mo:base/List";
import Time "mo:base/Time";
import Result "mo:base/Result";
import ExtTokenClass "../../EXT-V2/ext_v2/v2";
import MainTypes "../types/main.types";
import MainUtils "../utils/main.utils";
import Types "../../EXT-V2/Types";
import Pagin "../utils/pagin.utils";

module {
  public func addCollectionToMap(
    usersCollectionMap : TrieMap.TrieMap<Principal, [(Time.Time, Principal)]>,
    userCollections : ?[(Time.Time, Principal)],
    user : Principal,
    collection_id : Principal,
  ) : async Text {
    switch (userCollections) {
      case null {
        // No collections exist for the user, so create a new list with the collection
        let updatedCollections = [(Time.now(), collection_id)];
        usersCollectionMap.put(user, updatedCollections);
        return "Collection added";
      };
      case (?collections) {
        // Convert the array to a list for easier manipulation
        let collectionsList = List.fromArray(collections);
        // Check if the collection already exists in the list
        let collExists = List.some<(Time.Time, Principal)>(collectionsList, func((_, collId)) { collId == collection_id });
        if (collExists) {
          return "Collection already added";
        } else {
          // Add the new collection to the list and update the map
          let newCollectionsList = List.push((Time.now(), collection_id), collectionsList);
          usersCollectionMap.put(user, List.toArray(newCollectionsList));
          return "Collection added";
        };
      };
    };
  };

  public func removeCollection(
    usersCollectionMap : TrieMap.TrieMap<Principal, [(Time.Time, Principal)]>,
    collection_id : Principal,
  ) : async Text {
    var found = false;

    // Iterate through all entries in usersCollectionMap
    for ((userPrincipal, collections) in usersCollectionMap.entries()) {
      var updatedCollections = List.filter<(Time.Time, Principal)>(
        List.fromArray(collections),
        func((_, collId)) {
          if (collId == collection_id) {
            found := true;
            return false; // Exclude the target collection
          };
          return true;
        },
      );

      // Update the map for this user if a collection was removed
      if (found) {
        usersCollectionMap.put(userPrincipal, List.toArray(updatedCollections));
      };
    };

    // Return appropriate response based on whether the collection was found
    if (found) {
      return "Collection removed successfully.";
    } else {
      return "Collection not found.";
    };
  };

  public func createExtCollection(
    usersCollectionMap : TrieMap.TrieMap<Principal, [(Time.Time, Principal)]>,
    selfPrincipal : Principal,
    user : Principal,
    _title : Text,
    _symbol : Text,
    _metadata : Text,
  ) : async (Principal, Principal) {
    // Add cycles for canister creation
    Cycles.add<system>(900_000_000_000);

    // Deploy a new EXT NFT canister
    let extToken = await ExtTokenClass.EXTNFT(selfPrincipal);
    let extCollectionCanisterId = await extToken.getCanisterId();

    // Define the remote EXT NFT interface
    let collectionCanisterActor = actor (Principal.toText(extCollectionCanisterId)) : actor {
      ext_setCollectionMetadata : (name : Text, symbol : Text, metadata : Text) -> async ();
      setMinter : (minter : Principal) -> async ();
      ext_admin : () -> async Principal;
    };

    // Configure the collection
    await collectionCanisterActor.setMinter(user);
    await collectionCanisterActor.ext_setCollectionMetadata(_title, _symbol, _metadata);

    // Update the userCollectionMap
    let collections = usersCollectionMap.get(user);
    switch (collections) {
      case null {
        let updatedCollections = [(Time.now(), extCollectionCanisterId)];
        usersCollectionMap.put(user, updatedCollections);
      };
      case (?collections) {
        let updatedObj = List.push(
          (Time.now(), extCollectionCanisterId),
          List.fromArray(collections),
        );
        usersCollectionMap.put(user, List.toArray(updatedObj));
      };
    };

    return (user, extCollectionCanisterId);
  };

  public func getUserCollectionDetails(
    userCollections : ?[(Time.Time, Principal)]
  ) : async ?[(Time.Time, Principal, Text, Text, Text)] {
    switch (userCollections) {
      case null {
        return null;
      };
      case (?collections) {
        var result : [(Time.Time, Principal, Text, Text, Text)] = [];
        for ((timestamp, collectionCanisterId) in collections.vals()) {
          let collectionCanister = actor (Principal.toText(collectionCanisterId)) : actor {
            getCollectionDetails : () -> async (Text, Text, Text);
          };
          let details = await collectionCanister.getCollectionDetails();
          result := Array.append(result, [(timestamp, collectionCanisterId, details.0, details.1, details.2)]);
        };
        return ?result;
      };
    };
  };

  public func getAllCollections(usersCollectionMap : TrieMap.TrieMap<Principal, [(Time.Time, Principal)]>) : async [(Principal, [(Time.Time, Principal, Text, Text, Text)])] {
    var result : [(Principal, [(Time.Time, Principal, Text, Text, Text)])] = [];

    // Iterate through all entries in usersCollectionMap
    for ((userPrincipal, collections) in usersCollectionMap.entries()) {
      var collectionDetails : [(Time.Time, Principal, Text, Text, Text)] = [];

      // Iterate through each collection the user has
      for ((time, collectionCanisterId) in collections.vals()) {
        // Try-catch block to handle potential errors while fetching collection metadata
        try {
          let collectionCanisterActor = actor (Principal.toText(collectionCanisterId)) : actor {
            getCollectionDetails : () -> async (Text, Text, Text); // Assuming it returns (name, symbol, metadata)
          };

          // Fetch the collection details (name, symbol, metadata)
          let (collectionName, collectionSymbol, collectionMetadata) = await collectionCanisterActor.getCollectionDetails();

          // Add collection with its name, symbol, and metadata to the list
          collectionDetails := Array.append(collectionDetails, [(time, collectionCanisterId, collectionName, collectionSymbol, collectionMetadata)]);
        } catch (e) {
          Debug.print("Error fetching collection details for canister: " # Principal.toText(collectionCanisterId));
          // Handle failure by appending the collection with placeholder values
          collectionDetails := Array.append(collectionDetails, [(time, collectionCanisterId, "Unknown Collection", "Unknown Symbol", "Unknown Metadata")]);
        };
      };

      // Append user's collections to the result
      result := Array.append(result, [(userPrincipal, collectionDetails)]);
    };

    return result;
  };

  public func getAllCollectionNFTs(
    _collectionCanisterId : Principal,
    chunkSize : Nat,
    pageNo : Nat,
  ) : async Result.Result<{ data : [(MainTypes.TokenIndex, MainTypes.AccountIdentifier, Types.Metadata, ?Nat64)]; current_page : Nat; total_pages : Nat }, Text> {
    // Define the canister actor interface
    let collectionCanisterActor = actor (Principal.toText(_collectionCanisterId)) : actor {
      getAllNonFungibleTokenData : () -> async [(MainTypes.TokenIndex, MainTypes.AccountIdentifier, Types.Metadata, ?Nat64)];
    };

    // Retrieve all NFTs from the specified collection canister
    let nfts = await collectionCanisterActor.getAllNonFungibleTokenData();

    // Apply pagination
    let paginatedNFTs = Pagin.paginate<(MainTypes.TokenIndex, MainTypes.AccountIdentifier, Types.Metadata, ?Nat64)>(nfts, chunkSize);

    // Get the specific page of NFTs
    let nftPage = if (pageNo < paginatedNFTs.size()) {
      paginatedNFTs[pageNo];
    } else { [] };

    return #ok({
      data = nftPage;
      current_page = pageNo + 1;
      total_pages = paginatedNFTs.size();
    });
  };

  public func getSingleCollectionDetails(collectionCanisterId : Principal) : async ([(MainTypes.TokenIndex, MainTypes.AccountIdentifier, Types.Metadata)], Nat) {
    let collectionCanisterActor = actor (Principal.toText(collectionCanisterId)) : actor {
      getAllNonFungibleTokenData : () -> async [(MainTypes.TokenIndex, MainTypes.AccountIdentifier, Types.Metadata)];
    };

    // Attempt to retrieve all NFTs from the specified collection canister
    try {
      let nfts = await collectionCanisterActor.getAllNonFungibleTokenData();
      let nftCount = nfts.size(); // Count the total number of NFTs
      return (nfts, nftCount); // Return both the NFT details and the count
    } catch (e) {
      // Handle potential errors (e.g., canister not responding, method not implemented)
      Debug.print(Text.concat("Error fetching NFTs from canister: ", Principal.toText(collectionCanisterId)));
      return ([], 0); // Return an empty list and a count of 0 in case of error
    };
  };

};
