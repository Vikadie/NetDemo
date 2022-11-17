import { Grid, Paper } from "@mui/material";
import {
    useEffect,
    // useState
} from "react";
// import agent from "../../app/http/agent";
import Loading from "../../app/layout/Loading";
// import { Product } from "../../app/models/product";
import { useAppDispatch, useAppSelector } from "../../app/store/configureStore";
import {
    fetchFilters,
    fetchProductsAsync,
    productSelectors,
    setProductParams,
} from "./catalogSlice";
import ProductList from "./ProductList";
import ProductSearch from "./ProductSearch";
import RadioButtonGroup from "../../app/components/RadioButtonGroup";
import { CheckBoxGroup } from "../../app/components/CheckboxGroup";
import { AppPagination } from "../../app/components/AppPagination";

const sortOption = [
    { value: "name", label: "Alphabetical" },
    { value: "priceDesc", label: "Price - High to low" },
    { value: "price", label: "Price - Low to high" },
];

const Catalogue = () => {
    // const [products, setProducts] = useState<Product[]>([]); // will be replaced by Redux Selectors provided by EntityAdaoter
    const products = useAppSelector(productSelectors.selectAll);
    const { productsLoaded, filtersLoaded, brands, types, productParams, metaData } = useAppSelector(
        (state) => state.catalog
    );
    const dispatch = useAppDispatch();
    // const [loading, setLoading] = useState(true); // witout status

    useEffect(() => {
        // agent.Catalog.list() // without Redux
        //     .then(setProducts)
        //     .catch((err) => console.log(err))
        //     .finally(() => setLoading(false));
        if (!productsLoaded) {
            dispatch(fetchProductsAsync());
        }
    }, [productsLoaded, dispatch, filtersLoaded]);

    useEffect(() => {
        if (!filtersLoaded) {
            dispatch(fetchFilters());
        }
    }, [dispatch, filtersLoaded]);

    if (!filtersLoaded) return <Loading message="Loading products..." />;

    return (
        <Grid container columnSpacing={4}>
            <Grid item xs={3}>
                <Paper sx={{ mb: 2 }}>
                    <ProductSearch />
                </Paper>
                <Paper sx={{ mb: 2, p: 2 }}>
                    <RadioButtonGroup
                        selectedValue={productParams.orderBy}
                        onChange={(e) =>
                            dispatch(setProductParams({ orderBy: e.target.value, pageNumber: 1 }))
                        }
                        options={sortOption}
                    />
                </Paper>
                <Paper sx={{ mb: 2, p: 2 }}>
                    <CheckBoxGroup
                        items={brands}
                        checked={productParams.brands}
                        onChange={(items) => dispatch(setProductParams({ brands: items, pageNumber: 1 }))}
                    />
                </Paper>
                <Paper sx={{ mb: 2, p: 2 }}>
                    <CheckBoxGroup
                        items={types}
                        checked={productParams.types}
                        onChange={(items) => dispatch(setProductParams({ types: items, pageNumber: 1 }))}
                    />
                </Paper>
            </Grid>
            <Grid item xs={9}>
                <ProductList products={products} />
            </Grid>
            <Grid item xs={3} />
            <Grid item xs={9} sx={{ mb: 2 }}>
                {metaData && <AppPagination
                    metaData={metaData}
                    onPageChange={(page) => dispatch(setProductParams({ pageNumber: page }))}
                />}
            </Grid>
        </Grid>
    );
};

export default Catalogue;
