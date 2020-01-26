import { LightningElement, track, api, wire } from "lwc";
import { getRecord, updateRecord } from "lightning/uiRecordApi";
import { ShowToastEvent } from "lightning/platformShowToastEvent";
import ID_FIELD from "@salesforce/schema/Case.Id";
import t1RO from "./t1RO.html";
import t1RW from "./t1RW.html";
import errorFile from "./error.html";
import t2 from "./t2.html";
const fields = ["Case.Id", "Case.CreatedDate"];
import JSON_FIELD from "@salesforce/schema/Case.JSONSummary__c";

export default class Accessrecords extends LightningElement {
  @api recordId;
  @track record = {};
  @track error = {};
  recordtypename;
  @wire(getRecord, { recordId: "$recordId", fields: fields })
  case({ error, data }) {
    console.log(`Iam in wire ${JSON.stringify(data)}`);
    if (data) {
      this.record = data;
      this.error = undefined;
    } else if (error) {
      this.error = error;
      this.record = undefined;
    }
  }
  render() {
    console.log(`recordid is ${this.recordId}`);
    console.log(`case is ${JSON.stringify(this.record)}`);
    this.recordtypename = "";
    let r = {};
    if (this.record) {
      let rt = {};
      rt = this.record.recordTypeInfo;
      if (rt != undefined) {
        this.recordtypename = JSON.stringify(rt.name);
        console.log(`recordtypename name` + this.recordtypename);
        if (this.recordtypename == "LandPlanning") {
          console.log("Inside LandPlanning");
          return t1RO;
        } else if (this.recordtypename == "FamilyWelfare") {
          console.log("Inside FamilyWelfare");
          return t2;
        }
        //this.t = await returnRecordType(this.recordtypename);
        //return t;
      }
      //r = JSON.parse(this.record);
      //console.log(`recordtypeinf is ${JSON.stringify(r.recordTypeInfo)}`);
    }
    console.log("Inside Render Block End");
    return errorFile;
  }

  async returnRecordType(rt) {
    if (rt === "LandPlanning") {
      console.log("Inside LandPlanning");
      return t1RO;
    } else if (rt === "FamilyWelfare") {
      console.log("Inside FamilyWelfare");
      return t2;
    }
  }
  handleFieldChange(e) {
    //console.log(`event is ${JSON.stringify(e.target)}`);
  }

  renderedCallback() {
    //console.log(`I am in render callback ${this.record}`);
  }
  saveT2Form() {
    console.log(`saveT2Form have been clicked`);
  }
  saveT1Form() {
    console.log(`I have been clicked`);
    const fields = {};
    let a = this.template.querySelector(
      'lightning-input[data-formfield="landid"]'
    ).value;
    let b = this.template.querySelector(
      'lightning-input[data-formfield="landaddress"]'
    ).value;

    let saveJSON = {};
    let key = "formdata";
    saveJSON[key] = [];
    var data = {
      landid: a,
      landaddress: b
    };

    saveJSON[key].push(data);
    console.log(`json is ${JSON.stringify(saveJSON)}`);

    console.log(`this.recordId is ${this.recordId}`);
    fields[ID_FIELD.fieldApiName] = this.recordId;
    fields[JSON_FIELD.fieldApiName] = JSON.stringify(saveJSON);
    const recordInput = { fields };

    console.log(`recordInput is ${JSON.stringify(recordInput)}`);
    updateRecord(recordInput)
      .then(() => {
        this.dispatchEvent(
          new ShowToastEvent({
            title: "Success",
            message: "Case updated",
            variant: "success"
          })
        );
      })
      .catch(error => {
        this.dispatchEvent(
          new ShowToastEvent({
            title: "Something is wrong",
            message: "Check the record",
            variant: "error"
          })
        );
      });
  }
}
