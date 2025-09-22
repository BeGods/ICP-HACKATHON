import ExtTokenClass "../../EXT-V2/ext_v2/v2";
import ExtCore "../../EXT-V2/motoko/ext/Core";
import Queue "../../EXT-V2/motoko/util/Queue";
import Types "../../EXT-V2/Types";
import V2 "../../EXT-V2/ext_v2/v2";
import _owners "../../EXT-V2/ext_v2/v2";
import ExtCommon "../../EXT-V2/motoko/ext/Common";
import MainTypes "../types/main.types";
import Result "mo:base/Result";
import HashMap "mo:base/HashMap";
import Array "mo:base/Array";
import TrieMap "mo:base/TrieMap";
import Debug "mo:base/Debug";
import Nat "mo:base/Nat";
import Buffer "mo:base/Buffer";
import MainUtils "../utils/main.utils";
import Error "mo:base/Error";
import UserServices "user.services";
import Principal "mo:base/Principal";

module {

  // ADD TO FAVORITES //
  public func addToFavorites(
    user : MainTypes.AccountIdentifier,
    tokenIdentifier : MainTypes.TokenIdentifier,
    _favorites : HashMap.HashMap<MainTypes.AccountIdentifier, [(MainTypes.TokenIdentifier)]>,
  ) : async Result.Result<Text, MainTypes.CommonError> {

    // Check if the user already has favorites
    let userFavorites = switch (_favorites.get(user)) {
      case (?favorites) favorites; // If the user has favorites, retrieve them
      case (_) [] // If the user has no favorites, start with an empty array
    };

    // Check if the token is already in the user's favorites
    let isAlreadyFavorite = Array.find(
      userFavorites,
      func(entry : (MainTypes.TokenIdentifier)) : Bool {
        entry == tokenIdentifier;
      },
    ) != null;

    if (isAlreadyFavorite) {
      return #err(#Other("Token is already in favorites"));
    } else {
      // Append the new token to the user's favorites list (without metadata)
      let updatedFavorites = Array.append(userFavorites, [tokenIdentifier]);

      // Update the user's favorites in the favorites map
      _favorites.put(user, updatedFavorites);
      return #ok("Token added to favorites successfully");
    };
  };

  //REMOVE FROM FAVORITES : Function to remove a token from the user's favorites
  public func removeFromFavorites(
    user : MainTypes.AccountIdentifier,
    tokenIdentifier : MainTypes.TokenIdentifier,
    _favorites : HashMap.HashMap<MainTypes.AccountIdentifier, [(MainTypes.TokenIdentifier)]>,
  ) : async Result.Result<Text, MainTypes.CommonError> {

    // Check if the user already has favorites
    let userFavorites = switch (_favorites.get(user)) {
      case (?favorites) favorites; // If the user has favorites, retrieve them
      case (_) return #err(#Other("No favorites found for this user")); // If the user has no favorites, return an error
    };

    // Check if the token is in the user's favorites
    let isFavorite = Array.find(
      userFavorites,
      func(entry : (MainTypes.TokenIdentifier)) : Bool {
        entry == tokenIdentifier;
      },
    ) != null;

    // Instead of if (!isFavorite), use if isFavorite == false
    if (isFavorite == false) {
      return #err(#Other("Token is not in favorites"));
    };

    // Remove the token from the user's favorites list
    let updatedFavorites = Array.filter(
      userFavorites,
      func(entry : (MainTypes.TokenIdentifier)) : Bool {
        entry != tokenIdentifier;
      },
    );

    // Update the user's favorites in the favorites map
    _favorites.put(user, updatedFavorites);

    // Return success message
    return #ok("Token removed from favorites successfully");
  };

  // GET USER FAVORITES :  Function to get the user's favorites
  public func getFavorites(
    user : MainTypes.AccountIdentifier,
    _favorites : HashMap.HashMap<MainTypes.AccountIdentifier, [(MainTypes.TokenIdentifier)]>,
  ) : Result.Result<[(MainTypes.TokenIdentifier)], MainTypes.CommonError> {

    switch (_favorites.get(user)) {
      case (?favorites) {
        return #ok(favorites);
      };
      case (_) {
        return #err(#Other("No favorites found for this user"));
      };
    };
  };

  public func getFavoritesWithMetadata(
    user : MainTypes.AccountIdentifier,
    _favorites : HashMap.HashMap<MainTypes.AccountIdentifier, [(MainTypes.TokenIdentifier)]>,
    NFTcollections : TrieMap.TrieMap<Text, Principal>,
  ) : async Result.Result<[(MainTypes.TokenIndex, MainTypes.TokenIdentifier, MainTypes.Listing, MainTypes.Metadata)], MainTypes.CommonError> {

    Debug.print("Getting favorites with metadata for user: " # user);

    let favoriteTokensResult = getFavorites(user, _favorites);

    switch (favoriteTokensResult) {
      case (#err(error)) {
        return #err(error);
      };
      case (#ok(favoriteTokens)) {
        Debug.print("Found " # Nat.toText(favoriteTokens.size()) # " favorite tokens");

        try {
          let allCollections : [Principal] = await MainUtils.getAllCollectionCanisterIds(NFTcollections);
          Debug.print("Total collections to check: " # Nat.toText(allCollections.size()));

          let favoritesWithMetadataBuffer = Buffer.Buffer<(MainTypes.TokenIndex, MainTypes.TokenIdentifier, MainTypes.Listing, MainTypes.Metadata)>(0);

          for (collectionCanisterId in allCollections.vals()) {
            Debug.print("Checking collection: " # Principal.toText(collectionCanisterId));

            let priceListings = actor (Principal.toText(collectionCanisterId)) : actor {
              ext_marketplaceListings : () -> async [(MainTypes.TokenIndex, MainTypes.Listing, MainTypes.Metadata)];
            };

            let listingData = await priceListings.ext_marketplaceListings();
            Debug.print("Retrieved " # Nat.toText(listingData.size()) # " listings");

            for ((tokenIndex, listing, metadata) in listingData.vals()) {
              let tokenIdentifier = ExtCore.TokenIdentifier.fromPrincipal(collectionCanisterId, tokenIndex);

              let isFavorite = Array.find<MainTypes.TokenIdentifier>(
                favoriteTokens,
                func(favTokenId : MainTypes.TokenIdentifier) : Bool {
                  favTokenId == tokenIdentifier;
                },
              );

              switch (isFavorite) {
                case (?_) {
                  let transformedNFT = (
                    tokenIndex,
                    tokenIdentifier,
                    listing,
                    metadata,
                  );

                  favoritesWithMetadataBuffer.add(transformedNFT);
                  Debug.print("Found favorite NFT: " # tokenIdentifier);
                };
                case (_) {};
              };
            };
          };

          let favoritesWithMetadata = Buffer.toArray(favoritesWithMetadataBuffer);
          Debug.print("Total favorite NFTs with metadata: " # Nat.toText(favoritesWithMetadata.size()));

          return #ok(favoritesWithMetadata);

        } catch (e) {
          Debug.print("Error fetching favorites metadata: " # Error.message(e));
          return #err(#Other("Failed to get favorites metadata"));
        };
      };
    };
  };
};
