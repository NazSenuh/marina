export class CustomError {
    public message: string
    public status: number
      constructor(_message: string, _status: number) {
       this.message = _message
       this.status = _status
}
}