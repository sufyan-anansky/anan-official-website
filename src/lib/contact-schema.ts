import { z } from "zod";

export type ContactValidationMessages = Readonly<{
  nameRequired: string;
  nameTooLong: string;
  emailInvalid: string;
  messageTooShort: string;
  messageTooLong: string;
}>;

export function createContactSchema(messages: ContactValidationMessages) {
  return z.object({
    name: z
      .string()
      .trim()
      .min(2, messages.nameRequired)
      .max(100, messages.nameTooLong),
    email: z.string().trim().email(messages.emailInvalid).max(254),
    message: z
      .string()
      .trim()
      .min(20, messages.messageTooShort)
      .max(5000, messages.messageTooLong),
  });
}

export type ContactFormValues = z.infer<
  ReturnType<typeof createContactSchema>
>;

export const serverContactSchema = createContactSchema({
  nameRequired: "invalid_name",
  nameTooLong: "invalid_name",
  emailInvalid: "invalid_email",
  messageTooShort: "invalid_message",
  messageTooLong: "invalid_message",
});
