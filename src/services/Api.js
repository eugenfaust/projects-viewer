import axios from 'axios';

export default class Api {
  // Change hostname to your API server
  static HOSTNAME = 'http://localhost';

  static async doRequest(url, params, headers, method = 'get') {
    try {
      let response;
      if (method === 'get') {
        response = await axios[method](url, headers);
      } else {
        response = await axios[method](url, params, headers);
      }
      return { status: true, body: response };
    } catch (error) {
      return { status: false, detail: error.message };
    }
  }

  static async login(username, password) {
    const response = await this.doRequest(
      `${this.HOSTNAME}/token`,
      { username, password },
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      },
      'post',
    );
    if (response.status) {
      if (response.body.status === 200) {
        localStorage.setItem('token', response.body.data.access_token);
        return { status: true };
      }
      return { status: false, detail: response.body.data.detail };
    }
    return response;
  }

  static async getClients() {
    const response = await this.doRequest(
      `${this.HOSTNAME}/clients`,
      {},
      {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      },
    );
    if (response.status) {
      return response.body.data;
    }
    return false;
  }

  static async createClient(username) {
    const response = await this.doRequest(
      `${this.HOSTNAME}/clients/create`,
      {
        username,
      },
      {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      },
      'post',
    );
    if (response.status) {
      return response.body.data;
    }
    return false;
  }

  static async updateUsername(id, username) {
    const response = await this.doRequest(
      `${this.HOSTNAME}/clients/updateusername`,
      {
        username,
        id,
      },
      {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      },
      'post',
    );
    if (response.status) {
      return response.body.data;
    }
    return false;
  }

  static async updateClientStatus(clientId, status) {
    const response = await this.doRequest(
      `${this.HOSTNAME}/clients/updatestatus`,
      {
        id: clientId,
        status,
      },
      {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      },
      'post',
    );
    if (response.status) {
      return response.body.data;
    }
    return false;
  }

  static async getMe() {
    const response = await this.doRequest(
      `${this.HOSTNAME}/users/me`,
      {},
      {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      },
    );
    if (response.status) {
      return response.body.data;
    }
    return false;
  }
}
