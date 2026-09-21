"use client";

import Select from "react-select";
import { useEffect, useState } from "react";
import { SelectOption, selectStyles } from "../../utils/selectStyles";
import { getLocalizedText, cityPlaceholder, getMinLengthMessage, loadingMessage } from "../../utils/selectTranslations";

interface City {
  Ref: string;
  Description: string;
}

interface Props {
  oblastRef: string | null;
  onChange: (option: SelectOption | null) => void;
  locale: string;
}

const MIN_SEARCH_LENGTH = 2;

export default function CitySelect({ oblastRef, onChange, locale }: Props) {
  const [options, setOptions] = useState<SelectOption[]>([]);
  const [selected, setSelected] = useState<SelectOption | null>(null);
  const [inputValue, setInputValue] = useState("");
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {

    if (!oblastRef || inputValue.length < MIN_SEARCH_LENGTH) {
      setLoading(false);
      setOptions([]);
      return;
    }

    const controller = new AbortController();

    setLoading(true);

    const fetchCities = async () => {
      try {
        const res = await fetch(
          `/api/get_city?RefOblast=${encodeURIComponent(
            oblastRef
          )}&InputByUser_City=${encodeURIComponent(inputValue)}`,
          {
            signal: controller.signal,
          }
        );

        if (!res.ok) {
          throw new Error(`HTTP error: ${res.status}`);
        }

        const data = await res.json();

        const cityOptions = data.map((city: City) => ({
          value: city.Ref,
          label: city.Description,
        }));

        setOptions(cityOptions);
      } catch (error) {
        if (error instanceof DOMException && error.name === "AbortError") {
          return;
        }

        console.error("Помилка при отриманні міст:", error);
        setOptions([]);
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    };

    const timer = setTimeout(fetchCities, 500);

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
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
        placeholder={getLocalizedText(cityPlaceholder, locale)}
        isSearchable
        styles={selectStyles}
        isDisabled={!oblastRef}
        onInputChange={(value) => setInputValue(value)}
        inputValue={inputValue}
        noOptionsMessage={() => getMinLengthMessage(locale, inputValue.length, MIN_SEARCH_LENGTH)}
        isLoading={loading}
        loadingMessage={() => getLocalizedText(loadingMessage, locale)}
      />
    </div>
  );
}
