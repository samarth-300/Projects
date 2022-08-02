import { LightningElement,api } from 'lwc';
import { FlowNavigationNextEvent,FlowAttributeChangeEvent} from 'lightning/flowSupport';

export default class PathCmp extends LightningElement {
    @api targetLabel;
    @api availableActions = [];
    @api len

    connectedCallback(){
        
    }

    pathHandler(event){
        
        const attributeChangeEvent = new FlowAttributeChangeEvent('targetLabel', this.targetLabel );
        this.dispatchEvent(attributeChangeEvent);
        
        let targetId = event.currentTarget.id;
        console.log('targetId----------->',targetId);
        let len = targetId.length;
        let mainTarId = targetId.charAt(4);  // charAt returns character at index 4
        console.log('mainTarId----------->',mainTarId);
        let targatPrefix = targetId.substring(5, len);  // 
        console.log('targatPrefix---------->',targatPrefix)
        var selectedPath = this.template.querySelector("[id=" +targetId+ "]");
        if(selectedPath){
            this.template.querySelector("[id=" +targetId+ "]").className='slds-is-active slds-path__item';
        }
            for(let i = 0; i < mainTarId; i++){
                let selectedPath = this.template.querySelector("[id=pat-" +i+ targatPrefix+"]");
                if(selectedPath){
                    console.log('inside complete');
                    this.template.querySelector("[id=pat-" +i+ targatPrefix+"]").className='slds-is-complete slds-path__item';
                }
            }
            for(let i = mainTarId; i < 4; i++){
                if(i != mainTarId){
                    let selectedPath = this.template.querySelector("[id=pat-" +i+ targatPrefix+"]");
                    if(selectedPath){
                        console.log('inside incomplete')
                        this.template.querySelector("[id=pat-" +i+targatPrefix+ "]").className='slds-is-incomplete slds-path__item';
                    }
                }
            }
                console.log('event----------->',event.currentTarget.outerText)
                this.targetLabel=event.currentTarget.outerText;
            
                // navigate to the next screen
                const navigateNextEvent = new FlowNavigationNextEvent();
                this.dispatchEvent(navigateNextEvent);
    }
}