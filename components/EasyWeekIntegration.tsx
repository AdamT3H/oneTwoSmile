"use client";

import { useEffect } from "react";

const BASE = "https://widget.easyweek.io/onetwosmile";
const LOCATION_ID = "65270";

type Employee = {
  id: number | string;
  easyweek_employee_id?: number | string | null;
}

let headerReady = false;

export default function EasyWeekIntegration({
  employees = [],
}: {
  employees?: Employee[];
}) {
  useEffect(() => {
    if (!window.EasyWeekWidget || headerReady) return;
    new window.EasyWeekWidget({url: BASE, trigger: ".OnlineBookingBtn" });
    headerReady = true;
  }, []);

  const key = employees.map((e) => e.id).join(",");

  useEffect(() => {
    if (!key || !window.EasyWeekWidget) return;

    employees.forEach((e) => {
      new window.EasyWeekWidget({
        url: e.easyweek_employee_id
          ? `${BASE}/team/${LOCATION_ID}/${e.easyweek_employee_id}/`
          : BASE,
        trigger: `.doctor-book-${e.id}`,
      });
    });
  }, [key]);

  return null;
}
