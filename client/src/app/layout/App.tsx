import { Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import Catalogue from "../../features/catalog/Catalog";
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
                pictureUrl: 'http://picsum.photos/' + (200 + (prevState.length + 1)),
            },
        ]);
    };
    return (
        <>
            <Typography variant="h1">Net Demo</Typography>
            <Catalogue products={products} addProduct={addProduct} />
        </>
    );
}

export default App;
