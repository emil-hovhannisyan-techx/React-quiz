import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import "@testing-library/jest-dom/vitest";
import LoginModal from "./LoginModal";
import * as utils from "../../utils";

describe("LoginModal", () => {
  let onLogin, onClose;

  beforeEach(() => {
    onLogin = vi.fn();
    onClose = vi.fn();

    // mock utils
    vi.spyOn(utils, "generateId").mockReturnValue("123");
    vi.spyOn(utils, "getUsers").mockReturnValue([]);
    vi.spyOn(utils, "saveUser").mockImplementation(() => {});

    localStorage.clear();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("renders sign in mode by default", () => {
    render(<LoginModal onLogin={onLogin} onClose={onClose} />);
    expect(
      screen.getByRole("heading", { name: "Sign In" })
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Sign In" })).toBeInTheDocument();
    expect(
      screen.getByText(/Access your QuizMaster Pro account/i)
    ).toBeInTheDocument();
  });

  it("switches to sign up and back", () => {
    render(<LoginModal onLogin={onLogin} onClose={onClose} />);
    fireEvent.click(screen.getByRole("button", { name: "Sign up" }));
    expect(
      screen.getByRole("heading", { name: "Sign Up" })
    ).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Sign In" }));
    expect(
      screen.getByRole("heading", { name: "Sign In" })
    ).toBeInTheDocument();
  });

  it("shows error when submitting empty form", () => {
    render(<LoginModal onLogin={onLogin} onClose={onClose} />);
    fireEvent.click(screen.getByRole("button", { name: "Sign In" }));
    expect(screen.getByText(/Please fill in all fields/i)).toBeInTheDocument();
  });

  it("signs up new user and calls onLogin", () => {
    render(<LoginModal onLogin={onLogin} onClose={onClose} />);

    fireEvent.click(screen.getByRole("button", { name: "Sign up" }));

    fireEvent.change(screen.getByRole("combobox"), {
      target: { value: "new@test.com" },
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: "secret" },
    });

    fireEvent.click(screen.getByRole("button", { name: "Sign Up" }));

    expect(utils.saveUser).toHaveBeenCalledWith({
      id: "123",
      email: "new@test.com",
      password: "secret",
    });
    expect(onLogin).toHaveBeenCalledWith({
      id: "123",
      email: "new@test.com",
      password: "secret",
    });
    expect(JSON.parse(localStorage.getItem("quizUser"))).toEqual({
      id: "123",
      email: "new@test.com",
      password: "secret",
    });
  });

  it("signs in existing user successfully", () => {
    const existingUser = { id: "1", email: "user@test.com", password: "pass" };
    utils.getUsers.mockReturnValue([existingUser]);

    render(<LoginModal onLogin={onLogin} onClose={onClose} />);

    fireEvent.change(screen.getByRole("combobox"), {
      target: { value: "user@test.com" },
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: "pass" },
    });

    fireEvent.click(screen.getByRole("button", { name: "Sign In" }));

    expect(onLogin).toHaveBeenCalledWith(existingUser);
    expect(JSON.parse(localStorage.getItem("quizUser"))).toEqual(existingUser);
  });

  it("shows error when credentials are invalid", () => {
    utils.getUsers.mockReturnValue([
      { id: "1", email: "user@test.com", password: "pass" },
    ]);

    render(<LoginModal onLogin={onLogin} onClose={onClose} />);

    fireEvent.change(screen.getByRole("combobox"), {
      target: { value: "wrong@test.com" },
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: "wrong" },
    });

    fireEvent.click(screen.getByRole("button", { name: "Sign In" }));

    expect(screen.getByText(/Invalid credentials/i)).toBeInTheDocument();
    expect(onLogin).not.toHaveBeenCalled();
  });

  it("calls onClose when close button is clicked", () => {
    render(<LoginModal onLogin={onLogin} onClose={onClose} />);
    fireEvent.click(screen.getByRole("button", { name: /×/i }));
    expect(onClose).toHaveBeenCalled();
  });
});
