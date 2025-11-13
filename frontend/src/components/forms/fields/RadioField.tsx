import {
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  FormHelperText,
} from "@mui/material";
import { FormField } from "@/types/form.types";

interface Props {
  field: FormField;
  register: any;
  error?: any;
}

export const RadioField = ({ field, register, error }: Props) => (
  <FormControl error={!!error} required={field.required}>
    <FormLabel>{field.name}</FormLabel>
    <RadioGroup
      {...register(field.id.toString())}
      defaultValue={field.defaultValue || ""}
    >
      {field.listOfValues1?.map((opt) => (
        <FormControlLabel
          key={opt}
          value={opt}
          control={<Radio />}
          label={opt}
        />
      ))}
    </RadioGroup>
    {error && <FormHelperText>{error.message}</FormHelperText>}
  </FormControl>
);
