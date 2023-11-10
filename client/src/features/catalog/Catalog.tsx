import { Grid, Paper } from "@mui/material";
import Loading from "../../app/layout/Loading";
import { setProductParams } from "./catalogSlice";
import ProductList from "./ProductList";
import ProductSearch from "./ProductSearch";
import RadioButtonGroup from "../../app/components/RadioButtonGroup";
import { CheckBoxGroup } from "../../app/components/CheckboxGroup";
import { AppPagination } from "../../app/components/AppPagination";
import useProducts from "../../app/hooks/useProducts";

const sortOption = [
    { value: "name", label: "Alphabetical" },
    { value: "priceDesc", label: "Price - High to low" },
    { value: "price", label: "Price - Low to high" },
];

const Catalogue = () => {
    const { products, filtersLoaded, brands, types, productParams, metaData, dispatch } = useProducts();

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
                {metaData && (
                    <AppPagination
                        metaData={metaData}
                        onPageChange={(page) => dispatch(setProductParams({ pageNumber: page }))}
                    />
                )}
            </Grid>
        </Grid>
    );
};

export default Catalogue;
