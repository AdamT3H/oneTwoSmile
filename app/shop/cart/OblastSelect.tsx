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
  }

export default function OblastSelect({ onChange }: Props) {
  const [options, setOptions] = useState<Option[]>([]);
  const [selected, setSelected] = useState<Option | null>(null);
//   const [loading, setLoading] = useState<boolean>(false);
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

  useEffect(() => {
    const fetchOblasts = async () => {
      try {
        // setLoading(true); 
        const res = await fetch("/api/get_oblast");
        const data = await res.json();
        const oblastOptions = data.map((oblast: Oblast) => ({
          value: oblast.Ref,
          label: oblast.Description,
        }));
        setOptions(oblastOptions);
      } catch (error) {
        console.error("Помилка при отриманні областей:", error);
      } finally {
        // setLoading(false);
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
          placeholder="Область"
          isSearchable
          styles={customStyles}
          onInputChange={(value) => setInputValue(value)} // Зберігаємо введений текст
          inputValue={inputValue} // Встановлюємо введене значення після завантаження
        />
    </div>
  );
}
