class RequestInterface {
  tenantId: string;
  tenantDomain: string;
  channelId: string;
  channelName: string;
  userId: string;
  userEmail: string;
  command: string;
  text: string;
  responseUrl: string;
  appToken: string;
  cmdToken: string;
  triggerId: string;
}

class RequestDto extends RequestInterface {
  errObj: {
    isError: false;
    errMsg: null;
  };
  actionName: string;
  actions: Array<string>;
}

class InterActiveRequestDtoInterface {
  tenant: any;
  channel: any;
  user: any;
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
  originalMessage: any;
}

class InterActiveRequestDto extends InterActiveRequestDtoInterface {
  errObj: {
    isError: false;
    errMsg: null;
  };
}

export { RequestDto, InterActiveRequestDto };
