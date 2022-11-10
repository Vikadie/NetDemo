import React, { useEffect, useState } from "react";
import { Product } from "../models/product";

function App() {
    const [products, setProducts] = useState<Product[]>([]);

    useEffect(() => {
      fetch('http://localhost:5000/api/Products')
      .then((response) => response.json())
      .then((data) => setProducts(data))
    }, []);

    const addProduct = () => {
        setProducts((prevState) => [
            ...prevState,
            { 
                id: prevState.length + 101,
                name: "product" + (prevState.length + 1), 
                price: (prevState.length + 1) * 100.0,
                brand: 'someBrand',
                description: 'someDescription',
                pictureUrl: 'hhtp://picsum.photos/200',
            },
        ]);
    };
    return (
        <div>
            <h1>Net Demo</h1>
            <ul>
                {products.map((product, index) => (
                    <li key={index}>
                        {product.name} - {product.price}
                    </li>
                ))}
            </ul>
            <button onClick={addProduct}>Add Product</button>
        </div>
    );
}

export default App;
