import { createAsyncThunk, createSlice, isAnyOf } from "@reduxjs/toolkit";
import { FieldValues } from "react-hook-form";
import { toast } from "react-toastify";
import { history } from "../..";
import agent from "../../app/http/agent";
import { User } from "../../app/models/user";
import { setBasket } from "../basket/basketSlice";

interface AccountState {
    user: User | null;
}

const initialState: AccountState = {
    user: null,
};

export const signInUser = createAsyncThunk<User, FieldValues>(
    "account/signInUser",
    async (data, thunkAPI) => {
        try {
            const userDto = await agent.Account.login(data); // userDto is returned from our API and it contains user details + basket(if exists)
            const {basket, ...user} = userDto; // separating the basket from the user
            if (basket) thunkAPI.dispatch(setBasket(basket)); // add the basket to our Redux state
            localStorage.setItem("user", JSON.stringify(user));
            return user;
        } catch (error: any) {
            return thunkAPI.rejectWithValue({ error: error.data });
        }
    }
);

export const fetchCurrentUser = createAsyncThunk<User>(
    "account/fetchCurrentUser",
    async (_, thunkAPI) => {
        thunkAPI.dispatch(setUser(JSON.parse(localStorage.getItem("user")!))) // to set the token to our state if it is not set before
        // ! is allowed since it is for sure to have user Item in localStorage in order to get here, as we put it in teh condition
        try {
            const userDto = await agent.Account.currentUser(); // userDto is returned from our API and it contains user details + basket(if exists)
            const {basket, ...user} = userDto; // separating the basket from the user
            if (basket) thunkAPI.dispatch(setBasket(basket)); // add the basket to our Redux state
            localStorage.setItem("user", JSON.stringify(user));
            return user;
        } catch (error: any) {
            return thunkAPI.rejectWithValue({ error: error.data }); 
            // this will send us to the agent response interception case 401, but there will be no additional toast from there
        }
    },
    {
        condition: () => {
            if (!localStorage.getItem("user")) {
                return false; // it is not going to make the network request if we do not have the user key in teh localStorage
            }
        },
    }
);

export const accountSlice = createSlice({
    name: "account",
    initialState,
    reducers: {
        signOut: (state) => {
            state.user = null;
            localStorage.removeItem("user");
            history.push("/");
        },
        setUser: (state, action) => {
            state.user = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder.addCase(signInUser.rejected, (state, action) => {
            throw (action.payload);
        });
        builder.addCase(fetchCurrentUser.rejected, (state) => {
            // if it is still UnAuthorized or the JWT is wrong...
            state.user = null;
            localStorage.removeItem('user');
            toast.error("Session expired - please log in again");
            history.push('/');
        });
        builder.addMatcher(isAnyOf(signInUser.fulfilled, fetchCurrentUser.fulfilled), (state, action) => {
            state.user = action.payload;
        });
    },
});

export const { signOut, setUser } = accountSlice.actions;
