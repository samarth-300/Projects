import { api, LightningElement, track } from 'lwc';
import { FlowAttributeChangeEvent, FlowNavigationNextEvent } from 'lightning/flowSupport';

export default class directNavigationHeader extends LightningElement {
  
  @api targetStringCollection;
  @api targetStringCSV;
  @api selectedTarget;

  connectedCallback() {
      let _visibleStatuses = [];
      if (this.targetStringCSV != null) {
        console.log('this.targetStringCSV is: ' + this.targetStringCSV);
        this.targetStringCollection = this.targetStringCSV.split(',');
      }
      console.log('this.targetStringCollection = ' + this.targetStringCollection);

      for(let index = 0; index < this.targetStringCollection.length; index++) {
        let target = {}
        target["label"] = this.targetStringCollection[index];
        console.log('target is:' + JSON.stringify(target));
        _visibleStatuses.push(target);

      }
      this.visibleStatuses = _visibleStatuses;
      console.log('visibleStatuses is: ' + JSON.stringify(this.visibleStatuses));
      this._updateVisibleStatuses();
  }

  /* private fields for tracking */
  @track status;
  @track selectedScreen;
  //@track visibleStatuses = [{label : 'foo', value : 'bar', class:'slds-is-incomplete'},{label : 'baz', value : 'qux',  class:'slds-is-incomplete'}];
  @track visibleStatuses = [];

  handleStatusClick(event) {
    console.log('entering handleStatusClick. event label is: ' + JSON.stringify(event.target.title) + ' and event detail id is:  ' + event.detail.id +'and role is: ' + event.target.role);
    event.stopPropagation();
    //update the stored status, but don't update the record
    //till the save button is clicked

    this.selectedScreen = event.target.title;
    console.log('selectedScreen',this.selectedScreen)

    this.selectedTarget=event.target.title;
    this._updateVisibleStatuses();

    const attributeChangeEvent = new FlowAttributeChangeEvent('selectedTarget',event.target.title );
    this.dispatchEvent(attributeChangeEvent);
    const navigateNextEvent = new FlowNavigationNextEvent();
    this.dispatchEvent(navigateNextEvent);
  }

  _getPathItemFromStatus(status) {
    console.log('lable',status )
    console.log('this.selectedScreen',this.selectedScreen)

    const ariaSelected = this.selectedScreen ? this.selectedScreen.includes(status) : false;
    const classList = ['slds-path__item'];

    if(!this.selectedTarget){
      console.log('eureka')
      if(status=='Account Update'){
        classList.push('slds-is-active');
      }else{
        classList.push('slds-is-incomplete');
      }

    }else{
      if(status==this.selectedTarget){
        classList.push('slds-is-active');
      }else if(this.targetStringCollection.indexOf(status)<this.targetStringCollection.indexOf(this.selectedTarget)){
        classList.push('slds-is-complete');
      }else if(this.targetStringCollection.indexOf(status)>this.targetStringCollection.indexOf(this.selectedTarget)){
        classList.push('slds-is-incomplete');
      }
    }

    return {
      ariaSelected: ariaSelected,
      class: classList.join(' '),
      label: status
    };
  }


  _updateVisibleStatuses() {
    console.log('entering _updateVisibleStatuses');
    //update the shown statuses based on the selection
    const newStatuses = [];
    console.log('1')
    for (let index = 0; index < this.visibleStatuses.length; index++) {
      console.log('2')
      const status = this.visibleStatuses[index];
      console.log('status in _updateVisibleStatuses',status)
      const pathItem = this._getPathItemFromStatus(status.label); //{ariaSelected: false, class: 'slds-path__item slds-is-complete', label: 'File Upload'}
      
      console.log('pathItem',pathItem)

      newStatuses.push(pathItem);
      
    }
    this.visibleStatuses = newStatuses;
    console.log('Final Status',this.visibleStatuses)
  }
}