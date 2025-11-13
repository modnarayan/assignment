import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
} from "@mui/material";
import { FormField } from "@/types/form.types";

interface Props {
  field: FormField;
  register: any;
  error?: any;
}

export const SelectField = ({ field, register, error }: Props) => (
  <FormControl fullWidth error={!!error} required={field.required}>
    <InputLabel>{field.name}</InputLabel>
    <Select
      {...register(field.id.toString())}
      label={field.name}
      defaultValue={field.defaultValue || ""}
    >
      {field.listOfValues1?.map((opt, i) => (
        <MenuItem key={i} value={opt}>
          {opt}
        </MenuItem>
      ))}
    </Select>
    {error && <FormHelperText>{error.message}</FormHelperText>}
  </FormControl>
);
