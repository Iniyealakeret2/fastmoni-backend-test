import { MessageInterface, messageTemplate } from "./email.form.template";

export const thankYouMessageTemplate = (p: MessageInterface) => {
  return messageTemplate({ ...p });
};
