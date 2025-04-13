import ShopNav from "@/app/components/shopNav/ShopNav.tsx";
import BannerShopPage from "@/app/components/bannerShopPage/BannerShopPage.tsx";
import СategorySection from "@/app/components/сategorySection/СategorySection.tsx";

export default function Shop() {
  return (
    <div className="w-full">
      <ShopNav />
      <BannerShopPage />
      <СategorySection
        title="Догляд"
        categoryLink="/shop/category/care"
        products={[
          {
            id: 1,
            title: "Крем для обличчя",
            imageUrl: "/shop/IMG_1962.png",
            price: "350₴",
          },
          {
            id: 2,
            title: "Маска для шкіри",
            imageUrl: "/shop/IMG_1981.png",
            price: "280₴",
          },
          {
            id: 3,
            title: "Сироватка",
            imageUrl: "/shop/IMG_1984.png",
            price: "410₴",
          },
          {
            id: 4,
            title: "Сироватка",
            imageUrl: "/shop/IMG_1984.png",
            price: "410₴",
          },
          {
            id: 5,
            title: "Сироватка",
            imageUrl: "/shop/IMG_1984.png",
            price: "410₴",
          },
          {
            id: 6,
            title: "Сироватка",
            imageUrl: "/shop/IMG_1984.png",
            price: "410₴",
          },
          {
            id: 7,
            title: "Сироватка",
            imageUrl: "/shop/IMG_1984.png",
            price: "410₴",
          },
          {
            id: 8,
            title: "Сироватка",
            imageUrl: "/shop/IMG_1984.png",
            price: "410₴",
          },
          {
            id: 9,
            title: "Сироватка",
            imageUrl: "/shop/IMG_1984.png",
            price: "410₴",
          },
          {
            id: 10,
            title: "Сироватка",
            imageUrl: "/shop/IMG_1984.png",
            price: "410₴",
          },
        ]}
      />

      <СategorySection
        title="Косметика"
        categoryLink="/shop/category/care"
        products={[
          {
            id: 1,
            title: "Крем для обличчя",
            imageUrl: "/shop/IMG_1984.png",
            price: "350₴",
          },
          {
            id: 2,
            title: "Маска для шкіри",
            imageUrl: "/shop/IMG_1984.png",
            price: "280₴",
          },
          {
            id: 3,
            title: "Сироватка",
            imageUrl: "/shop/IMG_1984.png",
            price: "410₴",
          },
        ]}
      />
    </div>
  );
}
