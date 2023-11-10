import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import ErrAlert from "../../components/ErrAlert";
import { axiosReq } from "../../api/axiosDefaults";
import { useRedirect } from "../../hooks/useRedirect";

const SignUp = () => {
  useRedirect("loggedIn");
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const [signUpData, setSignUpData] = useState({
    email: "",
    password1: "",
    password2: "",
    role: "customer",
  });
  const { email, password1, password2 } = signUpData;

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      await axiosReq.post("/register/", signUpData);
      navigate(-1, { state: { registrationSuccess: true } });
    } catch (err) {
      console.log(err);
      setErrors(err.response?.data);
    }
  };

  const handleChange = (event) => {
    setSignUpData({
      ...signUpData,
      [event.target.name]: event.target.value,
    });
  };

  return (
    <div className="flex flex-col items-center my-16 min-h-[80vh]">
      <form onSubmit={handleSubmit} className="forms">
        <h1>Sign Up</h1>
        <label>Email Address</label>
        <input
          placeholder="Enter email"
          type="text"
          name="email"
          value={email}
          onChange={handleChange}
        />
        {errors.email?.map((message, index) => (
          <ErrAlert key={index} message={message} />
        ))}
        <label>Password</label>
        <input
          placeholder="Enter password"
          type="password"
          name="password1"
          value={password1}
          onChange={handleChange}
        />
        {errors.password1?.map((message, index) => (
          <ErrAlert key={index} message={message} />
        ))}
        <label>Repeat password</label>
        <input
          placeholder="Enter password again"
          type="password"
          name="password2"
          value={password2}
          onChange={handleChange}
        />
        {errors.password2?.map((message, index) => (
          <ErrAlert key={index} message={message} />
        ))}
        <button type="submit" className="btns">
          Submit
        </button>
        {errors.non_field_errors?.map((message, index) => (
          <ErrAlert key={index} message={message} />
        ))}
      </form>
    </div>
  );
};

export default SignUp;
