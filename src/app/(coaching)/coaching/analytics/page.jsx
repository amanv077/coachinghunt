"use client";

import { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import Link from "next/link";

export default function CoachingAnalyticsPage() {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch("/api/coaching/analytics").then((r) => r.json()).then((d) => d.success && setData(d.data));
  }, []);

  if (!data) {
    return <Card className="py-12 text-center text-muted">Loading analytics...</Card>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Analytics</h1>
        <p className="text-sm text-muted">Track profile views, bookings, and conversion.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card><p className="text-sm text-muted">Profile views (30d)</p><p className="text-2xl font-bold">{data.funnel.views}</p></Card>
        <Card><p className="text-sm text-muted">Demo requests</p><p className="text-2xl font-bold">{data.funnel.requests}</p></Card>
        <Card><p className="text-sm text-muted">Bookings</p><p className="text-2xl font-bold">{data.funnel.bookings}</p></Card>
        <Card><p className="text-sm text-muted">Enrolled</p><p className="text-2xl font-bold">{data.funnel.enrolled}</p></Card>
      </div>

      <Card>
        <h2 className="font-semibold">Profile views (30 days)</h2>
        <div className="mt-4 h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data.profileViewsSeries}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" tick={{ fontSize: 11 }} />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Line type="monotone" dataKey="views" stroke="#2C4C9C" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Card>

      <Card>
        <h2 className="font-semibold">Bookings by week</h2>
        <div className="mt-4 h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data.bookingsSeries}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="week" tick={{ fontSize: 11 }} />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="count" fill="#2C4C9C" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {data.coaching.isPremium && data.premium ? (
        <div className="grid gap-4 sm:grid-cols-3">
          <Card><p className="text-sm text-muted">City avg competitor rating</p><p className="text-2xl font-bold">{data.premium.competitorAvgRating?.toFixed(1) || "—"}</p></Card>
          <Card><p className="text-sm text-muted">City booking share</p><p className="text-2xl font-bold">{data.premium.cityBookingShare}</p></Card>
          <Card><p className="text-sm text-muted">MoM booking growth</p><p className="text-2xl font-bold">{data.premium.monthOverMonthGrowth}%</p></Card>
        </div>
      ) : (
        <Card className="border-secondary/20 bg-secondary-light/20 text-center">
          <p className="font-semibold text-foreground">Unlock premium analytics</p>
          <p className="mt-2 text-sm text-muted">Get competitor benchmarks, city share, and growth trends.</p>
          <Link href="/contact" className="mt-4 inline-block">
            <Button className="min-h-11">Contact us to upgrade</Button>
          </Link>
        </Card>
      )}
    </div>
  );
}
