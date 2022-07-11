class ResponseDto {
  text: string;
  responseType?: string;
  deleteOriginal?: boolean;
  replaceOriginal?: boolean;
  callbackId: string;
  attachments: Array<any>;
}

export { ResponseDto };
