import { z } from "zod";

export const contactInterests = [
  "ai_powered_solutions",
  "saas",
  "mobile_applications",
  "erp_pos",
  "management_systems",
] as const;

export type ContactInterest = (typeof contactInterests)[number];

export const contactInterestLabels: Record<ContactInterest, string> = {
  ai_powered_solutions: "AI Powered Solutions",
  saas: "Software as a Service (SaaS)",
  mobile_applications: "Mobile Applications",
  erp_pos: "ERP & POS System",
  management_systems: "Management Systems",
};

export type ContactValidationMessages = Readonly<{
  nameRequired: string;
  nameTooLong: string;
  emailInvalid: string;
  phoneInvalid: string;
  interestRequired: string;
  messageTooShort: string;
  messageTooLong: string;
}>;

const phonePattern = /^\+?[0-9][0-9\s().-]{6,19}$/;

export function createContactSchema(messages: ContactValidationMessages) {
  return z.object({
    name: z
      .string()
      .trim()
      .min(2, messages.nameRequired)
      .max(100, messages.nameTooLong),
    email: z.string().trim().email(messages.emailInvalid).max(254),
    phone: z
      .string()
      .trim()
      .regex(phonePattern, messages.phoneInvalid),
    interest: z.enum(contactInterests, messages.interestRequired),
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
  phoneInvalid: "invalid_phone",
  interestRequired: "invalid_interest",
  messageTooShort: "invalid_message",
  messageTooLong: "invalid_message",
}).extend({
  locale: z.enum(["ar", "en"]).optional(),
});

export type ContactSubmission = z.infer<typeof serverContactSchema>;
