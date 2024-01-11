import { HttpService } from "./http.service";

export class SlipService {
  constructor(private httpService: HttpService) {
  }

  async getAll(){
    return this.httpService.get('api/slips/', true);
  }

  async getOne(code: string){
    return this.httpService.get(`api/slips/${code}`, true);
  }

  async blockSlip(data:string, code: string){
    return this.httpService.patch(`api/slips/block/${code}`,{'blockingReason': data}, true);
  }

  async unBlockSlip(code: string){
    return this.httpService.patch(`api/slips/unblock/${code}`, true);
  }
}

const slipService = new SlipService(new HttpService())
export default slipService