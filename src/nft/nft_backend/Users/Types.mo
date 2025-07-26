module {
    public type User = {
        //profileimage : Text;
        firstName : Text;
        lastName : Text;
        email : Text;
        //twitter : Text;
        //discord : Text;
        //telegram : Text;
        address: Text;
    };

    public type UpdateUserError = {
        #UserNotAuthenticated; // If your logic requires authentication
        #UserNotFound;
        #EmptyEmail;
        #EmptyFirstName;
        #EmptyLastName;
        #EmptyAddress;
    };

    public type GetUserError = {
        #UserNotFound;
    };

    public type CreateUserError = {
        #UserAlreadyExists;
        #EmptyEmail;
        #EmptyFirstName;
        #EmptyLastName; 
    };

    public type Statsdata = {
        totalusers : Int;
        totalCollections : Int;
        totalnfts : Int;
    };

    public type TransactionsDetails = {
        // Define fields as needed
    };

    
}
