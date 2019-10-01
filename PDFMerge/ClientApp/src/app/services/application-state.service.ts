import { Injectable } from '@angular/core';
import { FileModel } from '../model/file.model';

@Injectable({
  providedIn: 'root'
})
export class ApplicationStateService {
  public data:FileModel[];
  constructor() { }
}
