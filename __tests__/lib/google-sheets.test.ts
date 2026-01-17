// Mock the google-spreadsheet module to avoid ESM import issues with ky dependency
jest.mock("google-spreadsheet", () => ({}));

import { COLUMN_INDICES, COLUMN_MAPPING, rowToBoat } from "@/lib/google-sheets";

describe("google-sheets", () => {
  describe("COLUMN_INDICES", () => {
    it("should have correct column indices", () => {
      expect(COLUMN_INDICES.serial_number).toBe(0);
      expect(COLUMN_INDICES.district).toBe(1);
      expect(COLUMN_INDICES.boat_number).toBe(2);
      expect(COLUMN_INDICES.registration_date).toBe(3);
      expect(COLUMN_INDICES.boat_group).toBe(4);
      expect(COLUMN_INDICES.main_job).toBe(5);
      expect(COLUMN_INDICES.side_job).toBe(6);
      expect(COLUMN_INDICES.boat_members).toBe(7);
      expect(COLUMN_INDICES.owner_name).toBe(8);
      expect(COLUMN_INDICES.citizen_id).toBe(9);
      expect(COLUMN_INDICES.phone).toBe(10);
      expect(COLUMN_INDICES.address).toBe(11);
      expect(COLUMN_INDICES.inspection_number).toBe(12);
      expect(COLUMN_INDICES.inspection_expiry_date).toBe(13);
      expect(COLUMN_INDICES.boat_length).toBe(14);
      expect(COLUMN_INDICES.total_power).toBe(15);
    });
  });

  describe("COLUMN_MAPPING (legacy reference)", () => {
    it("should have correct Vietnamese column headers", () => {
      expect(COLUMN_MAPPING.serial_number).toBe("Số TT");
      expect(COLUMN_MAPPING.district).toBe("Quận/huyện");
      expect(COLUMN_MAPPING.boat_number).toBe("Số ĐK");
      expect(COLUMN_MAPPING.registration_date).toBe("Ngày ĐK");
      expect(COLUMN_MAPPING.boat_group).toBe("Nhóm tàu");
      expect(COLUMN_MAPPING.main_job).toBe("Nghề chính");
      expect(COLUMN_MAPPING.side_job).toBe("Nghề phụ");
      expect(COLUMN_MAPPING.boat_members).toBe("Số thuyền viên");
      expect(COLUMN_MAPPING.owner_name).toBe("Chủ phương tiện");
      expect(COLUMN_MAPPING.citizen_id).toBe("Số CMND");
      expect(COLUMN_MAPPING.phone).toBe("Điện thoại");
      expect(COLUMN_MAPPING.address).toBe("Địa chỉ");
      expect(COLUMN_MAPPING.inspection_number).toBe("Số sổ đăng kiểm/Sổ QLKT");
      expect(COLUMN_MAPPING.inspection_expiry_date).toBe("Ngày hết hạn đăng kiểm");
      expect(COLUMN_MAPPING.boat_length).toBe("Lmax (m)");
      expect(COLUMN_MAPPING.total_power).toBe("Tổng công suất");
    });
  });

  describe("rowToBoat", () => {
    it("should transform row data to Boat object using column indices", () => {
      const mockRow = {
        _rawData: [
          "ST-001",           // 0: serial_number
          "Sơn Trà",          // 1: district
          "ĐN-12345",         // 2: boat_number
          "01/01/2024",       // 3: registration_date
          "Câu Rê",           // 4: boat_group
          "Đánh bắt cá",      // 5: main_job
          "Không",            // 6: side_job
          "5",                // 7: boat_members
          "Nguyễn Văn A",     // 8: owner_name
          "123456789",        // 9: citizen_id
          "0901234567",       // 10: phone
          "123 Đường ABC, Đà Nẵng", // 11: address
          "001/ĐN",           // 12: inspection_number
          "01/01/2026",       // 13: inspection_expiry_date
          "12.5",             // 14: boat_length
          "500",              // 15: total_power
        ],
      };

      const boat = rowToBoat(mockRow);

      expect(boat).toEqual({
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
        phone: "0901234567",
        address: "123 Đường ABC, Đà Nẵng",
        inspection_number: "001/ĐN",
        inspection_expiry_date: "01/01/2026",
        boat_length: "12.5",
        total_power: "500",
      });
    });

    it("should handle empty values", () => {
      const mockRow = {
        _rawData: Array(16).fill(""),
      };

      const boat = rowToBoat(mockRow);

      expect(boat).toEqual({
        id: "",
        serial_number: "",
        district: "",
        boat_number: "",
        registration_date: "",
        boat_group: "",
        main_job: "",
        side_job: "",
        boat_members: "",
        owner_name: "",
        citizen_id: "",
        address: "",
        phone: "",
        inspection_number: "",
        inspection_expiry_date: "",
        boat_length: "",
        total_power: "",
      });
    });

    it("should handle null and undefined values", () => {
      const mockRow = {
        _rawData: [null, undefined, null, undefined, null, undefined, null, undefined, null, undefined, null, undefined, null, undefined, null, undefined],
      };

      const boat = rowToBoat(mockRow);

      expect(boat.serial_number).toBe("");
      expect(boat.district).toBe("");
      expect(boat.boat_number).toBe("");
      expect(boat.registration_date).toBe("");
    });
  });
});
