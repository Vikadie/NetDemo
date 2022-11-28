import { TextField } from "@mui/material";
import { useController, UseControllerProps } from "react-hook-form";

interface Props extends UseControllerProps { // UseControllerProps contains already the name, required, control props
    label: string;
}

// reusable text field using react-hook-form
export default function AppTextInput(props: Props) {
    const { fieldState, field } = useController({...props, defaultValue: ''})

    return (
        <TextField
            {...props}
            {...field} // contening value, onChange, onBlur events
            fullWidth
            variant="outlined"
            error={!!fieldState.error}
            helperText={fieldState.error?.message}
          />
    )
}