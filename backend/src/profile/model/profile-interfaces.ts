import { Country } from '../../artist/model/artist.model';

export interface ManagerData {
  agencyName: string;
  agencyCompanyName: string;
  nameOfBank: string;
  accountHolder: string;
  agencyCountry: Country;
  accountAddress: string;
  accountNumber: string;
  accountSwift: string;
  agencyEmail: string;
  agencyPhone: string;
}

export interface Size {
  width: number;
  height: number;
}
