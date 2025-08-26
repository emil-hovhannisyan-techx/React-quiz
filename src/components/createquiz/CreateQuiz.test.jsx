// src/components/createquiz/CreateQuiz.test.jsx
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { MemoryRouter } from "react-router-dom";
import CreateQuiz from "./CreateQuiz";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";

// Mock the useNavigate hook
const mockNavigate = vi.fn();
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe("CreateQuiz", () => {
  const mockOnClose = vi.fn();
  const defaultProps = { onClose: mockOnClose };

  const renderComponent = (props = {}) => {
    return render(
      <MemoryRouter>
        <CreateQuiz {...defaultProps} {...props} />
      </MemoryRouter>
    );
  };

  const fillForm = (overrides = {}) => {
    const values = {
      topic: "JavaScript Arrays",
      language: "English",
      count: 15,
      difficulty: "Easy",
      requirements: "Include array methods like map and filter",
      ...overrides,
    };

    const topicInput = screen.getByPlaceholderText(
      /e.g., JavaScript Fundamentals/i
    );
    fireEvent.change(topicInput, { target: { value: values.topic } });

    const languageSelect = screen.getByDisplayValue("English");
    fireEvent.change(languageSelect, { target: { value: values.language } });

    const countSelect = screen.getByDisplayValue("5 Questions");
    fireEvent.change(countSelect, { target: { value: String(values.count) } });

    const difficultySelect = screen.getByDisplayValue("Medium");
    fireEvent.change(difficultySelect, {
      target: { value: values.difficulty },
    });

    const requirementsTextarea = screen.getByPlaceholderText(
      /Any specific focus areas/i
    );
    fireEvent.change(requirementsTextarea, {
      target: { value: values.requirements },
    });

    return values;
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders modal with correct title and description", () => {
    renderComponent();

    expect(screen.getByText("Create New Quiz")).toBeInTheDocument();
    expect(
      screen.getByText("Configure your AI-generated quiz parameters")
    ).toBeInTheDocument();
  });

  it("renders all form fields with correct placeholders", () => {
    renderComponent();

    // Topic field
    expect(
      screen.getByPlaceholderText(/e.g., JavaScript Fundamentals/i)
    ).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText(/e.g., JavaScript Fundamentals/i)
    ).toHaveAttribute("required");

    // Language select
    expect(screen.getByDisplayValue("English")).toBeInTheDocument();

    // Question count select
    expect(screen.getByDisplayValue("5 Questions")).toBeInTheDocument();

    // Difficulty select
    expect(screen.getByDisplayValue("Medium")).toBeInTheDocument();

    // Requirements textarea
    expect(
      screen.getByPlaceholderText(/Any specific focus areas/i)
    ).toBeInTheDocument();

    // Submit button
    expect(
      screen.getByRole("button", { name: /generate quiz/i })
    ).toBeInTheDocument();

    // Close button
    expect(screen.getByText("×")).toBeInTheDocument();
  });

  it("populates dropdowns with correct options", () => {
    renderComponent();

    // Language options
    expect(screen.getByText("English")).toBeInTheDocument();
    expect(screen.getByText("Russian")).toBeInTheDocument();
    expect(screen.getByText("Armenian")).toBeInTheDocument();
    expect(screen.getByText("Spanish")).toBeInTheDocument();
    expect(screen.getByText("French")).toBeInTheDocument();
    expect(screen.getByText("German")).toBeInTheDocument();
    expect(screen.getByText("Chinese")).toBeInTheDocument();

    // Question count options
    expect(screen.getByText("5 Questions")).toBeInTheDocument();
    expect(screen.getByText("10 Questions")).toBeInTheDocument();
    expect(screen.getByText("15 Questions")).toBeInTheDocument();
    expect(screen.getByText("20 Questions")).toBeInTheDocument();

    // Difficulty options
    expect(screen.getByText("Easy")).toBeInTheDocument();
    expect(screen.getByText("Medium")).toBeInTheDocument();
    expect(screen.getByText("Hard")).toBeInTheDocument();
  });

  it("allows user to input values in all form fields", () => {
    renderComponent();

    const formValues = fillForm();

    expect(
      screen.getByPlaceholderText(/e.g., JavaScript Fundamentals/i)
    ).toHaveValue(formValues.topic);
    expect(screen.getByDisplayValue(formValues.language)).toBeInTheDocument();
    expect(
      screen.getByDisplayValue(`${formValues.count} Questions`)
    ).toBeInTheDocument();
    expect(screen.getByDisplayValue(formValues.difficulty)).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText(/Any specific focus areas/i)
    ).toHaveValue(formValues.requirements);
  });

  it("calls onClose when close button is clicked", () => {
    renderComponent();

    const closeButton = screen.getByText("×");
    fireEvent.click(closeButton);

    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it("submits form with correct data and navigates to result page", async () => {
    renderComponent();

    const formValues = fillForm();

    const submitButton = screen.getByRole("button", { name: /generate quiz/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith("/result", {
        state: {
          quizRequest: {
            topic: formValues.topic,
            language: formValues.language,
            count: Number(formValues.count),
            difficulty: formValues.difficulty,
            requirements: formValues.requirements,
          },
        },
      });
    });

    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it("requires topic field to be filled", async () => {
    renderComponent();

    // Fill all fields except topic
    fillForm({ topic: "" });

    const submitButton = screen.getByRole("button", { name: /generate quiz/i });
    fireEvent.click(submitButton);

    // Should not navigate when topic is empty due to HTML5 validation
    await waitFor(() => {
      expect(mockNavigate).not.toHaveBeenCalled();
    });

    expect(
      screen.getByPlaceholderText(/e.g., JavaScript Fundamentals/i)
    ).toBeRequired();
  });

  it("handles form submission with empty requirements", async () => {
    const user = userEvent.setup();
    render(<CreateQuiz onClose={mockOnClose} />);

    await user.type(
      screen.getByPlaceholderText(
        /e.g., JavaScript Fundamentals, World History, Biology/i
      ),
      "React Basics"
    );

    await user.click(screen.getByRole("button", { name: /Generate Quiz/i }));

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith("/result", {
        state: expect.objectContaining({
          quizRequest: expect.any(Object),
        }),
      });
    });
  });
  it("uses default values when form is submitted without changes", async () => {
    renderComponent();

    // Only fill the required topic field
    const topicInput = screen.getByPlaceholderText(
      /e.g., JavaScript Fundamentals, World History, Biology/i
    );
    fireEvent.change(topicInput, { target: { value: "Default Test" } });

    const submitButton = screen.getByRole("button", { name: /generate quiz/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith("/result", {
        state: {
          quizRequest: {
            topic: "Default Test",
            language: "English",
            count: 5,
            difficulty: "Medium",
            requirements: "",
          },
        },
      });
    });
  });

  it("handles language selection changes correctly", () => {
    renderComponent();

    const languageSelect = screen.getByDisplayValue("English");
    fireEvent.change(languageSelect, { target: { value: "Spanish" } });

    expect(languageSelect.value).toBe("Spanish");
  });

  it("handles question count selection changes correctly", () => {
    renderComponent();

    const countSelect = screen.getByDisplayValue("5 Questions");
    fireEvent.change(countSelect, { target: { value: "10" } });

    expect(countSelect.value).toBe("10");
  });

  it("handles difficulty selection changes correctly", () => {
    renderComponent();

    const difficultySelect = screen.getByDisplayValue("Medium");
    fireEvent.change(difficultySelect, { target: { value: "Hard" } });

    expect(difficultySelect.value).toBe("Hard");
  });

  it("displays correct number of options in each dropdown", () => {
    renderComponent();

    // Get all select elements
    const selects = screen.getAllByRole("combobox");

    // Language select should have 7 options
    const languageOptions = selects[0].querySelectorAll("option");
    expect(languageOptions).toHaveLength(7);

    // Question count select should have 4 options
    const countOptions = selects[1].querySelectorAll("option");
    expect(countOptions).toHaveLength(4);

    // Difficulty select should have 3 options
    const difficultyOptions = selects[2].querySelectorAll("option");
    expect(difficultyOptions).toHaveLength(3);
  });

  it("maintains form state after user interactions", () => {
    renderComponent();

    // Fill the form
    const formValues = fillForm();

    // Verify all values are maintained
    expect(
      screen.getByPlaceholderText(/e.g., JavaScript Fundamentals/i)
    ).toHaveValue(formValues.topic);
    expect(screen.getByDisplayValue(formValues.language)).toBeInTheDocument();
    expect(
      screen.getByDisplayValue(`${formValues.count} Questions`)
    ).toBeInTheDocument();
    expect(screen.getByDisplayValue(formValues.difficulty)).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText(/Any specific focus areas/i)
    ).toHaveValue(formValues.requirements);
  });

  it("handles special characters in topic and requirements", async () => {
    renderComponent();

    const topicInput = screen.getByPlaceholderText(
      /e.g., JavaScript Fundamentals/i
    );
    fireEvent.change(topicInput, {
      target: { value: "C# Programming & ASP.NET" },
    });

    const requirementsTextarea = screen.getByPlaceholderText(
      /Any specific focus areas/i
    );
    fireEvent.change(requirementsTextarea, {
      target: { value: "Focus on async/await & LINQ queries!" },
    });

    const submitButton = screen.getByRole("button", { name: /generate quiz/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith("/result", {
        state: {
          quizRequest: expect.objectContaining({
            topic: "C# Programming & ASP.NET",
            requirements: "Focus on async/await & LINQ queries!",
          }),
        },
      });
    });
  });

  it("resets form properly when closed and reopened", () => {
    const { unmount } = renderComponent();

    // Fill the form
    fillForm();

    // Unmount (simulate closing)
    unmount();

    // Re-render (simulate reopening)
    renderComponent();

    // Verify form is reset to defaults
    expect(
      screen.getByPlaceholderText(/e.g., JavaScript Fundamentals/i)
    ).toHaveValue("");
    expect(screen.getByDisplayValue("English")).toBeInTheDocument();
    expect(screen.getByDisplayValue("5 Questions")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Medium")).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText(/Any specific focus areas/i)
    ).toHaveValue("");
  });
});
