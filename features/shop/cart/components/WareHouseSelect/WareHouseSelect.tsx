"use client";

import Select, { StylesConfig, GroupBase } from "react-select";
import { useEffect, useState } from "react";
import { SelectOption, selectStyles } from "../../utils/selectStyles";
import { getLocalizedText, warehousePlaceholder, noOptionsMessage, loadingMessage } from "../../utils/selectTranslations";

interface Warehouse {
  SiteKey: string;
  Description: string;
}

type Props = {
  nameCity: string | null;
  onChange: (option: { value: string; label: string } | null) => void;
  locale: string;
};

export default function WarehouseSelect({ nameCity, onChange, locale }: Props) {
  const [options, setOptions] = useState<SelectOption[]>([]);
  const [selected, setSelected] = useState<SelectOption | null>(null);
  const [inputValue, setInputValue] = useState("");
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (!nameCity) {
      setLoading(false);
      setOptions([]);
      return;
    }
  
    setLoading(true);
  
    const controller = new AbortController();
  
    const delayDebounce = setTimeout(async () => {
      try {
        const res = await fetch(
          `/api/get_wareHouse?nameCity=${encodeURIComponent(nameCity)}${
            inputValue
              ? `&InputByUser_House=${encodeURIComponent(inputValue)}`
              : ""
          }`,
          {
            signal: controller.signal,
          }
        );
  
        if (!res.ok) {
          const text = await res.text();
          console.error("Помилка при отриманні складів:", text);
          setOptions([]);
          return;
        }
  
        const data = await res.json();
  
        const warehouseOptions = data.map((w: Warehouse) => ({
          value: w.SiteKey,
          label: w.Description,
        }));
  
        setOptions(warehouseOptions);
      } catch (error) {
        if (error instanceof DOMException && error.name === "AbortError") {
          return;
        }
  
        console.error("Помилка при отриманні складів:", error);
        setOptions([]);
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }, 300);
  
    return () => {
      clearTimeout(delayDebounce);
      controller.abort();
    };
  }, [inputValue, nameCity]);
  

  return (
    <div style={{ width: "100%", marginTop: "10px", position: "relative" }}>
      <Select
        id="warehouse-select"
        options={options}
        value={selected}
        onChange={(option) => {
          setSelected(option);
          onChange(option);
        }}
        placeholder={getLocalizedText(warehousePlaceholder, locale)}
        isSearchable
        styles={selectStyles}
        isDisabled={!nameCity}
        onInputChange={(value) => setInputValue(value)}
        // filterOption={(option, inputValue) =>
        //   option.label.toLowerCase().includes(inputValue.toLowerCase())
        // }
        noOptionsMessage={() => getLocalizedText(noOptionsMessage, locale)}
        isLoading={loading}
        loadingMessage={() => getLocalizedText(loadingMessage, locale)}
      />
    </div>
  );
}
