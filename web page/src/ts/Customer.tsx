import { ContractTileProps } from './Contract';
import { ContractItemName } from './Order';

export interface Customer {
  nip: string;
  name: string;
  customer_type: string;
  additional_info: string;
}

export interface CustomerAddress {
  nip: string;
  country: string;
  province: String;
  city: String;
  street: String;
  street2: String | undefined;
  post_code: String;
}

export interface CustomerTileProps {
  nip: string;
  name: string;
  customerType: string;
  pneumatic_post: boolean | null;
  city: string;
  province: string;
  contracts_value: number;
  contracts_utilization_value: number;
}

export interface AddCustomerModalProps {
  close: () => void;
  opened: boolean;
  setCustomers: (customers: CustomerTileProps[]) => void;
}
export interface AddEmployeeModalProps {
  nip: string;
  close: () => void;
  opened: boolean;
  setCustomer: (customer: CustomerInfo) => void;
}

export interface CustomerInfo {
  nip: string;
  name: string;
  customer_type: string;
  contracts_value: number;
  additional_info: string | null;
  pneumatic_post: boolean | null;
  contracts_utilization_value: number;
  addresses: CustomerAddress[] | null;
  // contracts: CustomerContractInfo[] | null;
  contracts: ContractTileProps[] | null;
  employees: Employee[] | null;
}

export interface Employee {
  id: number;
  name: string;
  surname: string;
  email: string | null;
  phone: string | null;
  role: string | null;
}
