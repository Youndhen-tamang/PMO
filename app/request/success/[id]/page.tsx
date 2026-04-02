"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { QRCodeSVG } from "qrcode.react";
import { CheckCircle2, Download, Share2, ArrowLeft, Printer, Loader2 } from "lucide-react";
import { toast } from "sonner";

export default function RequestSuccessPage() {
  const { id } = useParams();
  const router = useRouter();
  const [request, setRequest] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchRequest() {
      try {
        const response = await fetch(`/api/requests/${id}`);
        if (!response.ok) throw new Error("Not found");
        const data = await response.json();
        setRequest(data);
      } catch (error) {
        toast.error("Failed to load request details");
        router.push("/request");
      } finally {
        setLoading(false);
      }
    }
    fetchRequest();
  }, [id, router]);

  if (loading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  const verificationUrl = `${window.location.origin}/verify/${id}`;

  const handleDownload = () => {
    const svg = document.querySelector("svg");
    if (!svg) return;
    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new Image();
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx?.drawImage(img, 0, 0);
      const pngFile = canvas.toDataURL("image/png");
      const downloadLink = document.createElement("a");
      downloadLink.download = `visitor-pass-${id}.png`;
      downloadLink.href = pngFile;
      downloadLink.click();
    };
    img.src = "data:image/svg+xml;base64," + btoa(svgData);
  };

  return (
    <div className="container max-w-xl px-4 py-12 mx-auto">
      <div className="p-6 text-center bg-white border rounded-2xl shadow-sm sm:p-10">
        <div className="flex justify-center mb-6">
          <div className="flex items-center justify-center w-16 h-16 bg-green-100 rounded-full">
            <CheckCircle2 className="w-8 h-8 text-green-600" />
          </div>
        </div>

        <h1 className="mb-2 text-2xl font-bold text-slate-900 sm:text-3xl">Submission Successful!</h1>
        <p className="mb-8 text-slate-500">Your visitor request has been submitted. Please save this QR code for verification at the entrance.</p>

        <div className="inline-block p-6 mb-8 bg-slate-50 rounded-2xl border border-slate-100">
          <QRCodeSVG
            value={verificationUrl}
            size={200}
            level="H"
            includeMargin={true}
            className="mx-auto"
          />
          <div className="mt-4 text-sm font-mono text-slate-500 select-all">
            ID: {id}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="p-4 text-left bg-slate-50 rounded-xl border border-slate-100">
            <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">Visitor</p>
            <p className="font-semibold text-slate-900">{request.name}</p>
          </div>
          <div className="p-4 text-left bg-slate-50 rounded-xl border border-slate-100">
            <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">Date</p>
            <p className="font-semibold text-slate-900">{new Date(request.visitDate).toLocaleDateString()}</p>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <button
            onClick={handleDownload}
            className="flex items-center justify-center gap-2 px-4 py-3 text-sm font-semibold text-white bg-blue-600 rounded-xl hover:bg-blue-500 transition-all active:scale-95"
          >
            <Download className="w-4 h-4" />
            Download QR Pass
          </button>
          <div className="grid grid-cols-2 gap-3">
            <button className="flex items-center justify-center gap-2 px-4 py-3 text-sm font-semibold text-slate-700 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-all active:scale-95">
              <Printer className="w-4 h-4" />
              Print
            </button>
            <button className="flex items-center justify-center gap-2 px-4 py-3 text-sm font-semibold text-slate-700 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-all active:scale-95">
              <Share2 className="w-4 h-4" />
              Share
            </button>
          </div>
        </div>

        <button
          onClick={() => router.push("/request")}
          className="mt-8 text-sm font-medium text-slate-500 hover:text-blue-600 flex items-center justify-center gap-2 mx-auto"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </button>
      </div>
    </div>
  );
}
