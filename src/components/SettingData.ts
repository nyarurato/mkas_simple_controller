import { ActionButton } from "./ActionButton";

export class SettingData {
  controlBoardAddresses: string[];
  executionFolder: string;
  executionFileName: string;
  version: string;
  actionButtons: ActionButton[];

  constructor() {
    this.controlBoardAddresses = new Array<string>();
    this.executionFolder = "0://gcodes/mkas/";
    this.executionFileName = "program.nc";
    this.version = "0.0.1";
    this.actionButtons = new Array<ActionButton>();
  }

  setControlBoardAddresses(controlBoardAddresses: string) {
    this.controlBoardAddresses.push(controlBoardAddresses);
  }

  setExecutionFolder(executionFolder: string) {
    this.executionFolder = executionFolder;
  }

  setExecutionFileName(executionFileName: string) {
    this.executionFileName = executionFileName;
  }

  setVersion(version: string) {
    this.version = version;
  }

  setActionButtons(actionButtons: ActionButton) {
    this.actionButtons.push(actionButtons);
  }
}
