import { api, LightningElement } from 'lwc';
import { FlowNavigationNextEvent, } from 'lightning/flowSupport';
import NAME_FIELD from '@salesforce/schema/Account.Name';
import REVENUE_FIELD from '@salesforce/schema/Account.AnnualRevenue';
import TYPE_FIELD from '@salesforce/schema/Account.Type';
import INDUSTRY_FIELD from '@salesforce/schema/Account.Industry';
import PHONE_FIELD from '@salesforce/schema/Account.Phone';
import ACTIVE_FIELD from '@salesforce/schema/Account.Active__c';
import RATING_FIELD from '@salesforce/schema/Account.Rating';
import WEBSITE_FIELD from '@salesforce/schema/Account.Website';
import OWNERSHIP_FIELD from '@salesforce/schema/Account.Ownership';
import CUSTOMER_PRIORITY_FIELD from '@salesforce/schema/Account.CustomerPriority__c';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import getRecord from '@salesforce/apex/fetchAccRecords.getRecord';
export default class AccountUpdate2 extends LightningElement {
    @api availableActions = []; // The availableActions array contains which actions are available for the screen
    @api accountRecordId;
    Name = NAME_FIELD;
    Type = TYPE_FIELD;
    Industry = INDUSTRY_FIELD;
    AnnualRevenue = REVENUE_FIELD;
    Phone = PHONE_FIELD;
    Active__c = ACTIVE_FIELD;
    Rating = RATING_FIELD;
    Website = WEBSITE_FIELD
    Ownership = OWNERSHIP_FIELD;
    CustomerPriority__c = CUSTOMER_PRIORITY_FIELD;

    fieldChangesArray = {};
    @api fieldChangesString = '';
    @api fieldChanges = '';
    @api buttonClicked='';
    objectApiName = 'Account';
    fields = ['Name','Industry','AnnualRevenue','Phone', 'Active__c','Rating','Type','Website','Ownership','CustomerPriority__c'];

    recordBeforeChange;
    connectedCallback(){
        this.queryFieldNames = this.fields.join();
        this.fetchRecords();
    }

    fetchRecords(){
    getRecord({ recordId: this.accountRecordId , fields: this.queryFieldNames , objectApiName : this.objectApiName})
        .then(result => {
            this.recordBeforeChange=result;
            console.log(JSON.stringify(result))
            console.log(JSON.stringify(result[0].Industry))
        })
        .catch(error => {
            console.log('error ',error); // if any errors,they are logged 
        });
    }
    
    // handleInputs(event) {
    //         let fieldName = event.target.fieldName; // field Names are captured
    //         let fieldValue = event.target.value;  // field Values are captured
    //         this.fieldChangesArray[fieldName] = fieldValue.trim(); //field names and values are pushed into fieldChangesArray
    //         console.log('this.fieldChangesArray', this.fieldChangesArray)
    //         alert(JSON.stringify(this.fieldChangesArray));
    // }

    handleSuccess() {
        this.buttonClicked="Save Changes";
        //for(let field of this.fields ){
            //console.log(JSON.stringify(objJSON["fields"][field]["value"]))
            
            const inputFields = this.template.querySelectorAll(
                'lightning-input-field'
            );
            
            inputFields.forEach(field => {
                console.log(field.fieldName, field.value)
                let fieldName = field.fieldName;
                if(field.value!=this.recordBeforeChange[0][fieldName]){
                    let joined = `${fieldName} : ${field.value},`;
                    this.fieldChanges = this.fieldChanges.concat(joined);
                }
            });
            
            this.fieldChangesString = replaceCommaLine(this.fieldChanges);
            console.log('fieldChangesString', this.fieldChangesString);
            function replaceCommaLine(data) {
                let dataToArray = data.split(',').map(item => item.trim());
                //convert array to string replacing comma with new line
                return dataToArray.join("\n");
            }
            
            const evt = new ShowToastEvent({
                title: "Record Update",
                message: "Account record is updated successfully",
                variant: "Success"
            });
            this.dispatchEvent(evt);
        
        this.handleGoNext();
        this.fetchRecords();
    }

    handleGoNext() {
        // check if NEXT is allowed on this screen
        if (this.availableActions.find((action) => action === 'NEXT')) {
            // navigate to the next screen
            const navigateNextEvent = new FlowNavigationNextEvent();
            this.dispatchEvent(navigateNextEvent);
        }
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