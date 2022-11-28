import * as yup from "yup";

export const validationSchema = [
    yup.object({
        // object name should be exactly as in the form
        fullName: yup.string().required("Full name is required"),
        address1: yup.string().required("Address line 1 is required"),
        address2: yup.string().required("Address line 2 is required"),
        city: yup.string().required("City is required"),
        state: yup.string().required("State/Province/Region is required"),
        zip: yup.string().required("Zip / Postal code is required"),
        country: yup.string().required("Country is required"),
    }), // AddressForm
    yup.object(), // Review component
    yup.object({
        nameOnCard: yup.string().required()
    })
];
