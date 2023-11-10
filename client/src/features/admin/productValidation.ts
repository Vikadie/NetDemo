import * as yup from "yup";

export const validationSchema = yup.object({
    name: yup.string().required(),
    brand: yup.string().required(),
    type: yup.string().required(),
    price: yup.number().required().moreThan(100),
    quantityInStock: yup.number().required().min(0),
    description: yup.string().required(),
    file: yup.mixed().when("pictureUrl", {
        // when there is a field pictuUrl
        is: (value: string) => !value, // with empty value (!"" === true)
        then: (schema) => schema.required("Please provide an image"),
        otherwise: (schema) => schema.notRequired(),
    }),
});
