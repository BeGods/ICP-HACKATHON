//functions list:

// System Functions:
// 1. preupgrade
// 2. postupgrade
// 3. fetchCycles

// Collection-related Functions:
// 4. add_collection_to_map
// 5. removeCollection
// 6. createExtCollection
// 7. getUserCollectionDetails
// 8. getUserCollections
// 9. getAllCollections
// 10. totalcollections
// 11. getAllCollectionNFTs
// 12. getSingleCollectionDetails
// 13. getAllNFTsAcrossAllCollections

// NFT-related Functions:
// 14. getNftTokenId
// 15. mintExtNonFungible
// 16. mintExtFungible
// 17. getFungibleTokens
// 18. getNonFungibleTokens
// 19. getSingleNonFungibleTokens
// 20. getTotalNFTs

// User-related Functions:
// 21. create_user
// 22. updateUserDetails
// 23. getUserDetails
// 24. getAllUsers
// 25. getTotalUsers
// 26. userNFTcollection
// 27. addToFavorites
// 28. removeFromFavorites
// 29. getFavorites
// 30. useractivity

// Order-related Functions:
// 31. gethardcopy
// 32. updateOrder
// 33. removeOrder
// 34. getallOrders
// 35. orderDetails
// 36. getuserorders

// Marketplace-related Functions:
// 37. listprice
// 38. listings
// 39. purchaseNft
// 40. settlepurchase
// 41. transactions
// 42. marketstats
// 43. transfer_balance
// 44. balance_settelment
// 45. balance_nft_settelment
// 46. all_settelment
// 47. send_balance_and_nft

// Miscellaneous Functions:
// 48. getDeposits

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
import UsersTypes "./Users/Types";
import V2 "../EXT-V2/ext_v2/v2";
import HashMap "mo:base/HashMap";
import Hash "mo:base/Hash";
import Option "mo:base/Option";
import Queue "../EXT-V2/motoko/util/Queue";
import ExtCommon "../EXT-V2/motoko/ext/Common";
import _owners "../EXT-V2/ext_v2/v2";
import Pagin "pagin";

