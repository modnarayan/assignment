"use client";

import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { FormField } from "@/types/form.types";
import { saveFormData } from "@/lib/localStorage";

export const useDynamicForm = (fields: FormField[]) => {
  const schema = z.object(
    fields.reduce((acc, field) => {
      let fieldSchema: any = z.any();

      if (field.fieldType === "TEXT") {
        fieldSchema = z.string();
        if (field.minLength) fieldSchema = fieldSchema.min(field.minLength);
        if (field.maxLength) fieldSchema = fieldSchema.max(field.maxLength);
      } else if (field.fieldType === "LIST" || field.fieldType === "RADIO") {
        fieldSchema = z.string();
      }

      if (field.required) {
        fieldSchema = fieldSchema.refine(
          (val: any) => val !== "" && val !== null,
          {
            message: `${field.name} is required`,
          }
        );
      }

      acc[field.id.toString()] = fieldSchema;
      return acc;
    }, {} as Record<string, any>)
  );

  type FormValues = z.infer<typeof schema>;

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: fields.reduce((acc, field) => {
      acc[field.id] = field.defaultValue || "";
      return acc;
    }, {} as Record<string, string>),
  });

  const onSubmit: SubmitHandler<FormValues> = (data) => {
    const formatted = Object.entries(data).reduce((acc, [key, value]) => {
      const field = fields.find((f) => f.id === Number(key));
      acc[field?.name || key] =
        value === undefined || value === null ? "" : String(value);
      return acc;
    }, {} as Record<string, string>);

    saveFormData(formatted);
    alert("Form submitted & saved to localStorage!");
    console.log("Submitted:", formatted);
  };

  return { register, handleSubmit, errors, onSubmit, reset };
};
