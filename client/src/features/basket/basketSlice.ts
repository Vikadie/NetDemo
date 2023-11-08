import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import agent from "../../app/http/agent";
import { Basket } from "../../app/models/basket";
import { getCookie } from "../../util/utils";

interface BasketState {
    basket: Basket | null;
    status: string; // created for the API requests
}

const initialState: BasketState = {
    basket: null,
    status: "idle", // created for the API requests
};

// async function for the API request
export const addBasketItemAsync = createAsyncThunk<
    Basket, // return value type. Equals the action.payload in the builder.fulfuilled reducer case
    { productId: number; quantity?: number } // functions params (names should correspond)
>(
    "basket/addBasketItemAsync", // typePrefix
    async ({ productId, quantity = 1 }, thunkAPI) => {
        // payloadCreator
        try {
            return await agent.Basket.addItem(productId, quantity);
        } catch (error: any) {
            return thunkAPI.rejectWithValue({ error: error.data });
        }
    }
);

export const removeBasketItemAsync = createAsyncThunk<
    void,
    { productId: number; quantity?: number; name?: string }
>("basket/removeBasketItemAsync", async ({ productId, quantity = 1 }, thunkAPI) => {
    try {
        return await agent.Basket.removeItem(productId, quantity);
    } catch (error: any) {
        return thunkAPI.rejectWithValue({ error: error.data });
    }
});

export const fetchBasketAsync = createAsyncThunk<Basket>(
    "basket/fetchBasketAsync",
    async (_, thunkAPI) => {
        try {
            console.log("try");
            return agent.Basket.getBasket();
        } catch (error: any) {
            console.log("catch");
            return thunkAPI.rejectWithValue({ error: error.data });
        }
    },
    {
        condition: () => {
            const buyerId = getCookie("buyerId");
            if (!buyerId) return false;
        },
    }
);

export const basketSlice = createSlice({
    name: "basket",
    initialState,
    reducers: {
        setBasket: (state, action) => {
            state.basket = action.payload;
        },
        clearBasket: (state) => {
            state.basket = null;
        },
        // removeItem: (state, action) => {
        //     const { productId, quantity } = action.payload;
        //     const itemIndex = state.basket?.items.findIndex((i) => i.productId === productId);
        //     if (itemIndex && itemIndex >= 0) {
        //         state.basket!.items[itemIndex].quantity -= quantity;
        //         if (state.basket!.items[itemIndex].quantity <= 0) {
        //             state.basket!.items.splice(itemIndex, 1);
        //         }
        //     }
        // },
    },
    extraReducers: (builder) => {
        // add item part
        builder.addCase(addBasketItemAsync.pending, (state, action) => {
            state.status = "pendingAddItem" + action.meta.arg.productId;
        });
        builder.addCase(addBasketItemAsync.fulfilled, (state, action) => {
            state.basket = action.payload;
            state.status = "idle";
        });
        builder.addCase(addBasketItemAsync.rejected, (state, action) => {
            console.log("error", action.payload);
            state.status = "idle";
        });
        // remove item part
        builder.addCase(removeBasketItemAsync.pending, (state, action) => {
            const { productId, name = "" } = action.meta.arg;
            state.status = "pendingRemoveItem" + productId + name;
        });
        builder.addCase(removeBasketItemAsync.fulfilled, (state, action) => {
            const { productId, quantity = 1 } = action.meta.arg;
            const itemIndex = state.basket?.items.findIndex((i) => i.productId === productId);
            if (itemIndex !== undefined && itemIndex >= 0) {
                state.basket!.items[itemIndex].quantity -= quantity;
                if (state.basket!.items[itemIndex].quantity <= 0) {
                    state.basket!.items.splice(itemIndex, 1);
                }
            }
            state.status = "idle";
        });
        builder.addCase(removeBasketItemAsync.rejected, (state, action) => {
            console.log("error", action.payload);
            state.status = "idle";
        });
        builder.addCase(fetchBasketAsync.fulfilled, (state, action) => {
            state.basket = action.payload;
            state.status = "idle";
        });
        builder.addCase(fetchBasketAsync.rejected, (state, action) => {
            console.log("error", action.payload);
            state.status = "idle";
        });
    },
});

export const { setBasket, clearBasket } = basketSlice.actions;
