# Stage 1

## Priority Inbox Design

The Priority Inbox displays the top 10 unread notifications based on importance and recency.

### Priority Logic

Priority is calculated using:
- Notification type weight
- Timestamp (recency)

Weights:
- Placement = 3 (highest)
- Result = 2
- Event = 1

Final Score:
priority = weight * 1,000,000,000 + timestamp

This ensures:
- Placement notifications always rank higher
- Recent notifications within same type appear first

## Handling Incoming Notifications

Notifications are fetched from the API every 30 seconds using polling.

Steps:
1. Fetch notifications
2. Filter unread
3. Compute priority score
4. Sort descending
5. Display top 10

## Scalability Improvement

Instead of sorting all notifications, we can use a min-heap of size 10 to maintain only the top notifications efficiently.

Time Complexity:
- Current: O(n log n)
- Optimized: O(n log 10)

## Notes

- No database used
- No hardcoded notifications
- API-driven system