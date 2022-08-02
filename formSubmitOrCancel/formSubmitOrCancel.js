import { LightningElement,api } from 'lwc';
import { deleteRecord,updateRecord } from 'lightning/uiRecordApi';
import { FlowNavigationNextEvent, } from 'lightning/flowSupport';

export default class FormSubmitOrCancel extends LightningElement {

    @api accountRecordId;
    @api selectedDocumentIds;
    @api loaded;
    @api availableActions;
    @api fieldChangesStringArray;

    handleReset() {
        console.log(this.selectedDocumentIds);
        for(let id of this.selectedDocumentIds){
          deleteRecord(id);
        }
        this.files=[];
        console.log('value',this.files);
        this.selectedDocumentIds=[];
        this.loaded = false;
      }
    
      handleGoNext() {
        let parsedStringArray=this.fieldChangesStringArray;
        updateRecord(parsedStringArray);
        // check if NEXT is allowed on this screen
        console.log(this.availableActions)
        if (this.availableActions.find((action) => action === 'FINISH')) {
            // navigate to the next screen
            const navigateNextEvent = new FlowNavigationNextEvent();
            this.dispatchEvent(navigateNextEvent);
        }
}
}