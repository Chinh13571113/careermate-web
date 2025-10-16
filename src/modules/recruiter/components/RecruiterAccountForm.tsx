"use client";

import Image from "next/image";
import { useState } from "react";
import { Toggle } from "./RecruiterToggle";
import { AvatarPicker } from "./AvatarPicker";
import ChangePasswordDialog from "./ChangePasswordDialog";

export function RecruiterAccountForm() {
    const [openPwd, setOpenPwd] = useState(false);
    return (
        <section className="rounded-lg border bg-white p-6 shadow-sm shadow-sky-100">
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_320px]">
                <div>
                    <div className="mb-6 rounded-md bg-sky-50 p-4 text-sm text-sky-900">
                        <p>
                            Complete your company details and verification. Your information helps us review and activate your recruiter account.
                        </p>
                    </div>

                    <form className="space-y-6">
                        <fieldset className="space-y-3">
                            <label className="block text-sm font-medium text-sky-900">Login email *</label>
                            <input readOnly type="email" className="w-full cursor-not-allowed rounded-md border bg-slate-50 px-3 py-2 text-sm text-slate-700 outline-none" defaultValue="hr@example.com" />
                        </fieldset>

                        <fieldset className="space-y-3">
                            <label className="block text-sm font-medium text-sky-900">Password</label>
                            <input readOnly type="password" className="w-full cursor-not-allowed rounded-md border bg-slate-50 px-3 py-2 text-sm text-slate-700 outline-none" defaultValue="••••••••" />
                            <button type="button" onClick={() => setOpenPwd(true)} className="inline-flex h-9 items-center rounded-md border px-3 text-sm font-medium text-sky-800 hover:bg-sky-50">Change password</button>
                        </fieldset>

                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            <fieldset className="space-y-2">
                                <label className="block text-sm font-medium text-sky-900">Full name *</label>
                                <input type="text" className="w-full rounded-md border bg-background px-3 py-2 text-sm outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-sky-500" placeholder="Enter your name" />
                            </fieldset>

                            <fieldset className="space-y-2">
                                <label className="block text-sm font-medium text-sky-900">Phone number *</label>
                                <input type="tel" className="w-full rounded-md border bg-background px-3 py-2 text-sm outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-sky-500" placeholder="0123 456 789" />
                            </fieldset>

                            <fieldset className="space-y-2 md:col-span-2">
                                <label className="block text-sm font-medium text-sky-900">Contact email (not for login)</label>
                                <input type="email" className="w-full rounded-md border bg-background px-3 py-2 text-sm outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-sky-500" placeholder="contact@example.com" />
                            </fieldset>

                            <fieldset className="space-y-2 md:col-span-2">
                                <label className="block text-sm font-medium text-sky-900">Contact address</label>
                                <input type="text" className="w-full rounded-md border bg-background px-3 py-2 text-sm outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-sky-500" placeholder="Street, district, city, country" />
                            </fieldset>
                        </div>

                        <div className="flex gap-3">
                            <button type="button" className="inline-flex h-9 items-center rounded-md bg-sky-600 px-4 text-sm font-medium text-white hover:bg-sky-700">Save changes</button>
                        </div>
                    </form>

                    <div className="my-8 h-px w-full bg-border" />

                    <section className="space-y-4">
                        <h2 className="text-base font-semibold text-sky-900">Notifications</h2>
                        <div className="space-y-4">
                            <label className="flex items-center justify-between gap-4 rounded-md border p-4 hover:bg-sky-50">
                                <div>
                                    <p className="text-sm font-medium">Login alerts</p>
                                    <p className="text-xs text-muted-foreground">Email me when someone logs in from a new IP address.</p>
                                </div>
                                <Toggle defaultChecked ariaLabel="Toggle login alerts" />
                            </label>

                            <label className="flex items-center justify-between gap-4 rounded-md border p-4 hover:bg-sky-50">
                                <div>
                                    <p className="text-sm font-medium">New candidate screening</p>
                                    <p className="text-xs text-muted-foreground">Notify me when there are new applications needing review.</p>
                                </div>
                                <Toggle ariaLabel="Toggle candidate filter alerts" />
                            </label>
                        </div>
                    </section>

                    <div className="my-8 h-px w-full bg-border" />

                    <section className="space-y-4">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                            <h2 className="text-base font-semibold text-sky-900">Company information</h2>
                            <span className="text-xs text-sky-700/80">How to complete your profile »</span>
                        </div>

                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            <fieldset className="space-y-2 md:col-span-2">
                                <label className="block text-sm font-medium text-sky-900">Company introduction *</label>
                                <textarea rows={4} className="w-full rounded-md border bg-background px-3 py-2 text-sm outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-sky-500" placeholder="Write a short introduction about your company" />
                            </fieldset>
                            <fieldset className="space-y-2">
                                <label className="block text-sm font-medium text-sky-900">Website</label>
                                <input type="url" className="w-full rounded-md border bg-background px-3 py-2 text-sm outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-sky-500" placeholder="https://" />
                            </fieldset>
                        </div>

                        <div className="flex gap-3">
                            <button type="button" className="inline-flex h-9 items-center rounded-md bg-sky-600 px-4 text-sm font-medium text-white hover:bg-sky-700">Save changes</button>
                        </div>
                    </section>
                </div>

                <aside className="space-y-6">
                    <div className="rounded-md bg-sky-50 p-4 text-center">
                        <p className="mb-4 text-sm font-medium text-sky-900">Profile avatar</p>
                        <div className="mx-auto mb-4 h-28 w-28 overflow-hidden rounded-full border">
                            <Image src="/globe.svg" alt="Avatar" width={112} height={112} className="h-full w-full object-cover" />
                        </div>
                        <AvatarPicker />
                        <p className="mt-2 text-xs text-muted-foreground">Recommended size 1000x1000px, ≤ 1MB</p>
                    </div>
                </aside>
            </div>
            <ChangePasswordDialog open={openPwd} onClose={() => setOpenPwd(false)} />
        </section>
    );
}

export default RecruiterAccountForm;


