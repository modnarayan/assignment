"use client";
import { Box, Button, Stack, Typography } from "@mui/material";
import { TextField } from "./fields/TextField";
import { SelectField } from "./fields/SelectField";
import { RadioField } from "./fields/RadioField";
import { useDynamicForm } from "./useDynamicForm";
import { FormField } from "@/types/form.types";

interface Props {
  fields: FormField[];
}

const fieldMap = {
  TEXT: TextField,
  LIST: SelectField,
  RADIO: RadioField,
};

export const DynamicForm = ({ fields }: Props) => {
  const { register, handleSubmit, errors, onSubmit } = useDynamicForm(fields);

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
      <Stack spacing={3} maxWidth={500} mx="auto">
        <Typography variant="h5" component="h1" gutterBottom>
          Dynamic Signup Form
        </Typography>

        {fields.map((field) => {
          const FieldComponent = fieldMap[field.fieldType];
          const error = errors[field.id];

          return (
            <Box key={field.id}>
              <FieldComponent field={field} register={register} error={error} />
            </Box>
          );
        })}

        <Button type="submit" variant="contained" size="large" fullWidth>
          Submit
        </Button>
      </Stack>
    </Box>
  );
};
