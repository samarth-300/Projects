import { LightningElement, api } from "lwc";

export default class PreviewFileModal extends LightningElement {
  @api url;
  @api fileExtension;
  @api filename;
  imgFrame = false; //flag for file type image
  pdfFrame = false // flag for file typr PDF
  showModal = false; 
  @api show() {         //called in the PreviewFileThumbnailCard , Modal is shown only for image and PDF
    console.log('test test')
    if (this.fileExtension === "pdf" || this.fileExtension === "application/pdf") {
      this.pdfFrame = true;
    }
    else this.imgFrame = true;
    this.showModal = true;
  }
  closeModal() {
    this.showModal = false;
  }
}
