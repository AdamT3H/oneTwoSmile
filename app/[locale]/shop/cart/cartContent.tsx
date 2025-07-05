"use client";
import styles from "./page.module.css";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { supabase } from "@/lib/supabase.js";
import dynamic from "next/dynamic";
import { useTranslation } from "react-i18next";

const OblastSelect = dynamic(() => import("./OblastSelect.tsx"), {
  ssr: false,
});

const CitySelect = dynamic(() => import("./CitySelect.tsx"), {
  ssr: false,
});

const WarehouseSelect = dynamic(() => import("./WareHouseSelect.tsx"), {
  ssr: false,
});

const WayForPayElem = dynamic(() => import("./WayForPayElem.tsx"), {
  ssr: false,
});

const NotWayForPayElem = dynamic(() => import("./NotWayForPayElem.tsx"), {
  ssr: false,
});

interface Product {
  id: number;
  title: string;
  main_image_url: string;
  price: number;
  in_stock: boolean;
  quantity: number;
}

interface RawSupabaseProduct {
  id: number;
  price: number;
  main_image_url: string;
  in_stock: boolean;
  product_translations: {
    title: string;
    language_code: string;
  }[];
}

export default function CartContent({ locale }: { locale: string }) {
  const [cartedItems, setCartedItems] = useState<Product[]>([]);
  const [deliveryType, setDeliveryType] = useState("nova_poshta");
  const [paymentType, setPaymentType] = useState("card");
  const [totalPrice, setTotalPrice] = useState<number>(0);
  const [errorMessage] = useState("");

  const [oblastRef, setOblastRef] = useState<string | null>(null);
  const [oblastName, setOblastName] = useState<string | null>(null);
  const [selectedCity, setSelectedCity] = useState<{
    value: string;
    label: string;
  } | null>(null);

  const [selectedWarehouse, setSelectedWarehouse] = useState<{
    value: string;
    label: string;
  } | null>(null);

  const [lastName, setLastName] = useState("");
  const [firstName, setFirstName] = useState("");
  const [middleName, setMiddleName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [comment, setComment] = useState("");

  const { t } = useTranslation(["cartPage", "WayForPay"]);

  useEffect(() => {
    const total = cartedItems.reduce((sum, item) => {
      return sum + item.price * item.quantity;
    }, 0);
    setTotalPrice(total);
  }, [cartedItems]);

  useEffect(() => {
    const fetchCartedItems = async () => {
      const stored = localStorage.getItem("cartedProducts");
      if (!stored) return;

      try {
        const cartedData: { id: number; quantity: number }[] =
          JSON.parse(stored);
        if (Array.isArray(cartedData) && cartedData.length > 0) {
          const cartedIDs = cartedData.map((item) => item.id);

          const { data, error } = await supabase
            .from("products")
            .select(`
              id,
              price,
              main_image_url,
              category_id,
              in_stock,
              product_translations:product_translations_product_id_fkey (
                title,
                language_code
              )
            `)
            .in("id", cartedIDs)
            .filter("product_translations.language_code", "eq", locale);

          if (!error && data) {
            const mapped = (data || []).map((item: RawSupabaseProduct) => {
              const match = cartedData.find((p) => p.id === item.id);
            
              return {
                id: item.id,
                price: item.price,
                main_image_url: item.main_image_url,
                in_stock: item.in_stock,
                title: item.product_translations?.[0]?.title || "",
                quantity: match?.quantity ?? 1,
              };
            });

            setCartedItems(mapped);
          } else {
            console.error("Error fetching carted products:", error);
          }
        } else {
          setCartedItems([]);
        }
      } catch (err) {
        console.error("Failed to parse carted products:", err);
      }
    };

    fetchCartedItems();
  }, [locale]);

  const handleRemove = (id: number) => {
    const stored = localStorage.getItem("cartedProducts");
    if (!stored) return;

    try {
      const cartedItems: { id: number; quantity: number }[] =
        JSON.parse(stored);
      const updatedItems = cartedItems.filter((item) => item.id !== id);

      localStorage.setItem("cartedProducts", JSON.stringify(updatedItems));

      setCartedItems((prevItems) => prevItems.filter((item) => item.id !== id));

      
      window.dispatchEvent(new Event("storage"));
    } catch (err) {
      console.error("Помилка при видаленні товару з корзини:", err);
    }
  };

  const handleQuantityChange = (id: number, change: number) => {
    setCartedItems((prevItems) => {
      const updatedItems = prevItems.map((item) => {
        if (item.id === id) {
          if (!item.in_stock) return item;
  
          const newQuantity = item.quantity + change;
          const clampedQuantity = Math.max(1, newQuantity);
  
          return { ...item, quantity: clampedQuantity };
        }
        return item;
      });
  
      return updatedItems;
    });
  };

  const saveCartToLocalStorage = (items: Product[]) => {
    const cartToStore = items.map((item) => ({
      id: item.id,
      quantity: item.quantity,
    }));
    localStorage.setItem("cartedProducts", JSON.stringify(cartToStore));

    window.dispatchEvent(new Event("storage"));
  };

  const handleLettersOnly = (e: React.FormEvent<HTMLInputElement>) => {
    const input = e.currentTarget;
    input.value = input.value.replace(/[^а-яА-Яіїєґa-zA-Z]/g, "");
  };

  const handlePhoneInput = (e: React.FormEvent<HTMLInputElement>) => {
    const input = e.currentTarget;
    input.value = input.value.replace(/(?!^\+)[^\d]/g, "");
  };

  const handleEmailInput = (e: React.FormEvent<HTMLInputElement>) => {
    const input = e.currentTarget;
    const email = input.value;

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      input.setCustomValidity("Введіть коректну електронну адресу");
    } else {
      input.setCustomValidity("");
    }
  };

  useEffect(() => {
    saveCartToLocalStorage(cartedItems);
  }, [cartedItems]);

  return (
    <div className="w-full">
      <div className="w-full flex flex-col justify-center">
        <div className={styles.container}>
          <div className={styles.cartedItems}>
            <div className={styles.titleWrapper}>
              <div className={styles.title}>{t("cart")}</div>
              <div className={styles.total}>
                {t("total")}:{" "}
                <div className={styles.totalPrice}>{totalPrice}₴</div>
              </div>
            </div>

            <div className={styles.actyalCart}>
              {cartedItems.map((cartedProduct) => (
                <div key={cartedProduct.id} className={styles.productItem}>
                  <Link href={`/shop/product/${cartedProduct.id}`}>
                    <Image
                      src={cartedProduct.main_image_url}
                      alt={cartedProduct.title}
                      width={110}
                      height={110}
                      className={styles.productImage}
                    />
                  </Link>
                  <div className={styles.productInfo}>
                    <p className={styles.productTitle}>
                      <Link href={`/shop/product/${cartedProduct.id}`}>
                        {cartedProduct.title}
                      </Link>
                    </p>
                    <p className={styles.productPrice}>
                      {cartedProduct.price} ₴
                    </p>
                    <div className={styles.quantityControl}>
                      <button
                        className={styles.quantityButton}
                        onClick={() =>
                          handleQuantityChange(cartedProduct.id, -1)
                        }
                      >
                        -
                      </button>
                      <span className={styles.quantity}>
                        {cartedProduct.quantity}
                      </span>
                      <button
                        className={styles.quantityButton}
                        onClick={() =>
                          handleQuantityChange(cartedProduct.id, 1)
                        }
                      >
                        +
                      </button>
                    </div>
                    <button
                      className={styles.deleteButton}
                      onClick={() => handleRemove(cartedProduct.id)}
                    >
                      {t("delete")}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className={styles.containerDost}>
          <div className={styles.cartedItems}>
            <div className={styles.titleWrapper}>
              <div className={styles.title}>{t("delivery")}</div>
            </div>
            <div className={styles.personalInfoWrapper}>
              <div className={styles.typeOfDelivery}>
                <p className={styles.note}>{t("delivery_note")}</p>
                <div className={styles.typeOfDelivery}>
                  <div className={styles.typeOfDeliveryWrapper}>
                    <label className={styles.customRadio}>
                      <input
                        type="radio"
                        name="delivery"
                        value="nova_poshta"
                        checked={deliveryType === "nova_poshta"}
                        onChange={() => setDeliveryType("nova_poshta")}
                      />
                      <span className={styles.radioMark}></span>
                      {t("nova_poshta")}
                    </label>
                    <label className={styles.customRadio}>
                      <input
                        type="radio"
                        name="delivery"
                        value="pickup"
                        checked={deliveryType === "pickup"}
                        onChange={() => setDeliveryType("pickup")}
                      />
                      <span className={styles.radioMark}></span>
                      {t("pickup")}
                    </label>
                  </div>
                </div>
              </div>

              <div className={styles.personalInfo}>
                {deliveryType === "nova_poshta" ? (
                  <>
                    <div className={styles.personalInfoNameWrapper}>
                      <input
                        type="text"
                        placeholder={t("lastname")}
                        className={styles.inputField}
                        onInput={handleLettersOnly}
                        onChange={(e) => setLastName(e.target.value)}
                      />
                      <input
                        type="text"
                        placeholder={t("firstname")}
                        className={styles.inputField}
                        onInput={handleLettersOnly}
                        onChange={(e) => setFirstName(e.target.value)}
                      />
                      <input
                        type="text"
                        placeholder={t("middlename")}
                        className={styles.inputField}
                        onInput={handleLettersOnly}
                        onChange={(e) => setMiddleName(e.target.value)}
                      />
                    </div>

                    <div className={styles.personalInfoNamberWrapper}>
                      <input
                        type="tel"
                        placeholder="+380 (__) ___ __ __"
                        className={styles.inputField}
                        onInput={handlePhoneInput}
                        onChange={(e) => setPhone(e.target.value)}
                      />

                      <input
                        type="email"
                        placeholder={t("email")}
                        className={styles.inputField}
                        onInput={handleEmailInput}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                    </div>
                    <p className={styles.noteNP}>{t("np_note")}</p>
                    <div className={styles.novaWrapper}>
                      <OblastSelect
                        locale={locale}
                        onChange={({ ref, name }) => {
                          setOblastRef(ref);
                          setOblastName(name);
                        }}
                      />
                      <CitySelect
                        locale={locale}
                        oblastRef={oblastRef}
                        onChange={setSelectedCity}
                      />
                      <WarehouseSelect
                        locale={locale}
                        nameCity={selectedCity?.label ?? ""}
                        onChange={setSelectedWarehouse}
                      />
                    </div>
                  </>
                ) : (
                  <>
                    <div className={styles.personalInfoNameWrapper}>
                      <input
                        type="text"
                        placeholder={t("lastname")}
                        className={styles.inputField}
                        onInput={handleLettersOnly}
                        onChange={(e) => setLastName(e.target.value)}
                      />
                      <input
                        type="text"
                        placeholder={t("firstname")}
                        className={styles.inputField}
                        onInput={handleLettersOnly}
                        onChange={(e) => setFirstName(e.target.value)}
                      />
                      <input
                        type="text"
                        placeholder={t("middlename")}
                        className={styles.inputField}
                        onInput={handleLettersOnly}
                        onChange={(e) => setMiddleName(e.target.value)}
                      />
                    </div>

                    <div className={styles.personalInfoNamberWrapper}>
                      <input
                        type="tel"
                        placeholder="+380 (__) ___ __ __"
                        className={styles.inputField}
                        onInput={handlePhoneInput}
                        onChange={(e) => setPhone(e.target.value)}
                      />

                      <input
                        type="email"
                        placeholder={t("email")}
                        className={styles.inputField}
                        onInput={handleEmailInput}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                    </div>

                    <div className={styles.containerSelf}>
                      <p>{t("pickup_location_note")} </p>
                      <Link
                        className={styles.location}
                        href={"https://maps.app.goo.gl/LZ2czQejsunVQqNA8"}
                      >
                        {t("pickup_location_address")}
                      </Link>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className={styles.containerComment}>
          <div className={styles.titleWrapper}>
            <div className={styles.title}>{t("comment")}</div>
          </div>

          <input
            type="text"
            placeholder={t("comment_placeholder")}
            className={styles.inputFieldComment}
            onChange={(e) => setComment(e.target.value)}
          />
        </div>

        <div className={styles.containerPayment}>
          <div className={styles.titleWrapper}>
            <div className={styles.title}>{t("payment")}</div>
          </div>

          {errorMessage && (
            <div className="text-red-500 text-sm mt-2 text-center">
              {errorMessage}
            </div>
          )}

          <div className={styles.paymentWrapper}>
            <div className={styles.typeOfDelivery}>
              <div className={styles.typeOfDelivery}>
                <div className={styles.typeOfDeliveryWrapper}>
                  <label className={styles.customRadio}>
                    <input
                      type="radio"
                      name="pay"
                      value="card"
                      checked={paymentType === "card"}
                      onChange={() => setPaymentType("card")}
                    />
                    <span className={styles.radioMark}></span>
                    {t("payment_card")}
                  </label>
                  <label className={styles.customRadio}>
                    <input
                      type="radio"
                      name="pay"
                      value="paper"
                      checked={paymentType === "paper"}
                      onChange={() => setPaymentType("paper")}
                    />
                    <span className={styles.radioMark}></span>
                    {t("payment_cash")}
                  </label>
                </div>
              </div>
            </div>
          </div>

          {paymentType === "card" && (
            <WayForPayElem
              totalPrice={totalPrice}
              items={cartedItems.map((item) => ({
                name: item.title,
                count: item.quantity,
                price: item.price,
                id: item.id,
                inStock: item.in_stock,
              }))}
              lastName={lastName}
              firstName={firstName}
              middleName={middleName}
              phone={phone}
              paymentType={paymentType}
              comment={comment}
              email={email}
              deliveryType={deliveryType}
              oblastName={oblastName}
              selectedCity={selectedCity}
              selectedWarehouse={selectedWarehouse}
              t={t}
            />
          )}

          {paymentType === "paper" && (
            <div className={styles.paperDetails}>
              <p>{t("cash_payment_note")}</p>
              <NotWayForPayElem
                totalPrice={totalPrice}
                items={cartedItems.map((item) => ({
                  name: item.title,
                  count: item.quantity,
                  price: item.price,
                  id: item.id,
                  inStock: item.in_stock,
                }))}
                lastName={lastName}
                firstName={firstName}
                middleName={middleName}
                phone={phone}
                paymentType={paymentType}
                comment={comment}
                email={email}
                deliveryType={deliveryType}
                oblastName={oblastName}
                selectedCity={selectedCity}
                selectedWarehouse={selectedWarehouse}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
