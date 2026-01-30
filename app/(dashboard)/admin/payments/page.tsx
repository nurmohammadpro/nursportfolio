"use client";

import { ArrowDownLeft, Clock, Download } from "lucide-react";

const payments = [
  {
    id: "TRX-4401",
    client: "Duncun Immigration",
    amount: "1,200.00",
    date: "Jan 30",
    method: "Stripe",
    status: "completed",
  },
  {
    id: "TRX-4398",
    client: "AREI Group",
    amount: "4,500.00",
    date: "Jan 25",
    method: "Bank Transfer",
    status: "pending",
  },
  {
    id: "TRX-4385",
    client: "Global Tech",
    amount: "600.00",
    date: "Jan 12",
    method: "PayPal",
    status: "completed",
  },
];

export default function PaymentsPage() {
  return (
    <div className="space-y-10 fade-in">
      {/* Header */}
      <div className="space-y-1">
        <p className="text-[10px] font-black uppercase tracking-[0.4em] text-(--text-subtle)">
          Financial Suite
        </p>
        <p className="text-3xl font-light tracking-tighter text-(--text-main)">
          Transaction <span className="font-bold italic">History</span>
        </p>
      </div>

      {/* Summary Row - Minimalist Stats using only P tags */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Monthly Revenue", val: "$12,400" },
          { label: "Pending", val: "$4,500" },
          { label: "Completed", val: "18" },
          { label: "Active Subs", val: "06" },
        ].map((stat, i) => (
          <div
            key={i}
            className="p-4 border border-(--border-color) rounded-xl"
          >
            <p className="text-[9px] font-black uppercase tracking-widest text-(--text-subtle) mb-1">
              {stat.label}
            </p>
            <p className="text-xl font-bold tracking-tight">{stat.val}</p>
          </div>
        ))}
      </div>

      {/* Transaction Table */}
      <div className="border border-(--border-color) rounded-xl overflow-hidden">
        <div className="bg-(--subtle)/20 p-4 border-b border-(--border-color) flex justify-between items-center">
          <p className="text-[10px] font-black uppercase tracking-widest">
            Recent Activity
          </p>
          <button className="flex items-center gap-2 text-(--text-subtle) hover:text-(--text-main) transition-colors">
            <Download size={14} />
            <p className="text-[9px] font-bold uppercase">Export CSV</p>
          </button>
        </div>

        <div className="divide-y divide-(--border-color)">
          {payments.map((tx) => (
            <div
              key={tx.id}
              className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-(--subtle)/10 transition-colors"
            >
              <div className="flex items-center gap-4">
                <div
                  className={`p-2 rounded-lg ${tx.status === "completed" ? "bg-green-50 text-green-600" : "bg-amber-50 text-amber-600"}`}
                >
                  {tx.status === "completed" ? (
                    <ArrowDownLeft size={16} />
                  ) : (
                    <Clock size={16} />
                  )}
                </div>
                <div>
                  <p className="text-sm font-bold tracking-tight">
                    {tx.client}
                  </p>
                  <p className="text-[10px] font-medium font-mono text-(--text-subtle)">
                    {tx.id} • {tx.method}
                  </p>
                </div>
              </div>

              <div className="flex justify-between md:flex-col md:items-end gap-1">
                <p className="text-sm font-black tracking-tighter">
                  ${tx.amount}
                </p>
                <p className="text-[10px] font-bold text-(--text-subtle) uppercase tracking-widest">
                  {tx.date}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
