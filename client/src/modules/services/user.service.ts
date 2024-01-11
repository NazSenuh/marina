import { HttpService } from "./http.service";
import { IModifyUser } from "../types/marina.types";

export class UserServices {
  constructor(private httpService: HttpService) {
  }

  async modify(data:IModifyUser){
    return this.httpService.post<string, IModifyUser>('api/user/change', data, true)
  }
  async getUser(data: string, email:string){

    return this.httpService.get<IModifyUser>(`api/users/verify/${data}${email}`, true)
  }
}

const userService = new UserServices(new HttpService())
export default userService