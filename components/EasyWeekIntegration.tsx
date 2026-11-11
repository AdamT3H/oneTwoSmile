"use client";

import { useEffect } from "react";

const BASE = "https://widget.easyweek.io/onetwosmile";
const LOCATION_ID = "65270";

type Employee = {
  id: number | string;
  easyweek_employee_id?: number | string | null;
}

type ServiceItem = {
  id: number | string;
  easyweek_service_id?: number | string | null;
}

let headerReady = false;

export default function EasyWeekIntegration({
  employees = [],
  services = [],
}: {
  employees?: Employee[];
  services?: ServiceItem[];
}) {
  useEffect(() => {
    if (!window.EasyWeekWidget || headerReady) return;
    new window.EasyWeekWidget({url: BASE, trigger: ".OnlineBookingBtn" });
    headerReady = true;
  }, []);

  const employeeskey = employees.map((e) => e.id).join(",");
  useEffect(() => {
    if (!employeeskey || !window.EasyWeekWidget) return;

    employees.forEach((e) => {
      new window.EasyWeekWidget({
        url: e.easyweek_employee_id
          ? `${BASE}/team/${LOCATION_ID}/${e.easyweek_employee_id}/`
          : BASE,
        trigger: `.doctor-book-${e.id}`,
      });
    });
  }, [employeeskey]);

  const serviceskey = services.map((s) => s.id).join(",");
  useEffect(() => {
    if (!serviceskey || !window.EasyWeekWidget) return;

    services.forEach((s) => {
      new window.EasyWeekWidget({
        url: s.easyweek_service_id
          ? `${BASE}/${LOCATION_ID}/${s.easyweek_service_id}/date`
          : BASE,
        trigger: `.service-book-${s.id}`,
      });
    });
  }, [serviceskey]);

  return null;
}
