import nodemailer from "nodemailer";
import {
  contactInterestLabels,
  type ContactSubmission,
} from "@/lib/contact-schema";

const RATE_WINDOW_MS = 10 * 60 * 1000;
const RATE_LIMIT = 8;
const recentSubmissions = new Map<string, number[]>();

export type SmtpConfig = {
  host: string;
  port: number;
  secure: boolean;
  user: string;
  password: string;
  from: string;
  to: string;
};

function readEnv(name: string) {
  const value = process.env[name]?.trim();
  return value ? value : undefined;
}

/**
 * SMTP settings come from the environment so credentials stay out of the repo.
 * Returns null until SMTP_HOST, SMTP_USER, SMTP_PASSWORD, and SMTP_FROM are set.
 */
export function getSmtpConfig(): SmtpConfig | null {
  const host = readEnv("SMTP_HOST");
  const user = readEnv("SMTP_USER");
  const password = readEnv("SMTP_PASSWORD");
  const from = readEnv("SMTP_FROM");
  const portValue = readEnv("SMTP_PORT") ?? "587";
  const port = Number(portValue);

  if (!host || !user || !password || !from || !Number.isInteger(port)) {
    return null;
  }

  if (port < 1 || port > 65535) return null;

  const secureSetting = readEnv("SMTP_SECURE");
  const secure =
    secureSetting === undefined ? port === 465 : secureSetting === "true";

  return {
    host,
    port,
    secure,
    user,
    password,
    from,
    to: readEnv("CONTACT_TO_EMAIL") ?? "info@anansky.net",
  };
}

export function isContactRateLimited(key: string) {
  const now = Date.now();
  const recent = (recentSubmissions.get(key) ?? []).filter(
    (timestamp) => now - timestamp < RATE_WINDOW_MS,
  );

  if (recent.length >= RATE_LIMIT) {
    recentSubmissions.set(key, recent);
    return true;
  }

  recent.push(now);
  recentSubmissions.set(key, recent);
  return false;
}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function singleLine(value: string) {
  return value.replace(/[\r\n]+/g, " ").trim();
}

export async function sendContactInquiry(submission: ContactSubmission) {
  const config = getSmtpConfig();
  if (!config) return { status: "not_configured" as const };

  const interest = contactInterestLabels[submission.interest];
  const localeLabel = submission.locale === "ar" ? "Arabic" : "English";
  const submittedAt = new Date().toISOString();
  const subject = `New inquiry from ${singleLine(submission.name)} — ${interest}`;

  const text = [
    "New contact inquiry",
    "",
    `Name: ${submission.name}`,
    `Email: ${submission.email}`,
    `Phone: ${submission.phone}`,
    `Interest: ${interest}`,
    `Language: ${localeLabel}`,
    `Submitted: ${submittedAt}`,
    "",
    "Message:",
    submission.message,
  ].join("\n");

  const html = `
    <h2>New contact inquiry</h2>
    <p><strong>Name:</strong> ${escapeHtml(submission.name)}</p>
    <p><strong>Email:</strong> <a href="mailto:${escapeHtml(submission.email)}">${escapeHtml(submission.email)}</a></p>
    <p><strong>Phone:</strong> <a href="tel:${escapeHtml(submission.phone)}">${escapeHtml(submission.phone)}</a></p>
    <p><strong>Interest:</strong> ${escapeHtml(interest)}</p>
    <p><strong>Language:</strong> ${localeLabel}</p>
    <p><strong>Submitted:</strong> ${submittedAt}</p>
    <p><strong>Message:</strong></p>
    <p style="white-space:pre-wrap">${escapeHtml(submission.message)}</p>
  `;

  try {
    const transporter = nodemailer.createTransport({
      host: config.host,
      port: config.port,
      secure: config.secure,
      auth: {
        user: config.user,
        pass: config.password,
      },
    });

    await transporter.sendMail({
      from: config.from,
      to: config.to,
      replyTo: submission.email,
      subject,
      text,
      html,
    });

    return { status: "sent" as const };
  } catch (error) {
    console.error(
      "Contact email delivery failed.",
      error instanceof Error ? error.message : error,
    );
    return { status: "failed" as const };
  }
}
