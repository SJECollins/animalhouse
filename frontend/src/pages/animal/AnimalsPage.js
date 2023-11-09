import ahplaceholder from "../../assets/ahplaceholder.png";
import { useState, useEffect } from "react";
import { axiosRes } from "../../api/axiosDefaults";
import { Link } from "react-router-dom";
import { useCurrentUser } from "../../contexts/UserContext";

const AnimalsPage = () => {
  const [animals, setAnimals] = useState([]);
  const currentUser = useCurrentUser();

  const is_admin = currentUser?.role === "admin";

  useEffect(() => {
    const fetchAnimals = async () => {
      try {
        const { data } = await axiosRes.get("/animals/");
        console.log(data);
        setAnimals(data.animals);
      } catch (err) {
        console.log(err);
      }
    };
    fetchAnimals();
  }, []);

  return (
    <div className="mt-10">
      {is_admin && (
        <Link to="/animal/new" className="btns">
          Add New Animal
        </Link>
      )}
      <h1>Our Animals:</h1>
      <div className="max-w-lg my-4 mx-auto">
        <p className="text-justify">
          Our rescue is home to a variety of adorable animals, including dogs,
          cats, rabbits, guinea pigs, and possibly even some feathered friends.
          Each of these animals has its own unique story and is in search of a
          loving forever home. Explore their profiles to discover their
          individual personalities, backgrounds, and specific needs. Your
          support can make a real difference in their lives. Together, we can
          provide these animals with the second chance they deserve.
        </p>
      </div>
      <div className="flex flex-wrap w-full lg:w-11/12 justify-evenly m-auto">
        {animals?.length > 0 ? (
          animals?.map((animal, index) => (
            <div
              key={index}
              className="max-w-xs rounded overflow-hidden shadow-lg mb-4"
            >
              <Link to={"/animal/" + animal._id}>
                {animal.picture === "placeholder.png" ? (
                  <img
                    className="w-full"
                    src={ahplaceholder}
                    alt={animal.name}
                  />
                ) : (
                  <img
                    className="w-full"
                    src={animal.picture}
                    alt={animal.name}
                  />
                )}
                <div className="px-6 py-4">
                  <div className="font-bold text-xl text-center mb-2">
                    {animal.name}
                  </div>
                  <p className="text-gray-800 text-base">
                    {animal.description}
                  </p>
                </div>
              </Link>
            </div>
          ))
        ) : (
          <p>There are no animals available for adoption.</p>
        )}
      </div>
    </div>
  );
};

export default AnimalsPage;
