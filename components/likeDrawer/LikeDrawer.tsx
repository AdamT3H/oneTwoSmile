"use client";
import styles from "./LikeDrawer.module.css";
import LikeDrawerContext from "./LikeDrawerContext";
import TranslationsProvider from "@/components/TranslationsProvider.js";

interface I18nResources {
  [namespace: string]: {
    [key: string]: string | Record<string, string>;
  };
}

export default function LikeDrawer({
  resources,
  locale,
  isOpen,
  onClose,
}: {
  resources: I18nResources;
  locale: string;
  isOpen: boolean;
  onClose: () => void;
}) {
  return (
    <div className={styles.container}>
      <TranslationsProvider
        resources={resources}
        locale={locale}
        namespaces={["like"]}
      >
        <LikeDrawerContext isOpen={isOpen} onClose={onClose} locale={locale} />
      </TranslationsProvider>
    </div>
  );
}
