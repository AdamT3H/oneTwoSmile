interface ProductPay {
  name: string;
  count: number;
  price: number;
  id: number;
  inStock: boolean;
}

interface ValidateFormParams {
  lastName: string;
  firstName: string;
  middleName: string;
  phone: string;
  email: string;
  deliveryType: string;
  oblastName?: string | null;
  selectedCity?: { label?: string } | null;
  selectedWarehouse?: { label?: string } | null;
  items: ProductPay[];
}

export const validateForm = ({
  lastName,
  firstName,
  middleName,
  phone,
  email,
  deliveryType,
  oblastName,
  selectedCity,
  selectedWarehouse,
  items
}: ValidateFormParams): string | null => {
  if (!lastName || !firstName || !middleName || !phone || !email) {
    return "Будь ласка, заповніть усі обов’язкові поля.";
  }

  if (deliveryType === "nova_poshta") {
    if (
      !oblastName ||
      !selectedCity ||
      !selectedCity.label ||
      !selectedWarehouse?.label
    ) {
      return "Будь ласка, заповніть дані Нової Пошти.";
    }
  }

  for (const item of items) {
    if (item.inStock === false) {
      return `На складі недостатньо товару "${item.name}". Товару немає на складі`;
    }
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return "Введіть коректну електронну адресу.";
  }

  return null; 
};
