"use client";

import Select, { StylesConfig, GroupBase } from "react-select";
import { useEffect, useState } from "react";

interface City {
  Ref: string;
  Description: string;
}

interface Option {
  value: string;
  label: string;
}

interface Props {
  oblastRef: string | null;
  onChange: (option: Option | null) => void;
  locale: string;
}

const placeholderTranslations: Record<"ua" | "en" | "pl", string> = {
  ua: "Місто",
  en: "City",
  pl: "Miasto",
};

const noOptionsTranslations: Record<"ua" | "en" | "pl", { tooShort: string; notFound: string }> = {
  ua: {
    tooShort: "Введіть мінімум 2 літери",
    notFound: "Нічого не знайдено",
  },
  en: {
    tooShort: "Enter at least 2 letters",
    notFound: "Nothing found",
  },
  pl: {
    tooShort: "Wpisz co najmniej 2 litery",
    notFound: "Nic nie znaleziono",
  },
};

const loadingTranslations: Record<"ua" | "en" | "pl", string> = {
  ua: "Завантаження...",
  en: "Loading...",
  pl: "Ładowanie...",
};

export default function CitySelect({ oblastRef, onChange, locale }: Props) {
  const [options, setOptions] = useState<Option[]>([]);
  const [selected, setSelected] = useState<Option | null>(null);
  const [inputValue, setInputValue] = useState("");
  const [loading, setLoading] = useState<boolean>(false);

  const customStyles: StylesConfig<Option, false, GroupBase<Option>> = {
    control: (provided, state) => ({
      ...provided,
      padding: "2px",
      border: "1px solid #ccc",
      borderRadius: "6px",
      backgroundColor: state.isFocused ? "#fff" : "#fcfcfc",
      color: "#333",
      fontSize: "16px",
      boxShadow: "none",
      transition: "border 0.2s ease-in-out, background-color 0.2s",
      "&:hover": {
        borderColor: "#999",
      },
    }),
    placeholder: (provided) => ({
      ...provided,
      color: "#999",
    }),
    menu: (provided) => ({
      ...provided,
      zIndex: 5,
    }),
    loadingMessage: (provided) => ({
      ...provided,
      color: "#999",
    }),
  };

  const getPlaceholder = (): string => {
    return placeholderTranslations[locale as keyof typeof placeholderTranslations] ?? placeholderTranslations.ua;
  };

  const getNoOptionsMessage = (): string => {
    const messages = noOptionsTranslations[locale as keyof typeof noOptionsTranslations] ?? noOptionsTranslations.ua;
    return inputValue.length < 2 ? messages.tooShort : messages.notFound;
  };

  const getLoadingMessage = (): string => {
    return loadingTranslations[locale as keyof typeof loadingTranslations] ?? loadingTranslations.ua;
  };

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (!oblastRef || inputValue.length < 2) return;

      const fetchCities = async () => {
        try {
          setLoading(true);
          const res = await fetch(
            `/api/get_city?RefOblast=${encodeURIComponent(
              oblastRef
            )}&InputByUser_City=${encodeURIComponent(inputValue)}`
          );
          const data = await res.json();
          const cityOptions = data.map((city: City) => ({
            value: city.Ref,
            label: city.Description,
          }));
          setOptions(cityOptions);
        } catch (error) {
          console.error("Помилка при отриманні міст:", error);
        } finally {
          setLoading(false);
        }
      };

      fetchCities();
    }, 400);

    return () => clearTimeout(delayDebounce);
  }, [inputValue, oblastRef]);

  return (
    <div style={{ width: "100%", marginTop: "10px" }}>
      <Select
        id="city-select"
        options={options}
        value={selected}
        onChange={(option) => {
          setSelected(option);
          onChange(option);
        }}
        placeholder={getPlaceholder()}
        isSearchable
        styles={customStyles}
        isDisabled={!oblastRef}
        onInputChange={(value) => setInputValue(value)}
        inputValue={inputValue}
        noOptionsMessage={getNoOptionsMessage}
        loadingMessage={() => (loading ? getLoadingMessage() : null)}
      />
    </div>
  );
}
