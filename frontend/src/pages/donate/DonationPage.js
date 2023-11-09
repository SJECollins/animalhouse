import loader from "../../assets/loader.png";
import { useState, useEffect } from "react";
import { axiosRes } from "../../api/axiosDefaults";
import { Link } from "react-router-dom";

const DonationPage = () => {
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchDonations = async () => {
      try {
        const { data } = await axiosRes.get("/donation/all/");
        getRecentDonors(data.donations);
        setLoading(false);
      } catch (err) {
        console.log(err);
      }
    };
    setLoading(true);
    const timer = setTimeout(() => {
      fetchDonations();
    }, 1000);

    return () => {
      clearTimeout(timer);
    };
  }, []);

  const getRecentDonors = (donors) => {
    let donorsByDate = donors.sort(
      (a, b) => -a.date_created.localeCompare(b.date_created)
    );
    for (let donors of donorsByDate) {
      donors.date_created = new Date(donors.date_created).toLocaleDateString(
        "en-GB"
      );
    }
    setDonations(donorsByDate);
  };

  return (
    <div className="flex flex-col justify-evenly items-center w-11/12">
      <h1>Donations</h1>
      <div className="max-w-lg my-4 mx-auto">
        <p className="text-justify">
          This page is a testament to the incredible generosity of our
          supporters. Here, we acknowledge the kindness and compassion of those
          who have contributed to our cause. Every donation, big or small,
          represents a step closer to providing a better life for the animals in
          our care.
        </p>
        <br />
        <p className="text-justify">
          Your contributions directly support our mission to rescue and care for
          dogs, cats, rabbits, guinea pigs, and more. We are deeply grateful for
          your support, and we want to recognize your commitment. Together,
          we're making a real impact and giving these animals a brighter future.
          Thank you for being a part of our journey.
        </p>
      </div>
      <Link to="/donate" className="btns">
        Donate Now
      </Link>
      <h1>Hall of Fame</h1>
      {loading ? (
        <img src={loader} alt="loading" className="loading" />
      ) : (
        <div className="flex flex-wrap w-11/12 justify-evenly gap-">
          {donations?.length > 0 ? (
            donations?.map((donation) => (
              <div
                key={donation._id}
                className="w-56 rounded overflow-hidden shadow-lg mb-4"
              >
                <div className="px-6 py-4">
                  <div className="font-bold text-xl text-center mb-2">
                    €{donation.amount}
                  </div>
                  <p className="text-gray-700 text-base">
                    donated by {donation.name ? donation.name : "Anonymous"} on{" "}
                    {donation.date_created}.
                  </p>
                </div>
              </div>
            ))
          ) : (
            <p>There are no recent donations.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default DonationPage;
