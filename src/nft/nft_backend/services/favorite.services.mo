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

    // Check if the user has any favorites
    switch (_favorites.get(user)) {
      case (?favorites) {
        // Return the user's favorites if found
        return #ok(favorites);
      };
      case (_) {
        // Return an error if no favorites are found for the user
        return #err(#Other("No favorites found for this user"));
      };
    };
  };

};
