import { LightningElement, api, track } from "lwc";

export default class OnlyThumbnail extends LightningElement {
  @api file;
  @api thumbnail;
  @api testing;
  @api filename;
  @track values;
  @track titleValue;
  @track test;
  @track redirectToRecordPage;

  //imageAndPdfTypes=["pdf","application/pdf","png","image/png","jpg","image/jpeg","jpeg","jfif"]

  get forTemplate() { // 
    if (this.file.Extension === "pdf" || this.file.Extension === "application/pdf" || this.file.Extension === "png" || this.file.Extension === "image/png"
      || this.file.Extension === "jpg" || this.file.Extension === "image/jpeg" || this.file.Extension === "jpeg" || this.file.Extension === "jfif") {
      this.values = this.testing; // doctype:image or doctype:pdf
      this.titleValue = this.filename;
      return true;
    }
    else {
      this.test = this.testing; // noPreview
      return false;
    }
  }
  
}