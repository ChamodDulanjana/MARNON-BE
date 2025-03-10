export class ResponseDTO{
  statusCode: number;
  message: string | string[];
  timestamp: string;
  data: any;

  constructor(statusCode: number, message: string | string[], data?: any){
    this.statusCode = statusCode;
    this.message = message;
    this.timestamp = new Date().toLocaleString();
    this.data = data ?? null;
  }
}