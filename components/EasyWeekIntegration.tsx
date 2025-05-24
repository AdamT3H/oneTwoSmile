"use client";

import { useEffect } from "react";

export default function EasyWeekIntegration() {
  useEffect(() => {
    if (typeof window !== "undefined" && window.EasyWeekWidget) {
      new window.EasyWeekWidget({
        url: "https://widget.easyweek.io/onetwosmile",
        trigger: ".OnlineBookingBtn",
      });
    }
  }, []);

  return null;
}
