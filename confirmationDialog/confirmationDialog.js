import { LightningElement,api } from 'lwc';
import { deleteRecord } from 'lightning/uiRecordApi';
import { FlowNavigationNextEvent, FlowAttributeChangeEvent} from 'lightning/flowSupport';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

export default class ConfirmationDialog extends LightningElement {

    @api accountRecordId;
    @api selectedDocumentIds;
    @api loaded;
    @api availableActions=[];
    @api buttonClicked='';
    @api fieldChangesStringArray;
    @api selectedTarget;

    handleReset() {
        this.buttonClicked='Cancel';
        this.selectedTarget='Message Screen';
        const attributeChangeEvent = new FlowAttributeChangeEvent('selectedTarget', this.selectedTarget );
        this.dispatchEvent(attributeChangeEvent);

        console.log(this.selectedDocumentIds);
        if(this.selectedDocumentIds){
            for(let id of this.selectedDocumentIds){
                deleteRecord(id);
              }
              this.files=[];
              console.log('value',this.files);
              this.selectedDocumentIds=[];
              this.loaded = false;
        }
        const navigateNextEvent = new FlowNavigationNextEvent();
        this.dispatchEvent(navigateNextEvent);
      }
    
    handleGoNext() {
        this.buttonClicked='Submit';
        this.selectedTarget='Message Screen';
        
        
        const evt = new ShowToastEvent({
            title: "Record Update",
            message: "Account record is updated successfully",
            variant: "Success"
        });
        this.dispatchEvent(evt);
        //let parsedStringArray=JSON.parse(this.fieldChangesStringArray);
        //console.log('changes',JSON.stringify(parsedStringArray));
        //updateRecord(parsedStringArray);
        const attributeChangeEvent = new FlowAttributeChangeEvent('selectedTarget', this.selectedTarget );
        this.dispatchEvent(attributeChangeEvent);

        const navigateNextEvent = new FlowNavigationNextEvent();
        this.dispatchEvent(navigateNextEvent);
}
}