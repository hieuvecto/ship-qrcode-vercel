import { Boat } from "@/types/boat";

// Configuration: Number of mock boats to generate
const MOCK_BOAT_COUNT = 50;

// Data pools for realistic Vietnamese boat data
const DISTRICTS = ["Sơn Trà", "Thanh Khê", "Ngũ Hành Sơn", "Liên Chiểu", "Hải Châu"];

const BOAT_GROUPS = [
  "Câu Rê",
  "Rê",
  "Rê 5",
  "Rê 6",
  "Rê 7",
  "Rê 8",
  "Rê 10",
  "Câu",
  "Câu vồng",
  "Lưới kéo",
  "Lưới rê",
  "Công suất từ 90cv - nhỏ hơn 400cv",
  "Công suất từ 400cv - nhỏ hơn 1000cv",
  "Công suất từ 1000cv trở lên",
];

const MAIN_JOBS = [
  "Đánh bắt cá ngừ",
  "Đánh bắt cá ngừ đại dương",
  "Đánh bắt cá ngừ vây xanh",
  "Đánh bắt tôm hùm",
  "Đánh bắt cá cơm",
  "Đánh bắt cá trích",
  "Đánh bắt mực",
  "Đánh bắt ghẹ",
  "Đánh bắt cá tạp",
  "Đánh bắt cá tạp ven biển",
  "Đánh bắt cá hồng",
  "Đánh bắt tôm",
];

const SIDE_JOBS = [
  "Đánh bắt cá mực",
  "Đánh bắt cá",
  "Đánh bắt cá cơm",
  "Đánh bắt cá trích",
  "Đánh bắt cá bè",
  "Đánh bắt cá kiếm",
  "Đánh bắt cá nhám",
  "Đánh bắt cá cờ",
  "Đánh bắt cá bơn",
  "Đánh bắt mực",
  "Đánh bắt ghẹ",
  "Đánh bắt tôm",
  "Đánh bắt cá tạp",
  "Rê",
  "Không",
];

const FAMILY_NAMES = ["Nguyễn", "Trần", "Lê", "Phạm", "Hoàng", "Phan", "Vũ", "Võ", "Đặng", "Bùi", "Đỗ", "Hồ", "Ngô", "Dương", "Lý"];

const MIDDLE_NAMES = ["Văn", "Thị", "Minh", "Thanh", "Hữu", "Đức", "Quang", "Anh", "Công", "Thành", "Tấn", "Xuân", "Tiến", "Hoài"];

const GIVEN_NAMES = [
  "An", "Bình", "Cường", "Đức", "Em", "Phúc", "Giang", "Hạnh", "Xuân", "Khánh",
  "Long", "Minh", "Nam", "Oanh", "Phát", "Quang", "Rô", "Sơn", "Cẩm", "Dàng",
  "Thanh", "Tài", "Hoa", "Hùng", "Kiên", "Linh", "Mai", "Nga", "Oanh", "Phương",
];

const STREETS = [
  "Võ Nguyên Giáp", "Trường Sa", "Hoàng Sa", "Nguyễn Hữu Thọ", "Ngô Quyền",
  "Điện Biên Phủ", "Hùng Vương", "Lê Duẩn", "Tôn Đức Thắng", "Lê Lợi",
  "Phan Châu Trinh", "Trần Phú", "Lý Thường Kiệt", "Nguyễn Tri Phương", "Hoàng Diệu",
  "Nguyễn Văn Linh", "Hải Phòng", "Ông Ích Khiêm", "Núi Thành", "Nguyễn Tất Thành",
];

// Utility functions
function randomItem<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function formatDate(year: number, month: number, day: number): string {
  return `${day.toString().padStart(2, "0")}/${month.toString().padStart(2, "0")}/${year}`;
}

function generateRandomDate(startYear: number, endYear: number): string {
  const year = randomInt(startYear, endYear);
  const month = randomInt(1, 12);
  const day = randomInt(1, 28); // Simplified to avoid month/day validation
  return formatDate(year, month, day);
}

function generateVietnameseName(): string {
  const familyName = randomItem(FAMILY_NAMES);
  const middleName = randomItem(MIDDLE_NAMES);
  const givenName = randomItem(GIVEN_NAMES);
  return `${familyName} ${middleName} ${givenName}`;
}

