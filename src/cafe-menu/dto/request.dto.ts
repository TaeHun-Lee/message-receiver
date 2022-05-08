class RequestDto {
  isError: boolean;
  tenantId: string;
  tenantDomain: string;
  channelId: string;
  channelName: string;
  userId: string;
  command: string;
  text: string;
  responseUrl: string;
  appToken: string;
  cmdToken: string;
  triggerId: string;
}
class InterActiveRequestDto {
  isError: boolean;
  tenant: {
    domain: string;
  };
  channel: {
    id: string;
  };
  user: object;
  commandName: string;
  command: string;
  text: string;
  callbackId: string;
  actionName: string;
  actionValue: string;
  appToken: string;
  cmdToken: string;
  triggerId: string;
  commandRequestUrl: string;
  channelLogId: string;
  originalMessage: object;
}

export { RequestDto, InterActiveRequestDto }