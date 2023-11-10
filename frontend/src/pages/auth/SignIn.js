import React, { useState } from "react";
import axios from "axios";
import { useSetCurrentUser } from "../../contexts/UserContext";
import { useNavigate, useLocation } from "react-router-dom";
import ErrAlert from "../../components/ErrAlert";
import { setAccessTokenCookie } from "../../utils/tokenUtils";
import { useRedirect } from "../../hooks/useRedirect";

const SignIn = () => {
  useRedirect("loggedIn");
  const location = useLocation();
  const registrationSuccess = location.state?.registrationSuccess;
  const [errors, setErrors] = useState({});
  const setCurrentUser = useSetCurrentUser();
  const navigate = useNavigate();

  const [signInData, setSignInData] = useState({
    email: "",
    password: "",
  });
  const { email, password } = signInData;

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const { data } = await axios.post("/login/", signInData);
      setCurrentUser(data.user);
      setAccessTokenCookie(data.access_token);
      navigate(-1);
    } catch (err) {
      console.log(err);
      setErrors(err.response?.data);
    }
  };

  const handleChange = (event) => {
    setSignInData({
      ...signInData,
      [event.target.name]: event.target.value,
    });
  };

  return (
    <div className="flex flex-col items-center my-16 min-h-[80vh]">
      {registrationSuccess && (
        <div>Registration was successful. You can now log in.</div>
      )}
      <form onSubmit={handleSubmit} className="forms">
        <h1>Sign In</h1>
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
          name="password"
          value={password}
          onChange={handleChange}
        />
        {errors.password?.map((message, index) => (
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

export default SignIn;
