"use client";
import styles from "./CartDrawer.module.css";
import CartDrawerContext from "./CartDrawerContext";
import TranslationsProvider from "@/components/TranslationsProvider.js";

export default function CartDrawer({
  resources,
  locale,
  isOpen,
  onClose,
}: {
  resources: any;
  locale: string;
  isOpen: boolean;
  onClose: () => void;
}) {
  return (
    <div className={styles.container}>
      <TranslationsProvider
        resources={resources}
        locale={locale}
        namespaces={["cart"]}
      >
        <CartDrawerContext isOpen={isOpen} onClose={onClose} />
      </TranslationsProvider>
    </div>
  );
}
