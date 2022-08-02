import { LightningElement, api } from 'lwc'

export default class ComboboxOption extends LightningElement {
  @api record
  @api firstField
  @api secondField
  @api thirdField
  @api activeId

  @api
  selectItem (currentId) {
    if (this.isActive || currentId === this.record.Id) this.clickRecord()
  }

  get firstRow () { return this.record[this.firstField] }
  get secondRowA () { return this.record[this.secondField] }
  get secondRowB () { return this.record[this.thirdField]}
  //get isActive () { return this.activeId === this.record.Id }

  get itemClasses () {
    const classes = [
      'slds-media',
      'slds-listbox__option',
      'slds-listbox__option_entity',
      'slds-listbox__option_has-meta' ]

    if (this.isActive) {
      classes.push('slds-has-focus')
    }

    return classes.join(' ')
  }

  clickRecord () {
    const selected = new CustomEvent('selected', {
      detail: this.record.Id
    })
    this.dispatchEvent(selected)
  }
}