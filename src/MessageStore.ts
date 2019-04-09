export class MessageBody {
  constructor(
    public text: string,
    public   type: string = 'info',
    public duration: number = 1000,
    public   isOpen: boolean = true,
    public   createdTime: Date = new Date()) {
  }
}

export interface MessageListener {
  (message: MessageBody): void;
}

export default interface MessageStore {

  message: MessageBody;
  listenerPromise: Promise<Array<MessageListener>>;

  /**
   * 原格式：“Error: GraphQL error: Exception while fetching data (/reserveCreate) : 空余席位不足，请减少席位重试”
   * @param {message,errorCode,locations,errorType,path,extensions} graphqlError
   */
  newGraphqlError(graphqlError: string): void;

  newError(text: string): void;

  newSuccess(text: string): void;

  newMessage(message: MessageBody): void;

  closeMessage(): void;
}
