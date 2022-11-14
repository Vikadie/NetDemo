import { useEffect, useState } from "react";
import agent from "../../app/http/agent";
import Loading from "../../app/layout/Loading";
import { Product } from "../../app/models/product";
import ProductList from "./ProductList";

const Catalogue = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        agent.Catalog.list()
            .then(setProducts)
            .catch((err) => console.log(err))
            .finally(() => setLoading(false));
    }, []);

    if (loading) return <Loading message="Loading products..." />;

    return (
        <>
            <ProductList products={products} />
        </>
    );
};

export default Catalogue;
