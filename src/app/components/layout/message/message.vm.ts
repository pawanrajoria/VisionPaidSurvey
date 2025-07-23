export class MessageVM {
    public Message: string = '';
    public Type: string = '';
    constructor(private message: string, private type: string) {
        this.Message = message;
        this.Type = type;
    }
}
