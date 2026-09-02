export const NOTIFICATIONS_SEEN_EVENT = "ts-notifications-seen";

export function seenStorageKey(role: string) {
  return `talentsouq:${role}:notifications-seen`;
}
