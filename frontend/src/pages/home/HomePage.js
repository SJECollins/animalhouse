import loader from "../../assets/loader.png";
import ahplaceholder from "../../assets/ahplaceholder.png";
import React, { useState, useEffect } from "react";
import { axiosRes } from "../../api/axiosDefaults";
import { Link } from "react-router-dom";

const HomePage = () => {
  const [recentAnimals, setRecentAnimals] = useState([]);
  const [recentDonors, setRecentDonors] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchRecentAnimals = async () => {
      try {
        const [{ data: animals }, { data: donors }] = await Promise.all([
          axiosRes.get("/animals/"),
          axiosRes.get("/donation/all/"),
        ]);
        if (animals.animals !== undefined) {
          getRecentAnimals(animals.animals);
        } else {
          setRecentAnimals([]);
        }
        if (donors.donations !== undefined) {
          getRecentDonors(donors.donations);
        } else {
          setRecentDonors([]);
        }
        setLoading(false);
      } catch (err) {
        console.log(err);
      }
    };
    setLoading(true);
    const timer = setTimeout(() => {
      fetchRecentAnimals();
    }, 1000);

    return () => {
      clearTimeout(timer);
    };
  }, []);

  const getRecentAnimals = (animals) => {
    let animalsByDate = animals.sort(
      (a, b) => -a.date_created.localeCompare(b.date_created)
    );
    setRecentAnimals(animalsByDate.slice(0, 5));
  };

  const getRecentDonors = (donors) => {
    let donorsByDate = donors.sort(
      (a, b) => -a.date_created.localeCompare(b.date_created)
    );
    for (let donors of donorsByDate) {
      donors.date_created = new Date(donors.date_created).toLocaleDateString(
        "en-GB"
      );
    }
    setRecentDonors(donorsByDate.slice(0, 5));
  };

  return (
    <div className="flex flex-col w-11/12 md:w-11/12 items-center mx-auto">
      <h1>Welcome to Animal House</h1>
      <h2>Where Every Paw Has a Purpose</h2>
      <div className="w-11/12 md:w-1/2 m-auto">
        <p className="text-justify">
          At Animal House, we're dedicated to giving animals a second chance at
          happiness and a loving forever home. Our mission is simple but
          powerful: to rescue, rehabilitate, and rehome animals in need.
        </p>
      </div>
      <div className="flex flex-col md:flex-row w-full md lg:w-11/12 justify-evenly gap-4 items-center mb-8">
        <div className="flex flex-col w-4/5 md:w-1/3">
          <h3>Meet Our Rescued Companions</h3>
          <p className="text-justify">
            Browse through our heartwarming stories of the animals currently in
            our care. Each furry friend has a unique tale of resilience and
            hope, waiting for the perfect match to share their life with.
          </p>
        </div>
        <div className="flex flex-col w-4/5 md:w-1/3">
          <h3>Your Path to Pet Parenthood</h3>
          <p className="text-justify">
            Ready to bring a new furry friend into your life? We're here to
            guide you through the adoption process. Submit your adoption request
            and discover the joy of giving an animal a loving home.
          </p>
        </div>
        <div className="flex flex-col w-4/5 md:w-1/3">
          <h3>Support Our Cause</h3>
          <p className="text-justify">
            Your support helps us provide essential care, medical attention, and
            love to animals in distress. Every donation, no matter the size,
            contributes to creating a brighter future for animals in need.
          </p>
        </div>
      </div>
      <p>
        Thank you for visiting Animal House. Together, we can make a difference
        in the lives of animals, one paw at a time.
      </p>
      {loading ? (
        <img src={loader} alt="loading" className="loading" />
      ) : (
        <div className="flex flex-col lg:w-11/12 justify-evenly items-center">
          <h2>Our Newest Animals:</h2>
          <div className="flex flex-wrap w-full justify-evenly gap-4">
            {recentAnimals?.length > 0 ? (
              recentAnimals?.map((animal) => (
                <div key={animal._id} className="w-56 rounded shadow-lg mb-4">
                  <Link to={"/animal/" + animal._id}>
                    {animal.picture === "placeholder.png" ? (
                      <img
                        className="w-full max-h-48"
                        src={ahplaceholder}
                        alt={animal.name}
                      />
                    ) : (
                      <img
                        className="w-full max-h-48 overflow-y-hidden object-cover"
                        src={animal.picture}
                        alt={animal.name}
                      />
                    )}
                    <div className="px-6 py-4">
                      <div className="font-bold text-xl text-center mb-2">
                        {animal.name}
                      </div>
                      <p className="text-gray-800 text-base text-justify h-16 overflow-hidden text-fade-out">
                        {animal.description}
                      </p>
                    </div>
                  </Link>
                </div>
              ))
            ) : (
              <p>There are no animals available for adoption at this time.</p>
            )}
          </div>
          <p>
            Visit our{" "}
            <Link to="/animals" className="underline">
              animals page
            </Link>{" "}
            to see all our animals.
          </p>
          <h2>Latest Donations: </h2>
          <div className="flex flex-wrap w-full justify-evenly gap-4">
            {recentDonors?.length > 0 ? (
              recentDonors?.map((donor) => (
                <div
                  key={donor._id}
                  className="w-56 rounded overflow-hidden shadow-lg mb-4"
                >
                  <Link to={"/donate"}>
                    <div className="px-6 py-4">
                      <div className="font-bold text-xl text-center mb-2">
                        €{donor.amount}
                      </div>
                      <p className="text-gray-800 text-base">
                        donated by {donor.name ? donor.name : "Anonymous"} on{" "}
                        {donor.date_created}.
                      </p>
                    </div>
                  </Link>
                </div>
              ))
            ) : (
              <p>There are no recent donations.</p>
            )}
          </div>
          <p>
            Visit our{" "}
            <Link to="/donate" className="underline">
              donation page
            </Link>{" "}
            to donate.
          </p>
        </div>
      )}
    </div>
  );
};

export default HomePage;
