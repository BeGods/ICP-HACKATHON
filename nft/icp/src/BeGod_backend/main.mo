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
import AID "../EXT-V2/motoko/util/AccountIdentifier";
import ExtCore "../EXT-V2/motoko/ext/Core";
import Types "../EXT-V2/Types";
import UsersTypes "./Users/Types";
import V2 "../EXT-V2/ext_v2/v2";


actor Main {

    type AccountIdentifier = ExtCore.AccountIdentifier;
    type TokenIndex = ExtCore.TokenIndex;
    type TokenIdentifier = ExtCore.TokenIdentifier;
    //
    type NFTInfo = (TokenIndex, AccountIdentifier, Types.Metadata);
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

   type Metadata = {
    #fungible : {
      name : Text;
      symbol : Text;
      decimals : Nat8;
      metadata: ?MetadataContainer;
    };
    #nonfungible : {
      name : Text;
      description : Text;
      asset : Text;
      thumbnail : Text;
      metadata: ?MetadataContainer;
    };
   };

    //Exttypes
    type Time = Time.Time;
    
    type User = ExtCore.User;
    type CommonError = ExtCore.CommonError;

    // Maps user and the collection canisterIds they create
    private var usersCollectionMap = TrieMap.TrieMap<Principal, [(Time.Time, Principal)]>(Principal.equal, Principal.hash);
    //  Maps related to Campaigns

    // Stores details about the tokens coming into this vault
    private stable var deposits : [Deposit] = [];

    private var users = TrieMap.TrieMap<Principal, UsersTypes.User>(Principal.equal, Principal.hash);

    private var favoritesMap = TrieMap.TrieMap<Principal, [NFTInfo]>(Principal.equal, Principal.hash);

    

    /* -------------------------------------------------------------------------- */
    /*                         collection related methods                         */
    /* -------------------------------------------------------------------------- */

    //add collection manually to collection map
    public shared ({ caller = user }) func add_collection_to_map(collection_id : Principal) : async Text {
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

    //remove any collection from collection map
    public shared ({ caller = user }) func remove_collection_to_map(collection_id : Principal) : async Text {
        let userCollections = usersCollectionMap.get(user);
        switch (userCollections) {
            case null {
                return "There are no collections added yet!";
            };
            case (?collections) {
                // Convert the array to a list for easier manipulation
                let collectionsList = List.fromArray(collections);
                // Filter out the collection to be removed
                let newList = List.filter<(Time.Time, Principal)>(collectionsList, func((_, collId)) { collId != collection_id });
                // Convert the updated list back to an array and update the map
                usersCollectionMap.put(user, List.toArray(newList));
                return "Collection removed";
            };
        };
    };

    // Collection creation
    public shared ({ caller = user }) func createExtCollection(_title : Text, _symbol : Text, _metadata : Text) : async (Principal, Principal) {
        Cycles.add<system>(500_500_000_000);
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

    // Getting all the collections ever created(only gets the canisterIds)
    public shared query func getAllCollections() : async [(Principal, [(Time.Time, Principal)])] {
        var result : [(Principal, [(Time.Time, Principal)])] = [];
        for ((key, value) in usersCollectionMap.entries()) {
            result := Array.append([(key, value)], result);
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

    //getALLCollectionNFTs

   /* public shared func getAllCollectionNFTs(
        _collectionCanisterId: Principal
    ) : async [(TokenIndex, AccountIdentifier, Types.Metadata)] {
        let collectionCanisterActor = actor (Principal.toText(_collectionCanisterId)) : actor {
            getAllNonFungibleTokenData : () -> async [(TokenIndex, AccountIdentifier, Types.Metadata)];
        };

        // Attempt to retrieve all NFTs from the specified collection canister
        try {
            let nfts = await collectionCanisterActor.getAllNonFungibleTokenData();
            return nfts;
        } catch (e) {
            // Handle potential errors (e.g., canister not responding, method not implemented)
            throw (e);
            return [];
        }
    };*/

    //Explore Collections or Get all Collection NFTS
    public shared func getAllNFTsAcrossAllCollections() : async [(TokenIndex, AccountIdentifier, Types.Metadata)] {
        var allNFTs : [(TokenIndex, AccountIdentifier, Types.Metadata)] = [];

        // Iterate through all entries in usersCollectionMap
        for ((_, collections) in usersCollectionMap.entries()) {
            for ((_, collectionCanisterId) in collections.vals()) {
                let collectionCanisterActor = actor (Principal.toText(collectionCanisterId)) : actor {
                    getAllNonFungibleTokenData : () -> async [(TokenIndex, AccountIdentifier, Types.Metadata)];
                };

                // Attempt to retrieve all NFTs from the specified collection canister
                try {
                    let nfts = await collectionCanisterActor.getAllNonFungibleTokenData();
                    allNFTs := Array.append(allNFTs, nfts); // Add the NFTs to the aggregate list
                } catch (e) {
                    // Handle potential errors, but continue to the next collection
                    Debug.print(Text.concat("Error fetching NFTs from canister: ", Principal.toText(collectionCanisterId)));
                }
            };
        };

        return allNFTs; // Return the aggregated list of NFTs
    };

    //GET SINGLE COLLECTION DETAILS
    // Function to get all NFT details within a specific collection and the count of total NFTs
    public shared func getSingleCollectionDetails(
        collectionCanisterId: Principal
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
        }
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

    ) : async [TokenIndex] {

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
        extMint;
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

    // Get Single NFT details for specific collection
    public shared ({ caller = user }) func getSingleNonFungibleTokens(
        _collectionCanisterId : Principal,
        _tokenId : TokenIndex,
    ) : async [(TokenIndex, AccountIdentifier, Metadata)] {
        let collectionCanisterActor = actor (Principal.toText(_collectionCanisterId)) : actor {
            getSingleNonFungibleTokenData : (_tokenId : TokenIndex) -> async [(TokenIndex, AccountIdentifier, Metadata)];
        };
        return await collectionCanisterActor.getSingleNonFungibleTokenData(_tokenId);
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
                }
            };
        };

        return totalNFTs; // Return the total number of NFTs across all collections
    };




    /* -------------------------------------------------------------------------- */
    /*                            User Related Methods                            */
    /* -------------------------------------------------------------------------- */

    //fetching user details by id
    public shared query func getUserdetailsbyid(id : Principal) : async Result.Result<UsersTypes.User, UsersTypes.GetUserError> {
        let user = users.get(id);
        return Result.fromOption(user, #UserNotFound);
    };

    // Function to return the total number of users
    public shared query func getTotalUsers() : async Nat {
    return users.size();
    };



    //CREATE USER AND FILL RELATED DETAILS

    //create user 
    public shared func createUser(id: Principal, user: UsersTypes.User) : async Result.Result<(), UsersTypes.CreateUserError> {
    switch (users.get(id)) {
        case (null) {
            if (user.email == "" or user.firstName == "" or user.lastName == "") {
                return #err(#EmptyEmail); // or appropriate error based on the missing field
            };
            users.put(id, user);
            return #ok(());
        };
        case (?_) {
            return #err(#UserAlreadyExists);
        };
    };
    };
/*
    //mycollection
    public shared ({ caller = user }) func myCollection() : async [NFTInfo] {
        var userNFTs : [NFTInfo] = [];

        // Iterate through all entries in usersCollectionMap
        for ((_, collections) in usersCollectionMap.entries()) {
            for ((_, collectionCanisterId) in collections.vals()) {
                let collectionCanisterActor = actor (Principal.toText(collectionCanisterId)) : actor {
                    getAllNonFungibleTokenData : () -> async [(TokenIndex, AccountIdentifier, Types.Metadata)];
                };

                // Attempt to retrieve all NFTs from the specified collection canister
                try {
                    let nfts = await collectionCanisterActor.getAllNonFungibleTokenData();
                    
                    // Filter NFTs that are owned by the user
                    for (nft in nfts.vals()) {
                        if (nft.1 == AID.fromPrincipal(user, null)) {
                            userNFTs := Array.append(userNFTs, [nft]);
                        }
                    }
                } catch (e) {
                    // Handle potential errors, but continue to the next collection
                    Debug.print(Text.concat("Error fetching NFTs from canister: ", Principal.toText(collectionCanisterId)));
                }
            };
        };

        return userNFTs; // Return the list of NFTs owned by the user
    };


    //Favorite Nfts of User
     public shared ({ caller = user }) func addToFavorites(principal: Principal, tokenId: TokenIndex) : async Text {
    // Get the principal's collection
    let userNFTs = await myCollection();

    // Find the NFT in the principal's collection
    let nft = List.find<NFTInfo>(List.fromArray(userNFTs), func(nftInfo) { nftInfo.0 == tokenId });

    switch (nft) {
        case null {
            return "NFT not found in your collection.";
        };
        case (?nftInfo) {
            // Add the NFT to the principal's favorites
            let userFavorites = favoritesMap.get(principal);
            switch (userFavorites) {
                case null {
                    favoritesMap.put(principal, [nftInfo]);
                };
                case (?existingFavorites) {
                    // Check if the NFT is already in favorites
                    if (List.find<NFTInfo>(List.fromArray(existingFavorites), func(favNFT) { favNFT.0 == tokenId }) == null) {
                        favoritesMap.put(principal, Array.append(existingFavorites, [nftInfo]));
                    } else {
                        return "NFT is already in your favorites.";
                    }
                };
            };
            return "NFT added to your favorites.";
        };
    };
    };


    //get favorites 
    public shared ({ caller = user }) func getFavorites(principal: Principal) : async [(Principal, TokenIndex)] {
    // Fetch the principal's favorites from the favoritesMap
    switch (favoritesMap.get(principal)) {
        case null {
            // If the principal has no favorites, return an empty array
            return [];
        };
        case (?favorites) {
            // Return the principal's list of favorite NFTs with the associated principal
            return Array.map(favorites, func(myCollection) { (principal, nftInfo.0) });
        };
    };
    };*/

    /* -------------------------------------------------------------------------- */
    /*                                  MARKETPLACE                               */
    /* -------------------------------------------------------------------------- */



    // List the price of the nfts 
   /* public shared(msg) func listprice(_collectionCanisterId : Principal , request : ListRequest): async Result.Result<(), CommonError>{
    let priceactor =  actor (Principal.toText(_collectionCanisterId)): actor {
        ext_marketplaceList : (request : ListRequest) -> async Result.Result<(), CommonError>;
    };
    return await priceactor.ext_marketplaceList(request);
    };*/

    public shared(msg) func listprice(_collectionCanisterId : Principal, request : ListRequest) : async Result.Result<(), CommonError> {
    let priceactor = actor (Principal.toText(_collectionCanisterId)): actor {
        ext_marketplaceList : (caller: Principal, request: ListRequest) -> async Result.Result<(), CommonError>;
    };
    return await priceactor.ext_marketplaceList(msg.caller, request);
    };  


    //get the nfts and their corresponding prices 
    public shared func listings(_collectionCanisterId : Principal): async [(TokenIndex, Listing, Metadata)] {
    let pricelistings = actor (Principal.toText(_collectionCanisterId)) : actor {
        ext_marketplaceListings: () -> async [(TokenIndex, Listing, Metadata)]
    };
    return await pricelistings.ext_marketplaceListings();
    };

    //purchase nft
    public shared func purchaseNft(_collectionCanisterId: Principal, tokenid: TokenIdentifier, price: Nat64, buyer: AccountIdentifier) : async Result.Result<(AccountIdentifier, Nat64), CommonError> {
    let buynft = actor (Principal.toText(_collectionCanisterId)) : actor {
        ext_marketplacePurchase: (tokenid : TokenIdentifier, price : Nat64, buyer : AccountIdentifier) -> async Result.Result<(AccountIdentifier, Nat64), CommonError>;
    };
    return await buynft.ext_marketplacePurchase(tokenid, price, buyer);
    };


};
