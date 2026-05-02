import { Notification } from "../types/notification";

const weights: Record<string, number> = {
    placement: 3,
    result: 2,
    event: 1,
};

export function getPriorityScore(notification: Notification): number {
    const type = notification.type.toLowerCase();
    const weight = weights[type] || 0;
    const time = new Date(notification.createdAt).getTime();

    return weight * 1_000_000_000 + time;
}

export function getTopNotifications(
    notifications: Notification[],
    limit: number = 10
): Notification[] {
    return notifications
        .filter((n) => !n.read)
        .sort((a, b) => getPriorityScore(b) - getPriorityScore(a))
        .slice(0, limit);
}