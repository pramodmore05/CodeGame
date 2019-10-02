import { Component, Inject, EventEmitter, Output, Input } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ApplicationStateService } from '../services/application-state.service';

@Component({
  selector: 'app-merge-docs',
  templateUrl: './merge-documents.component.html'
})
export class MergeDocumentsComponent {

  public _htmlContent: string;
  public fileName: string = '';
  public sourceName: string = "Source";
  public destinationName: string = "Destination";
  public _sourceHtmlContent: string  = "<p>Nitin</p>";
  public _destinationHtmlContent: string="<p>Varpe</p>";
  //property used to set or get html content
  
  get htmlContent() {
    return this._htmlContent;
  }
  set htmlContent(val) {
    if (val != "") {
      this._htmlContent = val;
    }
  }

  public configuration: any;
  constructor(private service: ApplicationStateService) {
    this.sourceName = service.data[1][0].fileName;
    this.destinationName = service.data[1][1].fileName;
    this._sourceHtmlContent = service.data[1][0].fileData;
    this._destinationHtmlContent = service.data[1][1].fileData;
    this.configuration = {
      placeholder: '',
      tabsize: 2,
      minHeight: 150,
      lineHeight: 0.5,
      disableDragAndDrop: true,
      toolbar: [
        // [groupName, [list of button]]
        ['misc', ['undo', 'redo', 'codeview']],
        ['font', ['bold', 'italic', 'underline', 'strikethrough', 'clear']],
        ['fontsize', ['fontname', 'fontsize', 'color']],
        ['para', ['style0', 'ul', 'ol', 'paragraph', 'height']],
        ['insert', ['table', 'picture', 'link', 'hr']]
      ],
      fontNames: ['Helvetica', 'Arial', 'Arial Black', 'Comic Sans MS', 'Courier New', 'Roboto', 'Times']
    }
  }

  ngOnInit() {

  }

  merge() {
    console.log('merged');
  }

  swap() {
    console.log('swapped');
  }
}

