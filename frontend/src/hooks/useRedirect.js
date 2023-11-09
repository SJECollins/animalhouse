import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getAccessTokenCookie } from "../utils/tokenUtils";
import { useCurrentUser } from "../contexts/UserContext";

export const useRedirect = (userAuthStatus) => {
  const currentUser = useCurrentUser();
  const navigate = useNavigate();

  useEffect(() => {
    const handleMount = () => {
      const accessToken = getAccessTokenCookie();
      if (accessToken && userAuthStatus === "loggedIn") {
        navigate("/");
      } else if (!accessToken && userAuthStatus === "loggedOut") {
        navigate("/sigin");
      } else if (userAuthStatus === "user") {
        if (currentUser?.role === "customer") {
          navigate("/");
        }
      }
    };
    handleMount();
  }, [navigate, userAuthStatus, currentUser]);
};
