import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../store/configureStore";
import { productSelectors, fetchProductsAsync, fetchFilters } from "../../features/catalog/catalogSlice";

export default function useProducts() {
    // const [products, setProducts] = useState<Product[]>([]); // will be replaced by Redux Selectors provided by EntityAdapter
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

    return {
        products,
        productsLoaded,
        filtersLoaded,
        brands,
        types,
        productParams,
        metaData,
        dispatch,
    };
}
