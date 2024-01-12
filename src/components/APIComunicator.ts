import axios from "axios";
import { DefaultApi } from "./Duet/api";
import { Configuration } from "./Duet/configuration";
import RawAxiosRequestHeaders from "axios";
import { toast } from "vuetify-sonner";

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
        toast.success("接続成功", {
          description: address + "へ接続しました。",
        });
        return true;
      }
    } catch (error: any) {
      console.log(error);
      toast.error("接続失敗", {
        description: address + "へ接続できませんでした。<br>" + error.message,
      });
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
        toast.success("Gコード送信成功", {
          description:
            this.duetAddress + "へGコードを送信しました。<br>" + gcode,
        });
        return true;
      } else {
        toast.error("Gコード送信失敗", {
          description:
            this.duetAddress +
            "へGコードを送信できませんでした。<br>" +
            res_val.status +
            " " +
            res_val.statusText,
        });
        return false;
      }
    } catch (error: any) {
      console.log(error);
      toast.error("Gコード送信失敗", {
        description:
          this.duetAddress +
          "へGコードを送信できませんでした。送信エラー<br>" +
          error.message,
      });
      return false;
    }
    return false;
  }
}
