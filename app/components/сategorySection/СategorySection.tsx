import styles from "./СategorySection.module.css";
import Link from "next/link";
import Image from "next/image";

interface Product {
  id: number;
  title: string;
  imageUrl: string;
  price: string;
}

interface CategorySectionProps {
  title: string;
  categoryLink: string;
  products: Product[];
}

export default function СategorySection({
  title,
  categoryLink,
  products,
}: CategorySectionProps) {
  return (
    <div className={styles.container}>
      <div className={styles.inner}>
        <div className={styles.header}>
          <h3 className={styles.title}>{title}</h3>
          <Link href={categoryLink} className={styles.moreButton}>
            Більше →
          </Link>
        </div>

        <div className={styles.productsWrapper}>
          <div className={styles.products}>
            {products.map((product) => (
              <div key={product.id} className={styles.productCard}>
                <div className={styles.productImageWrapper}>
                  <Image
                    src={product.imageUrl}
                    alt={product.title}
                    width={160}
                    height={160}
                    className={styles.productImage}
                  />
                </div>
                <p className={styles.productTitle}>{product.title}</p>
                <p className={styles.productPrice}>{product.price}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
