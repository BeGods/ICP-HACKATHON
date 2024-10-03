import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";


export const fetchCollections = createAsyncThunk(
  "info/fetchCollections",
  async (backendActor, { getState }) => {
    const { collectionList } = getState().info;

    if (collectionList.length === 0) {
      const result = await backendActor?.getAllCollections();
      const collections = [];

      if (result.length === 0) {
        return collections;
      }

      const collectionItems = result[0][1];
      console.log("Fetched collection items in Footer:", collectionItems);

      let i = 0;
      collectionItems.forEach((eachItem) => {
        // console.log("collection item in redux slice",eachItem)
        const colItem = {
          index: i,
          collectionId: eachItem[1],  
          name: eachItem[2],
          description: eachItem[4],
          image : eachItem[3]
        };
        i++;
        collections.push(colItem);
      });

      console.log("Processed collections:", collections);
      return collections; 
    }

    return collectionList;
  }
);

const initialState = {
  collectionList: [],
  currentCollectionIndex : 0,
  isDisplayWalletOptions : {status:false,path:""},
};

const infoSlice = createSlice({
  name: "info",
  initialState,
  reducers: {
    updateCurrentIndex : (state,action) => {
        const newIndex = action.payload;
        console.log("new index", newIndex)
        state.currentCollectionIndex = newIndex;
    },
    updateDisplayWalletOptionsStatus : (state,action) => {
        console.log("in side function",action.payload);
        state.isDisplayWalletOptions = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder.addCase(fetchCollections.fulfilled, (state, action) => {
    //   console.log("Action payload (fulfilled):", action.payload); 
      state.collectionList = action.payload;
    });
  },
});

export const {updateCurrentIndex,updateDisplayWalletOptionsStatus} = infoSlice.actions;

export default infoSlice.reducer;
