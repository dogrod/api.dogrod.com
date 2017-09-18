declare interface IResponse {
  code: string,
  description: string | null,
  result: Object | Array<any> | string | number | null,
}