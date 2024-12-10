export interface IScan {
  id: string;
  domain: string;
  startTime: string;
  endTime: string;
  result: IScanResult;
}

export interface IScanResult {
  ips: string[];
  linkedInLinks: string[];
  emails: string[];
}

export type IScanHistory = IScan[];
