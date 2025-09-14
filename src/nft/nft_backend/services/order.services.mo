import Principal "mo:base/Principal";
import Result "mo:base/Result";
import Text "mo:base/Text";
import Nat "mo:base/Nat";
import Array "mo:base/Array";
import MainTypes "../types/main.types";
import Pagin "../utils/pagin.utils";

module {
  //update existing order details
  public func updateOrder(
    accountIdentifier : Principal,
    orderId : Nat,
    phone : Text,
    email : Text,
    address : Text,
    city : Text,
    country : Text,
    pincode : Text,
    landmark : ?Text,
    orders : [MainTypes.Order],
  ) : Result.Result<(Text, [MainTypes.Order]), Text> {

    var orderFound = false;

    let updatedOrders = Array.map<MainTypes.Order, MainTypes.Order>(
      orders,
      func(order : MainTypes.Order) : MainTypes.Order {
        if (order.id == orderId and order.accountIdentifier == accountIdentifier) {
          orderFound := true;
          return {
            id = order.id;
            accountIdentifier = order.accountIdentifier;
            uuid = order.uuid;
            collectionCanisterId = order.collectionCanisterId;
            phone = phone;
            email = email;
            address = address;
            city = city;
            country = country;
            pincode = pincode;
            landmark = landmark;
            orderTime = order.orderTime;
          };
        } else {
          return order;
        };
      },
    );

    if (orderFound) {
      return #ok(("Order updated successfully.", updatedOrders));
    } else {
      return #err("Order not found for the provided account identifier and order ID.");
    };
  };

  //remove existing orders
  public func removeOrder(
    accountIdentifier : Principal,
    orderId : Nat,
    orders : [MainTypes.Order],
  ) : Result.Result<(Text, [MainTypes.Order]), Text> {

    var orderRemoved = false;

    let updatedOrders = Array.filter<MainTypes.Order>(
      orders,
      func(order : MainTypes.Order) : Bool {
        if (order.id == orderId and order.accountIdentifier == accountIdentifier) {
          orderRemoved := true;
          return false; // remove this one
        };
        true; // keep others
      },
    );

    if (orderRemoved) {
      return #ok(("Order removed successfully.", updatedOrders));
    } else {
      return #err("Order not found for the provided account identifier and order ID.");
    };
  };

  //get all orders of users (admin side)
  public func getallOrders(
    chunkSize : Nat,
    pageNo : Nat,
    orders : [MainTypes.Order],
  ) : Result.Result<{ data : [MainTypes.Order]; current_page : Nat; total_pages : Nat }, Text> {

    let allOrders = orders;
    let index_pages = Pagin.paginate<MainTypes.Order>(allOrders, chunkSize);

    if (index_pages.size() == 0) {
      return #err("No orders found");
    };

    if (pageNo >= index_pages.size()) {
      return #err("Page not found");
    };

    let order_page = index_pages[pageNo];

    return #ok({
      data = order_page;
      current_page = pageNo + 1;
      total_pages = index_pages.size();
    });
  };

  // get order details for a specific order
  public func orderDetails(
    accountIdentifier : Principal,
    orderId : Nat,
    orders : [MainTypes.Order],
  ) : Result.Result<MainTypes.Order, Text> {

    // Search for the order that matches the provided account identifier and order ID
    let foundOrder = Array.find<MainTypes.Order>(
      orders,
      func(order : MainTypes.Order) : Bool {
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
  public func getuserorders(
    accountIdentifier : Principal,
    orders : [MainTypes.Order],
  ) : Result.Result<[MainTypes.Order], Text> {

    let userOrders = Array.filter<MainTypes.Order>(
      orders,
      func(order : MainTypes.Order) : Bool {
        order.accountIdentifier == accountIdentifier;
      },
    );
    if (userOrders.size() == 0) {
      return #err("No orders found for the provided account identifier.");
    } else {
      return #ok(userOrders);
    };
  };

};
