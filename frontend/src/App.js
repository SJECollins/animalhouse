import NavBar from "./components/NavBar";
import { Routes, Route } from "react-router-dom";
import HomePage from "./pages/home/HomePage";
import SignIn from "./pages/auth/SignIn";
import SignUp from "./pages/auth/SignUp";
import AnimalPage from "./pages/animal/AnimalPage";
import AnimalsPage from "./pages/animal/AnimalsPage";
import AccountPage from "./pages/account/AccountPage";
import AnimalCreate from "./pages/animal/AnimalCreate";
import AnimalEdit from "./pages/animal/AnimalEdit";
import "./App.css";
import AdoptionForm from "./pages/adopt/AdoptionForm";
import DonationParent from "./pages/donate/DonationParent";
import DonationSuccess from "./pages/donate/DonationSuccess";
import DonationPage from "./pages/donate/DonationPage";
import Footer from "./components/Footer";

function App() {
  return (
    <div className="App">
      <NavBar />
      <Routes>
        <Route exact path="/" element={<HomePage />} />
        <Route exact path="/signin" element={<SignIn />} />
        <Route exact path="/signup" element={<SignUp />} />
        <Route exact path="/animals" element={<AnimalsPage />} />
        <Route exact path="/animal/:id" element={<AnimalPage />} />
        <Route exact path="/animal/edit/:id" element={<AnimalEdit />} />
        <Route exact path="/animal/new" element={<AnimalCreate />} />
        <Route exact path="/account/:id" element={<AccountPage />} />
        <Route exact path="/adopt/request" element={<AdoptionForm />} />
        <Route exact path="/adopt/request/:id" element={<AdoptionForm />} />
        <Route exact path="/donations" element={<DonationPage />} />
        <Route exact path="/donate" element={<DonationParent />} />
        <Route exact path="/donate/success" element={<DonationSuccess />} />
      </Routes>
      <Footer />
    </div>
  );
}

export default App;
