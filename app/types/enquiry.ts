    export type EnquiryStatus = "NEW" | "IN_PROGRESS" | "CLOSED";

export interface IEnquiry {
  _id: string;
  full_name: string;
  email: string;
  mobile: string;
  qualification?: string | null;
  background?: string | null;
  current_location?: string | null;
  interested_course?: string | null;
  subject?: string | null;
  message?: string | null;
  source?: string;
  status: EnquiryStatus;
  created_at: string;
}

export interface EnquiryListResponse {
  success: boolean;
  data: {
    items: IEnquiry[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
  message?: string;
}

export interface EnquirySingleResponse {
  success: boolean;
  data: IEnquiry;
  message?: string;
}