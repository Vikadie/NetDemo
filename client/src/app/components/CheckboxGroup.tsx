import { FormGroup, FormControlLabel, Checkbox } from "@mui/material";
import { useState } from "react";

interface Props {
    items: any[];
    checked?: string[];
    onChange: (items: string[]) => void;
}

export function CheckBoxGroup({ items, checked, onChange }: Props) {
    const [checkedItems, setCheckedItems] = useState(checked || []);

    const handleChecked = (value: string) => {
        const currIndex = checkedItems.findIndex((i) => i === value);
        let newCheckedItems: string[] = [];
        if (currIndex === -1) newCheckedItems = [...checkedItems, value];
        else newCheckedItems = checkedItems.filter((i) => i !== value);
        setCheckedItems(newCheckedItems);
        onChange(newCheckedItems);
    };
    return (
        <FormGroup aria-labelledby="brands-filtering-label">
            {items.map((item) => (
                <FormControlLabel
                    key={item}
                    control={
                        <Checkbox checked={checkedItems.includes(item)} onClick={() => handleChecked(item)} />
                    }
                    label={item}
                />
            ))}
        </FormGroup>
    );
}
