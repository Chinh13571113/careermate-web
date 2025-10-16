"use client";

import { useRef, useState } from "react";

export function OrganizationProfileForm() {
    const inputRef = useRef<HTMLInputElement | null>(null);
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

    function openPicker() {
        inputRef.current?.click();
    }

    function onFilesChanged(e: React.ChangeEvent<HTMLInputElement>) {
        const files = Array.from(e.target.files ?? []);
        setSelectedFiles(files);
    }
    return (
        <section className="rounded-lg border bg-white p-6 shadow-sm shadow-sky-100">
            <div className="mb-4 rounded-md bg-amber-50 p-4 text-sm text-amber-900">
                Please update your company profile to complete verification.
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <fieldset className="space-y-2 md:col-span-2">
                    <label className="block text-sm font-medium text-sky-900">Tax ID *</label>
                    <input className="w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-sky-500" />
                </fieldset>

                <fieldset className="space-y-2 md:col-span-2">
                    <label className="block text-sm font-medium text-sky-900">Company name *</label>
                    <input className="w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-sky-500" />
                </fieldset>

                <fieldset className="space-y-2">
                    <label className="block text-sm font-medium text-sky-900">Headcount *</label>
                    <select className="w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-sky-500">
                        <option>1-10</option>
                        <option>11-50</option>
                        <option>51-200</option>
                        <option>200+</option>
                    </select>
                </fieldset>

                <fieldset className="space-y-2">
                    <label className="block text-sm font-medium text-sky-900">Location *</label>
                    <input className="w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-sky-500" />
                </fieldset>

                <fieldset className="space-y-2 md:col-span-2">
                    <label className="block text-sm font-medium text-sky-900">Address</label>
                    <input className="w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-sky-500" />
                </fieldset>

                <fieldset className="space-y-2">
                    <label className="block text-sm font-medium text-sky-900">Office phone</label>
                    <input className="w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-sky-500" />
                </fieldset>

                <fieldset className="space-y-2 md:col-span-2">
                    <label className="block text-sm font-medium text-sky-900">Industries</label>
                    <input className="w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-sky-500" placeholder="Add industries" />
                </fieldset>
            </div>

            <div className="my-6 h-px w-full bg-border" />

            <div className="space-y-3">
                <h3 className="text-sm font-semibold text-sky-900">Business license (GPKD)</h3>
                <div className="rounded-md border border-dashed p-6 text-center text-sm text-slate-600">
                    Drag & drop files here, or
                    <button type="button" onClick={openPicker} className="ml-2 inline-flex h-9 items-center rounded-md bg-sky-600 px-3 text-sm font-medium text-white hover:bg-sky-700">Choose files</button>
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
                <div className="text-xs text-muted-foreground">Up to 5 files, JPG/PNG/DOC/PDF, total ≤ 10MB</div>
            </div>

            <div className="mt-6 flex gap-3">
                <button className="inline-flex h-9 items-center rounded-md bg-sky-600 px-4 text-sm font-medium text-white hover:bg-sky-700">Update</button>
            </div>
        </section>
    );
}

export default OrganizationProfileForm;


