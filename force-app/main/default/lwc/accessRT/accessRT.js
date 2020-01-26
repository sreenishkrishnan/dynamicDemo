import { LightningElement, track, wire, api } from "lwc";
import { getRecord, getFieldValue } from "lightning/uiRecordApi";
import CASE_OBJECT from "@salesforce/schema/Case";
import RT_FIELD from "@salesforce/schema/Case.RecordType.Name";
import JSONSUM_FIELD from "@salesforce/schema/Case.JSONSummary__c";
export default class AccessRT extends LightningElement {
  @api recordId;
  @track editmode = false;
  caseObject = CASE_OBJECT;

  @wire(getRecord, { recordId: "$recordId", fields: [RT_FIELD, JSONSUM_FIELD] })
  record;

  toggleEditMode() {
    console.log(`inside edit mode ${editmode}`);
    this.editmode = true;
  }

  get rtype() {
    return this.record.data ? getFieldValue(this.record.data, RT_FIELD) : "";
  }
  get jsonsum() {
    return this.record.data
      ? getFieldValue(this.record.data, JSONSUM_FIELD)
      : "";
  }
}
