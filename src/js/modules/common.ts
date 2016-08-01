interface RequestTypes {
  REQUEST: string;
  SUCCESS: string;
  FAILURE: string;
}

export const createRequestTypes = (base: string): RequestTypes => ({
  REQUEST: `${base}/REQUEST`,
  SUCCESS: `${base}/SUCCESS`,
  FAILURE: `${base}/FAILURE`,
});
