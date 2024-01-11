import { HttpService } from "./http.service";
import { IEmail, ILoginUser, INewPass } from "../types/marina.types";

export class AuthService {
  constructor(private httpService: HttpService) {
  }
  

  async login(data:ILoginUser){
    return this.httpService.post<string, ILoginUser>('api/auth/login', data);
  }

  async sendEmail(data:IEmail){
    return this.httpService.post<string, IEmail>('api/auth/recover', data)
  }

  async setNewPassword(data:INewPass, link: string){
    return this.httpService.post<string, INewPass>(`api/auth/recover/${link}`, data)
  }
}

const authService = new AuthService(new HttpService())
export default authService