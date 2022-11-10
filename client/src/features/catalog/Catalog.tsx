import { Product } from "../../app/models/product";

interface Props {
    products: Product[];
    addProduct: () => void;
}

const Catalogue = ({ products, addProduct }: Props) => {
    return (
        <>
            <ul>
                {products.map((product) => (
                    <li key={product.id}>
                        {product.name} - {product.price}
                    </li>
                ))}
            </ul>
            <button onClick={addProduct}>Add Product</button>
        </>
    );
};

export default Catalogue;
