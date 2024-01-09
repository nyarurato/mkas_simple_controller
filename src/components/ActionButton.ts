//ボタンの定義（送信先、ボタンのラベル、アクションの種類）
//AddButtonDialogで追加されるボタンの定義
export class ActionButton {
  destination = "";
  label = "ボタン";
  x = 0;
  y = 0;
  actionType =
    AcctionType.None as (typeof AcctionType)[keyof typeof AcctionType];
  is_use_image = false;
  is_use_icon = false;
  color = "#cccccc";
  image_base64 = "";
  icon_name = "";
  action = "";

  constructor(
    destination?: string,
    label?: string,
    x?: number,
    y?: number,
    actionType?: (typeof AcctionType)[keyof typeof AcctionType],
    is_use_image?: boolean,
    is_use_icon?: boolean
  ) {
    if (destination) this.destination = destination;
    if (label) this.label = label;
    if (x) this.x = x;
    if (y) this.y = y;
    if (actionType) this.actionType = actionType;
    if (is_use_image) this.is_use_image = is_use_image;
    if (is_use_icon) this.is_use_icon = is_use_icon;
  }

  set_image_base64(image_base64: string) {
    this.image_base64 = image_base64;
  }

  paste_param(param: ActionButton) {
    this.destination = param.destination;
    this.label = param.label;
    this.x = param.x;
    this.y = param.y;
    this.actionType = param.actionType;
    this.is_use_image = param.is_use_image;
    this.is_use_icon = param.is_use_icon;
    this.color = param.color;
    this.image_base64 = param.image_base64;
    this.icon_name = param.icon_name;
    this.action = param.action;
  }
}

export const AcctionType = {
  None: 0,
  ExecuteRegisteredMotion: 1,
  ExecuteFile: 2,
  SendGcode: 3,
} as const;

export const ActionTypeLabel = [
  { value: 0, title: "何もしない" },
  { value: 1, title: "登録モーション実行" },
  { value: 2, title: "ファイル実行" },
  { value: 3, title: "Gコード送信" },
];
