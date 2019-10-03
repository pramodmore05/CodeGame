import { Component, ViewChild, ElementRef, OnInit } from '@angular/core';
import "ag-grid-enterprise";
import { MergepdfService } from '../services/mergepdf.service';
import { FileModel } from '../model/file.model';
import { ApplicationStateService } from '../services/application-state.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  styleUrls: ['./home.component.scss'],
  templateUrl: './home.component.html',
})
export class HomeComponent implements OnInit {
  title = 'MergePDF';
  gridApi;
  documentFilesGridAPI;
  selectedRowData: any;
  documentFiles: FileModel[];

  ngOnInit() {
    localStorage.clear();
  }

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
    { headerName: 'FileName', field: 'fileName', minWidth: 100 },
    { headerName: 'Size', field: 'size', minWidth: 50 },
    { headerName: 'Last Modified', field: 'lastModifiedDate', minWidth: 50 }
  ];

  rowData: FileModel[];

  onGridReady(params) {
    this.gridApi = params.api;
    // this.gridColumnApi = params.columnApi;
    this.mergePDFService.getFiles().subscribe((response) => {
      this.rowData = response;
      this.gridApi.sizeColumnsToFit();
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
          localStorage.setItem('data', JSON.stringify(this.applicationStateService.data));
          if (this.applicationStateService.data && this.applicationStateService.data.length == 1) {
            this.open(this.modalContentRef);
          }
          if (this.applicationStateService.data && this.applicationStateService.data.length == 2) {
            this.router.navigate(['/text-control']);
          }
          if (this.applicationStateService.data && this.applicationStateService.data.length > 2) {
            alert('Please select no more that 2 files');
          }
          //this.applicationStateService.data=this.selectedRowData;
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
    this.modalService.open(content, { centered: true, windowClass:'modal-custom'}).result.then((result) => {
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
      this.router.navigate(['/text-control']);
    }, (error) => {

    });

  }
}
