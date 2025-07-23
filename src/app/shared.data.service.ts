import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class SharedDataService {
    private data: any;

    setData(value: any) {
        this.data = value;
    }

    getData() {
        return this.data;
    }

    clearData() {
        this.data = null;
    }
}