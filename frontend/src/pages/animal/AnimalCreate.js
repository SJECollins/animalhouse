import { useState, useRef } from "react";
import { useRedirect } from "../../hooks/useRedirect";
import { axiosReq } from "../../api/axiosDefaults";
import ErrAlert from "../../components/ErrAlert";
import { useNavigate } from "react-router-dom";

const AnimalCreate = () => {
  useRedirect("loggedOut");
  useRedirect("user");

  const navigate = useNavigate();
  const [error, setError] = useState({});
  const pictureInput = useRef();
  const [animalData, setAnimalData] = useState({
    name: "",
    species: "",
    breed: "",
    age: "",
    description: "",
    picture: "",
  });
  const { name, species, breed, age, description, picture } = animalData;

  const handleChange = (e) => {
    setAnimalData({ ...animalData, [e.target.name]: e.target.value });
  };

  const handlePictureChange = (e) => {
    if (e.target.files.length) {
      URL.revokeObjectURL(picture);
      setAnimalData({
        ...animalData,
        picture: URL.createObjectURL(e.target.files[0]),
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    if (pictureInput.current.files.length) {
      formData.append("picture", pictureInput.current.files[0]);
    }
    formData.append("name", name);
    formData.append("species", species);
    formData.append("breed", breed);
    formData.append("age", age);
    formData.append("description", description);
    try {
      const response = await axiosReq.post("/animal_create/", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      navigate("/animal/" + response.data.animal);
    } catch (err) {
      console.log(err);
      setError(err.response.data);
    }
  };

  return (
    <div>
      <h1>Add New Animal</h1>
      <form
        onSubmit={handleSubmit}
        className="flex flex-col justify-evenly items-center mt-4"
        encType="multipart/form-data"
      >
        <div className="forms">
          <label htmlFor="name">Name</label>
          <input type="text" name="name" value={name} onChange={handleChange} />
          {error.name?.map((message, index) => (
            <ErrAlert key={index} message={message} />
          ))}

          <label htmlFor="species">Species</label>
          <input
            type="text"
            name="species"
            value={species}
            onChange={handleChange}
          />
          {error.species?.map((message, index) => (
            <ErrAlert key={index} message={message} />
          ))}

          <label htmlFor="breed">Breed</label>
          <input
            type="text"
            name="breed"
            value={breed}
            onChange={handleChange}
          />
          {error.breed?.map((message, index) => (
            <ErrAlert key={index} message={message} />
          ))}

          <label htmlFor="age">Age</label>
          <input type="text" name="age" value={age} onChange={handleChange} />
          {error.age?.map((message, index) => (
            <ErrAlert key={index} message={message} />
          ))}

          <label htmlFor="description">Description</label>
          <input
            type="textarea"
            rows={4}
            name="description"
            value={description}
            onChange={handleChange}
          />
          {error.description?.map((message, index) => (
            <ErrAlert key={index} message={message} />
          ))}
        </div>

        <div className="forms">
          <label htmlFor="picture">Picture</label>
          <input
            type="file"
            name="picture"
            ref={pictureInput}
            onChange={handlePictureChange}
          />
          {error.picture?.map((message, index) => (
            <ErrAlert key={index} message={message} />
          ))}
        </div>

        <button type="submit" className="btns">
          Submit
        </button>

        {error.non_field_errors?.map((message, index) => (
          <ErrAlert key={index} message={message} />
        ))}
      </form>
    </div>
  );
};

export default AnimalCreate;
