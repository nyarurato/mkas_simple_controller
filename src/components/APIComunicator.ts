import axios, { Axios } from "axios";
import { DefaultApi } from "./Duet/api";
import { Configuration } from "./Duet/configuration";
import RawAxiosRequestHeaders from "axios";
import { toast } from "vuetify-sonner";
import { AxiosError } from "axios";

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
  private _status = "disconnected";
  public get status(): string {
    return this._status;
  }
  public _last_message = "";
  public get last_message(): string {
    return this._last_message;
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
    if (this._duetAddress === "") {
      this._duetAddress = address;
    }

    //次にaddressがDuetのAPIを持っているか確認する
    this.config.basePath = address;
    const res = this.api.rrConnectGet("reprap");
    try {
      const res_val = await res;
      //console.log(res_val);
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

      if (res_val.status === 200) {
        this._status = (res_val.data.result ?? "") as string;
        return (res_val.data.result ?? "") as string;
      }
    } catch (error: any) {
      if (error instanceof AxiosError) {
        if (
          error.code === AxiosError.ERR_NETWORK ||
          error.code === AxiosError.ETIMEDOUT
        ) {
          if (this._is_connected) {
            toast.error("Duetとの通信エラー", {
              description: this.duetAddress + "との通信が失敗しました。",
            });
            this._is_connected = false;
          }
          this._status = DUETSTATUS[0].key;
        }
      }

      console.log(error);
      return "error";
    }

    return "error";
  }

  public async getDuetLastMessage(): Promise<string> {
    const res = this.api.rrReplyGet();

    try {
      const res_val = await res;
      console.log(res_val.data);
      console.log(typeof res_val.data);
      if (res_val.status === 200) {
        return res_val.data !== undefined ? res_val.data : "";
      }
    } catch (error) {
      console.log(error);
      return "error";
    }
    return "error";
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

export const DUETSTATUS = [
  { val: 0, key: "disconnected", color: "#ff0000", description: "切断中" },
  { val: 2, key: "updating", color: "#ffff00", description: "更新中" },
  { val: 3, key: "off", color: "#ff0000", description: "オフ" },
  { val: 4, key: "halted", color: "#ff0000", description: "停止中" },
  { val: 5, key: "pausing", color: "#ffff00", description: "一時停止中" },
  { val: 6, key: "paused", color: "#ffff00", description: "一時停止" },
  { val: 7, key: "resuming", color: "#ffff00", description: "再開中" },
  { val: 8, key: "cancelling", color: "#ffff00", description: "キャンセル中" },
  { val: 9, key: "processing", color: "#0000ff", description: "処理中" },
  {
    val: 10,
    key: "simulating",
    color: "#00ff00",
    description: "シミュレーション中",
  },
  { val: 11, key: "busy", color: "#ffff00", description: "ビジー" },
  {
    val: 12,
    key: "changingTool",
    color: "#ffff00",
    description: "ツール変更中",
  },
  { val: 13, key: "idle", color: "#00ff00", description: "アイドル" },
];
