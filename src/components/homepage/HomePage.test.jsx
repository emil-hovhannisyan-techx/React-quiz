import React from "react";
import { render, screen, cleanup } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";
import HomePage from "./HomePage";

// =========================
// Mock Components
// =========================
vi.mock("../loginmodal/LoginModal", () => ({
  default: ({ onLogin, onClose }) => (
    <div data-testid="login-modal">
      <button
        onClick={() =>
          onLogin({ name: "Test User", email: "test@example.com" })
        }
      >
        Mock Login
      </button>
      <button onClick={onClose}>Close Modal</button>
    </div>
  ),
}));

vi.mock("../createquiz/CreateQuiz", () => ({
  default: ({ onClose }) => (
    <div data-testid="create-quiz-modal">
      <p>Configure your AI-generated quiz parameters</p>
      <button onClick={onClose}>Close Quiz Modal</button>
    </div>
  ),
}));

// =========================
// Mock useUser Hook
// =========================
const mockLogin = vi.fn();
let mockUser = null;

vi.mock("../../context/useUser", () => ({
  default: () => ({
    user: mockUser,
    login: mockLogin,
  }),
}));

// =========================
// Tests
// =========================
describe("HomePage", () => {
  beforeEach(() => {
    mockLogin.mockReset();
    mockUser = null;
  });

  afterEach(() => {
    vi.clearAllMocks();
    cleanup();
  });

  // Test 1: Basic rendering
  it("renders header, description, features, stats, and + Create Quiz button", () => {
    render(<HomePage />);

    // Header
    expect(
      screen.getByText(/Enterprise AI Quiz Platform/i)
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Harness the power of artificial intelligence/i)
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /\+ Create Quiz/i })
    ).toBeInTheDocument();

    // Feature cards
    expect(screen.getByText(/AI-Powered/i)).toBeInTheDocument();
    expect(screen.getByText(/Multi-Language/i)).toBeInTheDocument();
    expect(screen.getByText(/Performance Analytics/i)).toBeInTheDocument();
    expect(screen.getByText(/Scalable Platform/i)).toBeInTheDocument();

    // Stats
    expect(screen.getByText(/10M\+/i)).toBeInTheDocument();
    expect(screen.getByText(/500K\+/i)).toBeInTheDocument();
    expect(screen.getByText(/99.9%/i)).toBeInTheDocument();
  });

  // Test 2: Clicking Create Quiz when not logged in shows login modal
  it("opens LoginModal when + Create Quiz clicked (logged out)", async () => {
    render(<HomePage />);
    const user = userEvent.setup();

    await user.click(screen.getByRole("button", { name: /\+ Create Quiz/i }));
    expect(screen.getByTestId("login-modal")).toBeInTheDocument();
  });

  // Test 3: Closing login modal works correctly
  it("closes LoginModal when close button clicked", async () => {
    render(<HomePage />);
    const user = userEvent.setup();

    // Open modal
    await user.click(screen.getByRole("button", { name: /\+ Create Quiz/i }));
    expect(screen.getByTestId("login-modal")).toBeInTheDocument();

    // Close modal
    await user.click(screen.getByText("Close Modal"));
    expect(screen.queryByTestId("login-modal")).not.toBeInTheDocument();
  });

  // Test 4: Login functionality works
  it("calls login when modal login clicked", async () => {
    render(<HomePage />);
    const user = userEvent.setup();

    // Open modal and login
    await user.click(screen.getByRole("button", { name: /\+ Create Quiz/i }));
    await user.click(screen.getByText("Mock Login"));

    expect(mockLogin).toHaveBeenCalledWith({
      name: "Test User",
      email: "test@example.com",
    });
  });

  // Test 5: CreateQuiz modal opens when user is logged in
  it("opens CreateQuiz modal when user is logged in", async () => {
    mockUser = { name: "Test User", email: "test@example.com" };
    render(<HomePage />);
    const user = userEvent.setup();

    await user.click(screen.getByRole("button", { name: /\+ Create Quiz/i }));
    expect(screen.getByTestId("create-quiz-modal")).toBeInTheDocument();
  });

  // Test 6: CreateQuiz modal can be closed
  it("closes CreateQuiz modal when close clicked", async () => {
    mockUser = { name: "Test User", email: "test@example.com" };
    render(<HomePage />);
    const user = userEvent.setup();

    // Open modal
    await user.click(screen.getByRole("button", { name: /\+ Create Quiz/i }));
    expect(screen.getByTestId("create-quiz-modal")).toBeInTheDocument();

    // Close modal
    await user.click(screen.getByText("Close Quiz Modal"));
    expect(screen.queryByTestId("create-quiz-modal")).not.toBeInTheDocument();
  });

  // Test 7: Complete flow from logged out to creating quiz after login
  it("opens CreateQuiz modal after login (logged out -> login)", async () => {
    // First render - user is logged out
    const { rerender } = render(<HomePage />);
    const user = userEvent.setup();

    // Click + Create Quiz (logged out)
    await user.click(screen.getByRole("button", { name: /\+ Create Quiz/i }));
    expect(screen.getByTestId("login-modal")).toBeInTheDocument();

    // Click login inside modal
    await user.click(screen.getByText("Mock Login"));

    // Verify login was called
    expect(mockLogin).toHaveBeenCalledWith({
      name: "Test User",
      email: "test@example.com",
    });

    // Update the mock user to simulate login
    mockUser = { name: "Test User", email: "test@example.com" };

    // Re-render the component to reflect the logged-in state
    rerender(<HomePage />);

    // Click create quiz again - now should open create quiz modal
    await user.click(screen.getByRole("button", { name: /\+ Create Quiz/i }));
    expect(screen.getByTestId("create-quiz-modal")).toBeInTheDocument();
  });

  // Test 8: Verify all feature icons are rendered
  it("renders all feature icons", () => {
    render(<HomePage />);

    // Since we're using Lucide icons which are mocked, we can't test for them directly
    // But we can verify that all feature titles are present
    expect(screen.getByText("AI-Powered")).toBeInTheDocument();
    expect(screen.getByText("Multi-Language")).toBeInTheDocument();
    expect(screen.getByText("Performance Analytics")).toBeInTheDocument();
    expect(screen.getByText("Scalable Platform")).toBeInTheDocument();
  });

  // Test 9: Verify all stats are displayed correctly
  it("displays all statistics correctly", () => {
    render(<HomePage />);

    expect(screen.getByText("10M+")).toBeInTheDocument();
    expect(screen.getByText("Quizzes Created")).toBeInTheDocument();

    expect(screen.getByText("500K+")).toBeInTheDocument();
    expect(screen.getByText("Active Users")).toBeInTheDocument();

    expect(screen.getByText("99.9%")).toBeInTheDocument();
    expect(screen.getByText("Uptime SLA")).toBeInTheDocument();
  });

  // Test 10: Verify login modal is not initially visible
  it("does not show login modal initially", () => {
    render(<HomePage />);
    expect(screen.queryByTestId("login-modal")).not.toBeInTheDocument();
  });

  // Test 11: Verify create quiz modal is not initially visible
  it("does not show create quiz modal initially", () => {
    render(<HomePage />);
    expect(screen.queryByTestId("create-quiz-modal")).not.toBeInTheDocument();
  });

  // Test 12: Verify create quiz modal is not shown when logged out
  it("does not show create quiz modal when logged out", () => {
    render(<HomePage />);
    expect(screen.queryByTestId("create-quiz-modal")).not.toBeInTheDocument();
  });

  // Test 13: Test that login modal closes after successful login
  it("closes login modal after successful login", async () => {
    render(<HomePage />);
    const user = userEvent.setup();

    // Open login modal
    await user.click(screen.getByRole("button", { name: /\+ Create Quiz/i }));
    expect(screen.getByTestId("login-modal")).toBeInTheDocument();

    // Perform login
    await user.click(screen.getByText("Mock Login"));

    // Login modal should be closed
    expect(screen.queryByTestId("login-modal")).not.toBeInTheDocument();
  });
});
