import { Component, Inject, EventEmitter, Output, Input, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ApplicationStateService } from '../services/application-state.service';
import { MergepdfService } from '../services/mergepdf.service';
import { FileModel } from '../model/file.model';

declare var TXTextControlWeb, TXTextControl;

@Component({
  selector: 'app-text-control',
  templateUrl: './text-control.component.html'
})
export class TextControlComponent implements OnInit {

  constructor(private mergePDFService: MergepdfService,private applicationStateService:ApplicationStateService) {
    if(this.applicationStateService.data){
      this.sourceFileModel=this.applicationStateService.data[0];
      this.destinationFileModel=this.applicationStateService.data[1];
    }
  }
  sourceFileModel:FileModel;
  destinationFileModel:FileModel;
  
  control1: any;
  control2: any;
  swapped =  false;

  swap() {
    this.swapped = !this.swapped;
    this.destinationFileModel = this.swapped ? this.applicationStateService.data[0] : this.applicationStateService.data[1];
    this.sourceFileModel = this.swapped  ? this.applicationStateService.data[1] : this.applicationStateService.data[0];
    this.control1.loadDocument(TXTextControl.StreamType.AdobePDF, this.sourceFileModel.fileData);
    this.control2.loadDocument(TXTextControl.StreamType.AdobePDF, this.destinationFileModel.fileData);
  }

  getDocument() {

  }

  ngOnInit(): void {
    this.control1 = new TXTextControlWeb("sourceContainer");
     this.control2 = new TXTextControlWeb("destContainer");
    window.addEventListener("textControlWebLoaded", (function () {
      console.log(" control loaded");
      //this.mergePDFService.getFile().subscribe((res) => {
        this.control1.loadDocument(TXTextControl.StreamType.AdobePDF, this.sourceFileModel.fileData);
        this.control2.loadDocument(TXTextControl.StreamType.AdobePDF, this.destinationFileModel.fileData);
      //});
   
    }).bind(this));

   function hideRibbon(){
       var ribbonGroup = document.getElementById('ribbonbar');

        ribbonGroup.setAttribute('display', 'none');
    }

  }
  merge(){
    this.control2.saveDocument(TXTextControl.StreamType.AdobePDF , (function (e) {
      //data.conetntText = e.data;
      console.log(e.data);
      this.destinationFileModel.fileData=e.data;
      this.mergePDFService.saveMergedDocument(this.destinationFileModel).subscribe(response => {
        
      });
      //  console.log(e.data);
    }).bind(this));
  }

  autoMerge(){
    this.control2.saveDocument(TXTextControl.StreamType.AdobePDF , (function (e) {
      this.destinationFileModel.fileData=e.data;
      this.control1.saveDocument(TXTextControl.StreamType.AdobePDF , (function (d) {
        this.sourceFileModel.fileData= d.data;
        this.mergePDFService.autoMergedDocument([this.destinationFileModel,this.sourceFileModel]).subscribe(response => {
        
        });
        //  console.log(e.data);
      }).bind(this));
      //  console.log(e.data);
    }).bind(this));

    
  }
}

