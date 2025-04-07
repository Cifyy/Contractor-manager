export interface OrderTileProps {
  id: number;
  customer_name: string;
  reference_name: string | null;
  contract_name: string | null;
  value: number;
  date: Date;
  fulfilled: boolean;
}

export interface OrderItem {
  product_name: string | null;
  amount: number | null;
  price: number | null;
  tax: number | null;
}

export interface CustomerContractList {
  name: string;
  nip: string;
  contracts: CustomerContract[];
}

export interface CustomerContract {
  reference_name: string;
  start_date: Date;
  end_date: Date;
  products: ContractItemName[];
}

export interface ContractItemName {
  name: string;
  price: number;
  amount: number;
  tax: number;
}

export interface CustomerContractsWrapper {
  value: string;
  label: string;
  products: ContractItemName[];
}
