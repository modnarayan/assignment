import { TextField as MuiTextField } from "@mui/material";
import { FormField } from "@/types/form.types";

interface Props {
  field: FormField;
  register: any;
  error?: any;
}

export const TextField = ({ field, register, error }: Props) => (
  <MuiTextField
    {...register(field.id.toString())}
    label={field.name}
    variant="outlined"
    fullWidth
    required={field.required}
    error={!!error}
    helperText={error?.message}
    inputProps={{
      minLength: field.minLength,
      maxLength: field.maxLength,
    }}
  />
);
