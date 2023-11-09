import "../App.css";
import logo from "../assets/ahlogo.png";
import { NavLink, useNavigate } from "react-router-dom";
import { useCurrentUser, useSetCurrentUser } from "../contexts/UserContext";
import { Menu } from "@headlessui/react";
import { axiosReq } from "../api/axiosDefaults";
import useClickOutsideToggle from "../hooks/useClickOutsideToggle";
import {
  getAccessTokenCookie,
  removeAccessTokenCookie,
} from "../utils/tokenUtils";

const NavBar = () => {
  const currentUser = useCurrentUser();
  const setCurrentUser = useSetCurrentUser();
  const navigate = useNavigate();
  const { expanded, setExpanded, ref } = useClickOutsideToggle();

  const handleSignOut = async () => {
    const access_token = getAccessTokenCookie();
    try {
      await axiosReq.post("/logout/", null, {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      });
      setCurrentUser(null);
      removeAccessTokenCookie();
      navigate("/");
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <nav
      className={`px-10 py-4 flex flex-col sm:flex-row justify-between align-center bg-purple-800 shadow-[0_0_12px_0_#8b5cf6] text-white`}
    >
      <div className="flex content-center justify-between">
        <NavLink to="/" className="flex content-center items-center">
          <img
            src={logo}
            alt="logo"
            className="w-14 h-14 object-contain rounded-md"
          />
          <span className="mb-1 mr-3">Animal House</span>
        </NavLink>
        <button
          type="button"
          className="sm:hidden"
          ref={ref}
          onClick={() => setExpanded(!expanded)}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
            />
          </svg>
        </button>
      </div>

      <div className={`${expanded ? "block" : "hidden"} sm:flex sm:flex-row`}>
        <div className="flex flex-col sm:flex-row items-start sm:items-center">
          <NavLink className="mr-3 py-2" to="/">
            Home
          </NavLink>
          <NavLink className="mr-3 py-2" to="/animals">
            Animals
          </NavLink>
          <NavLink className="mr-3 py-2" to="/donations">
            Donations
          </NavLink>
          {expanded ? (
            currentUser ? (
              <>
                <NavLink to={`/account/${currentUser?._id}`} className="py-2">
                  <span>Account</span>
                </NavLink>
                <NavLink onClick={handleSignOut} className="py-2">
                  Logout
                </NavLink>
              </>
            ) : (
              <>
                <NavLink to="/signin" className="py-2">
                  Sign In
                </NavLink>
                <NavLink to="/signup" className="py-2">
                  Sign Up
                </NavLink>
              </>
            )
          ) : (
            <div className="flex flex-col">
              <Menu>
                <Menu.Button>
                  {currentUser ? <>Account</> : <> Sign In </>}
                </Menu.Button>
                {currentUser ? (
                  <Menu.Items
                    className={`flex flex-col absolute mt-12 right-4 bg-purple-800 shadow-[0_35px_60px_-15px_rgba(0,0,0,0.3)] p-2 w-24`}
                  >
                    <Menu.Item>
                      <NavLink to={`/account/${currentUser?._id}`}>
                        <span>Account</span>
                      </NavLink>
                    </Menu.Item>
                    <Menu.Item>
                      <NavLink onClick={handleSignOut}>Logout</NavLink>
                    </Menu.Item>
                  </Menu.Items>
                ) : (
                  <Menu.Items
                    className={`flex flex-col absolute mt-12 right-4 bg-purple-800 shadow-[0_35px_60px_-15px_rgba(0,0,0,0.3)] p-2 w-24`}
                  >
                    <Menu.Item>
                      <NavLink to="/signin">Sign In</NavLink>
                    </Menu.Item>
                    <Menu.Item>
                      <NavLink to="/signup">Sign Up</NavLink>
                    </Menu.Item>
                  </Menu.Items>
                )}
              </Menu>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
