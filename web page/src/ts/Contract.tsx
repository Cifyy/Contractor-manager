export interface Contract {
  id: number;
  reference_name: string;
  customer_name: string;
  nip: string;
  start_date: Date;
  end_date: Date;
}

export interface FullContract {
  reference_name: string;
  customer_name: string;
  nip: string;
  start_date: Date;
  end_date: Date;
  products: ContractItem[];
}

export interface ContractTileProps {
  id: number;
  nip: string;
  reference_name: string;
  customer_name: string;
  start_date: Date;
  end_date: Date;
  contract_value: number;
  contract_utilization_value: number;
}

export interface ContractItem {
  contract_reference_name: string | null;
  product_name: string | null;
  amount: number | null;
  price: number | null;
  tax: number | null;
}
export interface AddModalProp<T> {
  close: () => void;
  opened: boolean;
  setObjects: (object: T[]) => void;
}
