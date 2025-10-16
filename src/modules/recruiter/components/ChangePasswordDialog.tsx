"use client";

import { useState } from "react";
import { Eye, EyeOff, X } from "lucide-react";

type Props = {
    open: boolean;
    onClose: () => void;
};

export default function ChangePasswordDialog({ open, onClose }: Props) {
    const [show1, setShow1] = useState(false);
    const [show2, setShow2] = useState(false);
    const [show3, setShow3] = useState(false);

    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="absolute inset-0 bg-black/40" onClick={onClose} />
            <div className="relative z-10 w-full max-w-md rounded-lg bg-white p-6 shadow-lg">
                <div className="mb-4 flex items-center justify-between">
                    <h2 className="text-lg font-semibold text-sky-900">Change password</h2>
                    <button aria-label="Close" onClick={onClose} className="rounded p-1 text-slate-600 hover:bg-slate-100">
                        <X className="h-5 w-5" />
                    </button>
                </div>

                <form className="space-y-4">
                    <Field label="Current password" required>
                        <PasswordInput value="" show={show1} onToggle={() => setShow1((s) => !s)} placeholder="" />
                    </Field>
                    <Field label="New password" required helper="Password must be at least 6 characters">
                        <PasswordInput value="" show={show2} onToggle={() => setShow2((s) => !s)} placeholder="" />
                    </Field>
                    <Field label="Confirm new password" required>
                        <PasswordInput value="" show={show3} onToggle={() => setShow3((s) => !s)} placeholder="" />
                    </Field>

                    <div className="flex gap-3 pt-2">
                        <button type="button" onClick={onClose} className="inline-flex h-10 flex-1 items-center justify-center rounded-md border px-4 text-sm font-medium text-sky-800 hover:bg-sky-50">Cancel</button>
                        <button type="button" onClick={onClose} className="inline-flex h-10 flex-1 items-center justify-center rounded-md bg-sky-600 px-4 text-sm font-medium text-white hover:bg-sky-700">Confirm</button>
                    </div>
                </form>
            </div>
        </div>
    );
}

function Field({ label, required, helper, children }: { label: string; required?: boolean; helper?: string; children: React.ReactNode }) {
    return (
        <div className="space-y-1">
            <label className="block text-sm font-medium text-slate-900">
                {label} {required && <span className="text-red-500">*</span>}
            </label>
            {children}
            {helper && <p className="text-xs text-slate-500">{helper}</p>}
        </div>
    );
}

function PasswordInput({ value, show, onToggle, placeholder }: { value: string; show: boolean; onToggle: () => void; placeholder?: string }) {
    return (
        <div className="relative">
            <input
                defaultValue={value}
                type={show ? "text" : "password"}
                placeholder={placeholder}
                className="w-full rounded-md border bg-background px-3 py-2 pr-10 text-sm outline-none focus:ring-0 focus:outline-none"
            />
            <button type="button" onClick={onToggle} className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1 text-slate-600 hover:bg-slate-100" aria-label="Toggle password visibility">
                {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
        </div>
    );
}


