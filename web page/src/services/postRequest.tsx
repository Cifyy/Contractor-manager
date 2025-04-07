export async function postReqID<T>(token: string, object: any, endPoint: string): Promise<T> {
  const response = await fetch('http://localhost:8090/api/' + endPoint, {
    method: 'POST',
    mode: 'cors',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(object),
  });
  if (!response.ok) {
    let errorText = await response.text();

    try {
      const errorJson = JSON.parse(errorText);
      console.error('Received JSON error:', errorJson);
      throw new Error(`${response.status}: ${JSON.stringify(errorJson)}`);
    } catch (e) {
      console.error('Received non-JSON error:', errorText);
      throw new Error(`${response.status}: ${errorText || 'No error details provided'}`);
    }
  }
  const data = await response.json();
  //   console.log(data);
  return data;
}
