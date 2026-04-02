"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { User, Building, MessageSquare, Calendar, Phone, Mail, ShieldCheck, ShieldAlert, Loader2, CheckCircle, XCircle } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export default function VerificationPage() {
  const { id } = useParams();
  const router = useRouter();
  const [request, setRequest] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [verifying, setVerifying] = useState(false);

  useEffect(() => {
    async function fetchRequest() {
      try {
        const response = await fetch(`/api/requests/${id}`);
        if (!response.ok) throw new Error("Not found");
        const data = await response.json();
        setRequest(data);
      } catch (error) {
        toast.error("Invalid QR Code or Request ID");
      } finally {
        setLoading(false);
      }
    }
    fetchRequest();
  }, [id]);

  async function handleAction(status: string) {
    setVerifying(true);
    try {
      const response = await fetch(`/api/requests/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });

      if (!response.ok) throw new Error("Action failed");

      const updated = await response.json();
      setRequest(updated);
      toast.success(status === "CHECKED_IN" ? "Visitor Checked In" : "Entry Rejected");
    } catch (error) {
      toast.error("Failed to update status");
    } finally {
      setVerifying(false);
    }
  }

  if (loading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (!request) {
    return (
      <div className="container max-w-xl px-4 py-24 mx-auto text-center">
        <div className="flex justify-center mb-6">
          <div className="flex items-center justify-center w-16 h-16 bg-red-100 rounded-full">
            <ShieldAlert className="w-8 h-8 text-red-600" />
          </div>
        </div>
        <h1 className="text-2xl font-bold mb-2">Invalid Pass</h1>
        <p className="text-slate-500 mb-8">This QR code is invalid or has expired.</p>
        <button
          onClick={() => router.push("/security/dashboard")}
          className="px-6 py-2 bg-slate-900 text-white rounded-lg font-medium"
        >
          Go to Dashboard
        </button>
      </div>
    );
  }

  const isAlreadyCheckedIn = request.status === "CHECKED_IN";
  const isRejected = request.status === "REJECTED";

  return (
    <div className="container max-w-xl px-4 py-12 mx-auto">
      <div className="p-6 bg-white border rounded-2xl shadow-sm sm:p-10">
        <div className="flex items-center justify-between mb-8 pb-6 border-b">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Security Verification</h1>
            <p className="text-sm text-slate-500 font-mono">REQ: {id}</p>
          </div>
          <div className={cn(
            "px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider",
            request.status === "PENDING" && "bg-amber-100 text-amber-700",
            request.status === "CHECKED_IN" && "bg-green-100 text-green-700",
            request.status === "REJECTED" && "bg-red-100 text-red-700"
          )}>
            {request.status.replace("_", " ")}
          </div>
        </div>

        <div className="space-y-6 mb-10">
          <DetailItem icon={<User />} label="Visitor Name" value={request.name} />
          <DetailItem icon={<Building />} label="Organization" value={request.organization} />
          <DetailItem icon={<Building />} label="Citizenship / ID" value={request.citizenshipNo} />
          <DetailItem icon={<MessageSquare />} label="Purpose" value={request.purpose} />
          <DetailItem icon={<User />} label="Person to Meet" value={request.personToMeet} />
          <DetailItem icon={<Calendar />} label="Visit Date" value={new Date(request.visitDate).toLocaleDateString()} />
          <DetailItem icon={<Phone />} label="Contact Number" value={request.phone} />
        </div>

        {!isAlreadyCheckedIn && !isRejected ? (
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => handleAction("REJECTED")}
              disabled={verifying}
              className="flex items-center justify-center gap-2 px-4 py-4 text-sm font-semibold text-red-700 bg-red-50 border border-red-100 rounded-xl hover:bg-red-100 transition-all active:scale-95 disabled:opacity-50"
            >
              <XCircle className="w-5 h-5" />
              Reject Entry
            </button>
            <button
              onClick={() => handleAction("CHECKED_IN")}
              disabled={verifying}
              className="flex items-center justify-center gap-2 px-4 py-4 text-sm font-semibold text-white bg-green-600 rounded-xl hover:bg-green-500 shadow-sm transition-all active:scale-95 disabled:opacity-50"
            >
              <CheckCircle className="w-5 h-5" />
              Approve Entry
            </button>
          </div>
        ) : (
          <div className={cn(
            "p-4 rounded-xl border text-center flex flex-col items-center gap-2",
            isAlreadyCheckedIn ? "bg-green-50 border-green-100 text-green-800" : "bg-red-50 border-red-100 text-red-800"
          )}>
            {isAlreadyCheckedIn ? <CheckCircle className="w-8 h-8" /> : <XCircle className="w-8 h-8" />}
            <span className="font-bold">{isAlreadyCheckedIn ? "Already Checked In" : "Entry Rejected"}</span>
            <p className="text-sm opacity-80">Processed at {new Date(request.updatedAt).toLocaleString()}</p>
          </div>
        )}

        <button
          onClick={() => router.push("/security/dashboard")}
          className="mt-8 w-full text-center text-sm font-medium text-slate-500 hover:text-blue-600"
        >
          View All Requests
        </button>
      </div>
    </div>
  );
}

function DetailItem({ icon, label, value }: { icon: React.ReactNode, label: string, value: string }) {
  return (
    <div className="flex items-start gap-4">
      <div className="mt-1 p-2 bg-slate-50 rounded-lg text-slate-400">
        {React.cloneElement(icon as React.ReactElement<any>, { 
          className: "w-4 h-4" 
        } as any)}
      </div>
      <div>
        <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">{label}</p>
        <p className="font-semibold text-slate-900">{value}</p>
      </div>
    </div>
  );
}
