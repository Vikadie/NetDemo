import { TextField } from "@mui/material";
import { useController, UseControllerProps } from "react-hook-form";

interface Props extends UseControllerProps {
    // UseControllerProps contains already the name, required, control props
    label: string;
    multiline?: boolean;
    rows?: number;
    type?: string;
}

// reusable text field using react-hook-form
export default function AppTextInput(props: Props) {
    const { fieldState, field } = useController({ ...props, defaultValue: "" });

    return (
        <TextField
            {...props} // multiline, rows and type are here inside, no need to write them additionally as they generally exist on input element
            {...field} // contening value, onChange, onBlur events
            fullWidth
            variant="outlined"
            error={!!fieldState.error}
            helperText={fieldState.error?.message}
        />
    );
}
