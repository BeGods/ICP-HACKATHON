/*
 ===============================
 main.mo structure
 ===============================
 1. GLOBAL - INTERFACES                                 (line 57)
 2. GLOBAL - DATA MAPS                                  (line 68)
 3. GLOBAL - SYSTEM FUNCTIONS                           (line 101)
 4. GAME - QUEST CONTROLLERS                            (line 160)
 5. NFT MARKETPLACE - COLLECTIONS CONTROLLERS           (line 204)
 6. NFT MARKETPLACE - NFTS CONTROLLERS                  (line 308)
 7. NFT MARKETPLACE - USERS CONTROLLERS                 (line 404)
 8. NFT MARKETPLACE - FAVORITES CONTROLLERS             (line 548)
 9. NFT MARKETPLACE - ORDERS CONTROLLERS                (line 587)
 10. NFT MARKETPLACE - GENERAL CONTROLLERS              (line 683)
*/

import ExtTokenClass "../EXT-V2/ext_v2/v2";
import Cycles "mo:base/ExperimentalCycles";
import Principal "mo:base/Principal";
import Text "mo:base/Text";
import TrieMap "mo:base/TrieMap";
import List "mo:base/List";
import Array "mo:base/Array";
import Nat "mo:base/Nat";
import Time "mo:base/Time";
import Debug "mo:base/Debug";
import Int "mo:base/Int";
import Iter "mo:base/Iter";
import Error "mo:base/Error";
import Nat32 "mo:base/Nat32";
import Result "mo:base/Result";
import Nat64 "mo:base/Nat64";
import AID "../EXT-V2/motoko/util/AccountIdentifier";
import ExtCore "../EXT-V2/motoko/ext/Core";
import Types "../EXT-V2/Types";
import V2 "../EXT-V2/ext_v2/v2";
import HashMap "mo:base/HashMap";
import Hash "mo:base/Hash";
import Option "mo:base/Option";
import Queue "../EXT-V2/motoko/util/Queue";
import ExtCommon "../EXT-V2/motoko/ext/Common";
import _owners "../EXT-V2/ext_v2/v2";
import Pagin "utils/pagin.utils";
import MainTypes "types/main.types";
import MainUtils "utils/main.utils";
import GameServices "services/game.services";
import CollectionService "services/collection.services";
import NftServices "services/nft.services";
import UserServices "services/user.services";
import FavoriteServices "services/favorite.services";
import OrderServices "services/order.services";
import MarketplaceServices "services/marketplace.services";
import Blob "mo:base/Blob";

