import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { axiosReq, axiosRes } from "../api/axiosDefaults";
import {
  getAccessTokenCookie,
  getRefreshTokenCookie,
  setAccessTokenCookie,
} from "../utils/tokenUtils";
import { useNavigate } from "react-router-dom";
import jwtDecode from "jwt-decode";

export const CurrentUserContext = createContext();
export const SetCurrentUserContext = createContext();

export const useCurrentUser = () => useContext(CurrentUserContext);
export const useSetCurrentUser = () => useContext(SetCurrentUserContext);

export const CurrentUserProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const navigate = useNavigate();

  const handleMount = async () => {
    const accessToken = getAccessTokenCookie();

    if (accessToken) {
      try {
        const { data } = await axiosRes.get("/user_data/");
        setCurrentUser(data);
      } catch (err) {
        console.log(err);
      }
    }
  };

  useEffect(() => {
    handleMount();
  }, []);

  useMemo(() => {
    axiosReq.interceptors.request.use(
      async (config) => {
        const accessToken = getAccessTokenCookie();
        const refreshToken = getRefreshTokenCookie();

        if (accessToken) {
          const decodedToken = jwtDecode(accessToken);
          if (decodedToken.exp && decodedToken.exp * 1000 < Date.now()) {
            try {
              const response = await axiosReq.post("/refresh/", {
                refresh_token: refreshToken,
              });
              const newAccessToken = response.data.accessToken;
              setAccessTokenCookie(newAccessToken);
            } catch (err) {
              setCurrentUser(null);
              navigate("/signin");
              return Promise.reject(err);
            }
          }

          config.headers.Authorization = `Bearer ${accessToken}`;
        }

        return config;
      },
      (err) => {
        return Promise.reject(err);
      }
    );
  }, [navigate]);

  return (
    <CurrentUserContext.Provider value={currentUser}>
      <SetCurrentUserContext.Provider value={setCurrentUser}>
        {children}
      </SetCurrentUserContext.Provider>
    </CurrentUserContext.Provider>
  );
};
