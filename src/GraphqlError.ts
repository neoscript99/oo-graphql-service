export interface GraphqlError{
  message: string
  errorCode: string
  locations: string
  errorType: string
  path: string
  extensions: string
}
