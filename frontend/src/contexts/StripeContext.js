// StripeContext.js (create a new context)
import React, { createContext, useContext, useEffect, useState } from "react";
import { loadStripe } from "@stripe/stripe-js";

const StripeContext = createContext();

export const useStripe = () => {
  return useContext(StripeContext);
};

export const StripeProvider = ({ children }) => {
  const [stripe, setStripe] = useState(null);

  useEffect(() => {
    const loadStripeInstance = async () => {
      const stripe = await loadStripe(
        "pk_test_51LuGJQKEidU8f4RUT8XLaBxjqSKlWXn7D5A9ld1hdUTuuy5yAUknn3SaqZXLp3Pigk7GbqU7QYT1WsObQWPo0LA700ckf7plHJ"
      );
      setStripe(stripe);
    };

    loadStripeInstance();
  }, []);

  return (
    <StripeContext.Provider value={stripe}>{children}</StripeContext.Provider>
  );
};
