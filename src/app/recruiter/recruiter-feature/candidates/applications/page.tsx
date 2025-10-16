import { Search, Filter, Download, FileText, Calendar, MapPin, Clock } from "lucide-react";

export default function CandidateApplicationsPage() {
    return (
        <>
            <header className="mb-6 flex items-center justify-between">
                <h1 className="text-xl font-semibold text-sky-800">Job applications</h1>
                <div className="flex items-center gap-3">
                    <button className="inline-flex h-9 items-center gap-2 rounded-md border px-3 text-sm font-medium text-sky-800 hover:bg-sky-50">
                        <Filter className="h-4 w-4" />
                        Advanced filters
                    </button>
                    <button className="inline-flex h-9 items-center gap-2 rounded-md border px-3 text-sm font-medium text-sky-800 hover:bg-sky-50">
                        <Download className="h-4 w-4" />
                        Download list
                    </button>
                </div>
            </header>

            {/* Alert */}
            <div className="mb-4 rounded-md bg-amber-50 p-4 text-sm text-amber-900">
                <div className="flex items-center gap-2">
                    <span className="h-1 w-1 rounded-full bg-amber-600" />
                    Your profile will be deleted or hidden from candidates if it is not used for 12 consecutive months from now.
                </div>
            </div>

            {/* Filters */}
            <div className="mb-6 rounded-lg bg-white p-4 shadow-sm shadow-sky-100">
                <div className="mb-4 flex items-center gap-4">
                    <div className="flex-1">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                            <input
                                type="text"
                                placeholder="Enter candidate name"
                                className="w-full rounded-md border bg-background pl-9 pr-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-sky-500"
                            />
                        </div>
                    </div>
                    <div className="flex-1">
                        <div className="relative">
                            <Calendar className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                            <input
                                type="text"
                                placeholder="Select time period"
                                className="w-full rounded-md border bg-background pl-9 pr-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-sky-500"
                            />
                        </div>
                    </div>
                    <select className="rounded-md border bg-background px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-sky-500">
                        <option>Sort by name</option>
                        <option>Sort by date</option>
                        <option>Sort by status</option>
                    </select>
                    <button className="inline-flex h-9 items-center rounded-md bg-sky-600 px-4 text-sm font-medium text-white hover:bg-sky-700">
                        Advanced filters (0)
                    </button>
                </div>

                {/* Status tabs */}
                <div className="flex items-center gap-1 border-b">
                    <button className="border-b-2 border-sky-600 px-4 py-2 text-sm font-medium text-sky-700">
                        All candidates <span className="ml-1 text-xs">0</span>
                    </button>
                    <button className="px-4 py-2 text-sm text-slate-600 hover:text-slate-800">
                        Suitable <span className="ml-1 text-xs">0</span>
                    </button>
                    <button className="px-4 py-2 text-sm text-slate-600 hover:text-slate-800">
                        Phone interview <span className="ml-1 text-xs">0</span>
                    </button>
                    <button className="px-4 py-2 text-sm text-slate-600 hover:text-slate-800">
                        Sent offer <span className="ml-1 text-xs">0</span>
                    </button>
                    <button className="px-4 py-2 text-sm text-slate-600 hover:text-slate-800">
                        Hired <span className="ml-1 text-xs">0</span>
                    </button>
                    <button className="px-4 py-2 text-sm text-slate-600 hover:text-slate-800">
                        Not suitable <span className="ml-1 text-xs">0</span>
                    </button>
                </div>
            </div>

            {/* Applications table */}
            <div className="rounded-lg bg-white shadow-sm shadow-sky-100">
                <div className="border-b p-4">
                    <h3 className="text-sm font-medium text-sky-900">Saved candidates: 0</h3>
                </div>

                {/* Table headers */}
                <div className="grid grid-cols-6 gap-4 border-b p-4 text-sm font-medium text-slate-700">
                    <div>Name</div>
                    <div>Suitability</div>
                    <div>Job posting</div>
                    <div>Application date</div>
                    <div>Status</div>
                    <div>Actions</div>
                </div>

                {/* Empty state */}
                <div className="flex flex-col items-center justify-center py-16 text-center">
                    <div className="mb-4 rounded-full bg-slate-100 p-4">
                        <FileText className="h-8 w-8 text-slate-400" />
                    </div>
                    <h3 className="mb-2 text-lg font-medium text-slate-900">No candidate applications yet</h3>
                    <p className="text-sm text-slate-600">Applications will appear here when candidates apply to your job postings.</p>
                </div>
            </div>
        </>
    );
}