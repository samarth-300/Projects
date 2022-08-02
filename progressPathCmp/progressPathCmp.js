import { api, LightningElement, track } from 'lwc';
import { FlowAttributeChangeEvent, FlowNavigationNextEvent } from 'lightning/flowSupport';

export default class ProgressPathCmp extends LightningElement {

    targetStringCollection; // List of Path labels
    @api pathLabelString; // String of the Path labels
    @api selectedTarget; // selected screen label (path)
    @track visibleStatuses = []; // List objects of each path ---> {ariaSelected: false, class: 'slds-path__item slds-is-complete', label: 'Account Update'}

    connectedCallback() {

        console.log('this.pathLabelString is: ' + this.pathLabelString);
        this.targetStringCollection = this.pathLabelString.split(',');  // String is converted into a list of screen labels
        
        console.log('this.targetStringCollection = ' + this.targetStringCollection);

        for (let index = 0; index < this.targetStringCollection.length; index++) {
            let target = {}
            target["label"] = this.targetStringCollection[index];  
            console.log('target is:' + JSON.stringify(target));
            this.visibleStatuses.push(target);
        }
        console.log('visibleStatuses is: ' + JSON.stringify(this.visibleStatuses));
        this.updateVisibleStatuses(); 
    }

    handleStatusClick(event) {

        this.selectedTarget = event.target.title;
        this.updateVisibleStatuses();

        const attributeChangeEvent = new FlowAttributeChangeEvent('selectedTarget', event.target.title);
        this.dispatchEvent(attributeChangeEvent);
        const navigateNextEvent = new FlowNavigationNextEvent();
        this.dispatchEvent(navigateNextEvent);
    }

    updateVisibleStatuses() {
        console.log('entering updateVisibleStatuses');
        //update the shown statuses based on the selection
        const newStatuses = [];
        for (let index = 0; index < this.visibleStatuses.length; index++) {
            const status = this.visibleStatuses[index];
            console.log('status in updateVisibleStatuses', status)
            const pathItem = this.getPathItemFromStatus(status.label); //{ariaSelected: false, class: 'slds-path__item slds-is-complete', label: 'File Upload'}
            console.log('pathItem', pathItem)
            newStatuses.push(pathItem);
        }
        this.visibleStatuses = newStatuses; // now this is would be sent to the markup
    }

    getPathItemFromStatus(label) { // function sets class, aria selected and label attributes
        console.log('lable', label)
        console.log('this.selectedScreen', this.selectedTarget)

        const ariaSelected = this.selectedTarget ? this.selectedTarget.includes(label) : false;
        const classList = ['slds-path__item'];

        if (!this.selectedTarget) { // This condition is executed, first time on load of the component, when selectedTarget is null
            if (label == this.targetStringCollection[0]) {
                classList.push('slds-is-active');
            } else {
                classList.push('slds-is-incomplete');
            }

        } else {  
            if (label == this.selectedTarget) {
                classList.push('slds-is-active');
            } else if (this.targetStringCollection.indexOf(label) < this.targetStringCollection.indexOf(this.selectedTarget)) { // stages greater than current stage are marked complete
                classList.push('slds-is-complete');
            } else if (this.targetStringCollection.indexOf(label) > this.targetStringCollection.indexOf(this.selectedTarget)) { // stages less than current stage are marked incomplete
                classList.push('slds-is-incomplete');
            }
        }

        return {
            ariaSelected: ariaSelected,
            class: classList.join(' '), // class determines if the stage is complete / active / incomplete
            label: label
        };
    }
}