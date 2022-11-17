import { useEffect, 
    // useState 
} from "react";
// import agent from "../../app/http/agent";
import Loading from "../../app/layout/Loading";
// import { Product } from "../../app/models/product";
import { useAppDispatch, useAppSelector } from "../../app/store/configureStore";
import { fetchFilters, fetchProductsAsync, productSelectors } from "./catalogSlice";
import ProductList from "./ProductList";

const Catalogue = () => {
    // const [products, setProducts] = useState<Product[]>([]); // will be replaced by Redux Selectors provided by EntityAdaoter
    const products = useAppSelector(productSelectors.selectAll);
    const { productsLoaded, status, filtersLoaded } = useAppSelector(state => state.catalog);
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

    if (status.includes("pending")) return <Loading message="Loading products..." />;

    return (
        <>
            <ProductList products={products} />
        </>
    );
};

export default Catalogue;
