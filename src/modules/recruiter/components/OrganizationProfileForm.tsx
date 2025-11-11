"use client";

import { useRef, useState, useEffect } from "react";
import { ProfileService } from "../services/profileService";
import type { Recruiter } from "@/types/recruiter";
import { useAuthStore } from "@/store/use-auth-store";
import toast from "react-hot-toast";
import Image from "next/image";

export function OrganizationProfileForm() {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [recruiterData, setRecruiterData] = useState<Recruiter | null>(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuthStore();

  const [formData, setFormData] = useState({
    companyName: "",
    website: "",
    logoUrl: "",
    businessLicense: "",
    contactPerson: "",
    phoneNumber: "",
    companyAddress: "",
    about: "",
  });

  useEffect(() => {
    const fetchRecruiterData = async () => {
      try {
        setLoading(true);
        if (user?.email) {
          const data = await ProfileService.getRecruiterAccount(user.email);
          if (data) {
            setRecruiterData(data);
            setFormData({
              companyName: data.companyName || "",
              website: data.website || "",
              logoUrl: data.logoUrl || "",
              businessLicense: data.businessLicense || "",
              contactPerson: data.contactPerson || "",
              phoneNumber: data.phoneNumber || "",
              companyAddress: data.companyAddress || "",
              about: data.about || "",
            });
          }
        }
      } catch (error) {
        console.error("Error fetching recruiter data:", error);
        toast.error("Failed to load organization data");
      } finally {
        setLoading(false);
      }
    };

    fetchRecruiterData();
  }, [user?.email]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = async () => {
    try {
      await ProfileService.updateRecruiterAccount(formData);
      toast.success("Organization information updated successfully");
    } catch (error) {
      console.error("Error updating organization info:", error);
      toast.error("Failed to update organization information");
    }
  };

  function openPicker() {
    inputRef.current?.click();
  }

  function onFilesChanged(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    setSelectedFiles(files);
  }

  if (loading) {
    return (
      <section className="rounded-lg border bg-white p-6 shadow-sm shadow-sky-100">
        <div className="flex items-center justify-center py-12">
          <p className="text-sm text-gray-500">Loading...</p>
        </div>
      </section>
    );
  }
  return (
    <section className="rounded-lg border bg-white p-6 shadow-sm shadow-sky-100">
      <div className="mb-4 rounded-md bg-amber-50 p-4 text-sm text-amber-900">
        Please update your company profile to complete verification.
      </div>

      {/* Company Logo Preview */}
      {formData.logoUrl && (
        <div className="mb-6 flex justify-center">
          <div className="relative h-32 w-32 overflow-hidden rounded-lg border">
            <Image
              src={formData.logoUrl}
              alt="Company Logo"
              width={128}
              height={128}
              className="h-full w-full object-cover"
            />
          </div>
        </div>
      )}

      <form className="space-y-6">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {/* Company Name */}
          <fieldset className="space-y-2 md:col-span-2">
            <label className="block text-sm font-medium text-sky-900">
              Company Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="companyName"
              value={formData.companyName}
              onChange={handleInputChange}
              className="w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-sky-500"
              placeholder="e.g., FPT Corporation"
            />
          </fieldset>

          {/* Website */}
          <fieldset className="space-y-2 md:col-span-2">
            <label className="block text-sm font-medium text-sky-900">
              Website (Optional)
            </label>
            <input
              type="url"
              name="website"
              value={formData.website}
              onChange={handleInputChange}
              className="w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-sky-500"
              placeholder="https://yourcompany.com"
            />
          </fieldset>

          {/* Company Logo URL */}
          <fieldset className="space-y-2 md:col-span-2">
            <label className="block text-sm font-medium text-sky-900">
              Company Logo URL (Optional)
            </label>
            <input
              type="url"
              name="logoUrl"
              value={formData.logoUrl}
              onChange={handleInputChange}
              className="w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-sky-500"
              placeholder="https://example.com/logo.png"
            />
          </fieldset>

          {/* Business License */}
          <fieldset className="space-y-2 md:col-span-2">
            <label className="block text-sm font-medium text-sky-900">
              Business License <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="businessLicense"
              value={formData.businessLicense}
              onChange={handleInputChange}
              className="w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-sky-500"
              placeholder="e.g., BL-2025-123456"
            />
          </fieldset>

          {/* Contact Person */}
          <fieldset className="space-y-2">
            <label className="block text-sm font-medium text-sky-900">
              Contact Person <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="contactPerson"
              value={formData.contactPerson}
              onChange={handleInputChange}
              className="w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-sky-500"
              placeholder="Enter contact person name"
            />
          </fieldset>

          {/* Phone Number */}
          <fieldset className="space-y-2">
            <label className="block text-sm font-medium text-sky-900">
              Phone Number <span className="text-red-500">*</span>
            </label>
            <input
              type="tel"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleInputChange}
              className="w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-sky-500"
              placeholder="0929098765"
            />
          </fieldset>

          {/* Company Address */}
          <fieldset className="space-y-2 md:col-span-2">
            <label className="block text-sm font-medium text-sky-900">
              Company Address <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="companyAddress"
              value={formData.companyAddress}
              onChange={handleInputChange}
              className="w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-sky-500"
              placeholder="e.g., Ftown1"
            />
          </fieldset>

          {/* Company Introduction */}
          <fieldset className="space-y-2 md:col-span-2">
            <label className="block text-sm font-medium text-sky-900">
              Company Introduction
            </label>
            <textarea
              name="about"
              value={formData.about}
              onChange={handleInputChange}
              rows={4}
              className="w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-sky-500"
              placeholder="Write a short introduction about your company"
            />
          </fieldset>
        </div>

        <div className="my-6 h-px w-full bg-border" />

        {/*  Business license */}
        <fieldset className="space-y-2">
          <label className="block text-sm font-medium text-sky-900">
            Business License <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="businessLicense"
            value={formData.businessLicense}
            onChange={handleInputChange}
            className="w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-sky-500"
            placeholder="Enter business license details"
          />
        </fieldset>

        <div className="space-y-3">
          <div className="rounded-md border border-dashed p-6 text-center text-sm text-slate-600">
            Drag & drop files here, or
            <button
              type="button"
              onClick={openPicker}
              className="ml-2 inline-flex h-9 items-center rounded-md bg-sky-600 px-3 text-sm font-medium text-white hover:bg-sky-700"
            >
              Choose files
            </button>
            <input
              ref={inputRef}
              type="file"
              multiple
              onChange={onFilesChanged}
              accept=".jpg,.jpeg,.png,.doc,.docx,.pdf"
              className="hidden"
              aria-label="Upload business license files"
            />
          </div>
          {selectedFiles.length > 0 && (
            <ul className="text-xs text-slate-600">
              {selectedFiles.map((f) => (
                <li key={f.name}>{f.name}</li>
              ))}
            </ul>
          )}
          <div className="text-xs text-muted-foreground">
            Up to 5 files, JPG/PNG/DOC/PDF, total ≤ 10MB
          </div>
        </div>

        <div className="mt-6 flex gap-3">
          <button
            type="button"
            onClick={handleSave}
            className="inline-flex h-9 items-center rounded-md bg-sky-600 px-4 text-sm font-medium text-white hover:bg-sky-700"
          >
            Save changes
          </button>
        </div>
      </form>
    </section>
  );
}

export default OrganizationProfileForm;
