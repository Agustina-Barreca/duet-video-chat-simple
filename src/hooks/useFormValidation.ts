
import { useState } from "react";

export const useFormValidation = () => {
  const [formErrors, setFormErrors] = useState<{[key: string]: string}>({});

  const validateForm = (name: string) => {
    const errors: {[key: string]: string} = {};
    
    if (!name.trim()) {
      errors.name = 'El nombre es obligatorio';
    } else if (name.trim().length < 2) {
      errors.name = 'El nombre debe tener al menos 2 caracteres';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const clearError = (field: string) => {
    if (formErrors[field]) {
      setFormErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return {
    formErrors,
    validateForm,
    clearError,
    setFormErrors
  };
};
