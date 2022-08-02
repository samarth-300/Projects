// Copyright © 2022 MaxVal Group. All Rights Reserved.
// Unauthorized copying of this file, via any medium is strictly prohibited
// Proprietary and confidential

import { LightningElement, api, track, wire } from "lwc";
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import GetFileDetails from "@salesforce/apex/FileHelper.GetFileDetails";
import noPreview from '@salesforce/resourceUrl/noPreview'; 

export default class OnlyPreview extends LightningElement {
  loaded = false;
  // @api multipleFiles;
  @api fileUploadLabel = "Please Upload Related Files ";
  @api accountRecordId;
  @track files;
  @track size = [];
  @track file;
  @track error;
  @api fileList;
  @api selectedDocumentIds=[];

  @wire(GetFileDetails, { fileId: '$selectedDocumentIds' }) // Apex call is made whenever 
  fileResponse(value) {

    console.log('files from database',value.data)
    this.wiredActivities = value;
    const { data, error } = value;
    this.fileList = "";
    this.files = [];

    console.log('data ',data)
    if (data) {
      this.fileList = data;
      console.log('fileList',this.fileList[0].ContentDocumentId)
      for (let i = 0; i < this.fileList.length; i++) {
        let file = {
          Id: this.fileList[i].ContentDocumentId,
          Title: this.fileList[i].Title,
          Extension: this.fileList[i].FileExtension,
          ContentDocumentId: this.fileList[i].ContentDocumentId,
          thumbnailFileCard:
            "/sfc/servlet.shepherd/version/renditionDownload?rendition=THUMB720BY480&versionId=" +
            this.fileList[i].Id +
            "&operationContext=CHATTER&contentId=" +
            this.fileList[i].ContentDocumentId,
          redirectUrl:"/lightning/r/ContentDocument/"+this.fileList[i].ContentDocumentId+"/view",
          fileType: this.getImage(this.fileList[i].FileExtension)
        };
        this.files.push(file);
      }
      if (this.fileList != null && this.fileList.length > 0)
        this.loaded = true;
      console.log("Apex called files", JSON.stringify(this.files));
    } else if (error) {
      this.dispatchEvent(
        new ShowToastEvent({
          title: "Error loading Files",
          message: error.body.message,
          variant: "error"
        })
      );
    }
  }

  getImage(value) { // getImage returns the docType, based on whether its PDF,image etc.
    if (value === "pdf" || value === "application/pdf") {
      return "doctype:pdf";
    }
    if (value === "png" || value === "image/png" || value === "jpg" || value === "jpeg" || value === "jfif" || value === "image/jpeg") {
      return "doctype:image";
    }
    else {
      return noPreview; // for file other than PDF or image, static image of no preview is displayed
    }

  }

}