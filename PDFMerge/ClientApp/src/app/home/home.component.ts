import { Component } from '@angular/core';
import "ag-grid-enterprise";
import { MergepdfService } from '../services/mergepdf.service';
import { FileModel } from '../model/file.model';
import { ApplicationStateService } from '../services/application-state.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
})
export class HomeComponent {
  title = 'MergePDF';
  gridApi;
  selectedRowData: any;
  

  constructor(private mergePDFService: MergepdfService,
    private applicationStateService: ApplicationStateService,
    private modalService: NgbModal) {

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
    // this.http
    //   .get(
    //     "https://raw.githubusercontent.com/ag-grid/ag-grid/master/packages/ag-grid-docs/src/olympicWinnersSmall.json"
    //   )
    //   .subscribe(data => {
    //     this.rowData = data;
    //   });
  }

  onSelectionChanged() {
    var selectedRows = this.gridApi.getSelectedRows();
    this.applicationStateService.data.push(selectedRows);
    // var selectedRowsString = "";
    // selectedRows.forEach(function(selectedRow, index) {
    //   if (index > 5) {
    //     return;
    //   }
    //   if (index !== 0) {
    //     selectedRowsString += ", ";
    //   }
    //   selectedRowsString += selectedRow.fileName;
    // });
    // if (selectedRows.length >= 5) {
    //   selectedRowsString += " - and " + (selectedRows.length - 5) + " others";
    // }
    // //document.querySelector("#selectedRows").innerHTML = selectedRowsString;
    // this.selectedRowData=selectedRowsString;

  }

  getContextMenuItems = function (params) {
    var result = [
      {
        name: "Merge",
        action: function () {
          //window.alert("Alerting about " + params.value);
          console.log(this.selectedRowData);
          //this.applicationStateService.data=this.selectedRowData;
        }.bind(this),
        cssClasses: ["redFont", "bold"]
      }];
    return result;
  }.bind(this);

  open(content) {
    // call open function modal instance to open the modal with given properties
    this.modalService.open(content, { centered: true }).result.then((result) => {
      // this function is called when close function of modal instance is called
      //this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      if (reason == "local") {
        console.log("local selected");

      } else if (reason == "cloud") {
        console.log("cloud selected");
      } else {
        return;
      }
      // this function is called when dismiss function of modal instance is called
      //this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }
}
