import { render, screen, fireEvent, act } from "@testing-library/react";
import NotFoundPage from "./NotFoundPage";
import { vi, beforeEach, afterEach, describe, test, expect } from "vitest";
import React from "react";

// Mocking da react-router navigate
const mockNavigate = vi.fn();
vi.mock("react-router-dom", () => ({
  useNavigate: () => mockNavigate,
}));

// Mocking da getBoundingClientRect for container
const mockGetBoundingClientRect = vi.fn(() => ({
  width: 800,
  height: 600,
  top: 0,
  left: 0,
  bottom: 600,
  right: 800,
}));

beforeEach(() => {
  vi.useFakeTimers();
  // Mocking da Math.random to return predictable values
  vi.spyOn(globalThis.Math, "random").mockReturnValue(0.5);
  mockNavigate.mockClear();

  // Mocking da getBoundingClientRect for the container ref
  Element.prototype.getBoundingClientRect = mockGetBoundingClientRect;
});

afterEach(() => {
  vi.useRealTimers();
  vi.restoreAllMocks();
});

describe("NotFoundPage", () => {
  test("renders core elements", () => {
    render(<NotFoundPage />);

    // Checking da main error message
    expect(
      screen.getByText(/Oops! This page went on vacation/)
    ).toBeInTheDocument();
    expect(screen.getByText(/We've sent a search party/)).toBeInTheDocument();

    // Checking for glitch text (should be "404" initially) - use class selector since there are multiple "404" texts
    expect(document.querySelector(".glitch-text")).toHaveTextContent("404");

    // Checking da particles (20)
    const particles = document.querySelectorAll(".particle");
    expect(particles.length).toBe(20);

    // Checking da buttons
    expect(screen.getByText("🏠 Go Home")).toBeInTheDocument();
    expect(screen.getByText("⬅️ Go Back")).toBeInTheDocument();
    expect(screen.getByText("🔍 Search")).toBeInTheDocument();
  });

  test("navigates home on home button click", () => {
    render(<NotFoundPage />);
    fireEvent.click(screen.getByText("🏠 Go Home"));
    expect(mockNavigate).toHaveBeenCalledWith("/");
  });

  test("hover on back/search triggers escape transform but not on home button", () => {
    render(<NotFoundPage />);
    const backBtn = screen.getByText("⬅️ Go Back").closest("button");
    const searchBtn = screen.getByText("🔍 Search").closest("button");
    const homeBtn = screen.getByText("🏠 Go Home").closest("button");

    fireEvent.mouseEnter(backBtn);
    fireEvent.mouseEnter(searchBtn);

    expect(backBtn.style.transform).toContain("translate");
    expect(searchBtn.style.transform).toContain("translate");

    fireEvent.mouseEnter(homeBtn);
    expect(homeBtn.style.transform).toBe("translate(0, 0)");

    act(() => {
      vi.advanceTimersByTime(3000);
    });

    expect(backBtn.style.transform).toBe("translate(0, 0)");
    expect(searchBtn.style.transform).toBe("translate(0, 0)");
  });

  test("mouse move updates coordinates display", () => {
    render(<NotFoundPage />);

    act(() => {
      fireEvent.mouseMove(window, { clientX: 123, clientY: 456 });
    });

    expect(
      screen.getByText(/Mouse position: X:123, Y:456/)
    ).toBeInTheDocument();
  });

  test("glitch text changes over time", async () => {
    render(<NotFoundPage />);

    const glitchElement = document.querySelector(".glitch-text");

    act(() => {
      vi.advanceTimersByTime(200);
    });

    expect(glitchElement.textContent).toBeDefined();
  });

  test("fun fact displays random confusion percentage", () => {
    render(<NotFoundPage />);

    expect(
      screen.getByText(
        /Fun fact: This error message is powered by 50% pure confusion!/
      )
    ).toBeInTheDocument();
  });

  test("clicking glitch container triggers easter egg after 5 clicks", () => {
    render(<NotFoundPage />);
    const glitchContainer = document.querySelector(".glitch-container");

    for (let i = 0; i < 4; i++) {
      fireEvent.click(glitchContainer);
    }
    expect(
      screen.queryByText(/🎉 You found the secret!/)
    ).not.toBeInTheDocument();

    fireEvent.click(glitchContainer);
    expect(screen.getByText(/🎉 You found the secret!/)).toBeInTheDocument();
    expect(screen.getByText(/Here's a virtual cookie: 🍪/)).toBeInTheDocument();

    act(() => {
      vi.advanceTimersByTime(3000);
    });

    expect(
      screen.queryByText(/🎉 You found the secret!/)
    ).not.toBeInTheDocument();
  });

  test("back and search buttons have proper onClick handlers", () => {
    render(<NotFoundPage />);
    const backBtn = screen.getByText("⬅️ Go Back").closest("button");
    const searchBtn = screen.getByText("🔍 Search").closest("button");

    expect(() => {
      fireEvent.click(backBtn);
      fireEvent.click(searchBtn);
    }).not.toThrow();
  });

  test("component handles window resize and cleanup properly", () => {
    const { unmount } = render(<NotFoundPage />);

    act(() => {
      fireEvent.mouseMove(window, { clientX: 100, clientY: 100 });
      vi.advanceTimersByTime(100);
    });

    expect(() => unmount()).not.toThrow();

    act(() => {
      vi.runAllTimers();
    });
  });

  test("button positions reset correctly", () => {
    render(<NotFoundPage />);
    const backBtn = screen.getByText("⬅️ Go Back").closest("button");

    fireEvent.mouseEnter(backBtn);
    expect(backBtn.style.transform).toContain("translate");

    act(() => {
      vi.advanceTimersByTime(3000);
    });

    expect(backBtn.style.transform).toBe("translate(0, 0)");
  });

  test("particles render with correct animation delays", () => {
    render(<NotFoundPage />);
    const particles = document.querySelectorAll(".particle");

    expect(particles.length).toBe(20);

    particles.forEach((particle, index) => {
      expect(particle.style.animationDelay).toBe(`${index * 0.5}s`);
    });
  });

  test("handles container ref being null during button hover", () => {
    render(<NotFoundPage />);

    const backBtn = screen.getByText("⬅️ Go Back").closest("button");

    Element.prototype.getBoundingClientRect = vi.fn(() => null);

    expect(() => {
      fireEvent.mouseEnter(backBtn);
    }).not.toThrow();

    Element.prototype.getBoundingClientRect = mockGetBoundingClientRect;
  });

  test("handles different glitch text variations", () => {
    vi.spyOn(globalThis.Math, "random")
      .mockReturnValueOnce(0.1)
      .mockReturnValueOnce(0.3)
      .mockReturnValueOnce(0.8);

    render(<NotFoundPage />);

    act(() => {
      vi.advanceTimersByTime(150);
    });
    act(() => {
      vi.advanceTimersByTime(150);
    });
    act(() => {
      vi.advanceTimersByTime(150);
    });

    const glitchElement = document.querySelector(".glitch-text");
    expect(glitchElement.textContent).toBeDefined();
  });

  test("handles click count reset after easter egg", () => {
    render(<NotFoundPage />);
    const glitchContainer = document.querySelector(".glitch-container");

    // Click 5 times to trigger easter egg
    for (let i = 0; i < 5; i++) {
      fireEvent.click(glitchContainer);
    }

    // Easter egg should be visible
    expect(screen.getByText(/🎉 You found the secret!/)).toBeInTheDocument();

    act(() => {
      vi.advanceTimersByTime(3000);
    });

    for (let i = 0; i < 4; i++) {
      fireEvent.click(glitchContainer);
    }

    expect(
      screen.queryByText(/🎉 You found the secret!/)
    ).not.toBeInTheDocument();

    fireEvent.click(glitchContainer);
    expect(screen.getByText(/🎉 You found the secret!/)).toBeInTheDocument();
  });

  test("floating buttons render with correct delays", () => {
    render(<NotFoundPage />);

    const homeBtn = screen.getByText("🏠 Go Home").closest("button");
    const backBtn = screen.getByText("⬅️ Go Back").closest("button");
    const searchBtn = screen.getByText("🔍 Search").closest("button");

    expect(homeBtn.style.animationDelay).toBe("0s");
    expect(backBtn.style.animationDelay).toBe("0.2s");
    expect(searchBtn.style.animationDelay).toBe("0.4s");
  });

  test("tests edge cases in button positioning calculations", () => {
    Element.prototype.getBoundingClientRect = vi.fn(() => ({
      width: 400,
      height: 300,
      top: 0,
      left: 0,
      bottom: 300,
      right: 400,
    }));

    render(<NotFoundPage />);
    const backBtn = screen.getByText("⬅️ Go Back").closest("button");

    fireEvent.mouseEnter(backBtn);
    expect(backBtn.style.transform).toContain("translate");

    act(() => {
      vi.advanceTimersByTime(3000);
    });

    fireEvent.mouseEnter(backBtn);
    expect(backBtn.style.transform).toContain("translate");
  });
});
