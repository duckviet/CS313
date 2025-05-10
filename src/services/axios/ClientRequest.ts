import type { AxiosInstance } from "axios";

import axios from "axios";

export default class ClientRequest {
  static instance: ClientRequest | null = null;

  public static getInstance(): ClientRequest {
    if (!ClientRequest.instance) {
      ClientRequest.instance = new ClientRequest();
    }
    return ClientRequest.instance;
  }

  private axiosInstance!: AxiosInstance;

  constructor() {
    this.axiosInstance = axios.create({
      baseURL: "https://2348-42-116-6-43.ngrok-free.app",
      timeout: 30000,
    });
  }
  public getAxiosInstance(): AxiosInstance {
    return this.axiosInstance;
  }
}
