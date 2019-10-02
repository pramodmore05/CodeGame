import { Component, ViewChild, ElementRef } from '@angular/core';
import "ag-grid-enterprise";
import { MergepdfService } from '../services/mergepdf.service';
import { FileModel } from '../model/file.model';
import { ApplicationStateService } from '../services/application-state.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
})
export class HomeComponent {
  title = 'MergePDF';
  gridApi;
  documentFilesGridAPI;
  selectedRowData: any;
  documentFiles: FileModel[];

  @ViewChild('content') modalContentRef: ElementRef;
  @ViewChild('fileLoader') fileLoaderRef: ElementRef;
  @ViewChild('cloudmodalcontent') documentFilecontentRef: ElementRef;
  constructor(private mergePDFService: MergepdfService,
    private applicationStateService: ApplicationStateService,
    private modalService: NgbModal,
    private router: Router) {

    this.applicationStateService.data = [];
  }

  columnDefs = [
    { headerName: 'FileName', field: 'fileName' },
    { headerName: 'Size', field: 'size' },
    { headerName: 'Last Modified', field: 'lastModifiedDate' }
  ];

  rowData: FileModel[];

  onGridReady(params) {
    this.gridApi = params.api;
    // this.gridColumnApi = params.columnApi;
    this.mergePDFService.getFiles().subscribe((response) => {
      this.rowData = response;
    });

  }



  onSelectionChanged() {
    var selectedRows = this.gridApi.getSelectedRows();
    this.applicationStateService.data = [];
    selectedRows.forEach((item: FileModel) => {
      this.applicationStateService.data.push(item);
    });

  }

  getContextMenuItems = function (params) {
    var result = [
      {
        name: "Merge",
        action: function () {
          //window.alert("Alerting about " + params.value);
          console.log(this.selectedRowData);
          this.router.navigate(['/merge-docs']);
          //this.applicationStateService.data=this.selectedRowData;
          this.open(this.modalContentRef);
        }.bind(this),
        cssClasses: ["redFont", "bold"]
      }];
    return result;
  }.bind(this);

  onDocumentFilesGridReady(params) {
    this.documentFilesGridAPI = params.api;
    //this.mergePDFService.getFiles().subscribe((response) => {
    this.documentFiles = this.rowData.filter(m => m.fileName != this.applicationStateService.data[0].fileName);
    //});
  }

  onDocumentFilesSelectionChanged() {
    var selectedRows = this.documentFilesGridAPI.getSelectedRows();
    selectedRows.forEach((item: FileModel) => {
      this.applicationStateService.data.push(item);
    });
  }

  open(content) {
    // call open function modal instance to open the modal with given properties
    this.modalService.open(content, { centered: true }).result.then((result) => {
      console.log(result);
      if (result == "local") {
        let el: HTMLElement = this.fileLoaderRef.nativeElement;
        el.click();
        //this.fileLoaderRef.nativeElement.Click();
      }
      else if (result == "cloud") {
        this.openDocumentFileModel(this.documentFilecontentRef);
      }

    }, (reason) => {

    });
  }
  close(c) {
    //c('Close Click');
  }

  openDocumentFileModel(content) {
    this.modalService.open(content, { centered: true }).result.then((result) => {
      console.log(result);
      if (result == "merge") {
      }

    }, (reason) => {

    });
  }

  onFilesSelect(event) {
    let files = event.target.files;

    const formData = new FormData();
    formData.append("file", files[0]);
    this.mergePDFService.saveDocument(formData).subscribe((response: FileModel) => {
      this.applicationStateService.data.push(response);

    }, (error) => {

    });

  }
}
