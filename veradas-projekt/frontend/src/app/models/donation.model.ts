export interface Donation {
  id: number;
  donationDate: string;
  eligible: boolean;
  ineligibleReason: string | null;
  doctorName: string;
  directed: boolean;
  patientName: string | null;
  patientTajNumber: string | null;
  location: {
    id: number;
    institutionName: string;
    address: string;
    active: boolean;
  };
  donor: {
    id: number;
    name: string;
    gender: string;
    citizenship: string;
    birthPlace: string;
    birthDate: string;
    address: string;
    tajNumber: string;
  };
}