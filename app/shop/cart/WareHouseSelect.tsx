"use client";

import Select, { StylesConfig, GroupBase } from "react-select";
import { useEffect, useState } from "react";

interface Warehouse {
  SiteKey: string;
  Description: string;
}

interface Option {
  value: string;
  label: string;
}

interface Props {
  nameCity: string | null;
}

export default function WarehouseSelect({ nameCity }: Props) {
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
    if (!nameCity) return;
  
    const delayDebounce = setTimeout(() => {
      const fetchWarehouses = async () => {
        try {
          setLoading(true);
          const res = await fetch(
            `/api/get_wareHouse?nameCity=${encodeURIComponent(nameCity)}${
              inputValue ? `&InputByUser_House=${encodeURIComponent(inputValue)}` : ""
            }`
          );
  
          if (!res.ok) {
            const text = await res.text();
            console.error("Помилка при отриманні складів:", text);
            return;
          }
  
          const data = await res.json();
          const warehouseOptions = data.map((w: Warehouse) => ({
            value: w.SiteKey,
            label: w.Description,
          }));
  
          setOptions(warehouseOptions);
        } catch (error) {
          console.error("Помилка при отриманні складів:", error);
        } finally {
          setLoading(false);
        }
      };
  
      fetchWarehouses();
    }, 400);
  
    return () => clearTimeout(delayDebounce);
  }, [inputValue, nameCity]);
  

  return (
    <div style={{ width: "100%", marginTop: "10px", position: "relative" }}>
        <Select
        id="warehouse-select"
        options={options}
        value={selected}
        onChange={(option) => setSelected(option)}
        placeholder="Склад"
        isSearchable
        styles={customStyles}
        isDisabled={!nameCity}
        onInputChange={(value) => setInputValue(value)}
        filterOption={(option, inputValue) =>
          option.label.toLowerCase().includes(inputValue.toLowerCase())
        }
        noOptionsMessage={() => "Складів не знайдено"}
        loadingMessage={() => loading ? "Загрузка..." : null}
      />
    </div>
  );
}
