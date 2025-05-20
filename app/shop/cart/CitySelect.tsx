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
}

export default function CitySelect({ oblastRef, onChange }: Props) {
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
          placeholder="Місто"
          isSearchable
          styles={customStyles}
          isDisabled={!oblastRef}
          onInputChange={(value) => setInputValue(value)} 
          inputValue={inputValue} 
          noOptionsMessage={() =>
            inputValue.length < 2
              ? "Введіть мінімум 2 літери"
              : "Нічого не знайдено"
          }
          loadingMessage={() => loading ? "Загрузка..." : null}
        />
    </div>
  );
}
