"use client";

import { useEffect, useState } from "react";
import { Notification } from "../types/notification";
import { getTopNotifications } from "../utils/priority";
import {
    Box,
    Typography,
    Card,
    CardContent,
    CircularProgress,
    Alert,
} from "@mui/material";

const API_URL = "http://20.207.122.201/evaluation-service/notifications";

export default function PriorityInbox() {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [topNotifications, setTopNotifications] = useState<Notification[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    async function fetchNotifications() {
        try {
            setError("");

            const res = await fetch(API_URL, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiYXVkIjoiaHR0cDovLzIwLjI0NC41Ni4xNDQvZXZhbHVhdGlvbi1zZXJ2aWNlIiwiZW1haWwiOiJzazQ4NDlAc3JtaXN0LmVkdS5pbiIsImV4cCI6MTc3NzcwNjgxMywiaWF0IjoxNzc3NzA1OTEzLCJpc3MiOiJBZmZvcmQgTWVkaWNhbCBUZWNobm9sb2dpZXMgUHJpdmF0ZSBMaW1pdGVkIiwianRpIjoiM2JiZDVmMjctYWY5MS00YWQxLWFjMzMtZTcxY2EwYmNmMWVjIiwibG9jYWxlIjoiZW4tSU4iLCJuYW1lIjoic2hyaXZhdHNhIHMga3Vsa2FybmkiLCJzdWIiOiJjODQwOTRjYS03ZDc1LTRkMjQtOGUyZC0yNjZjN2FiNzNiM2UifSwiZW1haWwiOiJzazQ4NDlAc3JtaXN0LmVkdS5pbiIsIm5hbWUiOiJzaHJpdmF0c2EgcyBrdWxrYXJuaSIsInJvbGxObyI6InJhMjMxMTAwMzAxMTg2NCIsImFjY2Vzc0NvZGUiOiJRa2JweEgiLCJjbGllbnRJRCI6ImM4NDA5NGNhLTdkNzUtNGQyNC04ZTJkLTI2NmM3YWI3M2IzZSIsImNsaWVudFNlY3JldCI6ImJDdXl0WkVWampUVk10blYifQ.qosk6JYpOqEm1uDAe0DgJXG29H4fgldKJGrLDJ75mYw",
                },
            });

            if (!res.ok) {
                throw new Error("Failed to fetch notifications");
            }

            const data: Notification[] = await res.json();

            setNotifications(data);
            setTopNotifications(getTopNotifications(data, 10));
        } catch (err) {
            console.error("Error fetching notifications:", err);
            setError("Unable to fetch notifications");
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchNotifications();

        const interval = setInterval(() => {
            fetchNotifications();
        }, 30000);

        return () => clearInterval(interval);
    }, []);

    if (loading) {
        return (
            <Box p={3}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Box p={3}>
            <Typography variant="h5" mb={2}>
                Priority Inbox - Top 10 Unread Notifications
            </Typography>

            {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                    {error}
                </Alert>
            )}

            {topNotifications.length === 0 ? (
                <Typography>No unread notifications found.</Typography>
            ) : (
                topNotifications.map((notif) => (
                    <Card key={notif.id} sx={{ mb: 2 }}>
                        <CardContent>
                            <Typography variant="subtitle2" color="text.secondary">
                                {notif.type?.toUpperCase()}
                            </Typography>

                            <Typography variant="body1" mt={1}>
                                {notif.message}
                            </Typography>

                            <Typography variant="caption" color="text.secondary">
                                {new Date(notif.createdAt).toLocaleString()}
                            </Typography>
                        </CardContent>
                    </Card>
                ))
            )}
        </Box>
    );
}