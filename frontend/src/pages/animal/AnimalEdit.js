import { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { useRedirect } from "../../hooks/useRedirect";
import { axiosRes } from "../../api/axiosDefaults";
import { useNavigate } from "react-router-dom";
import ErrAlert from "../../components/ErrAlert";

const AnimalEdit = () => {
  useRedirect("loggedOut");
  useRedirect("user");
  const navigate = useNavigate();
  const { id } = useParams();
  const pictureInput = useRef([]);
  const [error, setError] = useState({});
  const [animalData, setAnimalData] = useState({
    name: "",
    species: "",
    breed: "",
    age: "",
    description: "",
    picture: "",
    adopted: false,
  });
  const { name, species, breed, age, description, picture, adopted } =
    animalData;

  useEffect(() => {
    const fetchAnimal = async () => {
      try {
        const { data } = await axiosRes.get("/animal/" + id + "/");
        const { name, species, breed, age, description, picture, adopted } =
          data.animal;
        setAnimalData({
          name,
          species,
          breed,
          age,
          description,
          picture,
          adopted,
        });
      } catch (err) {
        console.log(err);
      }
    };
    fetchAnimal();
  }, [id]);

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
    } else {
      formData.append("picture", picture);
    }
    formData.append("name", name);
    formData.append("species", species);
    formData.append("breed", breed);
    formData.append("age", age);
    formData.append("description", description);
    formData.append("adopted", adopted);
    try {
      const response = await axiosRes.put("/animal/" + id + "/", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      navigate("/animal/" + response.data.animal_id);
    } catch (err) {
      console.log(err);
      setError(err.response.data);
    }
  };

  return (
    <div>
      <h1>Update Animal Profile</h1>
      <form
        onSubmit={handleSubmit}
        className="flex flex-col justify-evenly items-center mt-4"
        encType="multipart/form-data"
      >
        <div className="forms">
          <label htmlFor="name">Update Name</label>
          <input type="text" name="name" value={name} onChange={handleChange} />
          {error.name?.map((message, index) => (
            <ErrAlert key={index} message={message} />
          ))}

          <label htmlFor="species">Update Species</label>
          <input
            type="text"
            name="species"
            value={species}
            onChange={handleChange}
          />
          {error.species?.map((message, index) => (
            <ErrAlert key={index} message={message} />
          ))}

          <label htmlFor="breed">Update Breed</label>
          <input
            type="text"
            name="breed"
            value={breed}
            onChange={handleChange}
          />
          {error.breed?.map((message, index) => (
            <ErrAlert key={index} message={message} />
          ))}

          <label htmlFor="age">Update Age</label>
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
          <label htmlFor="picture">Update Picture</label>
          <figure className="mx-auto w-60 h-60">
            <img
              src={picture}
              alt="animal"
              className="object-contain w-full h-full"
            />
          </figure>
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

        <div className="forms">
          <label htmlFor="adopted">Adopted</label>
          <input
            type="checkbox"
            name="adopted"
            checked={adopted}
            onChange={() => setAnimalData({ ...animalData, adopted: !adopted })}
          />
          {error.adopted?.map((message, index) => (
            <ErrAlert key={index} message={message} />
          ))}
        </div>

        <button type="submit" className="btns">
          Update
        </button>
      </form>
    </div>
  );
};

export default AnimalEdit;
