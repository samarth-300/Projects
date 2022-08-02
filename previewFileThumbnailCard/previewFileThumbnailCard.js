// Copyright © 2022 MaxVal Group. All Rights Reserved.
// Unauthorized copying of this file, via any medium is strictly prohibited
// Proprietary and confidential

import { LightningElement, api, track } from "lwc";

export default class PreviewFileThumbnailCard extends LightningElement {
  @api file;
  @api thumbnail;
  @api testing;
  @api filename;
  @track values;
  @track titleValue;
  @track test;

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
  filePreview() { // Called on click of icon (only for image and PDF)
    console.log("###Click");
    const showPreview = this.template.querySelector("c-preview-file-modal");
    showPreview.show(); // show() is called from previewFileModal.js, which opens and closes modal
  }
  
}