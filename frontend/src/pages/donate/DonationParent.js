import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import WrappedDonationForm from "./DonationForm";

const stripePromise = loadStripe(
  "pk_test_51LuGJQKEidU8f4RUT8XLaBxjqSKlWXn7D5A9ld1hdUTuuy5yAUknn3SaqZXLp3Pigk7GbqU7QYT1WsObQWPo0LA700ckf7plHJ"
);

const DonationParent = () => {
  return (
    <Elements stripe={stripePromise}>
      <WrappedDonationForm />
    </Elements>
  );
};

export default DonationParent;
