import { observable, action } from 'mobx';
import MessageStore, { MessageBody, MessageListener } from '../MessageStore';


class MobxMessageStore implements MessageStore {
  @observable
  message: MessageBody;
  listenerPromise: Promise<Array<MessageListener>>;

  constructor(private messageListeners: Array<MessageListener> = []) {
    //可以传入不同类型的消息处理函数，如：{taroAtMessage:Taro.atMessage}
    this.listenerPromise = Promise.resolve(messageListeners);
  }

  /**
   * 原格式：“Error: GraphQL error: Exception while fetching data (/reserveCreate) : 空余席位不足，请减少席位重试”
   * @param {message,errorCode,locations,errorType,path,extensions} graphqlError
   */
    //如果加了@action无法捕获异常
  newGraphqlError = (graphqlError) => {
    const text = graphqlError.message
      .split(':')
      .filter(str =>
        !(str === 'GraphQL error' || str.indexOf('Exception while fetching data') > -1))
      .join(':')
    this.newError(text)
    throw graphqlError
  }

  @action
  newError(text) {
    this.newMessage(new MessageBody(text, 'error', 2000))
  }

  @action
  newSuccess(text) {
    this.newMessage(new MessageBody(text, 'success'))
  }

  /**
   * @param text
   * @param duration
   * @param type
   * @param isOpened
   */
  @action
  newMessage(message: MessageBody) {
    this.message = message
    this.listenerPromise.then(messageListeners => messageListeners.forEach(listener => listener(this.message)))
  }

  @action
  closeMessage() {
    this.message = { ...this.message, isOpen: false }
  }
}

export default MobxMessageStore;
