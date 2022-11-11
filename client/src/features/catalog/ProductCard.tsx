import {
    Button,
    Card,
    CardActions,
    CardContent,
    CardMedia,
    Typography,
    Grid,
    CardHeader,
    Avatar,
} from "@mui/material";
import { Link } from "react-router-dom";
import { Product } from "../../app/models/product";

const ProductCard = ({ product }: { product: Product }) => {
    return (
        <Grid item xs={3}>
            <Card>
                <CardHeader
                    avatar={
                        <Avatar sx={{ bgcolor: "secondary.light" }}>
                            {product.name.charAt(0).toUpperCase()}
                        </Avatar>
                    }
                    title={product.name}
                    titleTypographyProps={{
                        sx: { fontWeight: "bold", color: "primary.main" },
                    }}
                />
                <CardMedia
                    image={product.pictureUrl}
                    sx={{ height: 140, backgroundSize: "contain", bgcolor: 'grey.400' }}
                    title={product.name}
                />
                <CardContent>
                    <Typography gutterBottom variant="h5" color="secondary">
                        {(product.price / 100).toFixed(2)} BGN
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        {product.brand} / {product.type}
                    </Typography>
                </CardContent>
                <CardActions>
                    <Button size="small">Add to Card</Button>
                    <Button size="small" component={Link} to={`${product.id}`}>View</Button>
                </CardActions>
            </Card>
        </Grid>
    );
};

export default ProductCard;
