"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

interface AgencyContextValue {
  isAgencyVip: boolean;
  appId: string | null;
}

const AgencyContext = createContext<AgencyContextValue>({
  isAgencyVip: false,
  appId: null,
});

export function AgencyProvider({ children }: { children: React.ReactNode }) {
  const [isAgencyVip, setIsAgencyVip] = useState(false);
  const [appId, setAppId] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    try {
      const sp = new URLSearchParams(window.location.search);
      const urlAppId = sp.get("appid") || sp.get("id") || sp.get("app_id") || sp.get("apple_id");
      const urlVip = sp.get("vip") || sp.get("offer");
      const hasUrlSignal = Boolean(urlAppId) || urlVip === "39" || urlVip === "agency39";

      // 1. If URL has appid or vip signals, store into localStorage immediately
      if (hasUrlSignal) {
        const vipVal = urlAppId || "39";
        localStorage.setItem("sps_agency_vip", vipVal);
        sessionStorage.setItem("sps_agency_vip", vipVal);
        if (urlAppId) {
          localStorage.setItem("sps_app_id", urlAppId);
          sessionStorage.setItem("sps_app_id", urlAppId);
        }

        // 2. Automatically remove the query string from browser address bar (Clean URL)
        const cleanUrl = window.location.pathname + window.location.hash;
        window.history.replaceState({}, document.title, cleanUrl);

        setIsAgencyVip(true);
        if (urlAppId) setAppId(urlAppId);
        return;
      }

      // 3. If no URL param, hydrate state from persistent localStorage
      const savedVip = localStorage.getItem("sps_agency_vip") || sessionStorage.getItem("sps_agency_vip");
      const savedAppId = localStorage.getItem("sps_app_id") || sessionStorage.getItem("sps_app_id");

      if (savedVip) {
        setIsAgencyVip(true);
        if (savedAppId) setAppId(savedAppId);
      }
    } catch (_) {
      // Storage access safety fallback
    }
  }, []);

  return (
    <AgencyContext.Provider value={{ isAgencyVip, appId }}>
      {children}
    </AgencyContext.Provider>
  );
}

export function useAgency() {
  return useContext(AgencyContext);
}