actor Main {

  type AccountIdentifier = ExtCore.AccountIdentifier;
  type TokenIndex = ExtCore.TokenIndex;
  type TokenIdentifier = ExtCore.TokenIdentifier;

  type NFTInfo = (TokenIndex, AccountIdentifier, Metadata);

  type MetadataValue = (
    Text,
    {
      #text : Text;
      #blob : Blob;
      #nat : Nat;
      #nat8 : Nat8;
    },
  );
  type MetadataContainer = {
    #data : [MetadataValue];
    #blob : Blob;
    #json : Text;
  };

  type TransferRequest = ExtCore.TransferRequest;
  type TransferResponse = ExtCore.TransferResponse;

  type Deposit = {
    tokenId : TokenIndex;
    sender : Principal;
    collectionCanister : Principal;
    timestamp : Time.Time;
    pubKey : Principal;
  };

  type SubAccount = ExtCore.SubAccount;

  public type ListRequest = {
    token : TokenIdentifier;
    from_subaccount : ?SubAccount;
    price : ?Nat64;
  };

  type Listing = {
    seller : Principal;
    price : Nat64;
    locked : ?Time;
  };

  type Transaction = {
    token : TokenIndex;
    seller : AccountIdentifier;
    price : Nat64;
    buyer : AccountIdentifier;
    time : Time;
  };

  type Metadata = {
    #fungible : {
      name : Text;
      symbol : Text;
      decimals : Nat8;
      metadata : ?MetadataContainer;
    };
    #nonfungible : {
      name : Text;
      description : Text;
      asset : Text;
      thumbnail : Text;
      metadata : ?MetadataContainer;
    };
  };

  type User = {
    uid : Text;
    id : Nat;
    accountIdentifier : Principal;
    createdAt : Time.Time;
  };

  //To store additional user details
  type UserDetails = {
    name : Text;
    email : Text;
    telegram : Text;
    profilepic : ?Blob;
  };

  //LEDGER
  type AccountBalanceArgs = { account : AccountIdentifier };
  type ICPTs = { e8s : Nat64 };
  type SendArgs = {
    memo : Nat64;
    amount : ICPTs;
    fee : ICPTs;
    from_subaccount : ?SubAccount;
    to : AccountIdentifier;
    created_at_time : ?Time;
  };

  let ExternalService_ICPLedger = actor "bkyz2-fmaaa-aaaaa-qaaaq-cai" : actor {
    send_dfx : shared SendArgs -> async Nat64;
    account_balance_dfx : shared query AccountBalanceArgs -> async ICPTs;
  };

  type Order = {
    id : Nat;
    accountIdentifier : Principal;
    uuid : Text;
    collectionCanisterId : Principal;
    phone : Text;
    email : Text;
    address : Text;
    city : Text;
    country : Text;
    pincode : Text;
    landmark : ?Text;
    orderTime : Time.Time;
  };

  //Exttypes
  type Time = Time.Time;

  //type User = ExtCore.User;
  type CommonError = ExtCore.CommonError;
  type MetadataLegacy = ExtCommon.Metadata;

  /* -------------------------------------------------------------------------- */
  /*                         Data Maps                                          */
  /* -------------------------------------------------------------------------- */

  // Maps user and the collection canisterIds they create
  private var usersCollectionMap = TrieMap.TrieMap<Principal, [(Time.Time, Principal)]>(Principal.equal, Principal.hash);
  private stable var stableusersCollectionMap : [(Principal, [(Time.Time, Principal)])] = [];

  // Stores details about the tokens coming into this vault
  private stable var deposits : [Deposit] = [];

  // favorites data structure
  private var _favorites : HashMap.HashMap<AccountIdentifier, [(TokenIdentifier)]> = HashMap.HashMap<AccountIdentifier, [(TokenIdentifier)]>(0, AID.equal, AID.hash);
  private stable var stableFavorites : [(AccountIdentifier, [(TokenIdentifier)])] = [];

  //DB to store user related data
  private stable var usersArray : [User] = [];
  private stable var userIdCounter : Nat = 0;
  //private stable var userDetailsArray: [UserDetails] = [];
  private var userDetailsMap : TrieMap.TrieMap<Principal, UserDetails> = TrieMap.TrieMap<Principal, UserDetails>(Principal.equal, Principal.hash);

  //DB to store order related details
  private stable var orders : [Order] = [];
  private stable var orderIdCounter : Nat = 0;

  /* -------------------------------------------------------------------------- */
  /*                         SYSTEM FUNCTIONS                                   */
  /* -------------------------------------------------------------------------- */

  system func preupgrade() {
    stableusersCollectionMap := Iter.toArray(usersCollectionMap.entries());
    stableFavorites := Iter.toArray(_favorites.entries());

  };

  system func postupgrade() {
    usersCollectionMap := TrieMap.fromEntries(stableusersCollectionMap.vals(), Principal.equal, Principal.hash);
    _favorites := HashMap.fromIter<AccountIdentifier, [(TokenIdentifier)]>(
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

  let IC = actor "aaaaa-aa" : actor {
    canister_status : { canister_id : Principal } -> async {
      settings : { controllers : [Principal] };
    };
  };

  public shared func ping(name : Text) : async Text {
    Debug.print("📡 Ping received from frontend with name: " # name);
    return "Pong to " # name;
  };

  public shared (msg) func isController(canister_id : Principal, principal_id : Principal) : async Bool {
    let status = await IC.canister_status({ canister_id = canister_id });
    return contains(status.settings.controllers, principal_id);
  };

  public type Result = { #ok : Bool } or { #err : Text };

  /* -------------------------------------------------------------------------- */
  /*                         GAME                                 */
  /* -------------------------------------------------------------------------- */

  type CompletionRecord = {
    completedAt : Time.Time;
    mythology : Text;
    minted : Bool;
  };

  // Fix 1: Explicitly type the TrieMap initialization
  private var questCompletions : TrieMap.TrieMap<Principal, CompletionRecord> = TrieMap.TrieMap<Principal, CompletionRecord>(
    Principal.equal,
    Principal.hash,
  );

  // Fix 2: Proper public function declaration with return type
  public shared ({ caller }) func registerQuestCompletion(principal_id : Principal, mythologyText : Text) : async Bool {
    Debug.print("Caller principal: " # Principal.toText(caller));

    // Check if user already completed the quest
    switch (questCompletions.get(principal_id)) {
      case (?_) {
        Debug.print("FALSE - User already registered");
        return false;
      };
      case null {
        let completionRecord : CompletionRecord = {
          completedAt = Time.now();
          mythology = mythologyText;
          minted = false;
        };
        questCompletions.put(principal_id, completionRecord);
        Debug.print("Quest completion registered successfully");
        return true;
      };
    };
  };

  public query func getAllQuestCompletionsTuple() : async [(Principal, CompletionRecord)] {
    Iter.toArray(questCompletions.entries());
  };

  /* -------------------------------------------------------------------------- */
  /*                         PAKCETS                                            */
  /* -------------------------------------------------------------------------- */
  type PacketMetadata = {
    name : Text;
    description : Text;
    image : Text;
    attributes : [{ trait_type : Text; value : Text }];
  };

  // EXT standard types
  type PacketUser = {
    #address : Text;
    #principal : Principal;
  };

  // EXT Packet Canister interface
  type ExtPacketCanister = actor {
    ext_mint : (request : [(AccountIdentifier, Metadata)]) -> async [TokenIndex];
    setMinter : (minter : Principal) -> async ();
    ext_setCollectionMetadata : (name : Text, symbol : Text, metadata : Text) -> async ();
  };

  type PacketCanister = actor {
    mint : ({
      to : Principal;
      token_id : Nat;
      metadata : PacketMetadata;
    }) -> async Result.Result<Nat, Text>;
  };

  // Intermediate type for conversion
  type PacketEXTMetadata = {
    #fungible : {
      name : Text;
      symbol : Text;
      decimals : Nat8;
      metadata : ?[Nat8];
    };
    #nonfungible : {
      name : Text;
      description : ?Text;
      image : ?Text;
      thumbnail : ?Text;
      asset : Text;
      attributes : ?[(Text, Text)];
    };
  };

  private stable var nextTokenId : Nat = 1;

  public query func getNextTokenId() : async Nat {
    nextTokenId;
  };

  public query func getTotalMintedPackets() : async Nat {
    nextTokenId - 1;
  };

  public shared ({ caller }) func mintPacketToUser(recipient : Principal) : async Result.Result<TokenIndex, Text> {
    let tokenId = nextTokenId;
    nextTokenId += 1;

    let metadata = generateQuestPacketMetadata(recipient, Time.now(), tokenId);

    try {
      // Add cycles for canister creation
      Cycles.add<system>(900_000_000_000);

      // Create EXT Packet Canister
      let extToken = await ExtTokenClass.EXTNFT(Principal.fromActor(Main));
      let extPacketCanisterId = await extToken.getCanisterId();

      // Cast to interface
      let extPacketCanister = actor (Principal.toText(extPacketCanisterId)) : ExtPacketCanister;

      // Debug logs for confirmation (removed problematic actor reference logging)
      Debug.print("✅ New EXT Packet Canister created:");
      Debug.print("   Canister ID: " # Principal.toText(extPacketCanisterId));

      // Set this canister as minter
      await extPacketCanister.setMinter(Principal.fromActor(Main));

      // Set collection metadata
      await extPacketCanister.ext_setCollectionMetadata(
        "Quest Completion Collection",
        "QUEST",
        "A collection of Packets awarded for completing quests",
      );

      // Convert to EXT format and prepare for minting
      let extMetadata = convertToExtMetadata(metadata);

      // Convert PacketEXTMetadata to Metadata format expected by ext_mint
      let metadataForMint : Metadata = switch (extMetadata) {
        case (#nonfungible(nft)) {
          let description = switch (nft.description) {
            case (?desc) { desc };
            case null { "" }; // Provide default empty string since description is required
          };
          let thumbnail = switch (nft.thumbnail) {
            case (?thumb) { thumb };
            case null {
              switch (nft.image) {
                case (?img) { img };
                case null { "" };
              };
            }; // Use image as fallback since thumbnail is required
          };

          // Create base metadata container with NFT attributes
          let baseMetadataValues : [MetadataValue] = [
            ("name", #text(nft.name)),
            ("description", #text(description)),
            ("image", #text(switch (nft.image) { case (?img) { img }; case null { "" } })),
            ("thumbnail", #text(thumbnail)),
            ("asset", #text(nft.asset)),
          ];

          // Add attributes if they exist
          let attributeValues : [MetadataValue] = switch (nft.attributes) {
            case (?attrs) {
              Array.map<(Text, Text), MetadataValue>(
                attrs,
                func((key, value)) = (key, #text(value)),
              );
            };
            case null { [] };
          };

          // Combine base metadata with attributes using Array.append
          let allMetadataValues = Array.append(baseMetadataValues, attributeValues);

          #nonfungible({
            name = nft.name;
            description = description;
            thumbnail = thumbnail;
            asset = nft.asset;
            metadata = ?#data(allMetadataValues);
          });
        };
        case (#fungible(_)) {
          return #err("Fungible tokens not supported for quest packets");
        };
      };

      // Convert recipient to AccountIdentifier
      let recipientAccountId : AccountIdentifier = switch (#principal(recipient)) {
        case (#principal(p)) {
          Principal.toText(p);
        };
        case (#address(addr)) { addr };
      };

      // Mint Packet
      let tokenIndices = await extPacketCanister.ext_mint([(recipientAccountId, metadataForMint)]);

      switch (tokenIndices.size()) {
        case (0) {
          nextTokenId -= 1;
          #err("No tokens were minted");
        };
        case (_) {
          let tokenIndex = tokenIndices[0];
          Debug.print("✅ EXT Packet minted successfully with TokenIndex: " # Nat32.toText(tokenIndex));
          #ok(tokenIndex);
        };
      };

    } catch (error) {
      nextTokenId -= 1;
      Debug.print("❌ EXT Packet minting failed: " # Error.message(error));
      #err("EXT Packet minting failed: " # Error.message(error));
    };
  };

  private func convertToExtMetadata(packetMeta : PacketMetadata) : PacketEXTMetadata {
    // Convert attributes to EXT format
    let extAttributes : [(Text, Text)] = Array.map<{ trait_type : Text; value : Text }, (Text, Text)>(
      packetMeta.attributes,
      func(attr) = (attr.trait_type, attr.value),
    );

    #nonfungible({
      name = packetMeta.name;
      description = ?packetMeta.description;
      image = ?packetMeta.image;
      thumbnail = ?packetMeta.image; // Use same image as thumbnail
      asset = packetMeta.name; // Asset name
      attributes = ?extAttributes;
    });
  };

  private func generateQuestPacketMetadata(recipient : Principal, completedAt : Time.Time, tokenId : Nat) : PacketMetadata {
    let completionDate = Int.toText(completedAt);

    {
      name = "Quest Completion Packet #" # Nat.toText(tokenId);
      description = "Awarded for completing the Main Quest. This Packet certifies that " #
      Principal.toText(recipient) # " successfully completed all quest requirements.";
      image = "https://media.publit.io/file/BeGods/nft/360px-fof.packet.egyptian.png";
      attributes = [
        { trait_type = "Quest Type"; value = "Main Quest" },
        { trait_type = "Completion Date"; value = completionDate },
        { trait_type = "Token ID"; value = Nat.toText(tokenId) },
        { trait_type = "Rarity"; value = "Common" },
        { trait_type = "Network"; value = "Internet Computer" },
      ];
    };
  };

  type UserPacket = {
    tokenId : TokenIndex;
    metadata : PacketMetadata;
  };

  // =============================================================================================================================

  public shared (msg) func checkController(canister_id : Principal, principal_id : Principal) : async Result {
    try {
      let status = await IC.canister_status({ canister_id = canister_id });
      let isCtrl = contains(status.settings.controllers, principal_id);
      Debug.print("Caller principal: " # Principal.toText(principal_id));
      return #ok(isCtrl);
    } catch (err) {
      return #err("Failed to fetch canister status");
    };
  };

  public shared ({ caller }) func whoAmI() : async Text {
    let principalText = Principal.toText(caller);

    Debug.print("📢 Caller principal: " # principalText);

    if (Principal.isAnonymous(caller)) {
      Debug.print("❌ You are anonymous (principal: " # principalText # ")");

      return "❌ You are anonymous (principal: " # principalText # ")";
    } else {

      Debug.print("✅ You are authenticated as principal: " # principalText);

      return "✅ You are authenticated as principal: " # principalText;
    };
  };

  func contains(arr : [Principal], value : Principal) : Bool {
    var found = false;
    for (item in arr.vals()) {
      if (item == value) {
        found := true;
      };
    };
    return found;
  };

  /* -------------------------------------------------------------------------- */
  /*                         collection related methods                         */
  /* -------------------------------------------------------------------------- */

  //add collection manually to collection map
  public shared ({ caller = user }) func add_collection_to_map(collection_id : Principal) : async Text {
    if (Principal.isAnonymous(user)) {
      throw Error.reject("User is not authenticated");
    };
    let canisterId = Principal.fromActor(Main);
    // Check if the caller is one of the controllers
    let controllerResult = await isController(canisterId, user);

    if (controllerResult == false) {
      return ("Unauthorized: Only admins can add new collection");
    };

    let userCollections = usersCollectionMap.get(user);
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

  public shared ({ caller = user }) func removeCollection(collection_id : Principal) : async Text {
    if (Principal.isAnonymous(user)) {
      throw Error.reject("User is not authenticated");
    };

    let canisterId = Principal.fromActor(Main);

    // Check if the caller is one of the controllers (admin check)
    let controllerResult = await isController(canisterId, user);
    if (controllerResult == false) {
      return "Unauthorized: Only admins can delete a collection.";
    };

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

  // Collection creation
  public shared ({ caller = user }) func createExtCollection(_title : Text, _symbol : Text, _metadata : Text) : async (Principal, Principal) {
    Debug.print("Caller principal: " # Principal.toText(user));

    if (Principal.isAnonymous(user)) {
      throw Error.reject("User is not authenticated");
    };

    let canisterId = Principal.fromActor(Main);
    // Check if the caller is one of the controllers
    let controllerResult = await isController(canisterId, user);

    if (controllerResult == false) {
      throw Error.reject("Unauthorized: Only admins can create a new collection.");
    };

    Cycles.add<system>(900_000_000_000);
    let extToken = await ExtTokenClass.EXTNFT(Principal.fromActor(Main));
    let extCollectionCanisterId = await extToken.getCanisterId();
    let collectionCanisterActor = actor (Principal.toText(extCollectionCanisterId)) : actor {
      ext_setCollectionMetadata : (
        name : Text,
        symbol : Text,
        metadata : Text,
      ) -> async ();
      setMinter : (minter : Principal) -> async ();
      ext_admin : () -> async Principal;
    };
    await collectionCanisterActor.setMinter(user);
    await collectionCanisterActor.ext_setCollectionMetadata(_title, _symbol, _metadata);

    // Updating the userCollectionMap
    let collections = usersCollectionMap.get(user);
    switch (collections) {
      case null {
        let updatedCollections = [(Time.now(), extCollectionCanisterId)];
        usersCollectionMap.put(user, updatedCollections);
        return (user, extCollectionCanisterId);
      };
      case (?collections) {
        let updatedObj = List.push((Time.now(), extCollectionCanisterId), List.fromArray(collections));
        usersCollectionMap.put(user, List.toArray(updatedObj));
        return (user, extCollectionCanisterId);
      };
    };

  };

  // Getting Collection Metadata
  public shared ({ caller = user }) func getUserCollectionDetails() : async ?[(Time.Time, Principal, Text, Text, Text)] {
    let collections = usersCollectionMap.get(user);
    switch (collections) {
      case (null) {
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

  // Getting Collections that user own(only gets canisterIds of respective collections)
  public shared query ({ caller = user }) func getUserCollections() : async ?[(Time.Time, Principal)] {
    return usersCollectionMap.get(user);
  };

  // // Getting all the collections ever created(only gets the canisterIds)
  public shared func getAllCollections() : async [(Principal, [(Time.Time, Principal, Text, Text, Text)])] {
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

  //getTotalCollection
  public shared ({ caller = user }) func totalcollections() : async Nat {
    var count : Nat = 0;
    for ((k, v) in usersCollectionMap.entries()) {
      count := count + v.size();
    };
    return count;
  };

  public shared ({ caller = user }) func getAllCollectionNFTs(
    _collectionCanisterId : Principal,
    chunkSize : Nat,
    pageNo : Nat,
  ) : async Result.Result<{ data : [(TokenIndex, AccountIdentifier, Types.Metadata, ?Nat64)]; current_page : Nat; total_pages : Nat }, Text> {
    if (Principal.isAnonymous(user)) {
      throw Error.reject("User is not authenticated");
    };
    let canisterId = Principal.fromActor(Main);
    // Check if the caller is one of the controllers
    let controllerResult = await isController(canisterId, user);

    if (controllerResult == false) {
      throw Error.reject("Unauthorized: Only admins can view collection nfts");
    };

    // Define the canister actor interface
    let collectionCanisterActor = actor (Principal.toText(_collectionCanisterId)) : actor {
      getAllNonFungibleTokenData : () -> async [(TokenIndex, AccountIdentifier, Types.Metadata, ?Nat64)];
    };

    // Retrieve all NFTs from the specified collection canister
    let nfts = await collectionCanisterActor.getAllNonFungibleTokenData();

    // Apply pagination
    let paginatedNFTs = Pagin.paginate<(TokenIndex, AccountIdentifier, Types.Metadata, ?Nat64)>(nfts, chunkSize);

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

  //GET SINGLE COLLECTION DETAILS
  // Function to get all NFT details within a specific collection and the count of total NFTs
  public shared func getSingleCollectionDetails(
    collectionCanisterId : Principal
  ) : async ([(TokenIndex, AccountIdentifier, Types.Metadata)], Nat) {
    let collectionCanisterActor = actor (Principal.toText(collectionCanisterId)) : actor {
      getAllNonFungibleTokenData : () -> async [(TokenIndex, AccountIdentifier, Types.Metadata)];
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

  /* -------------------------------------------------------------------------- */
  /*                             NFT related methods                            */
  /* -------------------------------------------------------------------------- */

  // Token will be transfered to this Vault and gives you req details to construct a link out of it, which you can share
  public shared ({ caller = user }) func getNftTokenId(
    _collectionCanisterId : Principal,
    _tokenId : TokenIndex,

  ) : async TokenIdentifier {
    let tokenIdentifier = ExtCore.TokenIdentifier.fromPrincipal(_collectionCanisterId, _tokenId);
    return tokenIdentifier;
  };

  // Minting  a NFT pass the collection canisterId in which you want to mint and the required details to add, this enables minting multiple tokens
  public shared ({ caller = user }) func mintExtNonFungible(
    _collectionCanisterId : Principal,
    name : Text,
    desc : Text,
    asset : Text,
    thumb : Text,
    metadata : ?MetadataContainer,
    amount : Nat

  ) : async [(TokenIndex, TokenIdentifier)] {
    if (Principal.isAnonymous(user)) {
      throw Error.reject("User is not authenticated");
    };
    let canisterId = Principal.fromActor(Main);
    // Check if the caller is one of the controllers
    let controllerResult = await isController(canisterId, user);

    if (controllerResult == false) {
      throw Error.reject("Unauthorized: Only admins can mint nft.");
    };

    let collectionCanisterActor = actor (Principal.toText(_collectionCanisterId)) : actor {
      ext_mint : (
        request : [(AccountIdentifier, Types.Metadata)]
      ) -> async [TokenIndex];
    };
    let metadataNonFungible : Types.Metadata = #nonfungible {
      name = name;
      description = desc;
      asset = asset;
      thumbnail = thumb;
      metadata = metadata;
    };

    let receiver = AID.fromPrincipal(user, null);
    var request : [(AccountIdentifier, Types.Metadata)] = [];
    var i : Nat = 0;
    while (i < amount) {
      request := Array.append(request, [(receiver, metadataNonFungible)]);
      i := i + 1;
    };
    let extMint = await collectionCanisterActor.ext_mint(request);
    var result_list = List.nil<(TokenIndex, TokenIdentifier)>();
    for (i in extMint.vals()) {
      let _tokenIdentifier = await getNftTokenId(_collectionCanisterId, i);
      result_list := List.push((i, _tokenIdentifier), result_list);
    };
    List.toArray(result_list);
  };

  // Minting  a Fungible token pass the collection canisterId in which you want to mint and the required details to add, this enables minting multiple tokens
  public shared ({ caller = user }) func mintExtFungible(
    _collectionCanisterId : Principal,
    name : Text,
    symbol : Text,
    decimals : Nat8,
    metadata : ?MetadataContainer,
    amount : Nat

  ) : async [TokenIndex] {

    let collectionCanisterActor = actor (Principal.toText(_collectionCanisterId)) : actor {
      ext_mint : (
        request : [(AccountIdentifier, Types.Metadata)]
      ) -> async [TokenIndex];
    };
    let metadataFungible : Types.Metadata = #fungible {
      name = name;
      symbol = symbol;
      decimals = decimals;
      metadata = metadata;
    };

    let receiver = AID.fromPrincipal(user, null);
    var request : [(AccountIdentifier, Types.Metadata)] = [];
    var i : Nat = 0;
    while (i < amount) {
      request := Array.append(request, [(receiver, metadataFungible)]);
      i := i + 1;
    };
    let extMint = await collectionCanisterActor.ext_mint(request);
    extMint;
  };

  // Get Fungible token details for specific collection
  public shared func getFungibleTokens(
    _collectionCanisterId : Principal
  ) : async [(TokenIndex, AccountIdentifier, Types.Metadata)] {
    let collectionCanisterActor = actor (Principal.toText(_collectionCanisterId)) : actor {
      getAllFungibleTokenData : () -> async [(TokenIndex, AccountIdentifier, Types.Metadata)];
    };
    await collectionCanisterActor.getAllFungibleTokenData();
  };

  // Get NFT details for specific collection
  public shared func getNonFungibleTokens(
    _collectionCanisterId : Principal
  ) : async [(TokenIndex, AccountIdentifier, Types.Metadata)] {
    let collectionCanisterActor = actor (Principal.toText(_collectionCanisterId)) : actor {
      getAllNonFungibleTokenData : () -> async [(TokenIndex, AccountIdentifier, Types.Metadata)];
    };
    await collectionCanisterActor.getAllNonFungibleTokenData();
  };

  //function to get details of a particular nft
  public shared func getSingleNonFungibleTokens(
    _collectionCanisterId : Principal,
    _tokenId : TokenIndex,
    user : AccountIdentifier // Add user parameter to check ownership
  ) : async [(TokenIndex, AccountIdentifier, Metadata, ?Nat64, Bool)] {

    // Define the actor interface for the other canister
    let collectionCanisterActor = actor (Principal.toText(_collectionCanisterId)) : actor {
      getSingleNonFungibleTokenData : (TokenIndex) -> async [(TokenIndex, AccountIdentifier, Metadata, ?Nat64)];
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

  // Gets all details about the tokens that were transfered into this vault
  public shared query func getDeposits() : async [Deposit] {
    return deposits;
  };

  //fetch total number of nfts accross all collections
  public shared func getTotalNFTs() : async Nat {
    var totalNFTs : Nat = 0;

    // Iterate through all entries in usersCollectionMap
    for ((_, collections) in usersCollectionMap.entries()) {
      for ((_, collectionCanisterId) in collections.vals()) {
        let collectionCanisterActor = actor (Principal.toText(collectionCanisterId)) : actor {
          getAllNonFungibleTokenData : () -> async [(TokenIndex, AccountIdentifier, Types.Metadata)];
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

  /* -------------------------------------------------------------------------- */
  /*                            User Related Methods                            */
  /* -------------------------------------------------------------------------- */

  //create user
  public shared ({ caller = user }) func create_user(accountIdentifier : Principal, uid : Text) : async Result.Result<(Nat, Time.Time), Text> {
    if (Principal.isAnonymous(user)) {
      throw Error.reject("User is not authenticated");
    };

    // Check if the user already exists in the array
    let existingUser = Array.find<User>(
      usersArray,
      func(u : User) : Bool {
        u.accountIdentifier == accountIdentifier;
      },
    );

    switch (existingUser) {
      case (?_) {
        // If the user already exists, return an error
        return #err("User already exists.");
      };
      case (null) {
        // Generate a unique ID for the new user
        let newUserId = userIdCounter + 1;
        userIdCounter := newUserId;

        // Get the current time
        let currentTime = Time.now();

        // Create the new user entry
        let newUser : User = {
          uid = uid;
          id = newUserId;
          accountIdentifier = accountIdentifier;
          createdAt = currentTime;

        };

        // Store the new user in the array
        usersArray := Array.append(usersArray, [newUser]);

        Debug.print("New user created with ID: " # Nat.toText(newUserId));

        // Return the new user's ID and time of creation
        return #ok((newUserId, currentTime));
      };
    };
  };

  //enter user details
  public shared ({ caller = user }) func updateUserDetails(accountIdentifier : Principal, name : Text, email : Text, telegram : Text, profilePic : ?Blob) : async Result.Result<Text, Text> {
    if (Principal.isAnonymous(user)) {
      throw Error.reject("User is not authenticated");
    };
    // Check if the user exists in the usersArray created by the `create_user` function
    let existingUser = Array.find<User>(
      usersArray,
      func(u : User) : Bool {
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
        let userDetails : UserDetails = {
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

  // Get user details (for admin and user side both)
  public shared query ({ caller = user }) func getUserDetails(accountIdentifier : Principal) : async Result.Result<(Principal, Text, Nat, Text, Text, Text, ?Blob), Text> {
    if (Principal.isAnonymous(user)) {
      throw Error.reject("User is not authenticated");
    };
    // Check if the user exists in the usersArray (created by the create_user function)
    let existingUser = Array.find<User>(
      usersArray,
      func(u : User) : Bool {
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

  //fetch list of all users
  public shared query ({ caller = user }) func getAllUsers(chunkSize : Nat, pageNo : Nat) : async Result.Result<{ data : [(Principal, Nat, Time.Time, Text, Text, ?Blob)]; current_page : Nat; total_pages : Nat }, Text> {
    if (Principal.isAnonymous(user)) {
      throw Error.reject("User is not authenticated");
    };
    // Map over the usersArray and extract the relevant fields
    let allUsersDetails = Array.map<User, (Principal, Nat, Time.Time, Text, Text, ?Blob)>(
      usersArray,
      func(u : User) : (Principal, Nat, Time.Time, Text, Text, ?Blob) {
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

  // Function to get the total number of users
  public shared query ({ caller = user }) func getTotalUsers() : async Nat {
    //  if (Principal.isAnonymous(user)) {
    //     throw Error.reject("User is not authenticated");
    // };
    return usersArray.size();
  };

  //usernftcollection (mycollection)
  public shared ({ caller = user }) func userNFTcollection(
    _collectionCanisterId : Principal,
    user : AccountIdentifier,
    chunkSize : Nat,
    pageNo : Nat,
  ) : async Result.Result<{ boughtNFTs : [(TokenIdentifier, TokenIndex, Metadata, Text, Principal, ?Nat64)]; unboughtNFTs : [(TokenIdentifier, TokenIndex, Metadata, Text, Principal, ?Nat64)] }, CommonError> {
    if (Principal.isAnonymous(Principal.fromText(user))) {
      throw Error.reject("User is not authenticated");
    };

    // Define the canister actor interface
    let collectionCanisterActor = actor (Principal.toText(_collectionCanisterId)) : actor {
      getAllNonFungibleTokenData : () -> async [(TokenIndex, AccountIdentifier, Metadata, ?Nat64)];
      getCollectionDetails : () -> async (Text, Text, Text);
    };

    // Fetch the collection name and details
    let (collectionName, _, _) = await collectionCanisterActor.getCollectionDetails();

    // Fetch all NFTs in the collection
    let allNFTs = await collectionCanisterActor.getAllNonFungibleTokenData();

    // Fetch the listings (unbought NFTs)
    let marketplaceListings = await listings(_collectionCanisterId);

    var boughtNFTs : [(TokenIdentifier, TokenIndex, Metadata, Text, Principal, ?Nat64)] = [];
    var unboughtNFTs : [(TokenIdentifier, TokenIndex, Metadata, Text, Principal, ?Nat64)] = [];

    // Iterate through all NFTs in the collection
    for ((tokenIndex, nftOwner, metadata, price) in allNFTs.vals()) {
      let tokenIdentifier = ExtCore.TokenIdentifier.fromPrincipal(_collectionCanisterId, tokenIndex);

      // Check if the NFT is listed in the marketplace (unbought)
      let isListed = Array.find<(TokenIndex, TokenIdentifier, Listing, Metadata)>(
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
        let nameExistsInBoughtNFTs = Array.find<((TokenIdentifier, TokenIndex, Metadata, Text, Principal, ?Nat64))>(
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

        let nameExistsInUnboughtNFTs = Array.find<((TokenIdentifier, TokenIndex, Metadata, Text, Principal, ?Nat64))>(
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
    let boughtNFTsPaginated = Pagin.paginate<(TokenIdentifier, TokenIndex, Metadata, Text, Principal, ?Nat64)>(boughtNFTs, chunkSize);
    let unboughtNFTsPaginated = Pagin.paginate<(TokenIdentifier, TokenIndex, Metadata, Text, Principal, ?Nat64)>(unboughtNFTs, chunkSize);

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

  //User favorite NFTS from userNFTCollection

  // Function to add a token to the user's favorites
  func _addToFavorites(user : AccountIdentifier, tokenIdentifier : TokenIdentifier) : () {

    // Check if the user already has favorites
    let userFavorites = switch (_favorites.get(user)) {
      case (?favorites) favorites; // If the user has favorites, retrieve them
      case (_) [] // If the user has no favorites, start with an empty array
    };

    // Append the new token to the user's favorites list
    let updatedFavorites = Array.append(userFavorites, [(tokenIdentifier)]);

    // Update the user's favorites in the favorites map
    _favorites.put(user, updatedFavorites);
  };

  // ADD TO FAVORITES //

  public shared ({ caller = user }) func addToFavorites(
    user : AccountIdentifier,
    tokenIdentifier : TokenIdentifier,
  ) : async Result.Result<Text, CommonError> {
    if (Principal.isAnonymous(Principal.fromText(user))) {
      throw Error.reject("User is not authenticated");
    };

    // Check if the user already has favorites
    let userFavorites = switch (_favorites.get(user)) {
      case (?favorites) favorites; // If the user has favorites, retrieve them
      case (_) [] // If the user has no favorites, start with an empty array
    };

    // Check if the token is already in the user's favorites
    let isAlreadyFavorite = Array.find(
      userFavorites,
      func(entry : (TokenIdentifier)) : Bool {
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

  //REMOVE FROM FAVORITES //
  // Function to remove a token from the user's favorites
  public shared ({ caller = user }) func removeFromFavorites(user : AccountIdentifier, tokenIdentifier : TokenIdentifier) : async Result.Result<Text, CommonError> {
    if (Principal.isAnonymous(Principal.fromText(user))) {
      throw Error.reject("User is not authenticated");
    };
    // Check if the user already has favorites
    let userFavorites = switch (_favorites.get(user)) {
      case (?favorites) favorites; // If the user has favorites, retrieve them
      case (_) return #err(#Other("No favorites found for this user")); // If the user has no favorites, return an error
    };

    // Check if the token is in the user's favorites
    let isFavorite = Array.find(
      userFavorites,
      func(entry : (TokenIdentifier)) : Bool {
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
      func(entry : (TokenIdentifier)) : Bool {
        entry != tokenIdentifier;
      },
    );

    // Update the user's favorites in the favorites map
    _favorites.put(user, updatedFavorites);

    // Return success message
    return #ok("Token removed from favorites successfully");
  };

  // GET USER FAVORITES //
  // Function to get the user's favorites
  public shared query ({ caller = user }) func getFavorites(user : AccountIdentifier) : async Result.Result<[(TokenIdentifier)], CommonError> {
    if (Principal.isAnonymous(Principal.fromText(user))) {
      throw Error.reject("User is not authenticated");
    };
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

  // public shared query func getFavorites(user: AccountIdentifier, chunkSize: Nat, pageNo: Nat) : async Result.Result<{data: [TokenIdentifier]; current_page: Nat; total_pages: Nat}, CommonError> {
  // // Check if the user has any favorites
  // switch (_favorites.get(user)) {
  //     case (?favorites) {
  //         // Paginate the favorites
  //         let paginatedFavorites = Pagin.paginate<TokenIdentifier>(favorites, chunkSize);

  //         // Check if the page exists
  //         if (paginatedFavorites.size() < pageNo) {
  //             return #err(#Other("Page not found"));
  //         };

  //         // Return the paginated favorites for the requested page
  //         let favoritesPage = paginatedFavorites[pageNo];

  //         return #ok({
  //             data = favoritesPage;
  //             current_page = pageNo + 1;
  //             total_pages = paginatedFavorites.size();
  //         });
  //     };
  //     case (_) {
  //         // Return an error if no favorites are found for the user
  //         return #err(#Other("No favorites found for this user"));
  //     };
  // };
  // };

  //USER ACTIVITY
  public shared func useractivity(_collectionCanisterId : Principal, buyerId : AccountIdentifier) : async [(TokenIndex, TokenIdentifier, Transaction, Text)] {
    let transactionActor = actor (Principal.toText(_collectionCanisterId)) : actor {
      ext_marketplaceTransactions : () -> async [Transaction];
    };

    // Retrieve transactions from the collection canister
    let transactions = await transactionActor.ext_marketplaceTransactions();

    var transformedTransactions : [(TokenIndex, TokenIdentifier, Transaction, Text)] = [];

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
    // return transformedTransactions;
  };

  public shared ({ caller = user }) func alluseractivity(buyerId : AccountIdentifier, chunkSize : Nat, pageNo : Nat) : async Result.Result<{ data : [(TokenIndex, TokenIdentifier, Transaction, Text)]; current_page : Nat; total_pages : Nat }, Text> {
    if (Principal.isAnonymous(user)) {
      throw Error.reject("User is not authenticated");
    };
    var allUserActivities : [(TokenIndex, TokenIdentifier, Transaction, Text)] = [];

    // Call getAllCollections to get all collections in the system
    let allCollections = await getAllCollections();

    // Iterate through each collection's details
    for ((_, collections) in allCollections.vals()) {
      for ((_, collectionCanisterId, collectionName, _, _) in collections.vals()) {
        let transactionActor = actor (Principal.toText(collectionCanisterId)) : actor {
          ext_marketplaceTransactions : () -> async [Transaction];
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
    let index_pages = Pagin.paginate<(TokenIndex, TokenIdentifier, Transaction, Text)>(allUserActivities, chunkSize);

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

  //functions to get hard copy of cards
  // gethardcopy function
  public shared ({ caller = user }) func gethardcopy(
    accountIdentifier : Principal,
    uuid : Text,
    collectionCanisterId : Principal, // Added collectionCanisterId parameter
    phone : Text,
    email : Text, // Make email a required parameter
    address : Text,
    city : Text,
    country : Text,
    pincode : Text,
    landmark : ?Text,
  ) : async Result.Result<Text, Text> {

    if (Principal.isAnonymous(user)) {
      throw Error.reject("User is not authenticated");
    };
    // Validate required fields
    if (phone == "") {
      return #err("Phone number is required.");
    };
    if (address == "") {
      return #err("Address is required.");
    };
    if (city == "") {
      return #err("City is required.");
    };
    if (country == "") {
      return #err("Country is required.");
    };
    if (pincode == "") {
      return #err("Pincode is required.");
    };

    // Find the user by the provided account identifier
    let existingUser = Array.find<User>(
      usersArray,
      func(u : User) : Bool {
        u.accountIdentifier == accountIdentifier;
      },
    );

    // If user is not found, return an error
    switch (existingUser) {
      case (null) {
        return #err("User not found. Please create a user before placing an order.");
      };
      case (?foundUser) {
        // Generate a unique order ID
        let newOrderId = orderIdCounter + 1;
        orderIdCounter := newOrderId;

        // Create a new order linked to the user's account with the provided email
        let newOrder : Order = {
          id = newOrderId;
          accountIdentifier = foundUser.accountIdentifier;
          uuid = uuid;
          collectionCanisterId = collectionCanisterId; // Set collection canister ID
          phone = phone;
          email = email; // Use the provided email directly
          address = address;
          city = city;
          country = country;
          pincode = pincode;
          landmark = landmark; // Optional field
          orderTime = Time.now();
        };

        // Add the new order to the stable orders array
        orders := Array.append(orders, [newOrder]);

        // Return success with orderId and message
        return #ok("Order placed successfully for user with UUID: " # uuid # ". Order ID: " # Nat.toText(newOrderId));
      };
    };
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

    var orderFound = false;

    // Create a new array where the order is updated if found
    let updatedOrders = Array.map<Order, Order>(
      orders,
      func(order : Order) : Order {
        if (order.id == orderId and order.accountIdentifier == accountIdentifier) {
          orderFound := true; // Mark that the order was found

          // Return the updated order with new values
          return {
            id = order.id;
            accountIdentifier = order.accountIdentifier;
            uuid = order.uuid;
            collectionCanisterId = order.collectionCanisterId;
            phone = phone; // Update phone
            email = email; // Use the provided email directly
            address = address; // Update address
            city = city; // Update city
            country = country; // Update country
            pincode = pincode; // Update pincode
            landmark = landmark; // Update landmark (optional)
            orderTime = order.orderTime; // Keep the original order time
          };
        } else {
          // Return the unchanged order
          return order; // Ensure the unchanged order is returned
        };
      },
    );

    // If the order was updated, update the orders array
    if (orderFound) {
      orders := updatedOrders; // Update the global orders array
      return #ok("Order updated successfully.");
    } else {
      return #err("Order not found for the provided account identifier and order ID.");
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
    var orderRemoved = false;

    // Create a new array with the order removed
    let updatedOrders = Array.filter<Order>(
      orders,
      func(order : Order) : Bool {
        if (order.id == orderId and order.accountIdentifier == accountIdentifier) {
          orderRemoved := true; // Mark that the order was found and removed
          return false; // Exclude this order from the new array
        };
        true; // Keep all other orders
      },
    );

    // If the order was removed, update the orders array
    if (orderRemoved) {
      orders := updatedOrders;
      return #ok("Order removed successfully.");
    } else {
      return #err("Order not found for the provided account identifier and order ID.");
    };
  };

  //get all orders of users (admin side)
  public query ({ caller = user }) func getallOrders(chunkSize : Nat, pageNo : Nat) : async Result.Result<{ data : [Order]; current_page : Nat; total_pages : Nat }, Text> {
    if (Principal.isAnonymous(user)) {
      throw Error.reject("User is not authenticated");
    };
    let allOrders = orders;
    let index_pages = Pagin.paginate<Order>(allOrders, chunkSize);

    if (index_pages.size() < pageNo) {
      return #err("Page not found");
    };

    if (index_pages.size() == 0) {
      return #err("No orders found");
    };

    let order_page = index_pages[pageNo];
    if (allOrders.size() == 0) {
      return #err("No orders found");
    } else {
      return #ok({
        data = order_page;
        current_page = pageNo + 1;
        total_pages = index_pages.size();
      });
    };
  };

  // get order details for a specific order
  public query ({ caller = user }) func orderDetails(
    accountIdentifier : Principal,
    orderId : Nat,
  ) : async Result.Result<Order, Text> {
    if (Principal.isAnonymous(user)) {
      throw Error.reject("User is not authenticated");
    };
    // Search for the order that matches the provided account identifier and order ID
    let foundOrder = Array.find<Order>(
      orders,
      func(order : Order) : Bool {
        order.id == orderId and order.accountIdentifier == accountIdentifier;
      },
    );

    // If the order is found, return the order details
    switch (foundOrder) {
      case (null) {
        return #err("Order not found for the provided account identifier and order ID.");
      };
      case (?order) {
        return #ok(order); // Return the found order details
      };
    };
  };

  // Get all orders for a specific user based on their account identifier
  public query ({ caller = user }) func getuserorders(accountIdentifier : Principal) : async Result.Result<[Order], Text> {
    if (Principal.isAnonymous(user)) {
      throw Error.reject("User is not authenticated");
    };
    let userOrders = Array.filter<Order>(
      orders,
      func(order : Order) : Bool {
        order.accountIdentifier == accountIdentifier;
      },
    );
    if (userOrders.size() == 0) {
      return #err("No orders found for the provided account identifier.");
    } else {
      return #ok(userOrders);
    };
  };

  /* -------------------------------------------------------------------------- */
  /*                                  MARKETPLACE                               */
  /* -------------------------------------------------------------------------- */

  //set price for the nfts
  public shared (msg) func listprice(_collectionCanisterId : Principal, request : ListRequest) : async Result.Result<(), CommonError> {
    if (Principal.isAnonymous(msg.caller)) {
      throw Error.reject("User is not authenticated");
    };
    let canisterId = Principal.fromActor(Main);
    // Check if the caller is one of the controllers
    let controllerResult = await isController(canisterId, msg.caller);

    if (controllerResult == false) {
      throw Error.reject("Unauthorized: Only admins can list price");
    };

    let priceactor = actor (Principal.toText(_collectionCanisterId)) : actor {
      ext_marketplaceList : (caller : Principal, request : ListRequest) -> async Result.Result<(), CommonError>;
    };
    return await priceactor.ext_marketplaceList(msg.caller, request);
  };

  //Get the NFT listings and their corresponding prices, now including TokenIndex and TokenIdentifier
  public shared func listings(_collectionCanisterId : Principal) : async [(TokenIndex, TokenIdentifier, Listing, Metadata)] {
    let priceListings = actor (Principal.toText(_collectionCanisterId)) : actor {
      ext_marketplaceListings : () -> async [(TokenIndex, Listing, Metadata)];
    };

    // Retrieve listings from the collection canister
    let listingData = await priceListings.ext_marketplaceListings();

    // Transform listing data to include TokenIdentifier alongside TokenIndex
    let transformedListingData = Array.map<(TokenIndex, Listing, Metadata), (TokenIndex, TokenIdentifier, Listing, Metadata)>(
      listingData,
      func((tokenIndex, listing, metadata) : (TokenIndex, Listing, Metadata)) : (TokenIndex, TokenIdentifier, Listing, Metadata) {
        let tokenIdentifier = ExtCore.TokenIdentifier.fromPrincipal(_collectionCanisterId, tokenIndex);
        return (tokenIndex, tokenIdentifier, listing, metadata);
      },
    );

    return transformedListingData;
  };

  public shared func plistings(
    _collectionCanisterId : Principal,
    chunkSize : Nat,
    pageNo : Nat,
  ) : async Result.Result<{ data : [(TokenIndex, TokenIdentifier, Listing, Metadata)]; current_page : Nat; total_pages : Nat }, Text> {
    let priceListings = actor (Principal.toText(_collectionCanisterId)) : actor {
      ext_marketplaceListings : () -> async [(TokenIndex, Listing, Metadata)];
    };

    // Retrieve listings from the collection canister
    let listingData = await priceListings.ext_marketplaceListings();

    // Transform listing data to include TokenIdentifier alongside TokenIndex
    let transformedListingData = Array.map<(TokenIndex, Listing, Metadata), (TokenIndex, TokenIdentifier, Listing, Metadata)>(
      listingData,
      func((tokenIndex, listing, metadata) : (TokenIndex, Listing, Metadata)) : (TokenIndex, TokenIdentifier, Listing, Metadata) {
        let tokenIdentifier = ExtCore.TokenIdentifier.fromPrincipal(_collectionCanisterId, tokenIndex);
        return (tokenIndex, tokenIdentifier, listing, metadata);
      },
    );

    // Apply pagination
    let paginatedListings = Pagin.paginate<(TokenIndex, TokenIdentifier, Listing, Metadata)>(transformedListingData, chunkSize);

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

  //purchase nft
  public shared ({ caller = user }) func purchaseNft(_collectionCanisterId : Principal, tokenid : TokenIdentifier, price : Nat64, buyer : AccountIdentifier) : async Result.Result<(AccountIdentifier, Nat64), CommonError> {
    if (Principal.isAnonymous(user)) {
      throw Error.reject("User is not authenticated");
    };
    let buynft = actor (Principal.toText(_collectionCanisterId)) : actor {
      ext_marketplacePurchase : (tokenid : TokenIdentifier, price : Nat64, buyer : AccountIdentifier) -> async Result.Result<(AccountIdentifier, Nat64), CommonError>;
    };
    return await buynft.ext_marketplacePurchase(tokenid, price, buyer);
  };

  //settle and confirm purchase
  public shared ({ caller = user }) func settlepurchase(_collectionCanisterId : Principal, paymentaddress : AccountIdentifier) : async Result.Result<(), CommonError> {
    if (Principal.isAnonymous(user)) {
      throw Error.reject("User is not authenticated");
    };
    let confirmpurchase = actor (Principal.toText(_collectionCanisterId)) : actor {
      ext_marketplaceSettle : (paymentaddress : AccountIdentifier) -> async Result.Result<(), CommonError>;
    };
    return await confirmpurchase.ext_marketplaceSettle(paymentaddress);
  };

  // Get the transaction details
  public shared func transactions(_collectionCanisterId : Principal) : async [(TokenIndex, TokenIdentifier, Transaction)] {
    let transactionActor = actor (Principal.toText(_collectionCanisterId)) : actor {
      ext_marketplaceTransactions : () -> async [Transaction];
    };

    // Retrieve transactions from the collection canister
    let transactions = await transactionActor.ext_marketplaceTransactions();

    // Transform transaction data to include TokenIdentifier alongside TokenIndex
    let transformedTransactions = Array.map<Transaction, (TokenIndex, TokenIdentifier, Transaction)>(
      transactions,
      func(transaction : Transaction) : (TokenIndex, TokenIdentifier, Transaction) {
        let tokenIdentifier = ExtCore.TokenIdentifier.fromPrincipal(_collectionCanisterId, transaction.token);
        return (transaction.token, tokenIdentifier, transaction);
      },
    );

    return transformedTransactions;
  };

  public shared (msg) func alltransactions(chunkSize : Nat, pageNo : Nat) : async Result.Result<{ data : [(TokenIndex, TokenIdentifier, Transaction)]; current_page : Nat; total_pages : Nat }, Text> {
    if (Principal.isAnonymous(msg.caller)) {
      throw Error.reject("User is not authenticated");
    };
    let canisterId = Principal.fromActor(Main);
    // Check if the caller is one of the controllers
    let controllerResult = await isController(canisterId, msg.caller);

    if (controllerResult == false) {
      throw Error.reject("Unauthorized: Only admins can list price");
    };
    var allTransactions : [(TokenIndex, TokenIdentifier, Transaction)] = [];

    // Call getAllCollections to get all collections in the system
    let allCollections = await getAllCollections();

    // Iterate through each collection's details
    for ((_, collections) in allCollections.vals()) {
      for ((_, collectionCanisterId, _, _, _) in collections.vals()) {
        let transactionActor = actor (Principal.toText(collectionCanisterId)) : actor {
          ext_marketplaceTransactions : () -> async [Transaction];
        };

        // Retrieve transactions from the collection canister
        try {
          let transactions = await transactionActor.ext_marketplaceTransactions();

          // Transform transaction data to include TokenIdentifier alongside TokenIndex
          let transformedTransactions = Array.map<Transaction, (TokenIndex, TokenIdentifier, Transaction)>(
            transactions,
            func(transaction : Transaction) : (TokenIndex, TokenIdentifier, Transaction) {
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
    let index_pages = Pagin.paginate<(TokenIndex, TokenIdentifier, Transaction)>(allTransactions, chunkSize);

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

  //get marketplace stats
  public shared func marketstats(_collectionCanisterId : Principal) : async (Nat64, Nat64, Nat64, Nat64, Nat, Nat, Nat) {
    let getstats = actor (Principal.toText(_collectionCanisterId)) : actor {
      ext_marketplaceStats : () -> async (Nat64, Nat64, Nat64, Nat64, Nat, Nat, Nat);
    };

    return await getstats.ext_marketplaceStats();
  };

  public shared (msg) func transfer_balance(
    _collectionCanisterId : Principal,
    paymentAddress : AccountIdentifier,
    amount_e8s : Nat64,
    subaccount : ?SubAccount,
  ) : async Result.Result<Nat64, CommonError> {
    if (Principal.isAnonymous(msg.caller)) {
      throw Error.reject("User is not authenticated");
    };
    // Debug print available cycles
    Debug.print("Available cycles: " # Nat.toText(Cycles.balance()));

    try {
      // Prepare the arguments for the ICP ledger transfer
      let send_args = {
        memo = 0 : Nat64; // Memo set to 0, explicitly typed as Nat64
        amount = { e8s = amount_e8s }; // Transfer amount in e8s
        fee = { e8s = 10000 : Nat64 }; // Transaction fee in e8s (0.0001 ICP)
        from_subaccount = subaccount; // Subaccount for the buyer, if any
        to = paymentAddress; // Recipient is the seller's account
        created_at_time = null : ?Time; // Optional timestamp, explicitly typed as null
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
    paymentAddress : AccountIdentifier,
    amount_e8s : Nat64,
    subaccount : ?SubAccount,
  ) : async Result.Result<Nat64, CommonError> {
    if (Principal.isAnonymous(msg.caller)) {
      throw Error.reject("User is not authenticated");
    };
    // Debug print available cycles
    Debug.print("Available cycles: " # Nat.toText(Cycles.balance()));

    try {
      // Prepare the arguments for the ICP ledger transfer
      let send_args = {
        memo = 0 : Nat64; // Memo set to 0, explicitly typed as Nat64
        amount = { e8s = amount_e8s }; // Transfer amount in e8s
        fee = { e8s = 10000 : Nat64 }; // Transaction fee in e8s (0.0001 ICP)
        from_subaccount = subaccount; // Subaccount for the buyer, if any
        to = paymentAddress; // Recipient is the seller's account
        created_at_time = null : ?Time; // Optional timestamp, explicitly typed as null
      };

      // Debugging the send arguments
      Debug.print("Sending args: " # debug_show (send_args));

      // Call the ledger's send_dfx method to transfer funds
      let block_height : Nat64 = await ExternalService_ICPLedger.send_dfx(send_args);
      Debug.print("Transfer successful, block height: " # Nat64.toText(block_height));

      // Call the marketplace settle method after successful transfer
      let marketplaceActor = actor (Principal.toText(_collectionCanisterId)) : actor {
        ext_marketplaceSettle : (paymentAddress : AccountIdentifier) -> async Result.Result<(), CommonError>;
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
