import { render, screen } from "@testing-library/react";
import { BoatCard } from "@/components/boats/boat-card";
import { Boat } from "@/types/boat";
import { vi } from "@/locales/vi";

const mockBoat: Boat = {
  id: "ST-001",
  serial_number: "ST-001",
  district: "Sơn Trà",
  boat_number: "ĐN-12345",
  registration_date: "01/01/2024",
  boat_group: "Câu Rê",
  main_job: "Đánh bắt cá",
  side_job: "Không",
  boat_members: "5",
  owner_name: "Nguyễn Văn A",
  citizen_id: "123456789",
  address: "123 Đường ABC, Đà Nẵng",
  phone: "0901234567",
  inspection_number: "001/ĐN",
  inspection_expiry_date: "01/01/2026",
  boat_length: "12.5",
  total_power: "500",
};

describe("BoatCard", () => {
  it("should render all boat information", () => {
    render(<BoatCard boat={mockBoat} />);

    // serial_number appears twice: in badge and in the field (since id = serial_number)
    expect(screen.getAllByText(mockBoat.serial_number).length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText(mockBoat.boat_number)).toBeInTheDocument();
    expect(screen.getByText(mockBoat.district)).toBeInTheDocument();
    expect(screen.getByText(mockBoat.registration_date)).toBeInTheDocument();
    expect(screen.getByText(mockBoat.boat_group)).toBeInTheDocument();
    expect(screen.getByText(mockBoat.main_job)).toBeInTheDocument();
    expect(screen.getByText(mockBoat.side_job)).toBeInTheDocument();
    expect(screen.getByText(mockBoat.boat_members)).toBeInTheDocument();
    expect(screen.getByText(mockBoat.owner_name)).toBeInTheDocument();
    expect(screen.getByText(mockBoat.citizen_id)).toBeInTheDocument();
    expect(screen.getByText(mockBoat.address)).toBeInTheDocument();
    expect(screen.getByText(mockBoat.phone)).toBeInTheDocument();
    expect(screen.getByText(mockBoat.inspection_number)).toBeInTheDocument();
    expect(screen.getByText(mockBoat.inspection_expiry_date)).toBeInTheDocument();
    expect(screen.getByText(mockBoat.boat_length)).toBeInTheDocument();
    expect(screen.getByText(mockBoat.total_power)).toBeInTheDocument();
  });

  it("should render field labels", () => {
    render(<BoatCard boat={mockBoat} />);

    expect(screen.getByText(vi.boat.serialNumber)).toBeInTheDocument();
    expect(screen.getByText(vi.boat.boatNumber)).toBeInTheDocument();
    expect(screen.getByText(vi.boat.district)).toBeInTheDocument();
    expect(screen.getByText(vi.boat.registrationDate)).toBeInTheDocument();
    expect(screen.getByText(vi.boat.boatGroup)).toBeInTheDocument();
    expect(screen.getByText(vi.boat.mainJob)).toBeInTheDocument();
    expect(screen.getByText(vi.boat.sideJob)).toBeInTheDocument();
    expect(screen.getByText(vi.boat.boatMembers)).toBeInTheDocument();
    expect(screen.getByText(vi.boat.ownerName)).toBeInTheDocument();
    expect(screen.getByText(vi.boat.citizenId)).toBeInTheDocument();
    expect(screen.getByText(vi.boat.address)).toBeInTheDocument();
    expect(screen.getByText(vi.boat.phone)).toBeInTheDocument();
    expect(screen.getByText(vi.boat.inspectionNumber)).toBeInTheDocument();
    expect(screen.getByText(vi.boat.inspectionExpiryDate)).toBeInTheDocument();
    expect(screen.getByText(vi.boat.boatLength)).toBeInTheDocument();
    expect(screen.getByText(vi.boat.totalPower)).toBeInTheDocument();
  });

  it("should render boat ID badge", () => {
    render(<BoatCard boat={mockBoat} />);

    // ID appears in both the badge and serial_number field, so we check for multiple instances
    const idElements = screen.getAllByText(mockBoat.id);
    expect(idElements.length).toBeGreaterThanOrEqual(1);
  });

  it("should render card title", () => {
    render(<BoatCard boat={mockBoat} />);

    expect(screen.getByText(vi.boat.title)).toBeInTheDocument();
  });

  it("matches snapshot", () => {
    const { container } = render(<BoatCard boat={mockBoat} />);
    expect(container).toMatchSnapshot();
  });
});
