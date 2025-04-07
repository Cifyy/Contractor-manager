import { useAuth } from '@/components/utils/AuthProvider';
import { Customer, CustomerTileProps } from '@/ts/Customer';
import { CustomerContractList } from '@/ts/Order';
import { Contract, ContractTileProps } from '../ts/Contract';
import { Product } from '../ts/Product';

async function fetchData<Type>(token: string, endPoint: string): Promise<Type[]> {
  const response = await fetch('http://localhost:8090/api/' + endPoint, {
    method: 'GET',
    mode: 'cors',
    // credentials: 'include',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(`HTTP error! Status: ${response.status}:  ${error.error}`);
  }
  return await response.json();
}

export const getCustomers = async (token: string): Promise<Customer[]> => {
  try {
    const data = await fetchData<Customer>(token, 'customers');
    return data;
  } catch (err) {
    throw new Error(String(err));
  }
};

export const getCustomersTiles = async (token: string): Promise<CustomerTileProps[]> => {
  // if (token === null) token = localStorage.getItem('token');
  // if (!token) return [];
  try {
    const data = await fetchData<CustomerTileProps>(token, 'customerTiles');
    return data;
  } catch (err) {
    throw new Error(String(err));
  }
};

export const getContracts = async (token: string): Promise<Contract[]> => {
  try {
    const data = await fetchData<Contract>(token, 'contracts');
    data.forEach((e: any) => {
      e.start_date = new Date(e.start_date);
      e.end_date = new Date(e.end_date);
    });
    return data;
  } catch (err) {
    throw new Error(String(err));
  }
};

export const getContractTiles = async (token: string): Promise<ContractTileProps[]> => {
  try {
    const data = await fetchData<ContractTileProps>(token, 'contractTiles');
    data.forEach((e: any) => {
      e.start_date = new Date(e.start_date);
      e.end_date = new Date(e.end_date);
    });
    return data;
  } catch (err) {
    throw new Error(String(err));
  }
};

export const getProducts = async (token: string): Promise<Product[]> => {
  try {
    const data = await fetchData<Product>(token, 'products');
    return data;
  } catch (err) {
    throw new Error(String(err));
  }
};

export const getCustomerContracts = async (token: string): Promise<CustomerContractList[]> => {
  try {
    const data = await fetchData<CustomerContractList>(token, 'customerContracts');
    return data;
  } catch (err) {
    throw new Error(String(err));
  }
};
