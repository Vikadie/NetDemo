import { Typography, Grid, Paper, Box, Button } from "@mui/material";
import { FieldValues, useForm } from "react-hook-form";
import AppTextInput from "../../app/components/AppTextInput";
import { Product } from "../../app/models/product";
import { useEffect } from "react";
import useProducts from "../../app/hooks/useProducts";
import AppSelectList from "../../app/components/AppSelectList";
import AppDropzone from "../../app/components/AppDropzone";
import { yupResolver } from "@hookform/resolvers/yup";
import { validationSchema } from "./productValidation";
import agent from "../../app/http/agent";
import { useAppDispatch } from "../../app/store/configureStore";
import { setProduct } from "../catalog/catalogSlice";
import { LoadingButton } from "@mui/lab";

interface Props {
    product?: Product;
    cancelEdit: () => void;
}

export default function ProductForm({ product, cancelEdit }: Props) {
    const dispatch = useAppDispatch();

    const {
        control,
        reset,
        handleSubmit,
        watch,
        formState: { isDirty, isSubmitting },
    } = useForm({
        resolver: yupResolver<any>(validationSchema),
    });

    const { brands, types } = useProducts();

    const watchFile = watch("file", null); // watch from useForm allow us to observe the field with name='file', having an inti value of null

    useEffect(() => {
        if (product && !watchFile && !isDirty) reset(product); // isDirty and watch are added to avoid endless loop of useEffect and watxhFile as its dependency

        // cleanup function to remove the attached watch when this component unmount not to remain a memory leak
        return () => {
            if (watchFile) URL.revokeObjectURL(watchFile.preview);
        };
    }, [product, reset, watchFile, isDirty]);

    async function handleSubmitData(data: FieldValues) {
        try {
            let resp: Product;
            if (product) {
                resp = await agent.Admin.updateProduct(data);
            } else {
                resp = await agent.Admin.createProduct(data);
            }
            console.log(resp);
            //update our catalogue state
            dispatch(setProduct());
            cancelEdit();
        } catch (err) {
            console.log(err);
        }
    }

    return (
        <Box component={Paper} sx={{ p: 4 }}>
            <Typography variant="h4" gutterBottom sx={{ mb: 4 }}>
                Product Details
            </Typography>
            <form onSubmit={handleSubmit(handleSubmitData)}>
                <Grid container spacing={3}>
                    <Grid item xs={12} sm={12}>
                        <AppTextInput control={control} name="name" label="Product name" />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <AppSelectList control={control} name="brand" label="Brand" items={brands} />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <AppSelectList control={control} name="type" label="Type" items={types} />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <AppTextInput control={control} name="price" label="Price" type="number" />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <AppTextInput
                            control={control}
                            name="quantityInStock"
                            label="Quantity in Stock"
                            type="number"
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <AppTextInput
                            control={control}
                            name="description"
                            label="Description"
                            multiline={true}
                            rows={4}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <Box display={"flex"} justifyContent={"space-between"} alignItems="center">
                            {/* name="file" because this is what we expect in the productDto */}
                            <AppDropzone control={control} name="file" />
                            {watchFile ? (
                                <img src={watchFile.preview} alt="preview" style={{ maxHeight: 200 }} />
                            ) : (
                                <img
                                    src={product?.pictureUrl}
                                    alt={product?.name}
                                    style={{ maxHeight: 200 }}
                                />
                            )}
                        </Box>
                    </Grid>
                </Grid>
                <Box display="flex" justifyContent="space-between" sx={{ mt: 3 }}>
                    <Button onClick={cancelEdit} variant="contained" color="inherit">
                        Cancel
                    </Button>
                    <LoadingButton loading={isSubmitting} type="submit" variant="contained" color="success">
                        Submit
                    </LoadingButton>
                </Box>
            </form>
        </Box>
    );
}
