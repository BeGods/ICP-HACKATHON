import ExtTokenClass "../../EXT-V2/ext_v2/v2";
import ExtCore "../../EXT-V2/motoko/ext/Core";
import Queue "../../EXT-V2/motoko/util/Queue";
import Types "../../EXT-V2/Types";
import V2 "../../EXT-V2/ext_v2/v2";
import _owners "../../EXT-V2/ext_v2/v2";
import ExtCommon "../../EXT-V2/motoko/ext/Common";
import Principal "mo:base/Principal";
import Time "mo:base/Time";
import Debug "mo:base/Debug";
import Error "mo:base/Error";
import TrieMap "mo:base/TrieMap";
import Nat32 "mo:base/Nat32";
import Int "mo:base/Int";
import Array "mo:base/Array";
import Option "mo:base/Option";
import Cycles "mo:base/ExperimentalCycles";
import Result "mo:base/Result";
import MainTypes "../types/main.types";
import MainUtils "../utils/main.utils";

module {

  // register quest completion record
  public func registerQuestCompletion(
    questCompletions : TrieMap.TrieMap<Principal, MainTypes.CompletionRecord>,
    principal_id : Principal,
    mythologyText : Text,
  ) : async Bool {
    switch (questCompletions.get(principal_id)) {
      case (?_) {
        Debug.print("FALSE - User already registered");
        return false;
      };
      case null {
        let completionRecord : MainTypes.CompletionRecord = {
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

  // mint packet
  public func mintPacketToUser(
    recipient : Principal,
    mythologyText : Text,
    questCompletions : TrieMap.TrieMap<Principal, MainTypes.CompletionRecord>,
    nextPacketId : Nat,
    selfPrincipal : Principal,
  ) : async Result.Result<(Nat, Nat32), Text> {
    try {

      var packetId : Nat = nextPacketId;
      packetId += 1;

      let metadata = MainUtils.generateQuestPacketMetadata(recipient, Time.now(), packetId, mythologyText);

      // --- MINTING ---
      Cycles.add<system>(900_000_000_000);

      let extToken = await ExtTokenClass.EXTNFT(selfPrincipal);
      let extPacketCanisterId = await extToken.getCanisterId();

      let extPacketCanister = actor (Principal.toText(extPacketCanisterId)) : MainTypes.ExtPacketCanister;

      Debug.print("New EXT Packet Canister created: " # Principal.toText(extPacketCanisterId));

      await extPacketCanister.setMinter(selfPrincipal);

      await extPacketCanister.ext_setCollectionMetadata(
        "Quest Completion Collection",
        "QUEST",
        "A collection of Packets awarded for completing quests",
      );

      let extMetadata = MainUtils.convertToExtMetadata(metadata);

      let metadataForMint : MainTypes.Metadata = switch (extMetadata) {
        case (#nonfungible(nft)) {
          let description = Option.get(nft.description, "");
          let thumbnail = Option.get(nft.thumbnail, Option.get(nft.image, ""));

          let baseMetadataValues : [MainTypes.MetadataValue] = [
            ("name", #text(nft.name)),
            ("description", #text(description)),
            ("image", #text(Option.get(nft.image, ""))),
            ("thumbnail", #text(thumbnail)),
            ("asset", #text(nft.asset)),
          ];

          let attributeValues : [MainTypes.MetadataValue] = Option.get<[MainTypes.MetadataValue]>(
            Option.map<[(Text, Text)], [MainTypes.MetadataValue]>(
              nft.attributes,
              func(attrs : [(Text, Text)]) : [MainTypes.MetadataValue] {
                Array.map<(Text, Text), MainTypes.MetadataValue>(
                  attrs,
                  func((key, value) : (Text, Text)) : MainTypes.MetadataValue = (key, #text(value)),
                );
              },
            ),
            [],
          );

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

      let recipientAccountId : MainTypes.AccountIdentifier = Principal.toText(recipient);

      let packetIndices = await extPacketCanister.ext_mint([(recipientAccountId, metadataForMint)]);

      switch (packetIndices.size()) {
        case (0) { #err("No tokens were minted") };
        case (_) {
          let packetIndex = packetIndices[0];

          switch (questCompletions.get(recipient)) {
            case (?rec) {
              let updatedRecord : MainTypes.CompletionRecord = {
                completedAt = rec.completedAt;
                mythology = rec.mythology;
                minted = true;
              };
              questCompletions.put(recipient, updatedRecord);
            };
            case null {
              Debug.trap("Unexpected: Quest record missing after pre-check");
            };
          };

          Debug.print("EXT Packet minted successfully with TokenIndex: " # Nat32.toText(packetIndex));
          #ok((packetId, packetIndex));
        };
      };
    } catch (error) {
      Debug.print("EXT Packet minting failed: " # Error.message(error));
      #err("EXT Packet minting failed: " # Error.message(error));
    };
  };

  // public shared (msg) func burnBoosterNFT(tokenId : Nat) : async Result.Result<(), Text> {
  //   // Check if caller owns the NFT
  //   if (nftOwners.contains(tokenId) and nftOwners[tokenId] == msg.caller) {
  //     // Fetch/Log NFT metadata before burning
  //     let metadata = nftMetadata[tokenId];
  //     Debug.print(debug_show (metadata)); // log metadata for debugging

  //     return #ok();
  //   } else {
  //     return #err("Not authorized or NFT does not exist");
  //   };
  // }

};
