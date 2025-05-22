import ShopNav from "@/app/components/shopNav/ShopNav.tsx";
import ClientSuccess from "./ClientSuccess.tsx";
import React from "react";

export default function SuccessPage() {
  return (
    <div className="w-full">
      <ShopNav />
      <React.Suspense fallback={<p>Завантаження…</p>}>
        <ClientSuccess />
      </React.Suspense>
    </div>
  );
}