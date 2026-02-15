import React, { createContext, useState, useEffect } from "react";

const UserContext = createContext();

export default UserContext;

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const savedUser = localStorage.getItem("quizUser");
    if (savedUser) setUser(JSON.parse(savedUser));
  }, []);

  const login = (userData) => {
    setUser(userData);
    localStorage.setItem("quizUser", JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("quizUser");
  };

  return (
    <UserContext.Provider value={{ user, login, logout }}>
      {children}
    </UserContext.Provider>
  );
};
