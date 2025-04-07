import { CustomerInfo } from '@/ts/Customer';
import { getCustomersTiles } from './api';
import { postReqID } from './postRequest';

export const getCustomerInfo = async (token: string, nip: string): Promise<CustomerInfo> => {
  try {
    const data = await postReqID<CustomerInfo>(token, { nip: nip }, 'customerInfo');
    data.contracts?.forEach((e: any) => {
      e.start_date = new Date(e.start_date);
      e.end_date = new Date(e.end_date);
    });
    return data;
  } catch (err) {
    throw new Error(String(err));
  }
};

// const customersLoader = async () => {
//   const token = localStorage.getItem('token');
//   if (!token) return [];
//   console.log('Loader executed');
//   return getCustomersTiles(token);
// };

// export const customersLoader = async () => {
//   const token = localStorage.getItem('token');
//   if (!token) return [];
//   console.log('FETCHING LMAO!!!');
//   // loadedCustomers.sort(compareName);
//   return getCustomersTiles(token);
// };
