"use client";
import styles from "./LikeDrawer.module.css";
import LikeDrawerContext from "./LikeDrawerContext";
import TranslationsProvider from "@/components/TranslationsProvider";
import { Resource } from "i18next";

export default function LikeDrawer({
  resources,
  locale,
  isOpen,
  onClose,
}: {
  resources: Resource;
  locale: string;
  isOpen: boolean;
  onClose: () => void;
}) {
  return (
    <div className={styles.container}>
      <TranslationsProvider resources={resources} locale={locale} namespaces={["like"]}>
        <LikeDrawerContext isOpen={isOpen} onClose={onClose} locale={locale} />
      </TranslationsProvider>
    </div>
  );
}