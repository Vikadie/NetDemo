import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import { UseControllerProps, useController } from "react-hook-form";
import { FormHelperText } from "@mui/material";

interface Props extends UseControllerProps {
    label: string;
    items: string[];
}

const AppSelectList = (props: Props) => {
    const { fieldState, field } = useController({ ...props, defaultValue: "" });

    return (
        <FormControl fullWidth error={!!fieldState.error}>
            <InputLabel>{props.label}</InputLabel>
            <Select value={field.value} label={props.label} onChange={field.onChange}>
                {props.items.map((item, index) => (
                    <MenuItem key={index} value={item}>
                        {item}
                    </MenuItem>
                ))}
            </Select>
            <FormHelperText>{fieldState.error?.message}</FormHelperText>
        </FormControl>
    );
};

export default AppSelectList;