actor Main {

  /* -------------------------------------------------------------------------- */
  /*                               GLOBAL - INTERFACES                          */
  /* -------------------------------------------------------------------------- */

  // IC Canister interface
  let IC = actor "aaaaa-aa" : actor {
    canister_status : { canister_id : Principal } -> async {
      settings : { controllers : [Principal] };
    };
  };

  /* -------------------------------------------------------------------------- */
  /*                               GLOBAL - DATA MAPS                           */
  /* -------------------------------------------------------------------------- */
  // marketplace:  map to track users nft collections
  stable var mapEntries : [(Text, Principal)] = [];
  var NFTcollections : TrieMap.TrieMap<Text, Principal> = TrieMap.TrieMap<Text, Principal>(Text.equal, Text.hash);
  private let BURN_ADDRESS : MainTypes.AccountIdentifier = "7w5cw-rbxf2-lvbl7-iumn4-2ckjk-luseg-7wqzi-tulm7-ghmmf-lezhi-2qe";
  private var usersCollectionMap = TrieMap.TrieMap<Principal, [(Time.Time, Principal)]>(Principal.equal, Principal.hash);
  private stable var stableusersCollectionMap : [(Principal, [(Time.Time, Principal)])] = [];

  // marketplace: tores details about the tokens coming into this vault
  private stable var deposits : [MainTypes.Deposit] = [];

  // marketplace: favorite nfts
  private var _favorites : HashMap.HashMap<MainTypes.AccountIdentifier, [(MainTypes.TokenIdentifier)]> = HashMap.HashMap<MainTypes.AccountIdentifier, [(MainTypes.TokenIdentifier)]>(0, AID.equal, AID.hash);
  private stable var stableFavorites : [(MainTypes.AccountIdentifier, [(MainTypes.TokenIdentifier)])] = [];

  // marketplace: user data on-chain
  private stable var usersArray : [MainTypes.User] = [];
  private stable var userIdCounter : Nat = 0;
  private var userDetailsMap : TrieMap.TrieMap<Principal, MainTypes.UserDetails> = TrieMap.TrieMap<Principal, MainTypes.UserDetails>(Principal.equal, Principal.hash);

  // marketplace: track orders
  private stable var orders : [MainTypes.Order] = [];
  private stable var orderIdCounter : Nat = 0;

  // game: track packet id
  private stable var nextPacketId : Nat = 1;

  // game: track completed quest records
  private var questCompletions : TrieMap.TrieMap<Principal, MainTypes.CompletionRecord> = TrieMap.TrieMap<Principal, MainTypes.CompletionRecord>(
    Principal.equal,
    Principal.hash,
  );

  private var BoosterRecord : TrieMap.TrieMap<Principal, MainTypes.BoosterInfo> = TrieMap.TrieMap<Principal, MainTypes.BoosterInfo>(Principal.equal, Principal.hash);

  /* -------------------------------------------------------------------------- */
  /*                         GLOBAL - SYSTEM FUNCTIONS                          */
  /* -------------------------------------------------------------------------- */

  system func preupgrade() {
    stableusersCollectionMap := Iter.toArray(usersCollectionMap.entries());
    mapEntries := Iter.toArray(NFTcollections.entries());
    stableFavorites := Iter.toArray(_favorites.entries());
  };

  system func postupgrade() {
    usersCollectionMap := TrieMap.fromEntries(stableusersCollectionMap.vals(), Principal.equal, Principal.hash);
    NFTcollections := TrieMap.fromEntries(
      mapEntries.vals(),
      Text.equal,
      Text.hash,
    );
    _favorites := HashMap.fromIter<MainTypes.AccountIdentifier, [(MainTypes.TokenIdentifier)]>(
      stableFavorites.vals(),
      10,
      AID.equal,
      AID.hash,
    );
  };

  public shared func fetchCycles() : async Nat {
    let balance = Cycles.balance();
    Debug.print("Current cycle balance: " # Nat.toText(balance));
    return balance;
  };

  public shared func ping(name : Text) : async Text {
    Debug.print("Ping received from frontend with name: " # name);
    return "Pong to " # name;
  };

  public shared (msg) func isController(canister_id : Principal, principal_id : Principal) : async Bool {
    if (Principal.isAnonymous(principal_id)) {
      throw Error.reject("User is not authenticated");
    };
    let status = await IC.canister_status({ canister_id = canister_id });
    return MainUtils.contains(status.settings.controllers, principal_id);
  };

  public shared (msg) func checkController(canister_id : Principal, principal_id : Principal) : async MainTypes.Result {
    try {
      let status = await IC.canister_status({ canister_id = canister_id });
      let isCtrl = MainUtils.contains(status.settings.controllers, principal_id);
      Debug.print("Caller principal: " # Principal.toText(principal_id));
      return #ok(isCtrl);
    } catch (err) {
      return #err("Failed to fetch canister status");
    };
  };

  public shared ({ caller }) func whoAmI() : async Text {
    let principalText = Principal.toText(caller);

    if (Principal.isAnonymous(caller)) {
      return "You are anonymous (principal: " # principalText # ")";
    } else {
      return "You are authenticated as principal: " # principalText;
    };
  };

  /* -------------------------------------------------------------------------- */
  /*                     GAME -  QUEST PACKET CONTROLLERS                       */
  /* -------------------------------------------------------------------------- */

  // fetch: quest records
  public query func getAllQuestCompletionsTuple() : async [(Principal, MainTypes.CompletionRecord)] {
    Iter.toArray(questCompletions.entries());
  };

  // update: quest records
  public shared ({ caller }) func registerQuestCompletion(mythologyText : Text) : async Bool {
    await GameServices.registerQuestCompletion(questCompletions, caller, mythologyText);
  };

  // fetch: next packet to be minted ptrs
  public query func getNextPacketId() : async Nat {
    nextPacketId;
  };

  // fetch: total minted packets
  public query func getTotalMintedPackets() : async Nat {
    nextPacketId - 1;
  };

  public shared ({ caller }) func mintPacketToUser(recipient : Principal, mythologyText : Text) : async Result.Result<MainTypes.TokenIndex, Text> {
    try {
      let selfPrincipal = Principal.fromActor(Main);
      let result = await GameServices.mintPacketToUser(recipient, mythologyText, questCompletions, nextPacketId, selfPrincipal);

      switch (result) {
        case (#ok((newNextId, tokenIndex))) {
          nextPacketId := newNextId;
          #ok(tokenIndex);
        };
        case (#err(msg)) { #err(msg) };
      };

    } catch (error) {
      nextPacketId -= 1;
      Debug.print("EXT Packet minting failed: " # Error.message(error));
      #err("EXT Packet minting failed: " # Error.message(error));
    };
  };

  /* -------------------------------------------------------------------------- */
  /*                     NFT MARKETPLACE - COLLECTION CONTROLLERS               */
  /* -------------------------------------------------------------------------- */

  // Getting Collections that user own(only gets canisterIds of respective collections)
  public shared query ({ caller = user }) func getUserCollections() : async ?[(Time.Time, Principal)] {
    return usersCollectionMap.get(user);
  };

  //getTotalCollection
  public shared ({ caller = user }) func totalcollections() : async Nat {
    var count : Nat = 0;
    for ((k, v) in usersCollectionMap.entries()) {
      count := count + v.size();
    };
    return count;
  };

  // admin:update: add collection to map
  public shared ({ caller = user }) func add_collection_to_map(collection_id : Principal) : async Text {
    // check controller
    let canisterId = Principal.fromActor(Main);
    let controllerResult = await isController(canisterId, user);

    if (controllerResult == false) {
      return ("Unauthorized: Only admins can add new collection");
    };

    let userCollections = usersCollectionMap.get(user);
    return await CollectionService.addCollectionToMap(usersCollectionMap, userCollections, user, collection_id);
  };

  public shared ({ caller = user }) func removeCollection(collection_id : Principal) : async Text {
    // check controller
    let canisterId = Principal.fromActor(Main);
    let controllerResult = await isController(canisterId, user);

    if (controllerResult == false) {
      return ("Unauthorized: Only admins can add new collection");
    };

    return await CollectionService.removeCollection(usersCollectionMap, collection_id);

  };

  public shared ({ caller = user }) func createExtCollection(
    _title : Text,
    _symbol : Text,
    _metadata : Text,
  ) : async (Principal, Principal) {
    let canisterId = Principal.fromActor(Main);
    let controllerResult = await isController(canisterId, user);

    if (controllerResult == false) {
      throw Error.reject("Unauthorized: Only admins can add new collection");
    };

    let selfPrincipal = Principal.fromActor(Main);
    let result = await CollectionService.createExtCollection(
      usersCollectionMap,
      selfPrincipal,
      user,
      _title,
      _symbol,
      _metadata,
    );

    // add canister id to collections
    NFTcollections.put(_title, result.1);

    return result;
  };

  public query func getAllCollectionCanisterIds() : async [Principal] {
    var canisterList : [Principal] = [];
    for ((_, value) in NFTcollections.entries()) {
      canisterList := Array.append(canisterList, [value]);
    };
    return canisterList;
  };

  // Getting Collection Metadata
  public shared ({ caller = user }) func getUserCollectionDetails() : async ?[(Time.Time, Principal, Text, Text, Text)] {
    let collections = usersCollectionMap.get(user);
    return await CollectionService.getUserCollectionDetails(collections);
  };

  // Getting all the collections ever created(only gets the canisterIds)
  public shared func getAllCollections() : async [(Principal, [(Time.Time, Principal, Text, Text, Text)])] {
    return await CollectionService.getAllCollections(usersCollectionMap);
  };

  public shared ({ caller = user }) func getAllCollectionNFTs(
    _collectionCanisterId : Principal,
    chunkSize : Nat,
    pageNo : Nat,
  ) : async Result.Result<{ data : [(MainTypes.TokenIndex, MainTypes.AccountIdentifier, Types.Metadata, ?Nat64)]; current_page : Nat; total_pages : Nat }, Text> {

    let canisterId = Principal.fromActor(Main);
    // Check if the caller is one of the controllers
    let controllerResult = await isController(canisterId, user);

    if (controllerResult == false) {
      throw Error.reject("Unauthorized: Only admins can view collection nfts");
    };

    return await CollectionService.getAllCollectionNFTs(_collectionCanisterId, chunkSize, pageNo);
  };

  //GET SINGLE COLLECTION DETAILS: Function to get all NFT details within a specific collection and the count of total NFTs
  public shared func getSingleCollectionDetails(
    collectionCanisterId : Principal
  ) : async ([(MainTypes.TokenIndex, MainTypes.AccountIdentifier, Types.Metadata)], Nat) {
    return await CollectionService.getSingleCollectionDetails(collectionCanisterId);
  };

  /* -------------------------------------------------------------------------- */
  /*                      NFT MARKETPLACE - NFT CONTROLLERS                     */
  /* -------------------------------------------------------------------------- */

  // Gets all details about the tokens that were transfered into this vault
  public shared query func getDeposits() : async [MainTypes.Deposit] {
    return deposits;
  };

  // Minting  a NFT pass the collection canisterId in which you want to mint and the required details to add, this enables minting multiple tokens
  public shared ({ caller = user }) func mintExtNonFungible(
    _collectionCanisterId : Principal,
    name : Text,
    desc : Text,
    asset : Text,
    thumb : Text,
    metadata : ?MainTypes.MetadataContainer,
    amount : Nat,
  ) : async [(MainTypes.TokenIndex, MainTypes.TokenIdentifier)] {
    if (Principal.isAnonymous(user)) {
      throw Error.reject("User is not authenticated");
    };
    let canisterId = Principal.fromActor(Main);
    // Check if the caller is one of the controllers
    let controllerResult = await isController(canisterId, user);

    if (controllerResult == false) {
      throw Error.reject("Unauthorized: Only admins can mint nft.");
    };

    return await NftServices.mintExtNonFungible(
      _collectionCanisterId : Principal,
      name,
      desc,
      asset,
      thumb,
      metadata,
      amount,
      user,
    );
  };

  // Minting  a Fungible token pass the collection canisterId in which you want to mint and the required details to add, this enables minting multiple tokens
  public shared ({ caller = user }) func mintExtFungible(
    _collectionCanisterId : Principal,
    name : Text,
    symbol : Text,
    decimals : Nat8,
    metadata : ?MainTypes.MetadataContainer,
    amount : Nat,
  ) : async [MainTypes.TokenIndex] {
    return await NftServices.mintExtFungible(
      _collectionCanisterId,
      name,
      symbol,
      decimals,
      metadata,
      amount,
      user,
    );
  };

  // Get Fungible token details for specific collection
  public shared func getFungibleTokens(
    _collectionCanisterId : Principal
  ) : async [(MainTypes.TokenIndex, MainTypes.AccountIdentifier, Types.Metadata)] {
    let collectionCanisterActor = actor (Principal.toText(_collectionCanisterId)) : actor {
      getAllFungibleTokenData : () -> async [(MainTypes.TokenIndex, MainTypes.AccountIdentifier, Types.Metadata)];
    };
    await collectionCanisterActor.getAllFungibleTokenData();
  };

  // Get NFT details for specific collection
  public shared func getNonFungibleTokens(
    _collectionCanisterId : Principal
  ) : async [(MainTypes.TokenIndex, MainTypes.AccountIdentifier, Types.Metadata)] {
    let collectionCanisterActor = actor (Principal.toText(_collectionCanisterId)) : actor {
      getAllNonFungibleTokenData : () -> async [(MainTypes.TokenIndex, MainTypes.AccountIdentifier, Types.Metadata)];
    };
    await collectionCanisterActor.getAllNonFungibleTokenData();
  };

  //function to get details of a particular nft
  public shared func getSingleNonFungibleTokens(
    _collectionCanisterId : Principal,
    _tokenId : MainTypes.TokenIndex,
    user : MainTypes.AccountIdentifier,
  ) : async [(MainTypes.TokenIndex, MainTypes.AccountIdentifier, MainTypes.Metadata, ?Nat64, Bool)] {
    return await NftServices.getSingleNonFungibleTokens(_collectionCanisterId, _tokenId, user);
  };

  //fetch total number of nfts accross all collections
  public shared func getTotalNFTs() : async Nat {
    return await NftServices.getTotalNFTs(usersCollectionMap);
  };

  /* -------------------------------------------------------------------------- */
  /*                      NFT MARKETPLACE - USER CONTROLLERS                    */
  /* -------------------------------------------------------------------------- */

  // Token will be transfered to this Vault and gives you req details to construct a link out of it, which you can share
  public shared ({ caller = user }) func getNftTokenId(
    _collectionCanisterId : Principal,
    _tokenId : MainTypes.TokenIndex,
  ) : async MainTypes.TokenIdentifier {
    return await MainUtils.getNftTokenId(_collectionCanisterId, _tokenId);
  };

  public shared func userNFTsAllCollections(
    user : MainTypes.AccountIdentifier,
    chunkSize : Nat,
    pageNo : Nat,
  ) : async Result.Result<{ boughtNFTs : [(MainTypes.TokenIdentifier, MainTypes.TokenIndex, MainTypes.Metadata, Text, Principal, ?Nat64)]; current_page : Nat }, MainTypes.CommonError> {
    let result = await UserServices.userNFTsAllCollections(user, chunkSize, pageNo, NFTcollections);
    return result;
  };

  public shared ({ caller = user }) func claimBoosterNFT(
    collectionCanister : Principal,
    tokenId : MainTypes.TokenIdentifier,
    tokenIndex : MainTypes.TokenIndex,
  ) : async Text {
    if (Principal.isAnonymous(user)) {
      Debug.print("User is anonymous. Authentication required.");
      return "User must be authenticated";
    };

    Debug.print("=== Burn Initiation ===");
    Debug.print("User: " # Principal.toText(user));
    Debug.print("Collection: " # Principal.toText(collectionCanister));
    Debug.print("Token ID: " # tokenId);

    let userAccountId = Principal.toText(user);
    let nftActor = actor (Principal.toText(collectionCanister)) : actor {
      getSingleNonFungibleTokenData : (MainTypes.TokenIndex) -> async [(MainTypes.TokenIndex, MainTypes.AccountIdentifier, MainTypes.Metadata, ?Nat64)];
      ext_bearer : (tokenId : MainTypes.TokenIdentifier) -> async Result.Result<MainTypes.AccountIdentifier, MainTypes.CommonError>;
      ext_transfer : (request : MainTypes.TransferRequest) -> async Result.Result<Nat, MainTypes.CommonError>;
    };

    let bearerResult = await nftActor.ext_bearer(tokenId);
    switch (bearerResult) {
      case (#err(error)) {
        Debug.print("Failed to get NFT owner: " # debug_show (error));
        return "Failed to get NFT owner: " # debug_show (error);
      };
      case (#ok(owner)) {
        Debug.print("NFT Owner Account ID: " # owner);
        Debug.print("User Account ID: " # userAccountId);
        if (owner != userAccountId) {
          Debug.print("Ownership verified: NO");
          return "User does not own this NFT";
        };
        Debug.print("Ownership verified: YES");
      };
    };

    let tokenData = await nftActor.getSingleNonFungibleTokenData(tokenIndex);
    if (tokenData.size() > 0) {
      let (index, nftOwner, metadata, price) = tokenData[0];
      switch (metadata) {
        case (#fungible(fung)) {
          Debug.print("Fungible Token detected, not supported for burn");
          return "Token is not an NFT.";
        };
        case (#nonfungible(nfung)) {
          Debug.print("Nonfungible NFT Name: " # nfung.name);
          BoosterRecord.put(
            user,
            {
              NftTokeId = tokenId;
              boosterType = nfung.name;
              timestamp = Time.now();
              claimed = false;
            },
          );
        };
        case (_) {
          Debug.print("Unknown metadata variant");
          return "Unknown metadata variant.";
        };
      };
    } else {
      Debug.print("No token data found for tokenIndex " # Nat.toText(Nat32.toNat(tokenIndex)));
      return "No token data found";
    };

    // Transfer to burn address as an effective burn
    let transferRequest : MainTypes.TransferRequest = {
      from = #address(userAccountId);
      to = #address(BURN_ADDRESS);
      token = tokenId;
      amount = 1; // For NFTs, amount is always 1
      memo = Blob.fromArray([]);
      notify = false;
      subaccount = null;
    };

    let transferResult = await nftActor.ext_transfer(transferRequest);
    switch (transferResult) {
      case (#ok(balance)) {
        Debug.print("NFT transferred to burn address successfully. New balance: " # Nat.toText(balance));
      };
      case (#err(e)) {
        Debug.print("NFT transfer to burn address failed: " # debug_show (e));
        return "Failed to burn NFT: " # debug_show (e);
      };
    };

    return "Ownership verified, metadata logged, and NFT burned";
  };

  public shared func getBoostersForUser(user : Principal) : async ?MainTypes.BoosterInfo {
    return BoosterRecord.get(user);
  };

  public shared func updateBoosterRecordClaimed(user : Principal) : async () {
    switch (BoosterRecord.get(user)) {
      case (?booster) {
        let updatedBooster = {
          claimed = false;
          timestamp = booster.timestamp;
          boosterType = booster.boosterType;
          NftTokeId = booster.NftTokeId;
        };
        BoosterRecord.put(user, updatedBooster);
        Debug.print("Booster record updated for user");
      };
      case null {
        Debug.print("No booster record found for user");
      };
    };
  };

  // Get user details (for admin and user side both)
  public shared query ({ caller = user }) func getUserDetails(accountIdentifier : Principal) : async Result.Result<(Principal, Text, Nat, Text, Text, Text, ?Blob), Text> {
    if (Principal.isAnonymous(user)) {
      throw Error.reject("User is not authenticated");
    };

    return UserServices.getUserDetails(
      accountIdentifier,
      userDetailsMap,
      usersArray,
    );
  };

  //fetch list of all users
  public shared query ({ caller = user }) func getAllUsers(chunkSize : Nat, pageNo : Nat) : async Result.Result<{ data : [(Principal, Nat, Time.Time, Text, Text, ?Blob)]; current_page : Nat; total_pages : Nat }, Text> {
    if (Principal.isAnonymous(user)) {
      throw Error.reject("User is not authenticated");
    };

    return UserServices.getAllUsers(
      chunkSize,
      pageNo,
      userDetailsMap,
      usersArray,
    );
  };

  // Function to get the total number of users
  public shared query ({ caller = user }) func getTotalUsers() : async Nat {
    return usersArray.size();
  };

  //create user
  public shared ({ caller = user }) func create_user(accountIdentifier : Principal, uid : Text) : async Result.Result<(Nat, Time.Time), Text> {
    if (Principal.isAnonymous(user)) {
      throw Error.reject("User is not authenticated");
    };

    switch (await UserServices.create_user(accountIdentifier, uid, usersArray, userIdCounter)) {
      case (#err(msg)) { return #err(msg) };
      case (#ok((newUser, newCounter))) {
        // Update state here
        usersArray := Array.append(usersArray, [newUser]);
        userIdCounter := newCounter;

        return #ok((newUser.id, newUser.createdAt));
      };
    };
  };

  //enter user details
  public shared ({ caller = user }) func updateUserDetails(accountIdentifier : Principal, name : Text, email : Text, telegram : Text, profilePic : ?Blob) : async Result.Result<Text, Text> {
    if (Principal.isAnonymous(user)) {
      throw Error.reject("User is not authenticated");
    };

    return await UserServices.updateUserDetails(
      accountIdentifier,
      name,
      email,
      telegram,
      profilePic,
      userDetailsMap,
      usersArray,
    );
  };

  //usernftcollection (mycollection)
  public shared ({ caller = user }) func userNFTcollection(
    _collectionCanisterId : Principal,
    user : MainTypes.AccountIdentifier,
    chunkSize : Nat,
    pageNo : Nat,
  ) : async Result.Result<{ boughtNFTs : [(MainTypes.TokenIdentifier, MainTypes.TokenIndex, MainTypes.Metadata, Text, Principal, ?Nat64)]; unboughtNFTs : [(MainTypes.TokenIdentifier, MainTypes.TokenIndex, MainTypes.Metadata, Text, Principal, ?Nat64)]; current_page : Nat }, MainTypes.CommonError> {
    if (Principal.isAnonymous(Principal.fromText(user))) {
      throw Error.reject("User is not authenticated");
    };

    return await UserServices.userNFTcollection(
      _collectionCanisterId,
      user,
      chunkSize,
      pageNo,
    );
  };

  // user’s NFT purchase history for one collection
  public shared func useractivity(_collectionCanisterId : Principal, buyerId : MainTypes.AccountIdentifier) : async [(MainTypes.TokenIndex, MainTypes.TokenIdentifier, MainTypes.Transaction, Text)] {
    return await UserServices.useractivity(_collectionCanisterId, buyerId);
  };

  // user’s NFT purchase history across all collections
  public shared ({ caller = user }) func alluseractivity(buyerId : MainTypes.AccountIdentifier, chunkSize : Nat, pageNo : Nat) : async Result.Result<{ data : [(MainTypes.TokenIndex, MainTypes.TokenIdentifier, MainTypes.Transaction, Text)]; current_page : Nat; total_pages : Nat }, Text> {
    if (Principal.isAnonymous(user)) {
      throw Error.reject("User is not authenticated");
    };

    return await UserServices.alluseractivity(buyerId, chunkSize, pageNo, usersCollectionMap);
  };

  // place an order for a physical version of their NFT, stored in an orders array.
  public shared ({ caller = user }) func gethardcopy(
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
  ) : async Result.Result<Text, Text> {

    if (Principal.isAnonymous(user)) {
      throw Error.reject("User is not authenticated");
    };

    let (result, updatedOrders, newCounter) = UserServices.gethardcopy(
      accountIdentifier,
      uuid,
      collectionCanisterId,
      phone,
      email,
      address,
      city,
      country,
      pincode,
      landmark,
      usersArray,
      orders,
      orderIdCounter,
    );

    // update stable state
    orders := updatedOrders;
    orderIdCounter := newCounter;

    return result;
  };
  /* -------------------------------------------------------------------------- */
  /*                  NFT MARKETPLACE - FAVORITES CONTROLLERS                   */
  /* -------------------------------------------------------------------------- */

  // ADD TO FAVORITES //
  public shared ({ caller = user }) func addToFavorites(
    user : MainTypes.AccountIdentifier,
    tokenIdentifier : MainTypes.TokenIdentifier,
  ) : async Result.Result<Text, MainTypes.CommonError> {
    if (Principal.isAnonymous(Principal.fromText(user))) {
      throw Error.reject("User is not authenticated");
    };

    return await FavoriteServices.addToFavorites(
      user,
      tokenIdentifier,
      _favorites,
    );
  };

  //REMOVE FROM FAVORITES //
  // Function to remove a token from the user's favorites
  public shared ({ caller = user }) func removeFromFavorites(user : MainTypes.AccountIdentifier, tokenIdentifier : MainTypes.TokenIdentifier) : async Result.Result<Text, MainTypes.CommonError> {
    if (Principal.isAnonymous(Principal.fromText(user))) {
      throw Error.reject("User is not authenticated");
    };

    return await FavoriteServices.removeFromFavorites(user, tokenIdentifier, _favorites);
  };

  // GET USER FAVORITES //
  // Function to get the user's favorites
  public shared query ({ caller = user }) func getFavorites(user : MainTypes.AccountIdentifier) : async Result.Result<[(MainTypes.TokenIdentifier)], MainTypes.CommonError> {
    if (Principal.isAnonymous(Principal.fromText(user))) {
      throw Error.reject("User is not authenticated");
    };
    return FavoriteServices.getFavorites(user, _favorites);
  };

  /* -------------------------------------------------------------------------- */
  /*                     NFT MARKETPLACE - ORDER CONTROLLERS                    */
  /* -------------------------------------------------------------------------- */

  //get all orders of users (admin side)
  public query ({ caller = user }) func getallOrders(
    chunkSize : Nat,
    pageNo : Nat,
  ) : async Result.Result<{ data : [MainTypes.Order]; current_page : Nat; total_pages : Nat }, Text> {
    if (Principal.isAnonymous(user)) {
      throw Error.reject("User is not authenticated");
    };

    return OrderServices.getallOrders(chunkSize, pageNo, orders);
  };

  // get order details for a specific order
  public query ({ caller = user }) func orderDetails(
    accountIdentifier : Principal,
    orderId : Nat,
  ) : async Result.Result<MainTypes.Order, Text> {
    if (Principal.isAnonymous(user)) {
      throw Error.reject("User is not authenticated");
    };

    return OrderServices.orderDetails(accountIdentifier, orderId, orders);
  };

  // Get all orders for a specific user based on their account identifier
  public query ({ caller = user }) func getuserorders(accountIdentifier : Principal) : async Result.Result<[MainTypes.Order], Text> {
    if (Principal.isAnonymous(user)) {
      throw Error.reject("User is not authenticated");
    };

    return OrderServices.getuserorders(accountIdentifier, orders);
  };

  //update existing order details
  public shared ({ caller = user }) func updateOrder(
    accountIdentifier : Principal,
    orderId : Nat,
    phone : Text,
    email : Text,
    address : Text,
    city : Text,
    country : Text,
    pincode : Text,
    landmark : ?Text,
  ) : async Result.Result<Text, Text> {
    if (Principal.isAnonymous(user)) {
      throw Error.reject("User is not authenticated");
    };

    switch (
      OrderServices.updateOrder(
        accountIdentifier,
        orderId,
        phone,
        email,
        address,
        city,
        country,
        pincode,
        landmark,
        orders,
      )
    ) {
      case (#ok((msg, updatedOrders))) {
        orders := updatedOrders;
        return #ok(msg);
      };
      case (#err(e)) {
        return #err(e);
      };
    };
  };
  //remove existing orders
  public shared ({ caller = user }) func removeOrder(
    accountIdentifier : Principal,
    orderId : Nat,
  ) : async Result.Result<Text, Text> {
    if (Principal.isAnonymous(user)) {
      throw Error.reject("User is not authenticated");
    };

    switch (OrderServices.removeOrder(accountIdentifier, orderId, orders)) {
      case (#ok((msg, updatedOrders))) {
        orders := updatedOrders;
        return #ok(msg);
      };
      case (#err(e)) {
        return #err(e);
      };
    };
  };

  /* -------------------------------------------------------------------------- */
  /*                     NFT MARKETPLACE - GENERAL CONTROLLERS                  */
  /* -------------------------------------------------------------------------- */

  //set price for the nfts
  public shared (msg) func listprice(_collectionCanisterId : Principal, request : MainTypes.ListRequest) : async Result.Result<(), MainTypes.CommonError> {
    let canisterId = Principal.fromActor(Main);
    // Check if the caller is one of the controllers
    let controllerResult = await isController(canisterId, msg.caller);

    if (controllerResult == false) {
      throw Error.reject("Unauthorized: Only admins can list price");
    };

    let priceactor = actor (Principal.toText(_collectionCanisterId)) : actor {
      ext_marketplaceList : (caller : Principal, request : MainTypes.ListRequest) -> async Result.Result<(), MainTypes.CommonError>;
    };
    return await priceactor.ext_marketplaceList(msg.caller, request);
  };

  //Get the NFT listings and their corresponding prices, now including TokenIndex and TokenIdentifier
  public shared func listings(_collectionCanisterId : Principal) : async [(MainTypes.TokenIndex, MainTypes.TokenIdentifier, MainTypes.Listing, MainTypes.Metadata)] {
    return await MarketplaceServices.listings(_collectionCanisterId);
  };

  public shared func plistings(
    _collectionCanisterId : Principal,
    chunkSize : Nat,
    pageNo : Nat,
  ) : async Result.Result<{ data : [(MainTypes.TokenIndex, MainTypes.TokenIdentifier, MainTypes.Listing, MainTypes.Metadata)]; current_page : Nat; total_pages : Nat }, Text> {
    return await MarketplaceServices.plistings(_collectionCanisterId, chunkSize, pageNo);
  };

  //purchase nft
  public shared ({ caller = user }) func purchaseNft(_collectionCanisterId : Principal, tokenid : MainTypes.TokenIdentifier, price : Nat64, buyer : MainTypes.AccountIdentifier) : async Result.Result<(MainTypes.AccountIdentifier, Nat64), MainTypes.CommonError> {
    if (Principal.isAnonymous(user)) {
      throw Error.reject("User is not authenticated");
    };

    return await MarketplaceServices.purchaseNft(_collectionCanisterId, tokenid, price, buyer);
  };

  //settle and confirm purchase
  public shared ({ caller = user }) func settlepurchase(_collectionCanisterId : Principal, paymentaddress : MainTypes.AccountIdentifier) : async Result.Result<(), MainTypes.CommonError> {
    if (Principal.isAnonymous(user)) {
      throw Error.reject("User is not authenticated");
    };

    return await MarketplaceServices.settlepurchase(_collectionCanisterId, paymentaddress);
  };

  // Get the transaction details
  public shared func transactions(_collectionCanisterId : Principal) : async [(MainTypes.TokenIndex, MainTypes.TokenIdentifier, MainTypes.Transaction)] {
    return await MarketplaceServices.transactions(_collectionCanisterId);
  };

  public shared (msg) func alltransactions(chunkSize : Nat, pageNo : Nat) : async Result.Result<{ data : [(MainTypes.TokenIndex, MainTypes.TokenIdentifier, MainTypes.Transaction)]; current_page : Nat; total_pages : Nat }, Text> {
    if (Principal.isAnonymous(msg.caller)) {
      throw Error.reject("User is not authenticated");
    };
    let canisterId = Principal.fromActor(Main);
    // Check if the caller is one of the controllers
    let controllerResult = await isController(canisterId, msg.caller);

    if (controllerResult == false) {
      throw Error.reject("Unauthorized: Only admins can list price");
    };
    var allTransactions : [(MainTypes.TokenIndex, MainTypes.TokenIdentifier, MainTypes.Transaction)] = [];

    return await MarketplaceServices.alltransactions(chunkSize, pageNo, usersCollectionMap);
  };

  //get marketplace stats
  public shared func marketstats(_collectionCanisterId : Principal) : async (Nat64, Nat64, Nat64, Nat64, Nat, Nat, Nat) {
    let getstats = actor (Principal.toText(_collectionCanisterId)) : actor {
      ext_marketplaceStats : () -> async (Nat64, Nat64, Nat64, Nat64, Nat, Nat, Nat);
    };

    return await getstats.ext_marketplaceStats();
  };

  public shared (msg) func transfer_balance(
    _collectionCanisterId : Principal,
    paymentAddress : MainTypes.AccountIdentifier,
    amount_e8s : Nat64,
    subaccount : ?MainTypes.SubAccount,
  ) : async Result.Result<Nat64, MainTypes.CommonError> {
    if (Principal.isAnonymous(msg.caller)) {
      throw Error.reject("User is not authenticated");
    };
    // Debug print available cycles
    Debug.print("Available cycles: " # Nat.toText(Cycles.balance()));

    return await transfer_balance(_collectionCanisterId, paymentAddress, amount_e8s, subaccount);
  };

  public shared ({ caller = user }) func balance_settelment(_collectionCanisterId : Principal) : async () {
    if (Principal.isAnonymous(user)) {
      throw Error.reject("User is not authenticated");
    };
    let getResult = actor (Principal.toText(_collectionCanisterId)) : actor {
      heartbeat_disbursements : () -> async ();
    };
    return await getResult.heartbeat_disbursements();
  };

  public shared ({ caller = user }) func balance_nft_settelment(_collectionCanisterId : Principal) : async () {
    if (Principal.isAnonymous(user)) {
      throw Error.reject("User is not authenticated");
    };
    let getResult = actor (Principal.toText(_collectionCanisterId)) : actor {
      heartbeat_myself : () -> async ();
    };
    return await getResult.heartbeat_myself();
  };

  public shared ({ caller = user }) func all_settelment(_collectionCanisterId : Principal) : async () {
    if (Principal.isAnonymous(user)) {
      throw Error.reject("User is not authenticated");
    };

    let getResult = actor (Principal.toText(_collectionCanisterId)) : actor {
      heartbeat_external : () -> async ();
    };
    return await getResult.heartbeat_external();
  };

  public shared (msg) func send_balance_and_nft(
    _collectionCanisterId : Principal,
    paymentAddress : MainTypes.AccountIdentifier,
    amount_e8s : Nat64,
    subaccount : ?MainTypes.SubAccount,
  ) : async Result.Result<Nat64, MainTypes.CommonError> {
    if (Principal.isAnonymous(msg.caller)) {
      throw Error.reject("User is not authenticated");
    };
    // Debug print available cycles
    Debug.print("Available cycles: " # Nat.toText(Cycles.balance()));
    return await MarketplaceServices.send_balance_and_nft(_collectionCanisterId, paymentAddress, amount_e8s, subaccount);
  };
};
