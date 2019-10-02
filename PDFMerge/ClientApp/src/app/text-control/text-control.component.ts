import { Component, Inject, EventEmitter, Output, Input, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ApplicationStateService } from '../services/application-state.service';
import { MergepdfService } from '../services/mergepdf.service';

declare var TXTextControlWeb, TXTextControl;

@Component({
  selector: 'app-text-control',
  templateUrl: './text-control.component.html'
})
export class TextControlComponent implements OnInit {

  constructor(private mergePDFService: MergepdfService) {

  }

  dropped(ev) {
    console.log("text dropped.");
  }
  control1: any;
  control2: any; 

  getDocument() {

  }

  ngOnInit(): void {
    this.control1 = new TXTextControlWeb("sourceContainer");
    this.control2 = new TXTextControlWeb("destContainer");
    window.addEventListener("textControlWebLoaded", (function () {
      console.log(" control loaded");
      this.mergePDFService.getFile().subscribe((res) => {
        this.control1.loadDocument(TXTextControl.StreamType.AdobePDF, res.fileData);
        this.control2.loadDocument(TXTextControl.StreamType.AdobePDF, res.fileData);
      });

      this.control1.addEventListener("textDropped", this.textDroppedCallback);
      this.control1.addEventListener("fileDropped", function (e) {
      });
      document.getElementById("myTextControlContainer_txframe").setAttribute("droppable", "true");
      console.log(document.getElementById("myTextControlContainer_txframe"));
      this.message = new Object();
      this.message.receiver = "txtextcontrol - client";
      this.message.data = '$("#tabReports").css("display","none");';
      window.postMessage(this.message, "*");
      this.control1.ribbon.showElement("ribbonGroupMergeField", false);
      this.control1.ribbon.showElement("drpDnBtnInsertBookmark", false);
    }).bind(this));


    console.log(this.control1);
    console.log(TXTextControl);
  }
  
}

