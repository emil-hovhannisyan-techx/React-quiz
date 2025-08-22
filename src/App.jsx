import "./App.css";
import Header from "./components/Header";
import HomePage from "./components/HomePage";
import ResultPage from "./components/ResultPage";
import PassQuizPage from "./components/PassQuizPage";
import QuizListPage from "./components/QuizListPage";
import QuizReviewPage from "./components/QuizReviewPage";
import NotFoundPage from "./components/NotFoundPage";
import { createBrowserRouter, RouterProvider, Outlet } from "react-router-dom";
import { UserProvider } from "./context/UserContext";

const Layout = () => {
  return (
    <>
      <Header />
      <Outlet />
    </>
  );
};

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: "result", element: <ResultPage /> },
      { path: "passquiz", element: <PassQuizPage /> },
      { path: "quizzes", element: <QuizListPage /> },
      { path: "review", element: <QuizReviewPage /> },
      { path: "*", element: <NotFoundPage /> },
    ],
  },
]);

function App() {
  return (
    <UserProvider>
      <RouterProvider router={router} />
    </UserProvider>
  );
}

export default App;
