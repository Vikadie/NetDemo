import { Backdrop, CircularProgress, Typography } from "@mui/material";

interface Props {
    message?: string;
}
const Loading = ({ message = "Loading..." }: Props) => {
    return (
        <Backdrop
            // sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
            open={true}
            invisible={true}
        >
            <CircularProgress color="secondary" size={100} />
            <Typography variant="h4" sx={{ justifyContent: "center", position: "fixed", top: "60%" }}>
                {message}
            </Typography>
        </Backdrop>
    );
};

export default Loading;
