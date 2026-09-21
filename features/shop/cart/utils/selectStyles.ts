import { StylesConfig, GroupBase } from "react-select";

export interface SelectOption {
  value: string;
  label: string;
}

export const selectStyles: StylesConfig<SelectOption, false, GroupBase<SelectOption>> = {
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
    "&:hover": { borderColor: "#999" },
  }),
  placeholder: (provided) => ({ ...provided, color: "#999" }),
  menu: (provided) => ({ ...provided, zIndex: 5 }),
  loadingMessage: (provided) => ({ ...provided, color: "#999" }),
};