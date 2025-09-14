import Principal "mo:base/Principal";
import TrieMap "mo:base/TrieMap";
import Nat "mo:base/Nat";
import Array "mo:base/Array";
import Debug "mo:base/Debug";
import Text "mo:base/Text";
import Time "mo:base/Time";
import AID "../../EXT-V2/motoko/util/AccountIdentifier";
import List "mo:base/List";
import Types "../../EXT-V2/Types";
import MainTypes "../types/main.types";
import MainUtils "../utils/main.utils";

module {
  public func mintExtNonFungible(
    _collectionCanisterId : Principal,
    name : Text,
    desc : Text,
    asset : Text,
    thumb : Text,
    metadata : ?MainTypes.MetadataContainer,
    amount : Nat,
    user : Principal,
  ) : async [(MainTypes.TokenIndex, MainTypes.TokenIdentifier)] {
    let collectionCanisterActor = actor (Principal.toText(_collectionCanisterId)) : actor {
      ext_mint : (
        request : [(MainTypes.AccountIdentifier, Types.Metadata)]
      ) -> async [MainTypes.TokenIndex];
    };
    let metadataNonFungible : Types.Metadata = #nonfungible {
      name = name;
      description = desc;
      asset = asset;
      thumbnail = thumb;
      metadata = metadata;
    };

    let receiver = AID.fromPrincipal(user, null);
    var request : [(MainTypes.AccountIdentifier, Types.Metadata)] = [];
    var i : Nat = 0;
    while (i < amount) {
      request := Array.append(request, [(receiver, metadataNonFungible)]);
      i := i + 1;
    };
    let extMint = await collectionCanisterActor.ext_mint(request);
    var result_list = List.nil<(MainTypes.TokenIndex, MainTypes.TokenIdentifier)>();
    for (i in extMint.vals()) {
      let _tokenIdentifier = await MainUtils.getNftTokenId(_collectionCanisterId, i);
      result_list := List.push((i, _tokenIdentifier), result_list);
    };
    List.toArray(result_list);
  };

  public func mintExtFungible(
    _collectionCanisterId : Principal,
    name : Text,
    symbol : Text,
    decimals : Nat8,
    metadata : ?MainTypes.MetadataContainer,
    amount : Nat,
    user : Principal,
  ) : async [MainTypes.TokenIndex] {
    let collectionCanisterActor = actor (Principal.toText(_collectionCanisterId)) : actor {
      ext_mint : (
        request : [(MainTypes.AccountIdentifier, Types.Metadata)]
      ) -> async [MainTypes.TokenIndex];
    };
    let metadataFungible : Types.Metadata = #fungible {
      name = name;
      symbol = symbol;
      decimals = decimals;
      metadata = metadata;
    };

    let receiver = AID.fromPrincipal(user, null);
    var request : [(MainTypes.AccountIdentifier, Types.Metadata)] = [];
    var i : Nat = 0;
    while (i < amount) {
      request := Array.append(request, [(receiver, metadataFungible)]);
      i := i + 1;
    };
    let extMint = await collectionCanisterActor.ext_mint(request);
    extMint;
  };

  public func getSingleNonFungibleTokens(
    _collectionCanisterId : Principal,
    _tokenId : MainTypes.TokenIndex,
    user : MainTypes.AccountIdentifier,
  ) : async [(MainTypes.TokenIndex, MainTypes.AccountIdentifier, MainTypes.Metadata, ?Nat64, Bool)] {
    // Define the actor interface for the other canister
    let collectionCanisterActor = actor (Principal.toText(_collectionCanisterId)) : actor {
      getSingleNonFungibleTokenData : (MainTypes.TokenIndex) -> async [(MainTypes.TokenIndex, MainTypes.AccountIdentifier, MainTypes.Metadata, ?Nat64)];
    };

    // Make the inter-canister call to fetch the token data (including price)
    let tokenData = await collectionCanisterActor.getSingleNonFungibleTokenData(_tokenId);

    var isOwned : Bool = false; // Ownership flag

    // Check if tokenData contains elements
    if (tokenData.size() > 0) {
      let (tokenIndex, nftOwner, metadata, price) = tokenData[0]; // Access the first tuple in the array
      isOwned := (nftOwner == user); // Set ownership flag if the user is the owner

      // Return token data along with the ownership status
      return [(tokenIndex, nftOwner, metadata, price, isOwned)];
    } else {
      // Handle the case where no data is returned
      return [];
    };
  };

  public func getTotalNFTs(usersCollectionMap : TrieMap.TrieMap<Principal, [(Time.Time, Principal)]>) : async Nat {
    var totalNFTs : Nat = 0;

    // Iterate through all entries in usersCollectionMap
    for ((_, collections) in usersCollectionMap.entries()) {
      for ((_, collectionCanisterId) in collections.vals()) {
        let collectionCanisterActor = actor (Principal.toText(collectionCanisterId)) : actor {
          getAllNonFungibleTokenData : () -> async [(MainTypes.TokenIndex, MainTypes.AccountIdentifier, Types.Metadata)];
        };

        // Attempt to retrieve all NFTs from the specified collection canister and add to the total count
        try {
          let nfts = await collectionCanisterActor.getAllNonFungibleTokenData();
          totalNFTs += nfts.size();
        } catch (e) {
          // Handle potential errors, but continue to the next collection
          Debug.print(Text.concat("Error fetching NFTs from canister: ", Principal.toText(collectionCanisterId)));
        };
      };
    };

    return totalNFTs; // Return the total number of NFTs across all collections
  };
};
