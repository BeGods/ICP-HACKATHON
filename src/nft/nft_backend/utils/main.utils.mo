import Principal "mo:base/Principal";
import Array "mo:base/Array";
import MainTypes "../types/main.types";
import Time "mo:base/Time";
import Int "mo:base/Int";
import Nat "mo:base/Nat";
import Text "mo:base/Text";
import ExtCore "../../EXT-V2/motoko/ext/Core";

module {
  public func contains(arr : [Principal], value : Principal) : Bool {
    var found = false;
    for (item in arr.vals()) {
      if (item == value) {
        found := true;
      };
    };
    return found;
  };

  public func convertToExtMetadata(packetMeta : MainTypes.PacketMetadata) : MainTypes.PacketEXTMetadata {
    let extAttributes : [(Text, Text)] = Array.map<{ trait_type : Text; value : Text }, (Text, Text)>(
      packetMeta.attributes,
      func(attr) = (attr.trait_type, attr.value),
    );

    #nonfungible({
      name = packetMeta.name;
      description = ?packetMeta.description;
      image = ?packetMeta.image;
      thumbnail = ?packetMeta.image;
      asset = packetMeta.name;
      attributes = ?extAttributes;
    });
  };

  public func generateQuestPacketMetadata(
    recipient : Principal,
    completedAt : Time.Time,
    tokenId : Nat,
    questType : Text,
  ) : MainTypes.PacketMetadata {
    let completionDate = Int.toText(completedAt);

    {
      name = questType # " Quest Completion Packet #" # Nat.toText(tokenId);
      description = "Awarded for completing the Main Quest. This Packet certifies that " #
      Principal.toText(recipient) # " successfully completed all quest requirements.";
      image = "https://media.publit.io/file/BeGods/nft/360px-fof.packet." # Text.toLowercase(questType) # ".png";
      attributes = [
        { trait_type = "Quest Type"; value = questType },
        { trait_type = "Completion Date"; value = completionDate },
        { trait_type = "Token ID"; value = Nat.toText(tokenId) },
        { trait_type = "Rarity"; value = "Common" },
        { trait_type = "Network"; value = "Internet Computer" },
      ];
    };
  };

  // Token will be transfered to this Vault and gives you req details to construct a link out of it, which you can share
  public func getNftTokenId(
    _collectionCanisterId : Principal,
    _tokenId : MainTypes.TokenIndex,

  ) : async MainTypes.TokenIdentifier {
    let tokenIdentifier = ExtCore.TokenIdentifier.fromPrincipal(_collectionCanisterId, _tokenId);
    return tokenIdentifier;
  };

};
