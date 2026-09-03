export const NOTIFICATIONS_SEEN_EVENT = "ts-notifications-seen";
export const MESSAGES_SEEN_EVENT = "ts-messages-seen";

export function seenStorageKey(role: string) {
  return `talentsouq:${role}:notifications-seen`;
}

export function messagesSeenStorageKey(role: string) {
  return `talentsouq:${role}:messages-seen`;
}
