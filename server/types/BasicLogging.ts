export class Log {
  _id?: string;
  level?: string;
  method: string;
  route: string;
  date: Date;
  statusCode: number;
  statusText: string;
  agent: string;
  duration: number;
  user_ip: string;
  access_resource: string;
  cookies: Object;
  location?: string;
  message?: string;
  info?: string;
  payload?: any;
  constructor(
    method: string,
    route: string,
    date: Date,
    statusCode: number,
    statusText: string,
    agent: string,
    duration: number,
    user_ip: string,
    access_resource: string,
    cookies: Object,
    info?: string, // This should be add by the user
    payload?: any, // This should be too
    level?: string,// This should be add automatically by logger itself
    location?: string, // This should be too
    message?: string, // This should be too
    _id?: string
  ) {
    this._id = _id;
    this.method = method;
    this.route = route;
    this.date = date;
    this.statusCode = statusCode;
    this.statusText = statusText;
    this.agent = agent;
    this.duration = duration;
    this.user_ip = user_ip;
    this.access_resource = access_resource;
    this.cookies = cookies;
    this.message = message;
    this.location = location;
    this.level = level;
    this.info = info;
    this.payload = payload;
  }

  addLocation(location: string) {
    this.location = location
    return this
  }
}
