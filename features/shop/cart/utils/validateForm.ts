import { ProductPay } from "../types";
import { TFunction } from "i18next";

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

export const validateForm = (
  {
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
  }: ValidateFormParams,
  t: TFunction<"cartPage">
): string | null => {
  if (!lastName || !firstName || !middleName || !phone || !email) {
    return t("validation_required_fields");
  }

  if (deliveryType === "nova_poshta") {
    if (
      !oblastName ||
      !selectedCity ||
      !selectedCity.label ||
      !selectedWarehouse?.label
    ) {
      return t("validation_nova_poshta_incomplete");
    }
  }

  for (const item of items) {
    if (item.inStock === false) {
      return t("validation_out_of_stock", { name: item.name });
    }
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return t("validation_invalid_email");
  }

  return null; 
};
