import { createAsyncThunk, createSlice, isAnyOf } from "@reduxjs/toolkit";
import { FieldValues } from "react-hook-form";
import { toast } from "react-toastify";
import agent from "../../app/http/agent";
import { User } from "../../app/models/user";
import { setBasket } from "../basket/basketSlice";
import router from "../../app/router/Router";

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
            const { basket, ...user } = userDto; // separating the basket from the user
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
        thunkAPI.dispatch(setUser(JSON.parse(localStorage.getItem("user")!))); // to set the token to our state if it is not set before
        // ! is allowed since it is for sure to have user Item in localStorage in order to get here, as we put it in teh condition
        try {
            const userDto = await agent.Account.currentUser(); // userDto is returned from our API and it contains user details + basket(if exists)
            const { basket, ...user } = userDto; // separating the basket from the user
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
            router.navigate("/");
        },
        setUser: (state, action) => {
            const claims = JSON.parse(atob(action.payload.token.split(".")[1])) // atob() is a func that gets the jwt token to json object
            const roles = claims['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'];
            state.user = {...action.payload, roles: Array.isArray(roles) ? roles : [roles] };
        },
    },
    extraReducers: (builder) => {
        builder.addCase(signInUser.rejected, (_, action) => {
            throw action.payload;
        });
        builder.addCase(fetchCurrentUser.rejected, (state) => {
            // if it is still UnAuthorized or the JWT is wrong...
            state.user = null;
            localStorage.removeItem("user");
            toast.error("Session expired - please log in again");
            router.navigate("/");
        });
        builder.addMatcher(isAnyOf(signInUser.fulfilled, fetchCurrentUser.fulfilled), (state, action) => {
            const claims = JSON.parse(atob(action.payload.token.split(".")[1])) // atob() is a func that gets the jwt token to json object
            const roles = claims['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'];
            state.user = {...action.payload, roles: Array.isArray(roles) ? roles : [roles] };
        });
    },
});

export const { signOut, setUser } = accountSlice.actions;
