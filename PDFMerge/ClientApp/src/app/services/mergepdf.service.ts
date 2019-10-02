import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FileModel } from '../model/file.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MergepdfService {

  constructor(private httpClient: HttpClient) {

  }

  getFiles():Observable<FileModel[]> {
    return this.httpClient.get('https://localhost:44372/api/files/getfiles') as Observable<FileModel[]>
  }

  getFile(): Observable<FileModel> {
    return this.httpClient.get('https://localhost:44372/api/files/getfile') as Observable<FileModel>
  }
  
  saveDocument(fileData:FormData){
    return this.httpClient.post('https://localhost:44372/api/files/saveFile',fileData);
  }
}
