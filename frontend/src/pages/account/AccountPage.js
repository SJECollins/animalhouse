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
        const [{ data: donationData }, { data: adoptionData }] =
          await Promise.all([
            axiosRes.get("/donation/" + id + "/"),
            axiosRes.get("/adoption/" + id + "/"),
          ]);
        if (donationData.donations !== undefined) {
          getDonations(donationData.donations);
        } else {
          setDonations([]);
        }
        if (adoptionData.adoption_requests !== undefined) {
          getAdoptions(adoptionData.adoption_requests);
        } else {
          setAdoptions([]);
        }
      } catch (error) {
        console.log(error);
      }
    };
    handleMount();
  }, [id]);

  const getDonations = (donations) => {
    let donationsByDate = donations.sort(
      (a, b) => -a.date_created.localeCompare(b.date_created)
    );
    for (let donation of donationsByDate) {
      donation.date_created = new Date(
        donation.date_created
      ).toLocaleDateString("en-US");
    }
    setDonations(donationsByDate);
  };

  const getAdoptions = (adoptions) => {
    let adoptionsByDate = adoptions.sort(
      (a, b) => -a.date_created.localeCompare(b.date_created)
    );
    for (let adoption of adoptionsByDate) {
      adoption.date_created = new Date(
        adoption.date_created
      ).toLocaleDateString("en-US");
    }
    setAdoptions(adoptionsByDate);
  };

  return (
    <div className="flex flex-col justify-center items-center w-11/12 min-h-[80vh]">
      <h1 className="mb-0">Account For</h1>
      <h3>{email}</h3>
      <div className="flex flex-col md:flex-row justify-evenly items-center w-11/12">
        <div>
          <h2>Donations</h2>
          {/* List of donations */}
          {donations?.length > 0 ? (
            donations?.map((donation, index) => (
              <div key={index} className="mb-4">
                <p>Donation Amount: €{donation.amount}</p>
                <p>Donation Date: {donation.date_created}</p>
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
            adoptions?.map((adoption, index) => (
              <div key={index} className="mb-4">
                <p>Animal Name: {adoption.animal}</p>
                <p>Adoption Request Date: {adoption.date_created}</p>
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
