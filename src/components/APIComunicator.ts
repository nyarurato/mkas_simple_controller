import axios from "axios";
import { DefaultApi } from "./Duet/api";
import { Configuration } from "./Duet/configuration";
import RawAxiosRequestHeaders from "axios";

// Duetのconfig.gにM586 C"*"必要かもしれない

export class APIComunicator {
  private _duetAddress = "";
  public get duetAddress(): string {
    return this._duetAddress;
  }
  public get duetAddressWithoutHttp(): string {
    return this._duetAddress.replace(/^https?:\/\//, "");
  }
  private config = new Configuration();
  private api = new DefaultApi(this.config);
  private _is_connected = false;
  public get is_connected(): boolean {
    return this._is_connected;
  }

  constructor() {
    //pass

    this.config.password = "reprap";
  }

  public async checkValidAPI(address: string): Promise<boolean> {
    //もしaddressがhttp://かhttps://で始まっていない場合は、http://を付ける
    if (!address.match(/^https?:\/\//)) {
      address = "http://" + address;
    }

    //次にaddressがDuetのAPIを持っているか確認する
    this.config.basePath = address;
    const res = this.api.rrConnectGet("reprap");
    try {
      const res_val = await res;
      console.log(res_val);
      if (res_val.status === 200) {
        this._duetAddress = address;
        this._is_connected = true;
        return true;
      }
    } catch (error) {
      console.log(error);
      return false;
    }
    return false;
  }

  public async getDuetStatus(): Promise<string> {
    const res = this.api.rrModelGet("state.status", "f");

    try {
      const res_val = await res;
      console.log(res_val);
      if (res_val.status === 200) {
        return (res_val.data.result ?? "") as string;
      }
    } catch (error) {
      console.log(error);
      return "";
    }
    return "";
  }

  public async sendDuetCommand(gcode: string): Promise<boolean> {
    const res = this.api.rrGcodeGet(gcode);

    try {
      const res_val = await res;
      console.log(res_val);
      if (res_val.status === 200) {
        return true;
      }
    } catch (error) {
      console.log(error);
      return false;
    }
    return false;
  }
}
