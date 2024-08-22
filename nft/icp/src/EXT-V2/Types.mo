// EXT Types
import EXTAsset "./ext_v2/extAsset";
import Time "mo:base/Time";
import ExtCore "motoko/ext/Core";
import ExtCommon "motoko/ext/Common";
import ExtAllowance "motoko/ext/Allowance";

module {
    public type Order = { #less; #equal; #greater };
    public type Time = Time.Time;
    public type AccountIdentifier = ExtCore.AccountIdentifier;
    public type SubAccount = ExtCore.SubAccount;
    public type EXTAssetService = EXTAsset.EXTAsset;
    public type User = ExtCore.User;
    public type Balance = ExtCore.Balance;
    public type TokenIdentifier = ExtCore.TokenIdentifier;
    public type TokenIndex = ExtCore.TokenIndex;
    public type Extension = ExtCore.Extension;
    public type CommonError = ExtCore.CommonError;
    public type BalanceRequest = ExtCore.BalanceRequest;
    public type BalanceResponse = ExtCore.BalanceResponse;
    public type TransferRequest = ExtCore.TransferRequest;
    public type TransferResponse = ExtCore.TransferResponse;
    public type AllowanceRequest = ExtAllowance.AllowanceRequest;
    public type ApproveRequest = ExtAllowance.ApproveRequest;
    public type MetadataLegacy = ExtCommon.Metadata;
    public type NotifyService = ExtCore.NotifyService;
    public type MintingRequest = {
        to : AccountIdentifier;
        asset : Nat32;
    };

    public type Result<S, E> = {
        #Ok : S;
        #Err : E;
    };

    public type MetadataPurpose = {
        #Preview;
        #Rendered;
    };

    public type MetadataVal = {
        #TextContent : Text;
        #BlobContent : Blob;
        #NatContent : Nat;
        #Nat8Content : Nat8;
        #Nat16Content : Nat16;
        #Nat32Content : Nat32;
        #Nat64Content : Nat64;
    };

    public type MetadataKeyVal = {
        key : Text;
        val : MetadataVal;
    };

    public type MetadataPart = {
        description : Text;
        purpose : MetadataPurpose;
        key_val_data : [MetadataKeyVal];
        data : Blob;
    };

    public type ApiError = {
        #Unauthorized;
        #InvalidTokenId;
        #ZeroAddress;
        #Other;
    };

    public type MetadataDesc = [MetadataPart];

    public type MetadataResult = Result<MetadataDesc, ApiError>;
    public type MetadataResultArray = Result<[MetadataDesc], ApiError>;

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

    //Marketplace
    public type Transaction = {
        token : TokenIndex;
        seller : AccountIdentifier;
        price : Nat64;
        buyer : AccountIdentifier;
        time : Time;
    };
    public type Listing = {
        seller : Principal;
        price : Nat64;
        locked : ?Time;
    };
    public type ListRequest = {
        token : TokenIdentifier;
        from_subaccount : ?SubAccount;
        price : ?Nat64;
    };

    //LEDGER
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

    //Cap
    public type CapDetailValue = {
        #I64 : Int64;
        #U64 : Nat64;
        #Vec : [CapDetailValue];
        #Slice : [Nat8];
        #Text : Text;
        #True;
        #False;
        #Float : Float;
        #Principal : Principal;
    };
    public type CapEvent = {
        time : Nat64;
        operation : Text;
        details : [(Text, CapDetailValue)];
        caller : Principal;
    };
    public type CapIndefiniteEvent = {
        operation : Text;
        details : [(Text, CapDetailValue)];
        caller : Principal;
    };

    //Sale
    public type PaymentType = {
        #sale : Nat64;
        #nft : TokenIndex;
        #nfts : [TokenIndex];
    };
    public type Payment = {
        purchase : PaymentType;
        amount : Nat64;
        subaccount : SubAccount;
        payer : AccountIdentifier;
        expires : Time;
    };
    public type SaleTransaction = {
        tokens : [TokenIndex];
        seller : Principal;
        price : Nat64;
        buyer : AccountIdentifier;
        time : Time;
    };
    public type SaleDetailGroup = {
        id : Nat;
        name : Text;
        start : Time;
        end : Time;
        available : Bool;
        pricing : [(Nat64, Nat64)];
    };
    public type SaleDetails = {
        start : Time;
        end : Time;
        groups : [SaleDetailGroup];
        quantity : Nat;
        remaining : Nat;
    };
    public type SaleSettings = {
        price : Nat64;
        salePrice : Nat64;
        sold : Nat;
        remaining : Nat;
        startTime : Time;
        whitelistTime : Time;
        whitelist : Bool;
        totalToSell : Nat;
        bulkPricing : [(Nat64, Nat64)];
    };
    public type SalePricingGroup = {
        name : Text;
        limit : (Nat64, Nat64); //user, group
        start : Time;
        end : Time;
        pricing : [(Nat64, Nat64)]; //qty,price
        participants : [AccountIdentifier];
    };
    public type SaleRemaining = { #burn; #send : AccountIdentifier; #retain };
    public type Sale = {
        start : Time; //Start of first group
        end : Time; //End of first group
        groups : [SalePricingGroup];
        quantity : Nat; //Tokens for sale, set by 0000 address
        remaining : SaleRemaining;
    };

    //EXTv2 Asset Handling
    public type AssetHandle = Text;
    public type AssetId = Nat32;
    public type ChunkId = Nat32;
    public type AssetType = {
        #canister : {
            id : AssetId;
            canister : Text;
        };
        #direct : [ChunkId];
        #other : Text;
    };
    public type Asset = {
        ctype : Text;
        filename : Text;
        atype : AssetType;
    };

    //HTTP
    public type HeaderField = (Text, Text);
    public type HttpResponse = {
        status_code : Nat16;
        headers : [HeaderField];
        body : Blob;
        streaming_strategy : ?HttpStreamingStrategy;
        upgrade : Bool;
    };
    public type HttpRequest = {
        method : Text;
        url : Text;
        headers : [HeaderField];
        body : Blob;
    };
    public type HttpStreamingCallbackToken = {
        content_encoding : Text;
        index : Nat;
        key : Text;
        sha256 : ?Blob;
    };
    public type HttpStreamingStrategy = {
        #Callback : {
            callback : query (HttpStreamingCallbackToken) -> async (HttpStreamingCallbackResponse);
            token : HttpStreamingCallbackToken;
        };
    };
    public type HttpStreamingCallbackResponse = {
        body : Blob;
        token : ?HttpStreamingCallbackToken;
    };
};
