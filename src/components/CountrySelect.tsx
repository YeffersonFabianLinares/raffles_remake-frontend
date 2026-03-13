import { Autocomplete, TextField } from "@mui/material";
import { countries } from "../constants/countries";

interface Props {
    value: string | null;
    onChange: (dial: string) => void;
}

export default function CountrySelect({ value, onChange }: Props) {
    return (
        <Autocomplete
            options={countries}
            getOptionLabel={(option) => `${option.flag} ${option.name} (${option.dial})`}
            onChange={(_, newValue) => {
                if (newValue) onChange(newValue.dial);
            }}
            renderInput={(params) => (
                <TextField {...params} label="País" />
            )}
            renderOption={(props, option) => (
                <li {...props}>
                    <span style={{ fontSize: 20, marginRight: 10 }}>{option.flag}</span>
                    {option.name} ({option.dial})
                </li>
            )}
        />
    );
}