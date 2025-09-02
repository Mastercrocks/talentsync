export type ListType = "students" | "employers";

export type Contact = {
  id: string;
  email: string;
  name?: string;
  phone?: string;
  firstName?: string;
  companyName?: string;
  jobTitle?: string;
  type: ListType;
  skills?: string[];
  location?: string;
  engagementLevel?: "low" | "medium" | "high";
};

export type List = {
  id: string;
  name: string;
  type: ListType;
  contactIds: string[];
};

export type EmailTemplate = {
  id: string;
  name: string;
  description?: string;
  defaultSubject: string;
  html: string; // inline CSS with tokens like [First Name], [Job Title], [Company Name], [Job URL]
};

export type Campaign = {
  id: string;
  name: string;
  subject: string;
  templateId: string;
  listId?: string;
  listType?: ListType;
  createdAt: number;
  status?: "draft" | "scheduled" | "sent";
  scheduledAt?: number;
  metrics?: {
    sends: number;
    opens: number;
    clicks: number;
    conversions: number; // job applications or sign-ups
    revenue?: number; // from paid posts or upgrades
    cost?: number; // email cost or ad spend
    links?: { url: string; count: number }[]; // click map
  };
};

export type AutomationStep =
  | { kind: "wait"; days: number }
  | { kind: "sendEmail"; templateId: string; subject: string }
  | { kind: "repeat"; timesPerWeek: number; onDays?: number[] };

export type Automation = {
  id: string;
  name: string;
  enabled: boolean;
  target: { listId?: string; listType?: ListType };
  steps: AutomationStep[];
  createdAt: number;
};
