import { Box, Pagination, Typography } from "@mui/material";
import { MetaData } from "../models/pagination";

interface Props {
    metaData: MetaData;
    onPageChange: (page: number) => void;
}
export function AppPagination({ metaData, onPageChange }: Props) {
    const { currentPage, pageSize, totalCount, totalPages } = metaData;

    const firstPosition = (currentPage - 1) * pageSize + 1;
    const lastPosition = currentPage * pageSize < totalCount ? currentPage * pageSize : totalCount;

    const handleChange = (event: React.ChangeEvent<unknown>, value: number) => {
        onPageChange(value);
    };
    return (
        <Box display={"flex"} justifyContent="space-between" alignItems={"center"}>
            <Typography>
                Displaying {firstPosition}-{lastPosition} of {totalCount} items
            </Typography>
            <Pagination
                color="secondary"
                size="large"
                count={totalPages}
                page={currentPage}
                onChange={handleChange}
            />
        </Box>
    );
}
