"use client";

import styles from "./CartContent.module.css";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import dynamic from "next/dynamic";
import { useTranslation } from "react-i18next";
import { CartItem } from "../../types";
import { getCartedItems } from "../../services/getCartedItems";
import { useCartedProducts } from "@/features/shop/hooks/useCartedProducts";

const OblastSelect = dynamic(() => import("@/features/shop/cart/components/OblastSelect/OblastSelect"), { ssr: false });
const CitySelect = dynamic(() => import("@/features/shop/cart/components/CitySelect/CitySelect"), { ssr: false });
const WarehouseSelect = dynamic(() => import("@/features/shop/cart/components/WareHouseSelect/WareHouseSelect"), { ssr: false });
const WayForPayElem = dynamic(() => import("@/features/shop/cart/components/WayForPayElem/WayForPayElem"), { ssr: false });
const NotWayForPayElem = dynamic(() => import("@/features/shop/cart/components/NotWayForPayElem/NotWayForPayElem"), { ssr: false });

export default function CartContent({ locale }: { locale: string }) {
  const [displayItems, setDisplayItems] = useState<CartItem[]>([]);
  const [deliveryType, setDeliveryType] = useState("nova_poshta");
  const [paymentType, setPaymentType] = useState("card");
  const [totalPrice, setTotalPrice] = useState<number>(0);


  const { cartedProducts, removeFromCart, updateQuantity } = useCartedProducts();

  const [oblastRef, setOblastRef] = useState<string | null>(null);
  const [oblastName, setOblastName] = useState<string | null>(null);
  const [selectedCity, setSelectedCity] = useState<{value: string; label: string} | null>(null);
  const [selectedWarehouse, setSelectedWarehouse] = useState<{value: string; label: string} | null>(null);

  const [lastName, setLastName] = useState("");
  const [firstName, setFirstName] = useState("");
  const [middleName, setMiddleName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [comment, setComment] = useState("");

  const { t } = useTranslation(["cartPage", "WayForPay"]);

  useEffect(() => {
    getCartedItems(locale).then(setDisplayItems);
  }, [locale, cartedProducts]);

  useEffect(() => {
    const total = displayItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    setTotalPrice(total);
  }, [displayItems]);

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

  return (
    <div className="w-full">
      <div
        className="w-full"
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
        }}
      >
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
              {displayItems.map((cartedProduct) => (
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
                        onClick={() => updateQuantity(cartedProduct.id, Math.max(1, cartedProduct.quantity - 1))}
                      >
                        -
                      </button>
                      <span className={styles.quantity}>
                        {cartedProduct.quantity}
                      </span>
                      <button
                        className={styles.quantityButton}
                        onClick={() => updateQuantity(cartedProduct.id, cartedProduct.quantity + 1)}
                      >
                        +
                      </button>
                    </div>
                    <button
                      className={styles.deleteButton}
                      onClick={() => removeFromCart(cartedProduct.id)}
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
              items={displayItems.map((item) => ({
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
          )}

          {paymentType === "paper" && (
            <div className={styles.paperDetails}>
              <p>{t("cash_payment_note")}</p>
              <NotWayForPayElem
                totalPrice={totalPrice}
                items={displayItems.map((item) => ({
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
