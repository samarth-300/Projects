import { LightningElement, api, track, wire } from "lwc";
import { deleteRecord } from 'lightning/uiRecordApi';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import GetFileDetails from "@salesforce/apex/FileHelper.GetFileDetails";
import noPreview from '@salesforce/resourceUrl/noPreview'; 
import { FlowNavigationNextEvent,FlowAttributeChangeEvent  } from 'lightning/flowSupport';

export default class FileUploader extends LightningElement {
  loaded = false;
  @api multipleFiles;
  @api fileUploadLabel = "Please Upload Related Files ";
  @api accountRecordId;
  @track files;
  @track size = [];
  @track file;
  @track error;
  @track fileList;
  @api selectedDocumentIds=[];
  @api availableActions = []; // The availableActions array contains which actions are available for the screen
  buttonName='Save';
  @api buttonClick='';
  get acceptedFormats() {
    return [".doc", ".docx", ".pdf", ".png", ".jpg", ".jpeg", ".jfif", ".xls", ".xlsx", ".tiff", ".zip", ".rar"];
  }

  handleUploadFinishedmultiple(event) { // triggered when the upload is finished
    const uploadedFiles = event.detail.files; // uploaded file details are assigned to uploadedFiles
    console.log('uploadedFiles',uploadedFiles)
    console.log("files before",JSON.stringify(this.files));
    this.files = [...this.files,...this.generateFiles(uploadedFiles)];
    console.log("files after",JSON.stringify(this.files));
    console.log("onupload Files1");
    console.log(JSON.stringify(this.files));

    for(let i=0;i<this.files.length;i++){
      this.selectedDocumentIds.push(this.files[i].Id);
    }
    console.log('selectedDocumentIds in multiple',this.selectedDocumentIds)
    // for(let i=0;i<this.files.length;i++){
    //   this.selectedDocumentIds.push(this.files[i].ContentDocumentId);
    // }
    this.loaded = true;
  }

  generateFiles(filesOnUpload){ // this function assigns the properties inside the filesOnUpload to respective properties of file object and is added to listOfFiles
    let listOfFiles = [];
    for (let i = 0; i < filesOnUpload.length; i++) {
      this.file = {
        Id: filesOnUpload[i].documentId,
        Title: filesOnUpload[i].name,
        Extension: filesOnUpload[i].mimeType,
        ContentVersionId: filesOnUpload[i].contentVersionId,
        fileType: this.getImage(filesOnUpload[i].mimeType), // getImage returns the docType, based on whether its PDF,image etc.
        downloadUrl: "/sfc/servlet.shepherd/document/download/" + filesOnUpload[i].documentId
      };
      listOfFiles.push(this.file);
    }
    return listOfFiles;
  }

  //This function is invoked when delete button is clicked.
  ondelete(event) {
    const idToRemove = event.currentTarget.dataset.id;
    console.log(idToRemove);

    deleteRecord(idToRemove);
    if (this.files.length == 1) {
      this.files = this.files.filter((item) => item.Id != idToRemove);
      console.log('this.files',this.files)
      this.loaded = false // flag to display the preview datatable will be hidden
    } else {
      this.files = this.files.filter((item) => item.Id != idToRemove);
      console.log('this.files',this.files)
    }
    console.log(JSON.stringify(this.files));

  }

  @wire(GetFileDetails, { fileId: '$selectedDocumentIds' }) // Apex call is made whenever 
  fileResponse(value) {

    this.wiredActivities = value;
    const { data, error } = value;
    this.fileList = "";
    this.files = [];

    if (data) {
      this.fileList = data;
      console.log('fileList',this.fileList[0])
      for (let i = 0; i < this.fileList.length; i++) {
        let file = {
          Id: this.fileList[i].ContentDocumentId,
          Title: this.fileList[i].Title,
          Extension: this.fileList[i].FileExtension,
          ContentDocumentId: this.fileList[i].Id,
          thumbnailFileCard:
            "/sfc/servlet.shepherd/version/renditionDownload?rendition=THUMB720BY480&versionId=" +
            this.fileList[i].Id +
            "&operationContext=CHATTER&contentId=" +
            this.fileList[i].ContentDocumentId,
          downloadUrl:
            "/sfc/servlet.shepherd/document/download/" +
            this.fileList[i].ContentDocumentId,
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

  handleReset() {
    console.log(this.selectedDocumentIds);
    for(let id of this.selectedDocumentIds){
      deleteRecord(id);
    }
    this.files=[];
    console.log('value',this.files);
    this.selectedDocumentIds=[];
    this.loaded = false
  }

  @api selectedTarget;
  handleGoNext() {
    // check if NEXT is allowed on this screen
    this.selectedTarget='Confirmation Screen';
    const attributeChangeEvent = new FlowAttributeChangeEvent('selectedTarget', this.selectedTarget );
    this.dispatchEvent(attributeChangeEvent);
    if (this.availableActions.find((action) => action === 'NEXT')) {
        // navigate to the next screen
        const navigateNextEvent = new FlowNavigationNextEvent();
        this.dispatchEvent(navigateNextEvent);
    }
}

  handlePrevious() {
    this.selectedTarget='Account Update';
    const attributeChangeEvent = new FlowAttributeChangeEvent('selectedTarget', this.selectedTarget );
    this.dispatchEvent(attributeChangeEvent);
    this.buttonClick='Previous';
    if (this.availableActions.find((action) => action === 'NEXT')) {
      // navigate to the next screen
      const navigateNextEvent = new FlowNavigationNextEvent();
      this.dispatchEvent(navigateNextEvent);
  }
  }
}
