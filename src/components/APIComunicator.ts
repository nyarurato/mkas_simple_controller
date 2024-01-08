import axios from "axios";
import { DefaultApi } from "./Duet/api";
import { Configuration } from "./Duet/configuration";
import RawAxiosRequestHeaders from "axios";

// Duetのconfig.gにM586 C"*"必要かもしれない

export class APIComunicator {
  private duetAddress = "";
  constructor() {
    //pass
  }

  public async checkValidAPI(address: string): Promise<boolean> {
    //もしaddressがhttp://かhttps://で始まっていない場合は、http://を付ける
    if (!address.match(/^https?:\/\//)) {
      address = "http://" + address;
    }

    //次にaddressがDuetのAPIを持っているか確認する
    const config = new Configuration();
    config.username = "reprap";
    config.password = "reprap";
    config.basePath = address;
    const headers = {};
    config.baseOptions = headers;
    const api = new DefaultApi(config);
    const res = api.rrConnectGet("reprap");
    try {
      const res_val = await res;
      console.log(res_val);
      if (res_val.status === 200) return true;
    } catch (error) {
      console.log(error);
      return false;
    }
    return false;
  }

  public openDuetConnection(address: string): boolean {
    return false;
  }

  public getDuetStatus(): void {
    //pass
  }

  public getDuetFiles(): void {
    //pass
  }

  public sendDuetCommand(): void {
    //pass
  }

  public sendDuetFile(): void {
    //pass
  }
}
