import { LightningElement, api, wire, track } from 'lwc';
import { getRecord, getFieldValue } from 'lightning/uiRecordApi';
/* 230
    import { getRecord } from 'lightning/uiRecordApi';
    import  { updateRecords } from 'lightning/uiRecordApi';
*/
import { updateRecord } from 'lightning/uiRecordApi';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

import ASSET_OBJECT from '@salesforce/schema/Asset';
import ID_FIELD from '@salesforce/schema/Asset.Id';
import NAME_FIELD from '@salesforce/schema/Asset.Name';
import ACCOUNT_FIELD from '@salesforce/schema/Asset.AccountId';
import TEMPERATURE_FIELD from '@salesforce/schema/Asset.Temperature__c';
import STATUS_FIELD from '@salesforce/schema/Asset.Status';
import ASSET_ID from '@salesforce/schema/WorkOrder.AssetId';

export default class AssetCard extends LightningElement {
    disabled = false;
    @track error;
    @track workOrderWireResult;
    @track assetWireResult;
    @api recordId; // = '0WOB0000000NZ3xOAG';
    @api assetId;
    objectApiName = ASSET_OBJECT;
    fields = [ID_FIELD, NAME_FIELD, ACCOUNT_FIELD, TEMPERATURE_FIELD, STATUS_FIELD];

    @wire(getRecord, { recordId: '$recordId', fields: [ASSET_ID] })
    workOrderWire; /* ({error, data}) {
        if (data){
            this.workOrderWireResult = data.fields;
            this.error = undefined;
            console.log('work order getRecord wire result');
            console.log('--workOrderWire--');
            console.log(this.workOrderWire.data);
            console.log('--workOrderWireResult fields--');
            console.log(this.workOrderWireResult);
            console.log('--data--');
            console.log(data);

            this.assetId = data.fields.AssetId.value;
            console.log(this.assetId);
        }
        else if (error){
            this.error = error;
            this.workOrderWireResult = undefined;
            console.log('error:');
            console.log(error);
        }
    }*/
    
    @wire(getRecord, { recordId: '$workOrderWire.data.fields.AssetId.value', fields: [ID_FIELD, NAME_FIELD, ACCOUNT_FIELD], optionalFields: [TEMPERATURE_FIELD, STATUS_FIELD] }) 
    assetWire ({error, data}) {
        if (data){
            this.assetId = data.fields.Id.value;

            this.assetWireResult = data;
            this.error = undefined;
            console.log('asset getRecord wire result:');
            console.log(data);
            
        }
        else if (error){
            this.error = error;
            this.assetWireResult = undefined;
            console.log('error:');
            console.log(error);
        }
    }
    
    get myAssetId(){
        return this.assetWireResult.fields.Id.value;
    }
    get myAssetName(){
        return this.assetWireResult.fields.Name.value;
    }
    get myAssetAccount(){
        return this.assetWireResult.fields.AccountId.value;
    }
    get myAssetTemperature(){
        return this.assetWireResult.fields.Temperature__c.value;
    }
    get myAssetStatus(){
        return this.assetWireResult.fields.Status.value;
    }
    
    

    /* 230
    //get multiple records in bulk.
    @wire(getRecords, { recordIds: [], fields: [ID_FIELD, NAME_FIELD, ACCOUNT_FIELD]}) 
    records;  
    //heterogenous sets of object, mix and match with different entities
    @wire(getRecords, { recordIds: []})
    records; 

    //get all fields (standard + custom) visible to user from a record id
    //maybe also filter by recordtype 
    @wire(getAllFields, {recordId: '$recordId'}) 
    fields;
    //get all fields (standard + custom) visible to user from object name
    @wire(getAllFields, {sObject: 'Account'}) 
    fields;
    //get all standard fields visible to user
    @wire(getStandardFields, {sObject: 'Account'}) 
    fields;
    //get all custom fields visible to user
    @wire(getCustomFields, {sObject: 'Account'}) 
    fields;
    */
    
    
    
    handleSuccess(event) {
        const toastEvent = new ShowToastEvent({
            title: "Asset created",
            message: "Record ID: " + event.detail.id,
            variant: "success"
        });
        this.dispatchEvent(toastEvent);
    }
    handleChange(event){
        console.log(event.detail.value);
    }
    handleSubmit(event){
        console.log(event.detail.value);
    }
    /**********************
    updateAsset(){
        const fields = {};
        //fields[ID_FIELD.fieldApiName] = this.template.querySelector("[data-field='Id']").value;
        fields[NAME_FIELD.fieldApiName] = this.template.querySelector("[data-field='Name']").value;
        fields[ACCOUNT_FIELD.fieldApiName] = this.template.querySelector("[data-field='Account']").value;
        fields[STATUS_FIELD.fieldApiName] = this.template.querySelector("[data-field='Status']").value;
        fields[TEMPERATURE_FIELD.fieldApiName] = this.template.querySelector("[data-field='Temperature']").value;

        const recordInput = { fields };
        
        updateRecord(recordInput)
            .then(() => {
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'Success',
                        message: 'Asset updated',
                        variant: 'success'
                    })
                );
                // Display fresh data in the form
                //return refreshApex(this.contact);
            })
            .catch(error => {
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'Error updating record',
                        message: error.body.message,
                        variant: 'error'
                    })
                );
            });
        ////////////////////  230
        updateRecords(recordInputs)
            .then(() => {
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'Success',
                        message: 'Assets updated',
                        variant: 'success'
                    })
                );
                // Display fresh data in the form
                //return refreshApex(this.contact);
            })
            .catch(error => {
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'Error updating records',
                        message: error.body.message,
                        variant: 'error'
                    })
                );
            });
        ////////////////////////
    }*************************/
    
}