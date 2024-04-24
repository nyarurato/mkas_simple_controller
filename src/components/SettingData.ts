import { ActionButton } from "./ActionButton";
import { reactive } from "vue";

export class SettingData {
  controlBoardAddresses: string[];
  executionFolder: string;
  executionFileName: string;
  version: string;
  waitingTime: number;
  isUseWaitingAfterCommand: boolean;
  actionButtons: ActionButton[];

  constructor() {
    this.controlBoardAddresses = new Array<string>();
    this.executionFolder = "0://gcodes/";
    this.executionFileName = "program.nc";
    this.version = "0.0.1";
    this.actionButtons = new Array<ActionButton>();
    this.waitingTime = 5;
    this.isUseWaitingAfterCommand = false;
  }

  public setControlBoardAddresses(controlBoardAddresses: string) {
    this.controlBoardAddresses.push(controlBoardAddresses);
  }

  public setExecutionFolder(executionFolder: string) {
    this.executionFolder = executionFolder;
  }

  public setExecutionFileName(executionFileName: string) {
    this.executionFileName = executionFileName;
  }

  public setVersion(version: string) {
    this.version = version;
  }

  public setActionButtons(actionButtons: ActionButton) {
    this.actionButtons.push(actionButtons);
  }

  public setWaitingTime(waitingTime: number) {
    this.waitingTime = waitingTime;
  }

  public setIsUseWaitingAfterCommand(isUseWaitingAfterCommand: boolean) {
    this.isUseWaitingAfterCommand = isUseWaitingAfterCommand;
  }

  public paste_param(param: SettingData) {
    this.controlBoardAddresses = new Array<string>();
    for (let i = 0; i < param.controlBoardAddresses.length; i++) {
      this.controlBoardAddresses.push(param.controlBoardAddresses[i]);
    }
    this.executionFolder = param.executionFolder;
    this.executionFileName = param.executionFileName;
    this.version = param.version;
    this.actionButtons = new Array<ActionButton>();
    for (let i = 0; i < param.actionButtons.length; i++) {
      const acbutton = new ActionButton();
      acbutton.paste_param(param.actionButtons[i]);
      this.actionButtons.push(acbutton);
    }
    this.waitingTime = param.waitingTime;
    this.isUseWaitingAfterCommand = param.isUseWaitingAfterCommand;
  }
}
