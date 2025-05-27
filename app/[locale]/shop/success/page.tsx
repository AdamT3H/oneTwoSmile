import ClientSuccess from "./ClientSuccess.tsx";
import React from "react";

export default function SuccessPage() {
  return (
    <div className="w-full">
      <React.Suspense fallback={<p>Завантаження…</p>}>
        <ClientSuccess />
      </React.Suspense>
    </div>
  );
}