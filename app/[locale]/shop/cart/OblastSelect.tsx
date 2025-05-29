"use client";

import Select, { StylesConfig, GroupBase } from "react-select";
import { useEffect, useState } from "react";

interface Oblast {
  Ref: string;
  Description: string;
}

interface Option {
  value: string;
  label: string;
}

interface Props {
  onChange: (value: { ref: string | null; name: string | null }) => void;
  locale: string; 
}

const placeholderTranslations: Record<"ua" | "en" | "pl", string> = {
  ua: "Область",
  en: "Region",
  pl: "Obwód",
};

export default function OblastSelect({ onChange, locale}: Props) {
  const [options, setOptions] = useState<Option[]>([]);
  const [selected, setSelected] = useState<Option | null>(null);
  const [inputValue, setInputValue] = useState<string>("");

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

  const getPlaceholder = (locale: string): string => {
    const supportedLocales: (keyof typeof placeholderTranslations)[] = ["ua", "en", "pl"];
    if (supportedLocales.includes(locale as keyof typeof placeholderTranslations)) {
      return placeholderTranslations[locale as "ua" | "en" | "pl"];
    }
    return placeholderTranslations.ua;
  };

  useEffect(() => {
    const fetchOblasts = async () => {
      try {
        const res = await fetch("/api/get_oblast");
        const data = await res.json();
        const oblastOptions = data.map((oblast: Oblast) => ({
          value: oblast.Ref,
          label: oblast.Description,
        }));
        setOptions(oblastOptions);
      } catch (error) {
        console.error("Помилка при отриманні областей:", error);
      }
    };

    fetchOblasts();
  }, []);

  return (
    <div style={{ width: "100%", marginTop: "10px" }}>
        <Select
          id="oblast-select"
          options={options}
          value={selected}
          onChange={(option) => {
            setSelected(option);
            onChange(option ? { ref: option.value, name: option.label } : { ref: null, name: null });
          }}
          placeholder={getPlaceholder(locale)}
          isSearchable
          styles={customStyles}
          onInputChange={(value) => setInputValue(value)}
          inputValue={inputValue} 
        />
    </div>
  );
}
