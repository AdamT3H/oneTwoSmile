"use client";

import Select, { StylesConfig, GroupBase } from "react-select";
import { useEffect, useState } from "react";
import { SelectOption, selectStyles } from "../../utils/selectStyles";
import { getLocalizedText, loadingMessage, noOptionsMessage, oblastPlaceholder } from "../../utils/selectTranslations";
import { useTranslation } from "react-i18next";

interface Oblast {
  Ref: string;
  Description: string;
}

interface Props {
  onChange: (value: { ref: string | null; name: string | null }) => void;
  locale: string; 
}

export default function OblastSelect({ onChange, locale}: Props) {
  const [options, setOptions] = useState<SelectOption[]>([]);
  const [selected, setSelected] = useState<SelectOption | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [inputValue, setInputValue] = useState<string>("");
  const { t } = useTranslation("CartPage");

  useEffect(() => {
    const fetchOblasts = async () => {
      setIsLoading(true);
      try {
        const res = await fetch("/api/get_oblast");

        if (!res.ok) {
          throw new Error(
            t("oblast_load_error", { status: res.status })
          );
        }

        const data = await res.json();

        if (!Array.isArray(data)) {
          throw new Error(t("oblast_invalid_response"));
        }

        const oblastOptions = data.map((oblast: Oblast) => ({
          value: oblast.Ref,
          label: oblast.Description,
        }));

        setOptions(oblastOptions);
      } catch (error) {
        console.error(t("oblast_invalid_response"), error);
      } finally {
        setIsLoading(false);
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
          isLoading={isLoading}
          loadingMessage={() => getLocalizedText(loadingMessage, locale)}
          noOptionsMessage={() => getLocalizedText(noOptionsMessage, locale)}
          onChange={(option) => {
            setSelected(option);
            onChange(option ? { ref: option.value, name: option.label } : { ref: null, name: null });
          }}
          placeholder={getLocalizedText(oblastPlaceholder, locale)}
          isSearchable
          styles={selectStyles}
          onInputChange={(value) => setInputValue(value)}
          inputValue={inputValue} 
        />
    </div>
  );
}
