import ahplaceholder from "../../assets/ahplaceholder.png";
import { Link } from "react-router-dom";
import { useCurrentUser } from "../../contexts/UserContext";

const Animal = (props) => {
  const { _id, name, species, breed, age, description, picture, adopted } =
    props;
  const currentUser = useCurrentUser();
  const is_admin = currentUser?.role === "admin";
  const is_placeholder = picture === "placeholder.png";

  return (
    <div className="flex flex-col justify-content-center items-center mt-4">
      <div className="flex flex-row flex-wrap justify-content-center items-center">
        <div className="max-w-md rounded overflow-hidden shadow-lg mx-auto">
          <h1>{name}</h1>
          {is_placeholder ? (
            <img src={ahplaceholder} alt={name} className="max-h-96" />
          ) : (
            <img src={picture} alt={name} className="max-h-96" />
          )}
        </div>
        <div className="max-w-md md:mt-20 mx-auto">
          <table className="table-auto">
            <tbody>
              <tr>
                <th>Species:</th>
                <td>{species}</td>
              </tr>
              <tr>
                <th>Breed:</th>
                <td>{breed}</td>
              </tr>
              <tr>
                <th>Age:</th>
                <td>{age}</td>
              </tr>
              <tr>
                <th>About {name}: </th>
                <td>{description}</td>
              </tr>
            </tbody>
          </table>
          <p className="mt-8">
            To support {name} and our other animals or speak to us about making{" "}
            {name} a part of your family, you can reach out below.
          </p>
        </div>
      </div>
      <div className="sm:w-4/5 flex flex-col sm:flex-row justify-between my-4">
        <div className="btns">
          <Link to="/animals">Back to Animals</Link>
        </div>
        {adopted ? (
          <div>
            <h1 className="text-2xl text-purple-800 my-0">Adopted!</h1>
          </div>
        ) : (
          <div className="btns">
            <Link to="/adopt/request" state={{ _id, name }}>
              Adopt Me!
            </Link>
          </div>
        )}
        {is_admin ? (
          <div className="btns">
            <Link to={"/animal/edit/" + _id}>Edit Animal</Link>
          </div>
        ) : (
          <div className="btns">
            <Link to={"/donate"}>Donate</Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Animal;
