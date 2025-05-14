// validateForm.ts

interface ValidateFormParams {
    lastName: string;
    firstName: string;
    middleName: string;
    phone: string;
    email: string;
    deliveryType: string;
    oblastRef?: string | null;
    selectedCity?: { label?: string } | null;
  }
  
  export const validateForm = ({
    lastName,
    firstName,
    middleName,
    phone,
    email,
    deliveryType,
    oblastRef,
    selectedCity,
  }: ValidateFormParams): string | null => {
    if (!lastName || !firstName || !middleName || !phone || !email) {
      return "Будь ласка, заповніть усі обов’язкові поля.";
    }
  
    if (deliveryType === "nova_poshta") {
      if (!oblastRef || !selectedCity || !selectedCity.label) {
        return "Будь ласка, заповніть дані Нової Пошти.";
      }
    }
  
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return "Введіть коректну електронну адресу.";
    }
  
    return null; // Усе гаразд
  };
  