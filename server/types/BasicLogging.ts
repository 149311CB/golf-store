export class Log {
  _id?: string;
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
  error?: string;
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
    error?: string,
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
    this.error = error;
  }
}
