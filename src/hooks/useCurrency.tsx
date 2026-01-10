import { createContext, useContext, useState, useEffect, ReactNode } from "react";

type Currency = "MAD" | "EUR";

interface CurrencyContextType {
  currency: Currency;
  setCurrency: (currency: Currency) => void;
  formatPrice: (amount: number) => string;
  symbol: string;
  convertedAmount: (amountInMAD: number) => number;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

// Exchange rate: 1 EUR ≈ 10.8 MAD (approximate)
const EUR_TO_MAD_RATE = 10.8;

export function CurrencyProvider({ children }: { children: ReactNode }) {
  const [currency, setCurrencyState] = useState<Currency>(() => {
    const saved = localStorage.getItem("winxcar-currency");
    return (saved as Currency) || "EUR";
  });

  const setCurrency = (newCurrency: Currency) => {
    setCurrencyState(newCurrency);
    localStorage.setItem("winxcar-currency", newCurrency);
  };

  const symbol = currency === "EUR" ? "€" : "DH";

  const convertedAmount = (amountInMAD: number): number => {
    if (currency === "EUR") {
      return Math.round((amountInMAD / EUR_TO_MAD_RATE) * 100) / 100;
    }
    return amountInMAD;
  };

  const formatPrice = (amountInMAD: number): string => {
    const converted = convertedAmount(amountInMAD);
    if (currency === "EUR") {
      return `${converted.toLocaleString("fr-FR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} €`;
    }
    return `${converted.toLocaleString("fr-FR")} DH`;
  };

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency, formatPrice, symbol, convertedAmount }}>
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  const context = useContext(CurrencyContext);
  if (!context) {
    throw new Error("useCurrency must be used within a CurrencyProvider");
  }
  return context;
}
