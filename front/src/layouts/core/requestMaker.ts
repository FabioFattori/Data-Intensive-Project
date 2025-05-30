import axios from 'axios';

interface SingleRoute {
  route: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
}

const routes: { [key: string]: SingleRoute } = {
  predict: {
    route: '/predict',
    method: 'POST',
  },
  changeModel: {
    route: '/changeModel',
    method: 'POST',
  },
  getStatistics: {
    route: '/getStatistics',
    method: 'GET',
  },
};

const serverBaseUrl = 'http://127.0.0.1:5000';

export const requestMaker = async (route: string, data?: any): Promise<any> => {
  const url = `${serverBaseUrl}${routes[route].route}`;

  try {
    const response = await axios({
      method: routes[route].method,
      url: url,
      data: data,
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  } catch (error) {
    console.error(`Error making request to ${url}:`, error);
    throw error;
  }
};