function generateBoatNumber(id: number): string {
  // Mix of ĐNa-XXXXX-TS and ĐN-XXXXX formats
  const useNewFormat = Math.random() > 0.3;
  const baseNumber = 90000 + id;

  if (useNewFormat) {
    return `ĐNa-${baseNumber}-TS`;
  } else {
    return `ĐN-${baseNumber.toString().slice(-5)}`;
  }
}

function generateInspectionNumber(id: number): string {
  const formats = [
    `${String(id).padStart(6, "0")}/ĐN`,
    `${90000 + id}/ĐKTC`,
    `${90000 + id}/ĐNa`,
    `${String(id).padStart(3, "0")}/${new Date().getFullYear()}`,
  ];
  return randomItem(formats);
}

function generateAddress(district: string): string {
  const streetNumber = randomInt(1, 999);
  const street = randomItem(STREETS);
  const addressType = Math.random() > 0.5 ? "Đường" : "Tổ";

  if (addressType === "Tổ") {
    return `Tổ ${randomInt(1, 99)}, Phường ${district}, Đà Nẵng`;
  } else {
    return `${streetNumber} Đường ${street}, Quận ${district}, Đà Nẵng`;
  }
}

function generatePhone(): string {
  const prefixes = ["090", "091", "093", "094", "097", "098", "032", "033", "034", "035", "036", "037", "038", "039"];
  const prefix = randomItem(prefixes);
  const suffix = randomInt(1000000, 9999999);
  return `${prefix}${suffix}`;
}

function generateCitizenId(): string {
  // Generate realistic Vietnamese citizen ID
  const prefix = randomItem(["048", "049", "201", "301"]);
  const middle = randomInt(100000, 999999);
  const suffix = randomInt(1000, 9999);
  return `${prefix}${middle}${suffix}`;
}

function addYearToDate(dateStr: string, years: number): string {
  const [day, month, year] = dateStr.split("/").map(Number);
  return formatDate(year + years, month, day);
}

// Main generator function
function generateBoat(id: number): Boat {
  const district = randomItem(DISTRICTS);
  const registrationDate = generateRandomDate(2020, 2025);
  const boatGroup = randomItem(BOAT_GROUPS);

  // Generate crew size based on boat group
  let crewSize: number;
  if (boatGroup.includes("90cv")) {
    crewSize = randomInt(3, 5);
  } else if (boatGroup.includes("400cv")) {
    crewSize = randomInt(6, 10);
  } else if (boatGroup.includes("1000cv")) {
    crewSize = randomInt(10, 15);
  } else {
    crewSize = randomInt(4, 12);
  }

  // Generate boat specs based on group
  let boatLength: number;
  let totalPower: number;

  if (boatGroup.includes("90cv - nhỏ hơn 400cv")) {
    boatLength = randomInt(80, 140) / 10; // 8.0 - 14.0m
    totalPower = randomInt(90, 390);
  } else if (boatGroup.includes("400cv - nhỏ hơn 1000cv")) {
    boatLength = randomInt(140, 200) / 10; // 14.0 - 20.0m
    totalPower = randomInt(400, 990);
  } else if (boatGroup.includes("1000cv trở lên")) {
    boatLength = randomInt(200, 300) / 10; // 20.0 - 30.0m
    totalPower = randomInt(1000, 2000);
  } else {
    boatLength = randomInt(100, 250) / 10; // 10.0 - 25.0m
    totalPower = randomInt(250, 1200);
  }

  return {
    id: id.toString(),
    serial_number: id.toString(),
    district,
    boat_number: generateBoatNumber(id),
    registration_date: registrationDate,
    boat_group: boatGroup,
    main_job: randomItem(MAIN_JOBS),
    side_job: randomItem(SIDE_JOBS),
    boat_members: crewSize.toString(),
    owner_name: generateVietnameseName(),
    citizen_id: generateCitizenId(),
    phone: generatePhone(),
    address: generateAddress(district),
    inspection_number: generateInspectionNumber(id),
    inspection_expiry_date: addYearToDate(registrationDate, randomInt(1, 3)),
    boat_length: boatLength.toFixed(2),
    total_power: totalPower.toString(),
  };
}

// Generate mock boats
export const mockBoats: Boat[] = Array.from({ length: MOCK_BOAT_COUNT }, (_, i) => generateBoat(i + 1));

// Export configuration for documentation
export const MOCK_DATA_CONFIG = {
  count: MOCK_BOAT_COUNT,
  districts: DISTRICTS,
  boatGroups: BOAT_GROUPS,
};
