export class GolfPropertyMap<T>{
  map = new Map<T, any>();
  add(comparision: T, _: any, insertion?: any) {
    if (!this.map.has(comparision)) {
      this.map.set(comparision, {
        // variants: [variant._id],
        visualDisabled: false,
        disabled: false,
        ...insertion,
      })
    } else {
      this.map.set(comparision, {
        // variants: [...this.map.get(comparision)?.variants,
        // variant._id],
        visualDisabled: false,
        disabled: false,
        ...insertion,
      });
    }
    return this
  }
  toArray() {
    return Array.from(this.map).map(kv => {
      const [key, value] = kv
      return { value: key, ...value }
    })
  }
}
