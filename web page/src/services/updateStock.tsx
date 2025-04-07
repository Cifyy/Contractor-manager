import { Product } from '@/ts/Product';

export async function pushPost(token: string, name: string, change: number): Promise<Product[]> {
  const response = await fetch('http://localhost:8090/api/stock', {
    method: 'POST',
    mode: 'cors',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ name: name, change: change }),
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(`${response.status}:  ${error.error}`);
  }
  const data = await response.json();
  return data;
}

// export const update = async (token: string): Promise<Customer[]> => {
//   try {
//     const data = await fetchData<Customer>(token, 'customers');
//     return data;
//   } catch (err) {
//     throw new Error(`` + err);
//   }
// };
