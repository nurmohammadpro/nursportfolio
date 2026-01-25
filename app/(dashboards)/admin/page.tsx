"use client";
import { useEffect, useState } from "react";
interface ServiceRequest {
  id: string;
  clientEmail: string;
  serviceName: string;
  status: string;
  progress: number;
}

export default function AdminPanel() {
  const [requests, setRequests] = useState<ServiceRequest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRequests = async () => {
      const res = await fetch("/api/admin/monitor");
      const rawData = await res.json();

      const cleanData: ServiceRequest[] = rawData.filter(
        (item: any): item is ServiceRequest =>
          item !== null && item !== undefined,
      );

      setRequests(cleanData);
      setLoading(false);
    };
    fetchRequests();
  }, []);

  const updateProgress = async (requestId: string, newProgress: number) => {
    try {
      const response = await fetch("/api/admin/update", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          body: JSON.stringify({ requestId, progress: newProgress }),
        },
      });
    } catch (error) {
      console.error("Error updating progress:", error);
    }
  };
}
