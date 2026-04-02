"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Calendar, User, Building, MessageSquare, Phone, Mail, Loader2, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const visitorSchema = z.object({
  name: z.string().min(2, "Name is too short"),
  citizenshipNo: z.string().min(5, "ID number is required"),
  organization: z.string().min(2, "Organization is required"),
  purpose: z.string().min(5, "Please state your purpose"),
  personToMeet: z.string().min(2, "Name of person to meet is required"),
  visitDate: z.string().min(1, "Date is required"),
  phone: z.string().min(10, "Valid phone number is required"),
  email: z.string().email("Valid email is required"),
});

type VisitorFormValues = z.infer<typeof visitorSchema>;

export default function VisitorRequestPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<VisitorFormValues>({
    resolver: zodResolver(visitorSchema),
    defaultValues: {
      visitDate: new Date().toISOString().split("T")[0],
    },
  });

  async function onSubmit(data: VisitorFormValues) {
    setIsSubmitting(true);
    try {
      const response = await fetch("/api/requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Failed to submit request");
      }

      const result = await response.json();
      toast.success("Request submitted successfully!");
      router.push(`/request/success/${result.requestId}`);
    } catch (error) {
      toast.error("Something went wrong. Please try again.");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="container max-w-2xl px-4 py-12 mx-auto">
      <div className="mb-8 text-center">
        <h1 className="mb-2 text-3xl font-bold tracking-tight sm:text-4xl">Visitor Request Form</h1>
        <p className="text-slate-500">Please fill out the form below to request a visitor pass for PMO.</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="p-6 bg-white border rounded-2xl shadow-sm sm:p-8">
        <div className="grid gap-6 sm:grid-cols-2">
          {/* Full Name */}
          <div className="space-y-2">
            <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              Full Name
            </label>
            <div className="relative">
              <User className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
              <input
                {...register("name")}
                placeholder="John Doe"
                className={cn(
                  "flex h-10 w-full rounded-md border border-slate-200 bg-white px-9 py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
                  errors.name && "border-red-500 focus-visible:ring-red-500"
                )}
              />
            </div>
            {errors.name && <p className="text-xs font-medium text-red-500">{errors.name.message}</p>}
          </div>

          {/* Citizenship / ID */}
          <div className="space-y-2">
            <label className="text-sm font-medium leading-none">Citizenship / ID Number</label>
            <div className="relative">
              <Building className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
              <input
                {...register("citizenshipNo")}
                placeholder="123-456-789"
                className={cn(
                  "flex h-10 w-full rounded-md border border-slate-200 bg-white px-9 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600",
                  errors.citizenshipNo && "border-red-500"
                )}
              />
            </div>
            {errors.citizenshipNo && <p className="text-xs font-medium text-red-500">{errors.citizenshipNo.message}</p>}
          </div>

          {/* Organization */}
          <div className="space-y-2 sm:col-span-2">
            <label className="text-sm font-medium leading-none">Organization</label>
            <div className="relative">
              <Building className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
              <input
                {...register("organization")}
                placeholder="Company Name / Institution"
                className={cn(
                  "flex h-10 w-full rounded-md border border-slate-200 bg-white px-9 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600",
                  errors.organization && "border-red-500"
                )}
              />
            </div>
            {errors.organization && <p className="text-xs font-medium text-red-500">{errors.organization.message}</p>}
          </div>

          {/* Purpose of Visit */}
          <div className="space-y-2 sm:col-span-2">
            <label className="text-sm font-medium leading-none">Purpose of Visit</label>
            <div className="relative">
              <MessageSquare className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
              <textarea
                {...register("purpose")}
                placeholder="Detailed reason for your visit..."
                rows={3}
                className={cn(
                  "flex w-full rounded-md border border-slate-200 bg-white px-9 py-2.5 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 min-h-[80px]",
                  errors.purpose && "border-red-500"
                )}
              />
            </div>
            {errors.purpose && <p className="text-xs font-medium text-red-500">{errors.purpose.message}</p>}
          </div>

          {/* Person to Meet */}
          <div className="space-y-2">
            <label className="text-sm font-medium leading-none">Person to Meet (PM / Staff)</label>
            <div className="relative">
              <User className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
              <input
                {...register("personToMeet")}
                placeholder="Officer Name"
                className={cn(
                  "flex h-10 w-full rounded-md border border-slate-200 bg-white px-9 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600",
                  errors.personToMeet && "border-red-500"
                )}
              />
            </div>
            {errors.personToMeet && <p className="text-xs font-medium text-red-500">{errors.personToMeet.message}</p>}
          </div>

          {/* Preferred Date */}
          <div className="space-y-2">
            <label className="text-sm font-medium leading-none">Preferred Date</label>
            <div className="relative">
              <Calendar className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
              <input
                type="date"
                {...register("visitDate")}
                className={cn(
                  "flex h-10 w-full rounded-md border border-slate-200 bg-white px-9 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600",
                  errors.visitDate && "border-red-500"
                )}
              />
            </div>
            {errors.visitDate && <p className="text-xs font-medium text-red-500">{errors.visitDate.message}</p>}
          </div>

          {/* Contact (Phone) */}
          <div className="space-y-2">
            <label className="text-sm font-medium leading-none">Contact Phone</label>
            <div className="relative">
              <Phone className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
              <input
                {...register("phone")}
                placeholder="+977 98XXXXXXXX"
                className={cn(
                  "flex h-10 w-full rounded-md border border-slate-200 bg-white px-9 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600",
                  errors.phone && "border-red-500"
                )}
              />
            </div>
            {errors.phone && <p className="text-xs font-medium text-red-500">{errors.phone.message}</p>}
          </div>

          {/* Contact (Email) */}
          <div className="space-y-2">
            <label className="text-sm font-medium leading-none">Contact Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
              <input
                {...register("email")}
                placeholder="john@example.com"
                className={cn(
                  "flex h-10 w-full rounded-md border border-slate-200 bg-white px-9 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600",
                  errors.email && "border-red-500"
                )}
              />
            </div>
            {errors.email && <p className="text-xs font-medium text-red-500">{errors.email.message}</p>}
          </div>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full mt-8 flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 disabled:opacity-50 transition-all active:scale-95"
        >
          {isSubmitting ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            <>
              Submit Request
              <ArrowRight className="h-4 w-4" />
            </>
          )}
        </button>
      </form>
    </div>
  );
}
