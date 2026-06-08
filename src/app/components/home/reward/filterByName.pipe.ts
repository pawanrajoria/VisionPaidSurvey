import { Pipe } from "@angular/core";

@Pipe({ name: 'cashoutFilterByName' })
export class CasoutFilterByNamePipe {
    transform(items: any[], searchText: string): any[] {
        if (!searchText) return items;
        return items.filter(i =>
            i.name.toLowerCase().includes(searchText.toLowerCase())
        );
    }
}
