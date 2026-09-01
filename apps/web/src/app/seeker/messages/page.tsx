import type { Metadata } from "next";
import { Bell, MessageSquare, Search } from "lucide-react";
import { SectionCard, WorkspaceHeader } from "@/components/workspace-ui";
import { seekerSummary } from "@/data/workspace";

export const metadata: Metadata = { title: "Messages" };
export default function MessagesPage() { return <><WorkspaceHeader eyebrow="Inbox" title="Messages" description="Conversations with employers, application updates, and TalentSouq notifications." />
  <div className="inbox-layout"><SectionCard title="Conversations" action={<button className="icon-button" aria-label="Search messages"><Search size={16} /></button>}><div className="thread-list">{seekerSummary.messages.map((message, index) => <button type="button" aria-current={index === 0 ? "true" : undefined} key={message.subject}><span>{message.from.slice(0, 2).toUpperCase()}</span><div><strong>{message.from}</strong><p>{message.subject}</p></div><small>{message.time}</small></button>)}</div></SectionCard><SectionCard title="Maya · Nexa Commerce" description="Senior Product Designer"><div className="message-placeholder"><MessageSquare size={28} /><strong>Select and continue a conversation</strong><p>Full realtime threads, attachments, and read states will connect here.</p><button className="button button-primary button-small" type="button">Reply</button></div></SectionCard></div>
  <SectionCard title="Notifications" action={<button className="text-button" type="button"><Bell size={15} /> Notification settings</button>}><div className="notification-list">{seekerSummary.notifications.map((item) => <article key={item.title}><span /><div><strong>{item.title}</strong><p>{item.meta}</p></div></article>)}</div></SectionCard></>; }
