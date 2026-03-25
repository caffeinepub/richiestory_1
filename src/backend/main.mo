import Prim "mo:prim";
import Text "mo:core/Text";
import Time "mo:core/Time";
import Principal "mo:core/Principal";
import Int "mo:core/Int";
import Float "mo:core/Float";
import Set "mo:core/Set";
import List "mo:core/List";
import Map "mo:core/Map";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";
import MixinStorage "blob-storage/Mixin";
import Storage "blob-storage/Storage";
import Runtime "mo:core/Runtime";
import Iter "mo:core/Iter";

actor {
  public type RabbitId = Text;
  public type CollectorId = Text;
  public type Timestamp = Time.Time;
  public type Coordinates = { x : Float; y : Float };
  public type Price = Nat;

  public type Rarity = {
    #common;
    #rare;
    #unique;
  };

  public type RabbitStatus = {
    #in_collection;
    #for_sale;
    #auction;
    #pending_activation;
  };

  public type Rabbit = {
    id : RabbitId;
    name : Text;
    birthDate : Timestamp;
    materials : Text;
    rarity : Rarity;
    status : RabbitStatus;
    owner : ?CollectorId;
    likes : Nat;
    photo : ?Storage.ExternalBlob;
    coordinates : Coordinates;
    price : ?Price;
  };

  public type CollectorProfile = {
    id : Text;
    nickname : Text;
    city : Text;
    rabbitsCollected : Nat;
    photo : ?Storage.ExternalBlob;
  };

  public type Auction = {
    rabbitId : RabbitId;
    startPrice : Nat;
    startTime : Timestamp;
    endTime : Timestamp;
    highestBid : ?Nat;
    highestBidder : ?CollectorId;
  };

  public type Message = {
    sender : CollectorId;
    recipient : CollectorId;
    content : Text;
    timestamp : Timestamp;
    status : Text;
  };

  public type UserProfile = {
    name : Text;
  };

  let rabbits = Map.empty<RabbitId, Rabbit>();
  let collectors = Map.empty<CollectorId, CollectorProfile>();
  let auctions = Map.empty<RabbitId, Auction>();
  let messages = Map.empty<CollectorId, List.List<Message>>();
  let likes = Map.empty<Text, Nat>();
  let funds = Map.empty<CollectorId, Nat>();
  let userProfiles = Map.empty<Principal, UserProfile>();

  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);
  include MixinStorage();

  // Profile Management
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  // Rabbit Management
  public shared ({ caller }) func createRabbit(
    id : RabbitId,
    name : Text,
    birthDate : Timestamp,
    materials : Text,
    rarity : Rarity,
    coordinates : Coordinates,
    photo : ?Storage.ExternalBlob,
  ) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #admin)) {
      Runtime.trap("Unauthorized: Only admins can create rabbits");
    };

    let rabbit : Rabbit = {
      id;
      name;
      birthDate;
      materials;
      rarity;
      status = #pending_activation;
      owner = null;
      likes = 0;
      photo;
      coordinates;
      price = null;
    };

    rabbits.add(id, rabbit);
  };

  public shared ({ caller }) func activateRabbit(rabbitId : RabbitId, collectorId : CollectorId) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can activate rabbits");
    };

    switch (rabbits.get(rabbitId)) {
      case (null) { Runtime.trap("Rabbit not found") };
      case (?rabbit) {
        if (rabbit.status != #pending_activation) {
          Runtime.trap("Rabbit is not in pending activation state");
        };

        let updatedRabbit = {
          id = rabbit.id;
          name = rabbit.name;
          birthDate = rabbit.birthDate;
          materials = rabbit.materials;
          rarity = rabbit.rarity;
          status = #in_collection;
          owner = ?collectorId;
          likes = rabbit.likes;
          photo = rabbit.photo;
          coordinates = rabbit.coordinates;
          price = rabbit.price;
        };
        rabbits.add(rabbitId, updatedRabbit);
      };
    };
  };

  public shared ({ caller }) func updateRabbitForSale(rabbitId : RabbitId, price : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can update rabbit sale information");
    };

    switch (rabbits.get(rabbitId)) {
      case (null) { Runtime.trap("Rabbit not found") };
      case (?rabbit) {
        if (rabbit.status != #in_collection) {
          Runtime.trap("Rabbit is not in collection state");
        };

        let updatedRabbit = {
          id = rabbit.id;
          name = rabbit.name;
          birthDate = rabbit.birthDate;
          materials = rabbit.materials;
          rarity = rabbit.rarity;
          status = #for_sale;
          owner = rabbit.owner;
          likes = rabbit.likes;
          photo = rabbit.photo;
          coordinates = rabbit.coordinates;
          price = ?price;
        };
        rabbits.add(rabbitId, updatedRabbit);
      };
    };
  };

  public shared ({ caller }) func updateRabbitInAuction(rabbitId : RabbitId, price : Nat, durationInSeconds : Int) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can update rabbit auction information");
    };

    switch (rabbits.get(rabbitId)) {
      case (null) { Runtime.trap("Rabbit not found") };
      case (?rabbit) {
        if (rabbit.status != #in_collection) {
          Runtime.trap("Rabbit is not in collection state");
        };

        let updatedRabbit = {
          id = rabbit.id;
          name = rabbit.name;
          birthDate = rabbit.birthDate;
          materials = rabbit.materials;
          rarity = rabbit.rarity;
          status = #auction;
          owner = rabbit.owner;
          likes = rabbit.likes;
          photo = rabbit.photo;
          coordinates = rabbit.coordinates;
          price = ?price;
        };
        rabbits.add(rabbitId, updatedRabbit);

        let auction : Auction = {
          rabbitId;
          startPrice = price;
          startTime = Time.now();
          endTime = Time.now() + Int.abs(durationInSeconds) * 1_000_000_000;
          highestBid = null;
          highestBidder = null;
        };
        auctions.add(rabbitId, auction);
      };
    };
  };

  public shared ({ caller }) func updateRabbitName(rabbitId : RabbitId, newName : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can update rabbit name");
    };

    switch (rabbits.get(rabbitId)) {
      case (null) { Runtime.trap("Rabbit not found") };
      case (?rabbit) {
        let updatedRabbit = {
          id = rabbit.id;
          name = newName;
          birthDate = rabbit.birthDate;
          materials = rabbit.materials;
          rarity = rabbit.rarity;
          status = rabbit.status;
          owner = rabbit.owner;
          likes = rabbit.likes;
          photo = rabbit.photo;
          coordinates = rabbit.coordinates;
          price = rabbit.price;
        };
        rabbits.add(rabbitId, updatedRabbit);
      };
    };
  };

  public shared ({ caller }) func updateRabbitMaterials(rabbitId : RabbitId, newMaterials : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can update rabbit materials");
    };

    switch (rabbits.get(rabbitId)) {
      case (null) { Runtime.trap("Rabbit not found") };
      case (?rabbit) {
        let updatedRabbit = {
          id = rabbit.id;
          name = rabbit.name;
          birthDate = rabbit.birthDate;
          materials = newMaterials;
          rarity = rabbit.rarity;
          status = rabbit.status;
          owner = rabbit.owner;
          likes = rabbit.likes;
          photo = rabbit.photo;
          coordinates = rabbit.coordinates;
          price = rabbit.price;
        };
        rabbits.add(rabbitId, updatedRabbit);
      };
    };
  };

  public shared ({ caller }) func buyRabbit(rabbitId : RabbitId, newOwner : CollectorId, paymentAmount : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can buy rabbits");
    };

    switch (rabbits.get(rabbitId)) {
      case (null) { Runtime.trap("Rabbit not found") };
      case (?rabbit) {
        if (rabbit.status != #for_sale) {
          Runtime.trap("Rabbit is not for sale");
        };

        switch (rabbit.price) {
          case (null) { Runtime.trap("Price not set for this rabbit") };
          case (?price) {
            if (paymentAmount < price) {
              Runtime.trap("Insufficient funds to buy this rabbit");
            };

            switch (rabbit.owner) {
              case (null) { Runtime.trap("Rabbit has no previous owner") };
              case (?previousOwner) {
                let sellerFunds = switch (funds.get(previousOwner)) {
                  case (null) { 0 };
                  case (?amount) { amount };
                };

                let updatedFunds = sellerFunds + paymentAmount;
                funds.add(previousOwner, updatedFunds);

                let updatedRabbit = {
                  id = rabbit.id;
                  name = rabbit.name;
                  birthDate = rabbit.birthDate;
                  materials = rabbit.materials;
                  rarity = rabbit.rarity;
                  status = #in_collection;
                  owner = ?newOwner;
                  likes = rabbit.likes;
                  photo = rabbit.photo;
                  coordinates = rabbit.coordinates;
                  price = null;
                };
                rabbits.add(rabbitId, updatedRabbit);

                // Update owner profile
                switch (collectors.get(newOwner)) {
                  case (null) { Runtime.trap("Collector not found") };
                  case (?profile) {
                    let updatedProfile = {
                      id = profile.id;
                      nickname = profile.nickname;
                      city = profile.city;
                      rabbitsCollected = profile.rabbitsCollected + 1;
                      photo = profile.photo;
                    };
                    collectors.add(newOwner, updatedProfile);
                  };
                };
              };
            };
          };
        };
      };
    };
  };

  public shared ({ caller }) func placeBid(rabbitId : RabbitId, bidder : CollectorId, bidAmount : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can place bids");
    };

    switch (auctions.get(rabbitId)) {
      case (null) { Runtime.trap("Auction not found") };
      case (?auction) {
        if (Time.now() > auction.endTime) {
          Runtime.trap("Auction has ended");
        };

        switch (auction.highestBid) {
          case (null) {
            let updatedAuction = {
              rabbitId = auction.rabbitId;
              startPrice = auction.startPrice;
              startTime = auction.startTime;
              endTime = auction.endTime;
              highestBid = ?bidAmount;
              highestBidder = ?bidder;
            };
            auctions.add(rabbitId, updatedAuction);
          };
          case (?currentBid) {
            if (bidAmount <= currentBid) {
              Runtime.trap("Bid amount must exceed the current highest bid");
            };

            let updatedAuction = {
              rabbitId = auction.rabbitId;
              startPrice = auction.startPrice;
              startTime = auction.startTime;
              endTime = auction.endTime;
              highestBid = ?bidAmount;
              highestBidder = ?bidder;
            };
            auctions.add(rabbitId, updatedAuction);
          };
        };
      };
    };
  };

  public shared ({ caller }) func completeAuction(rabbitId : RabbitId, owner : CollectorId) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can complete auctions");
    };

    switch (auctions.get(rabbitId)) {
      case (null) { Runtime.trap("Auction not found") };
      case (?auction) {
        if (Time.now() < auction.endTime) {
          Runtime.trap("Auction has not ended yet");
        };

        switch (rabbitForAuction(rabbitId)) {
          case (null) { Runtime.trap("Rabbit not found") };
          case (?rabbit) {
            if (auctionIsInAuctionState(rabbit)) {
              completeAuctionTransfer(rabbitId, owner, auction, rabbit);
            } else {
              Runtime.trap("Rabbit is not in auction state");
            };
          };
        };
      };
    };
  };

  func auctionIsInAuctionState(rabbit : Rabbit) : Bool {
    rabbit.status == #auction;
  };

  func rabbitForAuction(rabbitId : RabbitId) : ?Rabbit {
    rabbits.get(rabbitId);
  };

  func completeAuctionTransfer(rabbitId : RabbitId, owner : CollectorId, auction : Auction, rabbit : Rabbit) {
    switch (auction.highestBid, auction.highestBidder) {
      case (null, _) {};
      case (_, null) {};
      case (?highestBid, ?buyer) {
        let sellerFunds = switch (funds.get(owner)) {
          case (null) { 0 };
          case (?amount) { amount };
        };

        let updatedFunds = sellerFunds + highestBid;
        funds.add(owner, updatedFunds);

        let updatedRabbit = {
          id = rabbit.id;
          name = rabbit.name;
          birthDate = rabbit.birthDate;
          materials = rabbit.materials;
          rarity = rabbit.rarity;
          status = #in_collection;
          owner = ?buyer;
          likes = rabbit.likes;
          photo = rabbit.photo;
          coordinates = rabbit.coordinates;
          price = null;
        };
        rabbits.add(rabbitId, updatedRabbit);

        switch (collectors.get(owner)) {
          case (null) {};
          case (?profile) {
            let updatedProfile = {
              id = profile.id;
              nickname = profile.nickname;
              city = profile.city;
              rabbitsCollected = if (profile.rabbitsCollected > 0) {
                profile.rabbitsCollected - 1;
              } else { 0 };
              photo = profile.photo;
            };
            collectors.add(owner, updatedProfile);
          };
        };

        switch (collectors.get(buyer)) {
          case (null) {};
          case (?profile) {
            let updatedProfile = {
              id = profile.id;
              nickname = profile.nickname;
              city = profile.city;
              rabbitsCollected = profile.rabbitsCollected + 1;
              photo = profile.photo;
            };
            collectors.add(buyer, updatedProfile);
          };
        };
      };
    };
  };

  public shared ({ caller }) func likeRabbit(rabbitId : RabbitId) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can like rabbits");
    };

    switch (rabbits.get(rabbitId)) {
      case (null) { Runtime.trap("Rabbit not found") };
      case (?rabbit) {
        let updatedLikes = rabbit.likes + 1;
        let updatedRabbit = {
          id = rabbit.id;
          name = rabbit.name;
          birthDate = rabbit.birthDate;
          materials = rabbit.materials;
          rarity = rabbit.rarity;
          status = rabbit.status;
          owner = rabbit.owner;
          likes = updatedLikes;
          photo = rabbit.photo;
          coordinates = rabbit.coordinates;
          price = rabbit.price;
        };
        rabbits.add(rabbitId, updatedRabbit);
      };
    };
  };

  public shared ({ caller }) func createCollectorProfile(
    id : Text,
    nickname : Text,
    city : Text,
    photo : ?Storage.ExternalBlob,
  ) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can create collector profiles");
    };

    let profile : CollectorProfile = {
      id;
      nickname;
      city;
      rabbitsCollected = 0;
      photo;
    };
    collectors.add(id, profile);
  };

  public shared ({ caller }) func sendMessage(
    sender : CollectorId,
    recipient : CollectorId,
    content : Text,
    status : Text,
  ) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can send messages");
    };

    let message : Message = {
      sender;
      recipient;
      content;
      timestamp = Time.now();
      status;
    };

    let sentMessages = switch (messages.get(sender)) {
      case (null) { List.empty<Message>() };
      case (?msgs) { msgs };
    };

    sentMessages.add(message);
    messages.add(sender, sentMessages);

    let receivedMessages = switch (messages.get(recipient)) {
      case (null) { List.empty<Message>() };
      case (?msgs) { msgs };
    };
    receivedMessages.add(message);
    messages.add(recipient, receivedMessages);
  };

  public query ({ caller }) func getRabbitById(rabbitId : RabbitId) : async ?Rabbit {
    rabbits.get(rabbitId);
  };

  public query ({ caller }) func getCollectorProfileById(collectorId : CollectorId) : async ?CollectorProfile {
    collectors.get(collectorId);
  };

  public query ({ caller }) func getAllRabbits() : async [Rabbit] {
    rabbits.values().toArray();
  };

  public query ({ caller }) func getAvailableRabbits() : async [Rabbit] {
    rabbits.values().toArray().filter(
      func(rabbit) {
        rabbit.status == #for_sale or rabbit.status == #auction
      }
    );
  };

  public query ({ caller }) func getCollectorRabbits(collectorId : CollectorId) : async [Rabbit] {
    rabbits.values().toArray().filter(
      func(rabbit) {
        rabbit.owner == ?collectorId and rabbit.status == #in_collection;
      }
    );
  };

  public query ({ caller }) func getCollectorMessages(collectorId : CollectorId) : async [Message] {
    switch (messages.get(collectorId)) {
      case (null) { [] };
      case (?msgs) { msgs.toArray() };
    };
  };

  // Allow claiming admin role even if already registered as user,
  // as long as no admin has been assigned yet and the caller provides the correct token.
  public shared ({ caller }) func claimFirstAdmin(userSecret : Text) : async () {
    switch (Prim.envVar<system>("CAFFEINE_ADMIN_TOKEN")) {
      case (null) { Runtime.trap("CAFFEINE_ADMIN_TOKEN not set") };
      case (?adminToken) {
        if (not accessControlState.adminAssigned and userSecret == adminToken) {
          accessControlState.userRoles.add(caller, #admin);
          accessControlState.adminAssigned := true;
        } else {
          Runtime.trap("Invalid admin token or admin already assigned");
        };
      };
    };
  };
};