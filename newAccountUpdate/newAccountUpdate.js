import { api, LightningElement } from 'lwc';
import { FlowNavigationNextEvent,FlowAttributeChangeEvent } from 'lightning/flowSupport';
import NAME_FIELD from '@salesforce/schema/Account.Name';
import REVENUE_FIELD from '@salesforce/schema/Account.AnnualRevenue';
import TYPE_FIELD from '@salesforce/schema/Account.Type';
import INDUSTRY_FIELD from '@salesforce/schema/Account.Industry';
import PHONE_FIELD from '@salesforce/schema/Account.Phone';
import ACTIVE_FIELD from '@salesforce/schema/Account.Active__c';
import RATING_FIELD from '@salesforce/schema/Account.Rating';
import OWNERSHIP_FIELD from '@salesforce/schema/Account.Ownership';
import CUSTOMER_PRIORITY_FIELD from '@salesforce/schema/Account.CustomerPriority__c';
import WEBSITE_FIELD from '@salesforce/schema/Account.Website';
import DESCRIPTION_FIELD from '@salesforce/schema/Account.Description';
import getRecord from '@salesforce/apex/fetchAccRecords.getRecord';
export default class NewAccountUpdate extends LightningElement {
    @api availableActions = []; // The availableActions array contains which actions are available for the screen
    @api accountRecordId;
    Name = NAME_FIELD;
    Type = TYPE_FIELD;
    Industry = INDUSTRY_FIELD;
    AnnualRevenue = REVENUE_FIELD;
    Phone = PHONE_FIELD;
    Active__c = ACTIVE_FIELD;
    Rating = RATING_FIELD;
    Description=DESCRIPTION_FIELD;
    Ownership = OWNERSHIP_FIELD;
    Website = WEBSITE_FIELD;
    CustomerPriority__c = CUSTOMER_PRIORITY_FIELD;

    @api name_value;
    // @api Name_value;
    @api Type_value;
    @api Industry_value;
    @api AnnualRevenue_value;
    @api Phone_value;
    @api Active__c_value;
    @api Rating_value;
    @api Website_value;
    @api Description_value;
    @api Ownership_value;
    @api CustomerPriority__c_value;

    fieldChangesArray = {};
    @api fieldChangesString = '';
    @api fieldChanges = '';
    @api buttonClicked='';
    @api fieldChangesStringArray;
    @api selectedTarget;
    objectApiName = 'Account';
    fields = ['Name','Industry','AnnualRevenue','Phone', 'Active__c','Rating','Type','Website','Ownership','CustomerPriority__c','Description'];

    recordBeforeChange;
    connectedCallback(){
        this.queryFieldNames = this.fields.join();
        this.fetchRecords();
    }

    fetchRecords(){
    getRecord({ recordId: this.accountRecordId , fields: this.queryFieldNames , objectApiName : this.objectApiName})
        .then(result => {
            this.recordBeforeChange=result;
        })
        .catch(error => {
            console.log('error ',error); // if any errors,they are logged 
        });
    }
    
    // handleChange(event) {
    //         if(this.fieldChangesArray)
    //         this.fieldChangesArray.Id=this.accountRecordId;
    //         let fieldName = event.target.fieldName; // field Names are captured
    //         let fieldValue = event.target.value;  // field Values are captured
    //         this.fieldChangesArray[fieldName] = fieldValue.trim(); //field names and values are pushed into fieldChangesArray
    //         //console.log('this.fieldChangesArray', this.fieldChangesArray)
    //         this.fieldChangesStringArray=JSON.stringify(this.fieldChangesArray);
    // }

    handleSuccess() {

        
        this.buttonClicked="Save Changes";
            const inputFields = this.template.querySelectorAll(
                'lightning-input-field'
            );
            
            inputFields.forEach(field => {
                console.log(field.fieldName, field.value)
                let fieldName = field.fieldName;
                let fieldValue = field.value;

                let fieldConcat;
                if(fieldName!='Name'){
                    fieldConcat=fieldName+'_value';
                }else{
                    fieldConcat='name_value'
                }
                this[fieldConcat]=fieldValue;

                if(field.value!=this.recordBeforeChange[0][fieldName]){
                    let joined = `${fieldName} : ${fieldValue}-`;
                    this.fieldChanges = this.fieldChanges.concat(joined);
                }
            });
            
            this.fieldChangesString = replaceCommaLine(this.fieldChanges);
            function replaceCommaLine(data) {
                let dataToArray = data.split('-').map(item => item.trim());
                //convert array to string replacing comma with new line
                return dataToArray.join("\n");
            }
        
        this.handleGoNext();
        this.fetchRecords();
    }

    handleGoNext() {
        this.selectedTarget='File Upload';
        const attributeChangeEvent = new FlowAttributeChangeEvent('selectedTarget', this.selectedTarget );
        this.dispatchEvent(attributeChangeEvent);
        // check if NEXT is allowed on this screen
            // navigate to the next screen
            const navigateNextEvent = new FlowNavigationNextEvent();
            this.dispatchEvent(navigateNextEvent);
    }

    handleReset() {
        const inputFields = this.template.querySelectorAll(
            'lightning-input-field'
        );
        //console.log('inputFields', inputFields)
        if (inputFields) {
            inputFields.forEach(field => {
                field.reset();
            });
        }
    }
}