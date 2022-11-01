const API_SERVER = process.env.NEXT_PUBLIC_API;

export const checkLogin = async (): Promise<boolean> => {
  const localToken = localStorage.getItem('token');
  if (!localToken) return false;

  const token = {
    Authorization: 'Bearer ' + localStorage.getItem('token'),
  };

  const response = await fetch(`${API_SERVER}/auth/check`, {
    method: 'post',
    headers: token,
  });
  if (response.status !== 200) return false;
  const json = await response.json();
  return json as boolean;
};

interface Options {
  method: string;
  headers: HeadersInit;
  body: BodyInit;
}

export const requestWithToken = async (
  path: string,
  options?: Options
): Promise<Response> => {
  const token = {
    Authorization: 'Bearer ' + localStorage.getItem('token'),
  };

  const headers = Object.assign({}, options?.headers, token);
  console.log(headers);

  const response = await fetch(`${API_SERVER}${path}`, {
    ...options,
    headers: headers,
  });
  return response;
};
