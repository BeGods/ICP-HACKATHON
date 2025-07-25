// import List "mo:base/List";
// import Iter "mo:base/Iter";
// import Array "mo:base/Array";
// import Principal "mo:base/Principal";
// module {

//         public func paginate<V>(array : [V], chunkSize : Nat) : [[V]] {
//         var paginationArray : List.List<[V]> = List.nil<[V]>();
//         var num_chunk : Nat = (array.size() + chunkSize -1) / chunkSize;
//         for (i in Iter.range(0, num_chunk -1)) {
//             var tempArray = List.nil<V>();
//             for (j in Iter.range(0, chunkSize -1)) {
//                 var index = i * chunkSize + j;
//                 if (index < array.size()) {
//                     tempArray := List.push(array[index], tempArray);
//                 };
//             };
//             paginationArray := List.push(List.toArray(tempArray), paginationArray);
//         };
//         List.toArray(paginationArray);
//     };
// };

import List "mo:base/List";
import Iter "mo:base/Iter";
import Array "mo:base/Array";
import Principal "mo:base/Principal";

// module {
//     public func paginate<V>(array : [V], chunkSize : Nat) : [[V]] {
//         var paginationArray : List.List<[V]> = List.nil<[V]>();
//         var arraySize : Nat = array.size();
//         var num_chunks : Nat = (arraySize + chunkSize - 1) / chunkSize;
//         for (i in Iter.range(0, num_chunks - 1)) {
//             var tempArray = List.nil<V>();
//             for (j in Iter.range(0, chunkSize - 1)) {
//                 let index = i * chunkSize + j;
//                 if (index < arraySize) {
//                     tempArray := List.push(array[index], tempArray);
//                 };
//             };
//             paginationArray := List.push(List.toArray(tempArray), paginationArray);
//         };
//         return List.toArray(List.reverse(paginationArray)); 
//     };
// };

module {
    public func paginate<V>(array : [V], chunkSize : Nat) : [[V]] {
        var paginationArray : List.List<[V]> = List.nil<[V]>();
        var num_chunk : Nat = (array.size() + chunkSize -1) / chunkSize;
        for (i in Iter.range(0, num_chunk -1)) {
            var tempArray = List.nil<V>();
            for (j in Iter.range(0, chunkSize -1)) {
                var index = i * chunkSize + j;
                if (index < array.size()) {
                  tempArray := List.push(array[index],tempArray);
                };
            };
          paginationArray := List.push(List.toArray(List.reverse(tempArray)), paginationArray);
        };
      List.toArray(List.reverse(paginationArray));
      };
};
    
