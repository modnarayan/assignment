export const saveFormData = (data: Record<string, any>) => {
  if (typeof window === "undefined") return;
  localStorage.setItem("signupFormData", JSON.stringify(data));
};

export const loadFormData = (): Record<string, any> | null => {
  if (typeof window === "undefined") return null;
  const data = localStorage.getItem("signupFormData");
  return data ? JSON.parse(data) : null;
};
