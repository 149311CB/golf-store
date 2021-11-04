import { IGolfProperty } from "../types/Golfs";

export interface Iterator {
  next(): any;
  hasNext(): boolean;
  mapValues(callback: Function): any;
}

export interface aggregator {
  createIterrator(): Iterator;
}

export class MapIterator implements Iterator {
  private collection: Map<string, IGolfProperty> = new Map();

  constructor(collection: Map<string, IGolfProperty>) {
    this.collection = collection;
  }

  next() {
    var result = this.collection.entries().next();
    return result;
  }

  hasNext(): boolean {
    return !this.collection.entries().next();
  }

  mapValues(callback: Function): IGolfProperty[] {
    const values = Array.from(this.collection.values());
    return values.map((value, index, array) => {
      return callback(value, index, array);
    });
  }

  mapKeys(callback: Function): IGolfProperty[] {
    const values = Array.from(this.collection.keys());
    return values.map((value, index, array) => {
      return callback(value, index, array);
    });
  }

  mapEntries(callback: Function): IGolfProperty[] {
    const values = Array.from(this.collection.entries());
    return values.map((value, index, array) => {
      return callback(value, index, array);
    });
  }
}
