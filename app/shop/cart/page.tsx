"use client";
import styles from "./page.module.css";
import ShopNav from "@/app/components/shopNav/ShopNav";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { supabase } from "@/lib/supabase.js";
import dynamic from "next/dynamic";

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
  in_stock: number;
  quantity: number;
}

export default function Cart() {
  const [cartedItems, setCartedItems] = useState<Product[]>([]);
  // const [isLoading, setIsLoading] = useState(false);
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

      // setIsLoading(true);
      try {
        const cartedData: { id: number; quantity: number }[] =
          JSON.parse(stored);
        if (Array.isArray(cartedData) && cartedData.length > 0) {
          const cartedIDs = cartedData.map((item) => item.id);

          const { data, error } = await supabase
            .from("products")
            .select("*")
            .in("id", cartedIDs);

          if (!error && data) {
            const merged = data.map((product) => {
              const match = cartedData.find((item) => item.id === product.id);
              return {
                ...product,
                quantity: match?.quantity ?? 1,
              };
            });

            setCartedItems(merged);
          } else {
            console.error("Error fetching carted products:", error);
          }
        } else {
          setCartedItems([]);
        }
      } catch (err) {
        console.error("Failed to parse carted products:", err);
      } finally {
        // setIsLoading(false);
      }
    };

    fetchCartedItems();
  }, []);

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
          const newQuantity = item.quantity + change;

          const clampedQuantity = Math.max(
            1,
            Math.min(item.in_stock, newQuantity)
          );

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
      <ShopNav />
      <div className="w-full flex flex-col justify-center">
        <div className={styles.container}>
          <div className={styles.cartedItems}>
            <div className={styles.titleWrapper}>
              <div className={styles.title}>Кошик:</div>
              <div className={styles.total}>
                Загалом: <div className={styles.totalPrice}>{totalPrice}₴</div>
              </div>
            </div>

            <div className={styles.actyalCart}>
              {cartedItems.map((cartedProduct) => (
                <div key={cartedProduct.id} className={styles.productItem}>
                  <Link href={`/product/${cartedProduct.id}`}>
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
                      <Link href={`/product/${cartedProduct.id}`}>
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
                      Видалити
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
              <div className={styles.title}>Доставка:</div>
            </div>
            <div className={styles.personalInfoWrapper}>
              <div className={styles.typeOfDelivery}>
                <p className={styles.note}>
                  Можливе доставлення Новою Поштою, або самовивіз
                </p>
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
                      Нова Пошта
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
                      Самовивіз
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
                        placeholder="Прізвище"
                        className={styles.inputField}
                        onInput={handleLettersOnly}
                        onChange={(e) => setLastName(e.target.value)}
                      />
                      <input
                        type="text"
                        placeholder="Ім’я"
                        className={styles.inputField}
                        onInput={handleLettersOnly}
                        onChange={(e) => setFirstName(e.target.value)}
                      />
                      <input
                        type="text"
                        placeholder="По батькові"
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
                        placeholder="example@gmail.com"
                        className={styles.inputField}
                        onInput={handleEmailInput}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                    </div>
                    <p className={styles.noteNP}>Дані доставки Новою Поштою:</p>
                    <div className={styles.novaWrapper}>
                      <OblastSelect
                        onChange={({ ref, name }) => {
                          setOblastRef(ref);
                          setOblastName(name);
                        }}
                      />
                      <CitySelect
                        oblastRef={oblastRef}
                        onChange={setSelectedCity}
                      />
                      <WarehouseSelect
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
                        placeholder="Прізвище"
                        className={styles.inputField}
                        onInput={handleLettersOnly}
                        onChange={(e) => setLastName(e.target.value)}
                      />
                      <input
                        type="text"
                        placeholder="Ім’я"
                        className={styles.inputField}
                        onInput={handleLettersOnly}
                        onChange={(e) => setFirstName(e.target.value)}
                      />
                      <input
                        type="text"
                        placeholder="По батькові"
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
                        placeholder="example@gmail.com"
                        className={styles.inputField}
                        onInput={handleEmailInput}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                    </div>

                    <div className={styles.containerSelf}>
                      <p>
                        Заберіть товар, у фізичному магазині, у цій локації:{" "}
                      </p>
                      <Link
                        className={styles.location}
                        href={"https://maps.app.goo.gl/LZ2czQejsunVQqNA8"}
                      >
                        Україна, м.Львів, вул.Замарстинівська,127 (ЖК Барселона)
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
            <div className={styles.title}>Коментар:</div>
          </div>

          <input
            type="text"
            placeholder="Коментар"
            className={styles.inputFieldComment}
            onChange={(e) => setComment(e.target.value)}
          />
        </div>

        <div className={styles.containerPayment}>
          <div className={styles.titleWrapper}>
            <div className={styles.title}>Оплата:</div>
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
                    Оплата картою
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
                    Накладний платіж
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
              <p>
                Ви обрали накладний платіж. Оплатіть замовлення при отриманні.
              </p>
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
                comment={comment}
                email={email}
                deliveryType={deliveryType}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
