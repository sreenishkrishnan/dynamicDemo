import { LightningElement, api, wire, track } from "lwc";
import CASE_RECORDTYPE_FIELD from "@salesforce/schema/Case.RecordTypeId";
import { getObjectInfo } from "lightning/uiObjectInfoApi";
import CASE_OBJECT from "@salesforce/schema/Case";

import t1 from "./t1.html"; //landplanning
import t2 from "./t2.html"; //familywelfare

export default class Dynamictemplate extends LightningElement {
  @track t1flag = true;
  @track t2flag = false;
  @api recordId;
  @track caseRecord = {};

  render() {
    console.log(`record is ${this.recordId}`);
    return this.t1flag ? t1 : t2;
  }

  handleFieldChange(e) {
    //console.log(`e is ${e.target}`)
    this.caseRecord[e.target] = e.target.value;
    console.log(`caseRecord1 is ${JSON.stringify(this.caseRecord)}`);
  }

  saveT1Form() {
    let a = this.template.querySelector(
      'lightning-input[data-formfield="landid"]'
    ).value;
    let b = this.template.querySelector(
      'lightning-input[data-formfield="landaddress"]'
    ).value;

    console.log(`a is ${a}`);
    console.log(`b is ${b}`);
  }
  saveT2Form() {}
}
