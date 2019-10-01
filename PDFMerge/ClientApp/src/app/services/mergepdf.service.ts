import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FileModel } from '../model/file.model';

@Injectable({
  providedIn: 'root'
})
export class MergepdfService {

  constructor(private httpClient: HttpClient) {

  }

  getFiles():FileModel[] {
    let files: FileModel[]=[];
    files.push({ id: 1, fileData: 'test', fileName: 'test.txt', lastModifiedDate: '02/10/2019', size: '2.3kb' });
    files.push({ id: 1, fileData: 'test 32', fileName: 'test1.txt', lastModifiedDate: '02/10/2019', size: '2.3kb' });
    files.push({ id: 1, fileData: 'test 3434', fileName: 'test23.txt', lastModifiedDate: '02/10/2019', size: '2.3kb' });
    return files;
  }
  
}
