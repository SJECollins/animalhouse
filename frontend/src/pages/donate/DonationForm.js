import { Link, useNavigate } from "react-router-dom";
import {
  ElementsConsumer,
  useElements,
  CardElement,
} from "@stripe/react-stripe-js";
import { useCurrentUser } from "../../contexts/UserContext";
import { useEffect, useState } from "react";
import { axiosReq } from "../../api/axiosDefaults";
import ErrAlert from "../../components/ErrAlert";

const DonationForm = (props) => {
  const currentUser = useCurrentUser();
  const navigate = useNavigate();
  const elements = useElements();
  const { stripe } = props;

  const [isCardElementCreated, setCardElementCreated] = useState(false);
  const [enterDetails, setEnterDetails] = useState(false);
  const [errors, setErrors] = useState({});
  useEffect(() => {
    if (stripe && elements && !isCardElementCreated) {
      setCardElementCreated(true);
    }
  }, [stripe, elements, isCardElementCreated]);

  const [donationData, setDonationData] = useState({
    amount: 0.0,
    name: "",
    email: currentUser?.email || "",
    phone: "",
    address1: "",
    address2: "",
    town_or_city: "",
    county: "",
    postcode: "",
    country: "",
  });
  const {
    amount,
    name,
    email,
    phone,
    address1,
    address2,
    town_or_city,
    county,
    postcode,
    country,
  } = donationData;

  const handleSubmit = async (event) => {
    event.preventDefault();

    const formData = new FormData();
    formData.append("amount", amount.toFixed(2));
    formData.append("name", name);
    formData.append("email", email);
    formData.append("phone", phone);
    formData.append("address1", address1);
    formData.append("address2", address2);
    formData.append("town_or_city", town_or_city);
    formData.append("county", county);
    formData.append("postcode", postcode);
    formData.append("country", country);
    formData.append("account_id", currentUser?._id || "");

    const { token, error } = await stripe.createToken(
      elements.getElement(CardElement)
    );

    if (error) {
      setErrors(error.response?.data);
      return;
    }
    formData.append("stripeToken", token.id);

    try {
      await axiosReq.post("/donation/create/", formData);
      navigate("/donate/success");
    } catch (err) {
      console.log(err);
      setErrors(err.response?.data);
    }
  };

  const handleChange = (event) => {
    setDonationData({
      ...donationData,
      [event.target.name]: event.target.value,
    });
  };

  const handleAmountChange = (event) => {
    let amt = Number(event.target.value).toString();

    if (amt < 0) {
      amt = 0;
    }

    if (amt.match(/\./g)) {
      const decimalPlaces = amt.split(".")[1].length;
      if (decimalPlaces > 2) {
        amt = amt.slice(0, -1);
      }
    }
    event.target.value = amt;

    setDonationData({
      ...donationData,
      [event.target.name]: parseFloat(amt),
    });
  };

  return (
    <div className="mt-4">
      {!currentUser && (
        <div>
          <p>
            If you have already registered and would like your donation recorded
            in your account, please{" "}
            <Link to="/signin" className="underline">
              log in
            </Link>
            . If you're not registered, but would like to be, please{" "}
            <Link to="/signup" className="underline">
              sign up
            </Link>
            .
          </p>
        </div>
      )}
      <h1>Make A Donation</h1>
      <div className="max-w-lg my-4 mx-auto">
        <p className="text-justify">
          Your donation, whether anonymous or logged in, makes a real difference
          in the lives of the animals we rescue. Your generosity helps provide
          food, shelter, and medical care. Choose your contribution, and know
          that every dollar goes directly to support our furry and feathered
          friends. Thank you for making a difference. If you're logged in, you
          can easily track your contributions on your account page.
        </p>
      </div>
      <form
        onSubmit={handleSubmit}
        className="flex flex-col justify-content-evenly items-center mt-4"
      >
        <div className="forms row-imp">
          <label className="basis-2/3">
            Would you like to enter your details?
          </label>
          <input
            className="basis-1/3 no-shadow"
            type="checkbox"
            name="enterDetails"
            checked={enterDetails}
            onChange={() => setEnterDetails(!enterDetails)}
          />
        </div>
        {enterDetails && (
          <div className="forms">
            <label>Name</label>
            <input
              type="text"
              name="name"
              placeholder="Leave blank if you wish to remain anonymous"
              value={name}
              onChange={handleChange}
            />
            {errors.name?.map((message, index) => (
              <ErrAlert key={index} message={message} />
            ))}
            <label>Email</label>
            <input
              type="text"
              name="email"
              placeholder="Please enter your email"
              value={email}
              onChange={handleChange}
            />
            {errors.email?.map((message, index) => (
              <ErrAlert key={index} message={message} />
            ))}
            <label>Phone</label>
            <input
              type="text"
              name="phone"
              placeholder="Please enter your phone number"
              value={phone}
              onChange={handleChange}
            />
            {errors.phone?.map((message, index) => (
              <ErrAlert key={index} message={message} />
            ))}
            <label>Address 1</label>
            <input
              type="text"
              name="address1"
              placeholder="Please enter your address"
              value={address1}
              onChange={handleChange}
            />
            {errors.address1?.map((message, index) => (
              <ErrAlert key={index} message={message} />
            ))}
            <label>Address 2</label>
            <input
              type="text"
              name="address2"
              placeholder="Please enter your address"
              value={address2}
              onChange={handleChange}
            />
            {errors.address2?.map((message, index) => (
              <ErrAlert key={index} message={message} />
            ))}
            <label>Town or City</label>
            <input
              type="text"
              name="town_or_city"
              placeholder="Please enter your town or city"
              value={town_or_city}
              onChange={handleChange}
            />
            {errors.town_or_city?.map((message, index) => (
              <ErrAlert key={index} message={message} />
            ))}
            <label>County</label>
            <input
              type="text"
              name="county"
              placeholder="Please enter your county"
              value={county}
              onChange={handleChange}
            />
            {errors.county?.map((message, index) => (
              <ErrAlert key={index} message={message} />
            ))}
            <label>Postcode</label>
            <input
              type="text"
              name="postcode"
              placeholder="Please enter your postcode"
              value={postcode}
              onChange={handleChange}
            />
            {errors.postcode?.map((message, index) => (
              <ErrAlert key={index} message={message} />
            ))}
            <label>Country</label>
            <input
              type="text"
              name="country"
              placeholder="Please enter your country"
              value={country}
              onChange={handleChange}
            />
            {errors.country?.map((message, index) => (
              <ErrAlert key={index} message={message} />
            ))}
          </div>
        )}
        <div className="forms">
          <label>Donation</label>
          <input
            type="number"
            name="amount"
            value={donationData.amount}
            onChange={handleAmountChange}
            required
          />
          {errors?.amount?.map((message, index) => (
            <ErrAlert key={index} message={message} />
          ))}
        </div>
        <label>Card details</label>
        {isCardElementCreated && (
          <div className="forms">
            <CardElement className="custom-card-element" />
            {errors?.stripe?.map((message, index) => (
              <ErrAlert key={index} message={message} />
            ))}
          </div>
        )}
        <button className="btns">Donate</button>
      </form>
    </div>
  );
};

export default function WrappedDonationForm(props) {
  return (
    <ElementsConsumer>
      {({ stripe, elements }) => (
        <DonationForm {...props} stripe={stripe} elements={elements} />
      )}
    </ElementsConsumer>
  );
}
