import React, { useState, useEffect } from "react";
import { useLocation, useParams } from "react-router-dom";
import Animal from "./Animal";
import { axiosRes } from "../../api/axiosDefaults";

const AnimalPage = () => {
  const [animalData, setAnimalData] = useState({});
  const { id } = useParams();

  const location = useLocation();
  const adoptionSent = location.state?.adoptionSent;

  useEffect(() => {
    const fetchAnimal = async () => {
      try {
        const { data } = await axiosRes.get("/animal/" + id + "/");
        setAnimalData(data.animal);
      } catch (err) {
        console.log(err);
      }
    };
    fetchAnimal();
  }, [id]);

  return (
    <div className="w-11/12 m-auto min-h-[80vh]">
      {adoptionSent && (
        <div className="text-center">
          <h1>Adoption enquiry sent!</h1>
          <p>
            Thank you for your interest in adopting {animalData.name}. We will
            get back to you as soon as possible.
          </p>
        </div>
      )}
      <Animal {...animalData} />
    </div>
  );
};

export default AnimalPage;
