import { useEffect, useState } from "react";
import { useCurrentUser } from "../../contexts/UserContext";
import { useRedirect } from "../../hooks/useRedirect";
import { axiosRes } from "../../api/axiosDefaults";

const AccountPage = () => {
  useRedirect("loggedOut");
  const currentUser = useCurrentUser();
  const email = currentUser?.email;
  const id = currentUser?._id;
  const [donations, setDonations] = useState([]);
  const [adoptions, setAdoptions] = useState([]);

  useEffect(() => {
    const handleMount = async () => {
      try {
        const { donationData, adoptionData } = await Promise.all([
          axiosRes.get("/donation/" + id + "/"),
          axiosRes.get("/adoption/" + id + "/"),
        ]);
        setDonations(donationData);
        setAdoptions(adoptionData);
      } catch (error) {
        console.log(error);
      }
    };
    handleMount();
  }, [id]);

  return (
    <div className="flex flex-col justify-center items-center w-11/12 min-h-[80vh]">
      <h1 className="mb-0">Account For</h1>
      <h3>{email}</h3>
      <div className="flex flex-col md:flex-row justify-evenly items-center w-11/12">
        <div>
          <h2>Donations</h2>
          {/* List of donations */}
          {donations?.length > 0 ? (
            donations?.map((donation) => (
              <div>
                <p>Donation Amount: {donation.amount}</p>
                <p>Donation Date: {donation.date}</p>
              </div>
            ))
          ) : (
            <p>You haven't made donations yet.</p>
          )}
        </div>
        <div>
          <h2>Adoption Requests</h2>
          {/* List of adoption requests */}
          {adoptions?.length > 0 ? (
            adoptions?.map((adoption) => (
              <div>
                <p>Animal Name: {adoption.animal.name}</p>
                <p>Adoption Request Date: {adoption.date}</p>
                <p>Status: {adoption.status}</p>
              </div>
            ))
          ) : (
            <p>You haven't made adoption requests yet.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AccountPage;
