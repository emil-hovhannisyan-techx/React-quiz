import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { MemoryRouter } from "react-router-dom";
import Header from "./Header";
import "@testing-library/jest-dom/vitest";

let mockUser = null;
const mockLogin = vi.fn();
const mockLogout = vi.fn();

vi.mock("../../context/useUser", () => ({
  default: () => ({
    user: mockUser,
    login: mockLogin,
    logout: mockLogout,
  }),
}));

vi.mock("../loginmodal/LoginModal", () => {
  return {
    default: ({ onLogin, onClose }) => (
      <div data-testid="login-modal">
        <button onClick={() => onLogin({ email: "test@example.com" })}>
          Mock Login
        </button>
        <button onClick={onClose}>Mock Close</button>
      </div>
    ),
  };
});

const mockNavigate = vi.fn();
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

beforeEach(() => {
  mockUser = null;
  mockLogin.mockReset();
  mockLogout.mockReset();
  mockNavigate.mockReset();
});

describe("Header", () => {
  it("renders title and Log In when logged out", () => {
    render(
      <MemoryRouter>
        <Header />
      </MemoryRouter>
    );

    expect(screen.getByText(/QuizMaster Pro/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /log in/i })).toBeInTheDocument();
  });

  it("shows welcome, username, and buttons when logged in", () => {
    mockUser = { email: "alice@example.com" };

    render(
      <MemoryRouter>
        <Header />
      </MemoryRouter>
    );

    expect(screen.getByText(/Welcome,/i)).toBeInTheDocument();
    expect(screen.getByText(/alice/i)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /browse quizzes/i })
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /logout/i })).toBeInTheDocument();
  });

  it("opens login modal when Log In button is clicked", () => {
    render(
      <MemoryRouter>
        <Header />
      </MemoryRouter>
    );

    const loginButton = screen.getByRole("button", { name: /log in/i });
    fireEvent.click(loginButton);

    expect(screen.getByTestId("login-modal")).toBeInTheDocument();
  });

  it("closes login modal when onClose is called", async () => {
    render(
      <MemoryRouter>
        <Header />
      </MemoryRouter>
    );

    const loginButton = screen.getByRole("button", { name: /log in/i });
    fireEvent.click(loginButton);
    expect(screen.getByTestId("login-modal")).toBeInTheDocument();

    const closeButton = screen.getByRole("button", { name: /mock close/i });
    fireEvent.click(closeButton);

    await waitFor(() => {
      expect(screen.queryByTestId("login-modal")).not.toBeInTheDocument();
    });
  });

  it("calls login and closes modal when onLogin is called", async () => {
    render(
      <MemoryRouter>
        <Header />
      </MemoryRouter>
    );

    const loginButton = screen.getByRole("button", { name: /log in/i });
    fireEvent.click(loginButton);

    const mockLoginButton = screen.getByRole("button", { name: /mock login/i });
    fireEvent.click(mockLoginButton);

    expect(mockLogin).toHaveBeenCalledWith({ email: "test@example.com" });

    await waitFor(() => {
      expect(screen.queryByTestId("login-modal")).not.toBeInTheDocument();
    });
  });

  it("calls logout when Logout button is clicked", () => {
    mockUser = { email: "alice@example.com" };

    render(
      <MemoryRouter>
        <Header />
      </MemoryRouter>
    );

    const logoutButton = screen.getByRole("button", { name: /logout/i });
    fireEvent.click(logoutButton);

    expect(mockLogout).toHaveBeenCalled();
  });

  it("navigates to quizzes page when Browse Quizzes button is clicked", () => {
    mockUser = { email: "alice@example.com" };

    render(
      <MemoryRouter>
        <Header />
      </MemoryRouter>
    );

    const browseButton = screen.getByRole("button", {
      name: /browse quizzes/i,
    });
    fireEvent.click(browseButton);

    expect(mockNavigate).toHaveBeenCalledWith("/quizzes");
  });

  it("handles email without @ symbol gracefully", () => {
    mockUser = { email: "invalidemail" };

    render(
      <MemoryRouter>
        <Header />
      </MemoryRouter>
    );

    expect(screen.getByText(/invalidemail/i)).toBeInTheDocument();
  });

  it("handles empty email gracefully", () => {
    mockUser = { email: "" };

    render(
      <MemoryRouter>
        <Header />
      </MemoryRouter>
    );

    expect(screen.getByText(/Welcome,/i)).toBeInTheDocument();
  });
});
