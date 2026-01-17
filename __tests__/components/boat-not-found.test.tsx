import { render, screen } from "@testing-library/react";
import { BoatNotFound } from "@/components/boats/boat-not-found";
import { vi } from "@/locales/vi";

describe("BoatNotFound", () => {
  it("should render not found message", () => {
    render(<BoatNotFound />);

    expect(screen.getByText(vi.boat.notFound)).toBeInTheDocument();
    expect(screen.getByText(vi.boat.notFoundDescription)).toBeInTheDocument();
  });

  it("should render back button", () => {
    render(<BoatNotFound />);

    const backButton = screen.getByRole("link", { name: vi.common.back });
    expect(backButton).toBeInTheDocument();
    expect(backButton).toHaveAttribute("href", "/");
  });

  it("should render alert icon", () => {
    const { container } = render(<BoatNotFound />);
    const svgElement = container.querySelector("svg");
    expect(svgElement).toBeInTheDocument();
  });

  it("matches snapshot", () => {
    const { container } = render(<BoatNotFound />);
    expect(container).toMatchSnapshot();
  });
});
