import "./App.css";
import Header from "./components/Header";
import HomePage from "./components/HomePage";
import ResultPage from "./components/ResultPage";
import { createBrowserRouter, RouterProvider, Outlet } from "react-router-dom";

// Layout keeps Header visible on all pages
const Layout = () => {
  return (
    <>
      <Header />
      <Outlet /> {/* renders the current page */}
    </>
  );
};

// Router definition
const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { index: true, element: <HomePage /> }, // default page "/"
      { path: "result", element: <ResultPage /> }, // "/result"
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
