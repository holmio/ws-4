import { Injectable } from '@angular/core';

class StorageService {
  constructor(private storage: Storage) {}

  get = (key: string): string | null => {
    return this.storage.getItem(key);
  }

  set = (key: string, value: string) => {
    if (value == null) {
      this.storage.removeItem(key);
    } else {
      this.storage.setItem(key, value);
    }
  }

  remove = (key: string) => {
    this.storage.removeItem(key);
  }
}
@Injectable({
  providedIn: 'root'
})
export class SessionStorageService extends StorageService {
  constructor() {
    super(sessionStorage);
  }
}
@Injectable({
  providedIn: 'root'
})
export class LocalStorageService extends StorageService {
  constructor() {
    super(localStorage);
  }
}
