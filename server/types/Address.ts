export default class Address {
  _id?: string;
  user: string;
  street: string;
  city: string;
  state: string;
  zip:number;
  apt?: string;
  isPrimary: boolean;
  private readonly createdAt?: Date;
  private readonly updatedAt?: Date;
  constructor(
    user: string,
    street: string,
    city: string,
    state: string,
    zip:number,
    isPrimary: boolean,
    apt?: string,
  ) {
    this.user = user;
    this.city = city;
    this.street = street;
    this.state = state;
    this.zip = zip
    this.apt = apt;
    this.isPrimary = isPrimary;
  }
}
