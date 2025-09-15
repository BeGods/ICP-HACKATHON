import ExtCore "../../EXT-V2/motoko/ext/Core";
import Time "mo:base/Time";
import ExtCommon "../../EXT-V2/motoko/ext/Common";
import Result "mo:base/Result";

module {

  public type AccountIdentifier = ExtCore.AccountIdentifier;
  public type TokenIndex = ExtCore.TokenIndex;
  public type TokenIdentifier = ExtCore.TokenIdentifier;
  public type NFTInfo = (TokenIndex, AccountIdentifier, Metadata);
  public type Time = Time.Time;
  public type CommonError = ExtCore.CommonError;
  public type MetadataLegacy = ExtCommon.Metadata;
  public type MetadataValue = (
    Text,
    {
      #text : Text;
      #blob : Blob;
      #nat : Nat;
      #nat8 : Nat8;
    },
  );
  public type MetadataContainer = {
    #data : [MetadataValue];
    #blob : Blob;
    #json : Text;
  };
  public type TransferRequest = ExtCore.TransferRequest;
  public type TransferResponse = ExtCore.TransferResponse;
  public type Deposit = {
    tokenId : TokenIndex;
    sender : Principal;
    collectionCanister : Principal;
    timestamp : Time.Time;
    pubKey : Principal;
  };
  public type SubAccount = ExtCore.SubAccount;
  public type ListRequest = {
    token : TokenIdentifier;
    from_subaccount : ?SubAccount;
    price : ?Nat64;
  };
  public type Listing = {
    seller : Principal;
    price : Nat64;
    locked : ?Time;
  };
  public type Transaction = {
    token : TokenIndex;
    seller : AccountIdentifier;
    price : Nat64;
    buyer : AccountIdentifier;
    time : Time;
  };
  public type Metadata = {
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
  public type User = {
    uid : Text;
    id : Nat;
    accountIdentifier : Principal;
    createdAt : Time.Time;
  };
  public type UserDetails = {
    name : Text;
    email : Text;
    telegram : Text;
    profilepic : ?Blob;
  };
  public type AccountBalanceArgs = { account : AccountIdentifier };
  public type ICPTs = { e8s : Nat64 };
  public type SendArgs = {
    memo : Nat64;
    amount : ICPTs;
    fee : ICPTs;
    from_subaccount : ?SubAccount;
    to : AccountIdentifier;
    created_at_time : ?Time;
  };

  public type Order = {
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

  public type Result = { #ok : Bool } or { #err : Text };

  public type CompletionRecord = {
    completedAt : Time.Time;
    mythology : Text;
    minted : Bool;
  };

  public type PacketMetadata = {
    name : Text;
    description : Text;
    image : Text;
    attributes : [{ trait_type : Text; value : Text }];
  };

  public type PacketUser = {
    #address : Text;
    #principal : Principal;
  };

  public type PacketEXTMetadata = {
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

  public type UserPacket = {
    tokenId : TokenIndex;
    metadata : PacketMetadata;
  };

  public type ExtPacketCanister = actor {
    ext_mint : (request : [(AccountIdentifier, Metadata)]) -> async [TokenIndex];
    setMinter : (minter : Principal) -> async ();
    ext_setCollectionMetadata : (name : Text, symbol : Text, metadata : Text) -> async ();
  };

  public type PacketCanister = actor {
    mint : ({
      to : Principal;
      token_id : Nat;
      metadata : PacketMetadata;
    }) -> async Result.Result<Nat, Text>;
  };

  public type BoosterInfo = {
    NftTokeId : TokenIdentifier;
    boosterType : Text;
    timestamp : Time.Time;
    claimed : Bool;
  };

};
