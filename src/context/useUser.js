import { useContext } from "react";
import UserContext from "./UserContext.jsx";

const useUser = () => useContext(UserContext);

export default useUser;
