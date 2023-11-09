import { Link } from "react-router-dom";
import { useCurrentUser } from "../../contexts/UserContext";

const DonationSuccess = () => {
  const currentUser = useCurrentUser();
  return (
    <div className="w-11/12 flex flex-col justify-evenly items-center min-h-[80vh]">
      <h1>Thank you for your donation!</h1>
      <p>Your contribution will make a difference!</p>
      <Link to="/" className="underline">
        Go to Home Page
      </Link>
      {currentUser && (
        <p>
          You can view your donations on your{" "}
          <Link to="/" className="underline">
            profile
          </Link>{" "}
          page.
        </p>
      )}
    </div>
  );
};

export default DonationSuccess;
