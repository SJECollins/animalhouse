import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { axiosReq } from "../../api/axiosDefaults";
import { useCurrentUser } from "../../contexts/UserContext";
import ErrAlert from "../../components/ErrAlert";

const AdoptionForm = () => {
  const location = useLocation();
  const { _id, name } = location.state || {};
  const currentUser = useCurrentUser();
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: "",
    email: currentUser?.email || "",
    phone: "",
    message: "",
    account_id: currentUser?._id || "",
    animal: name,
    animal_id: _id,
  });
  const { username, email, phone, message } = formData;
  const msgPlaceholder = `Please enter a short description about yourself and why you're interested in adopting ${name}.`;

  console.log(formData);

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      await axiosReq.post("/adoption/request/", formData);
      navigate("/animal/" + _id, { state: { adoptionSent: true } });
    } catch (err) {
      console.log(err);
      setErrors(err.response?.data);
    }
  };

  const handleChange = (event) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });
  };

  return (
    <div className="flex flex-col items-center my-16">
      <h1>Adoption Enquiry For {name}</h1>
      <form onSubmit={handleSubmit} className="forms">
        <label>Name</label>
        <input
          type="text"
          name="username"
          placeholder="Please enter your name"
          value={username}
          onChange={handleChange}
          required
        />
        {errors.username?.map((message, index) => (
          <ErrAlert key={index} message={message} />
        ))}
        <label>Email</label>
        <input
          type="text"
          name="email"
          placeholder="Please enter your email"
          value={email}
          onChange={handleChange}
          required
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
        <label>Message</label>
        <textarea
          type="textarea"
          rows={4}
          name="message"
          placeholder={msgPlaceholder}
          value={message}
          onChange={handleChange}
          required
        />
        {errors.message?.map((message, index) => (
          <ErrAlert key={index} message={message} />
        ))}
        <button className="btns" type="submit">
          Send Adoption Enquiry
        </button>
        {errors.non_field_errors?.map((message, index) => (
          <ErrAlert key={index} message={message} />
        ))}
        {errors.animal_id?.map((message, index) => (
          <ErrAlert key={index} message={message} />
        ))}
      </form>
    </div>
  );
};

export default AdoptionForm;
