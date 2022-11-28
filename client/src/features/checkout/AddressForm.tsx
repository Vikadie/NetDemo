import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import { useFormContext } from "react-hook-form";
import AppTextInput from "../../app/components/AppTextInput";
import AppCheckBox from "../../app/components/AppCheckBox";

export default function AddressForm() {
    const { control, formState } = useFormContext(); // to store our controls in the form context, to remember the states between different components inside the <FormProvider>
    // formState is needed 
    // name of AppTextIput should correspond to these of our API class Address without the capital letter
    return (
        <>
            <Typography variant="h6" gutterBottom>
                Shipping address
            </Typography>
            {/* no need for form here, it is inside the CheckOutPage */}
            <Grid container spacing={3}>
                <Grid item xs={12} sm={12}>
                    <AppTextInput control={control} name="fullName" label="Full name" />
                </Grid>

                <Grid item xs={12}>
                    <AppTextInput control={control} name="address1" label="Address line 1" />
                </Grid>
                <Grid item xs={12}>
                    <AppTextInput control={control} name="address2" label="Address line 2" />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <AppTextInput control={control} name="city" label="City" />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <AppTextInput control={control} label="State/Province/Region" name="state" />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <AppTextInput control={control} name="zip" label="Zip / Postal code" />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <AppTextInput control={control} name="country" label="Country" />
                </Grid>
                <Grid item xs={12}>
                    <AppCheckBox
                        disabled={!formState.isDirty}
                        control={control}
                        name="saveAddress"
                        label="Save this as the default address"
                    />
                </Grid>
            </Grid>
        </>
    );
}
