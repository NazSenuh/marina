import axios, { AxiosRequestConfig } from "axios";
import { ELogin } from "../types/marina.types";

export class HttpService {
  getFullUrl(url: string): string {
    return `${process.env.REACT_APP_BASE_URL}/${url}`;
  }

  async get<T>(url: string, withAuth?: boolean) {
    const res = await axios.get<T>(this.getFullUrl(url), {
      headers: { ...(withAuth && this.authConfig()) },
    });
    return res.data;
  }

  async post<T, D>(url: string, data: D,  withAuth?: boolean, options: AxiosRequestConfig<any> = {}) {
    const res = await axios.post<T>(this.getFullUrl(url), data, {headers: {...(withAuth && this.authConfig())}, ...options})
    return res.data
  }

  async patch<T, D>(url: string, data?: D,  withAuth?: boolean) {
    const res = await axios.patch<T>(this.getFullUrl(url), data, {headers: {...(withAuth && this.authConfig())}})
    return res.data
  }

  async delete<T, D>(url: string, data?: D,  withAuth?: boolean) {
    const res = await axios.delete<T>(this.getFullUrl(url), {headers: {...(withAuth && this.authConfig())}})
    return res.data
  }

  authConfig() {
    return { Authorization: `Bearer ${localStorage.getItem(ELogin.TOKEN)}` };
  }
}
