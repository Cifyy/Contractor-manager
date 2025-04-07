export async function login(username: string, password: string): Promise<string> {
  const response = await fetch('http://localhost:8090/auth/login', {
    mode: 'cors',
    method: 'POST',
    headers: {
      'content-type': 'application/json',
    },
    body: JSON.stringify({ username, password }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(`${response.status}:  ${error.error}`);
  }
  const data = await response.json();
  return data;
}

export async function checkToken(token: string) {
  const response = await fetch('http://localhost:8090/api/checkToken', {
    method: 'GET',
    mode: 'cors',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(`Status: ${response.status}:  ${error.error}`);
  }
  return;
}

// fetch('http://localhost:8080/auth/login', {
//   mode: 'cors',
//   method: 'POST',
//   headers: {
//     'content-type': 'application/json',
//   },
//   body: JSON.stringify({ username, password }),
// })
//   .then(async (res) => {
//     if (!res.ok) {
//       const error = await res.json();
//       throw new Error(`HTTP error! Status: ${res.status}:  ${error.error}`);
//     }
//     return res.json();
//   })
//   .then((data) => {
//     // if (data.error) {
//     //   console.log('Failed to authenticate');
//     //   console.log(data.error);
//     // }

//     // console.log(data.token);
//     // localStorage.setItem('jwt-token', data.token);
//     setToken(data.token);
//     setUsername('');
//     setPassword('');
//     navigate('/zamowienia', { replace: true });
//   });
