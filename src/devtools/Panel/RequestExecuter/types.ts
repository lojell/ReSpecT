export interface RequestHeader {
  enabled: boolean;
  header?: string;
  value?: string;
}


export interface ExecutableRequest {
  method: string;
  url: string;
  headers: RequestHeader[];
  body: string
}