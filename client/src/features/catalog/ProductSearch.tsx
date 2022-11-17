import TextField from "@mui/material/TextField";
import { debounce } from "@mui/material/utils";
import { useState } from "react";
import { useAppDispatch, useAppSelector } from "../../app/store/configureStore";
import { setProductParams } from "./catalogSlice";

export default function ProductSearch() {
    const { productParams } = useAppSelector((state) => state.catalog);
    const dispatch = useAppDispatch();

    //local state
    const [searchTerm, setSearchTerm] = useState(productParams.searchTerm);
    // debounced function
    const debouncedSearch = debounce((event: any) => {
        dispatch(setProductParams({ searchTerm: event.target.value, pageNumber: 1 }));
    }, 1000); // 1000 is in ms and it is the time to wait before launching the dispatch

    return (
        <TextField
            label="Search products"
            variant="outlined"
            fullWidth
            value={searchTerm}
            onChange={(e) => {
                setSearchTerm(e.target.value);
                debouncedSearch(e);
            }}
        />
    );
}
