import { createAsyncThunk, createEntityAdapter, createSlice } from "@reduxjs/toolkit";
import agent from "../../app/http/agent";
import { MetaData } from "../../app/models/pagination";
import { Product, ProductParams } from "../../app/models/product";
import { RootState } from "../../app/store/configureStore";

interface CatalogState {
    productsLoaded: boolean;
    filtersLoaded: boolean;
    status: string;
    brands: string[];
    types: string[];
    productParams: ProductParams;
    metaData: MetaData | null;
}

const productsAdapter = createEntityAdapter<Product>();

function getAxiosParams(productParams: ProductParams) {
    const params = new URLSearchParams();
    params.append("pageNumber", productParams.pageNumber.toString());
    params.append("pageSize", productParams.pageSize.toString());
    params.append("orderBy", productParams.orderBy);
    if (productParams.searchTerm) params.append("searchTerm", productParams.searchTerm);
    if (productParams.brands && productParams.brands.length > 0)
        params.append("brands", productParams.brands.toString());
    if (productParams.types && productParams.types.length > 0)
        params.append("types", productParams.types.toString());

    return params;
}

export const fetchProductsAsync = createAsyncThunk<Product[], void, { state: RootState }>(
    "catalog/fetchProductsAsync",
    async (_, thunkAPI) => {
        const params = getAxiosParams(thunkAPI.getState().catalog.productParams);
        try {
            // after the PaginatedResponse class in teh intercepts, the response consists of data which has items and metaData attributes
            const response = await agent.Catalog.list(params);
            // set the metadata in the Redux state
            thunkAPI.dispatch(setMetaData(response.metaData));
            // the items part will be returned
            return response.items;
        } catch (error: any) {
            return thunkAPI.rejectWithValue({ error: error.data });
        }
    }
);

export const fetchProductAsync = createAsyncThunk<Product, number>(
    "catalog/fetchProductAsync",
    async (productId, thunkAPI) => {
        try {
            return await agent.Catalog.details(productId);
        } catch (error: any) {
            return thunkAPI.rejectWithValue({ error: error.data });
        }
    }
);

export const fetchFilters = createAsyncThunk("catalog/fetchFilters", async (_, thunkAPI) => {
    try {
        return await agent.Catalog.filters();
    } catch (error: any) {
        return thunkAPI.rejectWithValue({ error: error.data });
    }
});

function initParams() {
    return { pageNumber: 1, pageSize: 6, orderBy: "name" }; // hidden attributes: types, brands, searchParams
}

export const catalogSlice = createSlice({
    name: "catalog",
    initialState: productsAdapter.getInitialState<CatalogState>({
        productsLoaded: false,
        filtersLoaded: false,
        status: "idle",
        brands: [],
        types: [],
        productParams: initParams(),
        metaData: null,
    }),
    reducers: {
        setProductParams: (state, action) => {
            state.productsLoaded = false;
            state.productParams = { ...state.productParams, ...action.payload };
        },
        setMetaData: (state, action) => {
            state.metaData = action.payload;
        },
        resetProductParams: (state) => {
            state.productParams = initParams();
        },
        setProduct: (state) => {
            // productsAdapter.upsertOne(state, action.payload);
            state.productsLoaded = false; // this will run the dispatch(fetchProductsAsync()); from useProducts hook and will reload all the products again
        },
        removeProduct: (state) => {
            // productsAdapter.removeOne(state, action.payload);
            state.productsLoaded = false; // this will run the dispatch(fetchProductsAsync()); from useProducts hook and will reload all the products again
        },
    },
    extraReducers: (builder) => {
        builder.addCase(fetchProductsAsync.pending, (state) => {
            state.status = "pendingFetchProducts";
        });
        builder.addCase(fetchProductsAsync.fulfilled, (state, action) => {
            productsAdapter.setAll(state, action.payload);
            state.status = "idle";
            state.productsLoaded = true;
        });
        builder.addCase(fetchProductsAsync.rejected, (state, action) => {
            console.log("error", action.payload);
            state.status = "idle";
        });
        builder.addCase(fetchProductAsync.pending, (state) => {
            state.status = "pendingFetchProduct";
        });
        builder.addCase(fetchProductAsync.fulfilled, (state, action) => {
            productsAdapter.upsertOne(state, action.payload);
            state.status = "idle";
        });
        builder.addCase(fetchProductAsync.rejected, (state, action) => {
            console.log("error", action.payload);
            state.status = "idle";
        });
        builder.addCase(fetchFilters.pending, (state) => {
            state.status = "pendingFetchFilters";
        });
        builder.addCase(fetchFilters.fulfilled, (state, action) => {
            state.brands = action.payload.brands;
            state.types = action.payload.types;
            state.filtersLoaded = true;
            state.status = "idle";
        });
        builder.addCase(fetchFilters.rejected, (state, action) => {
            console.log("error", action.payload);
            state.status = "idle";
        });
    },
});

export const productSelectors = productsAdapter.getSelectors((state: RootState) => state.catalog);

export const { setProductParams, setMetaData, resetProductParams, setProduct, removeProduct } =
    catalogSlice.actions;
