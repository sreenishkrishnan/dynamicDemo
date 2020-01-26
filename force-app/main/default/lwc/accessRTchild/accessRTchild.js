import { LightningElement, api, track } from "lwc";
import { updateRecord } from "lightning/uiRecordApi";
import { ShowToastEvent } from "lightning/platformShowToastEvent";
import landplanning from "./landplanning";
import errorFile from "./error";
import familywelfare from "./familywelfare";
import ID_FIELD from "@salesforce/schema/Case.Id";
import JSON_FIELD from "@salesforce/schema/Case.JSONSummary__c";
export default class AccessRTchild extends LightningElement {
  @api rtype;
  @api recordval;
  @api jsonsum;
  @api crecordid;
  @track editmode = false;

  @api isLoaded = false;

  @track fname = "";
  @track lname = "";

  @track landid = "";
  @track landaddress = "";

  @track formdatafamilywelfare = {
    fname: this.fname,
    lname: this.lname
  };

  @track formdatalandplanning = {
    landid: this.landid,
    landaddress: this.landaddress
  };

  render() {
    //console.log(`recordval is ${JSON.stringify(this.recordval)}`);
    if (this.rtype) {
      console.log(`jsonsum in child ${JSON.stringify(this.jsonsum)}`);

      let pjson = JSON.parse(this.jsonsum);
      // await this.childval;
      if (this.rtype == "LandPlanning") {
        this.landid = pjson.formdata[0].landid;
        this.landaddress = pjson.formdata[0].landaddress;
        return landplanning;
      } else if (this.rtype == "FamilyWelfare") {
        this.fname = pjson.formdata[0].fname;
        this.lname = pjson.formdata[0].lname;
        return familywelfare;
      }
      return errorFile;
    }
    //console.log(`end of render`);
    return this;
  }

  handleFieldChange(e) {
    console.log(`currenttarget is ${e.currentTarget}`);
  }

  handleFnameFieldChange(e) {
    this.fname = e.target.value;
  }
  handleLnameFieldChange(e) {
    this.lname = e.target.value;
  }
  handleLandIdFieldChange(e) {
    this.landid = e.target.value;
  }
  handleLandAddressFieldChange(e) {
    this.landaddress = e.target.value;
  }

  switchMode() {
    console.log(`template switch`);
    this.editmode = this.editmode == true ? false : true;
  }
  saveData(e) {
    console.log(`save data ${this.rtype}`);
    if (this.rtype == "LandPlanning") {
      this.saveLandPlanning(["wlandid", "wlandaddress"]);
    } else if (this.rtype == "FamilyWelfare") {
      this.saveFamilyWelfare(["wfname", "wlname"]);
    }
  }
  saveFamilyWelfare(arr) {
    const fields = {};
    console.log(`arr is ${arr[0]}`);
    let a = this.template.querySelector(
      `lightning-input[data-formfield=${arr[0]}]`
    ).value;
    let b = this.template.querySelector(
      `lightning-input[data-formfield=${arr[1]}]`
    ).value;
    console.log(`a is ${a}`);
    console.log(`b is ${b}`);
    let saveJSON = {};
    let key = "formdata";
    saveJSON[key] = [];
    var data = {
      fname: a,
      lname: b
    };
    //saveJSON[key].push(this.formdatafamilywelfare);
    saveJSON[key].push(data);

    console.log(`formdata save ${data}`);
    console.log(`recordid is ${this.crecordid}`);
    fields[ID_FIELD.fieldApiName] = this.crecordid;
    fields[JSON_FIELD.fieldApiName] = JSON.stringify(saveJSON);
    const recordInput = { fields };
    console.log(`recordInput ${JSON.stringify(recordInput)}`);
    updateRecord(recordInput)
      .then(() => {
        this.dispatchEvent(
          new ShowToastEvent({
            title: "Success",
            message: "Case updated",
            variant: "success"
          })
        );
        this.editmode = this.editmode == true ? false : true;
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
  saveLandPlanning(arr) {
    const fields = {};
    console.log(`arr is ${arr[0]}`);
    let a = this.template.querySelector(
      `lightning-input[data-formfield=${arr[0]}]`
    ).value;
    let b = this.template.querySelector(
      `lightning-input[data-formfield=${arr[1]}]`
    ).value;
    console.log(`a is ${a}`);
    console.log(`b is ${b}`);
    let saveJSON = {};
    let key = "formdata";
    saveJSON[key] = [];
    var data = {
      landid: a,
      landaddress: b
    };
    saveJSON[key].push(data);

    console.log(`form save data ${JSON.stringify(data)}`);
    console.log(`recordid is ${this.crecordid}`);
    fields[ID_FIELD.fieldApiName] = this.crecordid;
    fields[JSON_FIELD.fieldApiName] = JSON.stringify(saveJSON);
    const recordInput = { fields };
    console.log(`recordInput ${JSON.stringify(recordInput)}`);
    updateRecord(recordInput)
      .then(() => {
        this.dispatchEvent(
          new ShowToastEvent({
            title: "Success",
            message: "Case updated",
            variant: "success"
          })
        );
        this.editmode = this.editmode == true ? false : true;
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
