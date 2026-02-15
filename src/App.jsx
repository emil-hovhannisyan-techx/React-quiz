import "./App.css";
import Header from "./components/header/Header";
import HomePage from "./components/homepage/HomePage";
import ResultPage from "./components/resultpage/ResultPage";
import PassQuizPage from "./components/passquizpage/PassQuizPage";
import QuizListPage from "./components/quizlistpage/QuizListPage";
import QuizReviewPage from "./components/quizreviewpage/QuizReviewPage";
import NotFoundPage from "./components/notfoundpage/NotFoundPage";
import { createBrowserRouter, RouterProvider, Outlet } from "react-router-dom";
import { UserProvider } from "./context/UserContext.jsx";

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
