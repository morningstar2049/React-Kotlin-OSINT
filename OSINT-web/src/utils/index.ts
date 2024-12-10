import { API_BASE_URL } from "../constants";
import { IScan, IScanHistory } from "../types";

export async function getScanHistory() {
  const res = await fetch(API_BASE_URL + "/scan-history");
  if (res.ok) {
    const data: IScanHistory = await res.json();
    const transformedData = data.map((item) => ({
      ...item,
      result: JSON.parse(item.result as unknown as string),
    }));
    return transformedData as IScanHistory;
  }

  const error = await res.text();
  throw new Error(error);
}

export async function startNewScan(reqBody: { domain: string }) {
  const res = await fetch(API_BASE_URL + "/scan", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(reqBody),
  });
  if (res.ok) {
    const data: IScan = await res.json();
    const transformedData = {
      ...data,
      result: JSON.parse(data.result as unknown as string),
    };
    return transformedData as IScan;
  }

  const error = await res.text();
  throw new Error(error);
}

export function dateFormatter(dateString: string) {
  const date = new Date(dateString);

  return `${date.toDateString()}, ${date.toLocaleTimeString()}`;
}
