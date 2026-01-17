export interface Boat {
  id: string; // Derived from serial_number (used for QR codes and URLs)
  serial_number: string; // Số TT - Column 3 - Primary identifier in Google Sheet
  district: string;
  boat_number: string;
  registration_date: string;
  boat_group: string; // Nhóm tàu - Column 10 (renamed from boat_type)
  main_job: string;
  side_job: string;
  boat_members: string;
  owner_name: string;
  citizen_id: string;
  phone: string;
  address: string;
  inspection_number: string; // Số sổ đăng kiểm/Sổ QLKT - Column 23
  inspection_expiry_date: string; // Ngày hết hạn đăng kiểm - Column 26
  boat_length: string; // Lmax (m) - Column 37
  total_power: string; // Tổng công suất (CV) - Column 37
}

export interface BoatSearchParams {
  page?: number;
  limit?: number;
  search?: string;
}

export interface BoatListResponse {
  boats: Boat[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
