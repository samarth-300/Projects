import { api, LightningElement,track } from 'lwc';
import {FlowNavigationNextEvent,} from 'lightning/flowSupport';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
//import { getRecord } from 'lightning/uiRecordApi';
import getRecord from '@salesforce/apex/fetchAccRecords.getRecord';
export default class LWCtoFlow2 extends LightningElement {
    @api availableActions = [];
    @api accountRecordId ;
    @api Name;
    @api Type
    @api Industry
    @api AnnualRevenue
    @api Phone
    @api Active__c
    @api Rating
    @api Website
    @api Ownership
    @api CustomerPriority__c
    @api queryFieldNames='';
    @track recordBeforeChange;

    objectApiName= 'Account';
    fields = ['Name','Type','Industry','AnnualRevenue','Phone', 'Active__c','Rating','Type','Website','Ownership','CustomerPriority__c'];

    // connectedCallback(){
    //     this.queryFieldNames = this.fields.join();
    //     this.fetchRecords();
    // }

    // fetchRecords(){
    // getRecord({ recordId: '$accountRecordId', fields: this.queryFieldNames , objectApiName : this.objectApiName})
    //     .then(result => {
    //         this.recordBeforeChange=result;
    //     })
    //     .catch(error => {
    //         console.log('error ',error); // if any errors,they are logged 
    //     });
    // }
    
    handleSubmit(event){
        //alert('this.queryFieldNames',this.queryFieldNames)

        //console.log('=====>',JSON.stringify(this.recordBeforeChange))

        let payload = event.detail;
        //let count=0;

        for(let field of this.fields ){
            
        var objJSON = JSON.parse(JSON.stringify(payload));  
        //console.log('field names-->',event.detail.fieldname)
        this[field]=objJSON["fields"][field]["value"];
        }
        console.log(objJSON["fields"][field]["value"])
        this.handleNext();
    }

    handleNext(){

        const evt = new ShowToastEvent({
            title: "Record Update",
            message: "Account record is updated successfully",
            variant: "Success"
        });
        this.dispatchEvent(evt);
        if (this.availableActions.find((action) => action === 'NEXT')) {
            // navigate to the next screen
            const navigateNextEvent = new FlowNavigationNextEvent();
            this.dispatchEvent(navigateNextEvent);
        }
    }
}