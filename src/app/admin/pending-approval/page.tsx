'use client';

import { getRecruiters, approveRecruiter, rejectRecruiter } from '@/lib/recruiter-api';
import { Recruiter } from '@/types/recruiter';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { 
  Eye, 
  Clock, 
  Search, 
  RefreshCw, 
  Building2, 
  Mail, 
  Phone, 
  Globe, 
  MapPin,
  Star,
  CheckCircle,
  XCircle,
  AlertCircle
} from 'lucide-react';

export default function PendingApprovalPage() {
  const [recruiters, setRecruiters] = useState<Recruiter[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedRecruiter, setSelectedRecruiter] = useState<Recruiter | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isRejectDialogOpen, setIsRejectDialogOpen] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [recruiterToReject, setRecruiterToReject] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const fetchRecruiters = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await getRecruiters();
      if (response.code === 200 || response.result) {
        // The /pending endpoint already returns only pending recruiters
        setRecruiters(response.result);
      } else {
        setError('Failed to fetch recruiters');
      }
    } catch (error: any) {
      console.error('Error fetching recruiters:', error);
      setError(error.message || 'Error loading recruiters. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRecruiters();
  }, []);

  const handleViewDetails = (recruiter: Recruiter) => {
    setSelectedRecruiter(recruiter);
    setIsDialogOpen(true);
  };

  const handleApprove = async (recruiterId: number) => {
    if (!confirm('Are you sure you want to approve this recruiter?')) return;
    
    setIsProcessing(true);
    try {
      await approveRecruiter(recruiterId);
      await fetchRecruiters(); // Refresh the list
      setIsDialogOpen(false);
      alert('Recruiter approved successfully!');
    } catch (error: any) {
      alert(error.message || 'Failed to approve recruiter');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReject = async (recruiterId: number) => {
    setRecruiterToReject(recruiterId);
    setRejectReason('');
    setIsRejectDialogOpen(true);
  };

  const confirmReject = async () => {
    if (!recruiterToReject) return;
    
    if (rejectReason.trim() === '') {
      alert('Rejection reason is required.');
      return;
    }
    
    setIsProcessing(true);
    try {
      await rejectRecruiter(recruiterToReject, rejectReason.trim());
      await fetchRecruiters(); // Refresh the list
      setIsDialogOpen(false);
      setIsRejectDialogOpen(false);
      setRejectReason('');
      setRecruiterToReject(null);
      alert('Recruiter rejected successfully!');
    } catch (error: any) {
      alert(error.message || 'Failed to reject recruiter');
    } finally {
      setIsProcessing(false);
    }
  };

  const filteredRecruiters = recruiters.filter(recruiter => 
    recruiter.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
    recruiter.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    recruiter.companyName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
            <h1 className="text-3xl font-light mb-6 text-gray-800">Pending Approvals</h1>
            <div className="text-center p-12 bg-red-50 rounded-xl border border-red-200">
              <div className="text-red-500 text-5xl mb-4">⚠️</div>
              <p className="text-red-600 mb-6 text-lg">{error}</p>
              <Button 
                onClick={fetchRecruiters}
                className="bg-red-500 hover:bg-red-600 text-white"
              >
                <RefreshCw className="mr-2 h-4 w-4" />
                Try Again
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-xl shadow-lg">
                <Clock className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-light text-gray-800">Pending Approvals</h1>
                <p className="text-sm text-gray-500 mt-1">Review and approve recruiter registrations</p>
              </div>
            </div>
            
            {!isLoading && (
              <div className="flex items-center gap-3">
                <div className="text-center px-6 py-3 bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-xl border border-yellow-200">
                  <p className="text-xs text-gray-600 mb-1">Pending Approval</p>
                  <p className="text-2xl font-semibold text-yellow-600">{recruiters.length}</p>
                </div>
              </div>
            )}
          </div>

          {/* Search Bar */}
          <div className="mt-6 relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by company, username, or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all"
            />
          </div>
        </div>
        
        {isLoading ? (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-20">
            <div className="flex flex-col items-center justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-yellow-500 border-t-transparent mb-4"></div>
              <p className="text-gray-500">Loading pending approvals...</p>
            </div>
          </div>
        ) : filteredRecruiters.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-20">
            <div className="text-center">
              <div className="text-gray-400 text-6xl mb-4">✅</div>
              <p className="text-gray-600 text-lg">
                {searchQuery 
                  ? 'No pending approvals found matching your search' 
                  : 'No pending approvals at the moment'}
              </p>
              <p className="text-gray-500 text-sm mt-2">All caught up! New recruiter registrations will appear here.</p>
            </div>
          </div>
        ) : (
          <>
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gradient-to-r from-yellow-50 to-orange-50 border-b border-gray-200">
                    <TableHead className="font-semibold text-gray-700 py-4">Company</TableHead>
                    <TableHead className="font-semibold text-gray-700">Contact Person</TableHead>
                    <TableHead className="font-semibold text-gray-700">Email</TableHead>
                    <TableHead className="font-semibold text-gray-700">Phone</TableHead>
                    {/* <TableHead className="font-semibold text-gray-700">Rating</TableHead> */}
                    <TableHead className="font-semibold text-gray-700 text-center">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredRecruiters.map((recruiter) => (
                    <TableRow 
                      key={recruiter.recruiterId}
                      className="hover:bg-yellow-50 transition-colors border-b border-gray-100 last:border-0"
                    >
                      <TableCell className="font-medium text-gray-800 py-4">
                        <div className="flex items-center gap-3">
                          {recruiter.logoUrl ? (
                            <img 
                              src={recruiter.logoUrl} 
                              alt={recruiter.companyName}
                              className="w-10 h-10 rounded-lg object-cover border border-gray-200"
                            />
                          ) : (
                            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-yellow-400 to-yellow-600 flex items-center justify-center text-white font-semibold shadow-sm">
                              <Building2 className="h-5 w-5" />
                            </div>
                          )}
                          <div>
                            <p className="font-semibold">{recruiter.companyName}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-gray-600">{recruiter.contactPerson}</TableCell>
                      <TableCell className="text-gray-600">{recruiter.email}</TableCell>
                      <TableCell className="text-gray-600">{recruiter.phoneNumber}</TableCell>
                      {/* <TableCell>
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                          <span className="font-semibold">{recruiter.rating.toFixed(1)}</span>
                        </div>
                      </TableCell> */}
                      <TableCell className="text-center">
                        <div className="flex items-center justify-center gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleViewDetails(recruiter)}
                            className="hover:bg-blue-50 hover:text-blue-600 transition-colors rounded-lg"
                            title="View details"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleApprove(recruiter.recruiterId)}
                            className="hover:bg-green-50 hover:text-green-600 transition-colors rounded-lg"
                            title="Approve"
                            disabled={isProcessing}
                          >
                            <CheckCircle className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleReject(recruiter.recruiterId)}
                            className="hover:bg-red-50 hover:text-red-600 transition-colors rounded-lg"
                            title="Reject"
                            disabled={isProcessing}
                          >
                            <XCircle className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {/* Summary */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mt-6">
              <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
                <AlertCircle className="h-4 w-4 text-yellow-500" />
                <span>
                  Showing <span className="font-medium">{filteredRecruiters.length}</span> pending approval{filteredRecruiters.length !== 1 ? 's' : ''}
                </span>
              </div>
            </div>
          </>
        )}

        {/* Recruiter Details Dialog */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="max-w-4xl rounded-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-2xl font-light text-gray-800">Review Recruiter Application</DialogTitle>
              <DialogDescription className="text-gray-500">
                Review the complete information before approving or rejecting
              </DialogDescription>
            </DialogHeader>
            
            {selectedRecruiter && (
              <div className="space-y-6 mt-4">
                {/* Company Header */}
                <div className="flex items-start gap-6 p-6 bg-gradient-to-br from-yellow-50 to-orange-50 rounded-xl border border-yellow-200">
                  {selectedRecruiter.logoUrl ? (
                    <img 
                      src={selectedRecruiter.logoUrl} 
                      alt={selectedRecruiter.companyName}
                      className="w-24 h-24 rounded-xl object-cover border-2 border-white shadow-lg"
                    />
                  ) : (
                    <div className="w-24 h-24 rounded-xl bg-gradient-to-br from-yellow-400 to-yellow-600 flex items-center justify-center text-white shadow-lg">
                      <Building2 className="h-12 w-12" />
                    </div>
                  )}
                  <div className="flex-1">
                    <h3 className="text-2xl font-semibold text-gray-800">{selectedRecruiter.companyName}</h3>
                    {/* <p className="text-gray-600 mt-1">{selectedRecruiter.username}</p> */}
                    <div className="flex items-center gap-3 mt-3">
                      <Badge className="bg-yellow-100 text-yellow-700 border-yellow-200 px-3 py-1 flex items-center">
                        <Clock className="h-3 w-3 mr-1" />
                        Pending Approval
                      </Badge>
                    </div>
                  </div>
                </div>

                {/* Contact Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-gray-50 rounded-xl">
                    <div className="flex items-center gap-2 mb-2">
                      <Mail className="h-4 w-4 text-gray-500" />
                      <p className="text-xs text-gray-500 uppercase tracking-wide">Email</p>
                    </div>
                    <p className="text-gray-800 font-medium break-all">{selectedRecruiter.email}</p>
                  </div>
                  
                  <div className="p-4 bg-gray-50 rounded-xl">
                    <div className="flex items-center gap-2 mb-2">
                      <Phone className="h-4 w-4 text-gray-500" />
                      <p className="text-xs text-gray-500 uppercase tracking-wide">Phone Number</p>
                    </div>
                    <p className="text-gray-800 font-medium">{selectedRecruiter.phoneNumber}</p>
                  </div>

                  <div className="p-4 bg-gray-50 rounded-xl">
                    <div className="flex items-center gap-2 mb-2">
                      <Globe className="h-4 w-4 text-gray-500" />
                      <p className="text-xs text-gray-500 uppercase tracking-wide">Website</p>
                    </div>
                    {selectedRecruiter.website ? (
                      <a 
                        href={selectedRecruiter.website} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline font-medium"
                      >
                        {selectedRecruiter.website}
                      </a>
                    ) : (
                      <p className="text-gray-400">Not provided</p>
                    )}
                  </div>

                  <div className="p-4 bg-gray-50 rounded-xl">
                    <div className="flex items-center gap-2 mb-2">
                      <MapPin className="h-4 w-4 text-gray-500" />
                      <p className="text-xs text-gray-500 uppercase tracking-wide">Address</p>
                    </div>
                    <p className="text-gray-800 font-medium">{selectedRecruiter.companyAddress}</p>
                  </div>
                </div>

                {/* Additional Information */}
                <div className="space-y-4">
                  <div className="p-4 bg-gray-50 rounded-xl">
                    <p className="text-xs text-gray-500 uppercase tracking-wide mb-2">Contact Person</p>
                    <p className="text-gray-800 font-medium">{selectedRecruiter.contactPerson}</p>
                  </div>

                  <div className="p-4 bg-gray-50 rounded-xl">
                    <p className="text-xs text-gray-500 uppercase tracking-wide mb-2">Business License</p>
                    <p className="text-gray-800 font-medium">{selectedRecruiter.businessLicense}</p>
                  </div>

                  {selectedRecruiter.about && (
                    <div className="p-4 bg-gray-50 rounded-xl">
                      <p className="text-xs text-gray-500 uppercase tracking-wide mb-2">About Company</p>
                      <p className="text-gray-800 leading-relaxed">{selectedRecruiter.about}</p>
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 pt-4 border-t border-gray-200">
                  <Button
                    onClick={() => handleApprove(selectedRecruiter.recruiterId)}
                    disabled={isProcessing}
                    className="flex-1 bg-green-500 hover:bg-green-600 text-white rounded-xl py-6"
                  >
                    <CheckCircle className="mr-2 h-5 w-5" />
                    Approve Recruiter
                  </Button>
                  <Button
                    onClick={() => handleReject(selectedRecruiter.recruiterId)}
                    disabled={isProcessing}
                    variant="outline"
                    className="flex-1 border-red-300 text-red-600 hover:bg-red-50 rounded-xl py-6"
                  >
                    <XCircle className="mr-2 h-5 w-5" />
                    Reject Application
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Reject Reason Dialog */}
        <Dialog open={isRejectDialogOpen} onOpenChange={setIsRejectDialogOpen}>
          <DialogContent className="max-w-2xl rounded-2xl">
            <DialogHeader>
              <DialogTitle className="text-2xl font-light text-red-700 flex items-center gap-2">
                <XCircle className="h-6 w-6" />
                Reject Recruiter Application
              </DialogTitle>
              <DialogDescription className="text-gray-500">
                Please provide a clear reason for rejecting this application. The recruiter will see this message.
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4 mt-4">
              {/* Warning Box */}
              <div className="bg-red-50 border-l-4 border-red-500 rounded-xl p-4">
                <div className="flex gap-3">
                  <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-red-900 mb-1">Important Notice</h4>
                    <p className="text-sm text-red-800">
                      The recruiter will receive this rejection reason and will be able to update their information and reapply.
                    </p>
                  </div>
                </div>
              </div>

              {/* Reason Input */}
              <div>
                <label htmlFor="rejectReason" className="block text-sm font-medium text-gray-700 mb-2">
                  Rejection Reason <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="rejectReason"
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  placeholder="E.g., Your business license document is unclear. Please upload a higher quality image that clearly shows the license number and company name."
                  className="w-full min-h-[120px] px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none"
                  disabled={isProcessing}
                />
                <p className="text-xs text-gray-500 mt-2">
                  {rejectReason.length} / 500 characters
                </p>
              </div>

              {/* Common Reasons */}
              <div>
                <p className="text-sm font-medium text-gray-700 mb-2">Common rejection reasons:</p>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => setRejectReason('Your business license document is invalid or unclear. Please upload a clear, valid business license.')}
                    className="px-3 py-1.5 text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
                    disabled={isProcessing}
                  >
                    Invalid Business License
                  </button>
                  <button
                    type="button"
                    onClick={() => setRejectReason('The company information provided does not match our verification records. Please ensure all details are accurate.')}
                    className="px-3 py-1.5 text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
                    disabled={isProcessing}
                  >
                    Information Mismatch
                  </button>
                  <button
                    type="button"
                    onClick={() => setRejectReason('Your company website is not accessible or does not appear to be legitimate. Please provide a valid company website.')}
                    className="px-3 py-1.5 text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
                    disabled={isProcessing}
                  >
                    Invalid Website
                  </button>
                  <button
                    type="button"
                    onClick={() => setRejectReason('The contact information provided could not be verified. Please provide accurate contact details.')}
                    className="px-3 py-1.5 text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
                    disabled={isProcessing}
                  >
                    Invalid Contact Info
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4 border-t border-gray-200">
                <Button
                  onClick={() => {
                    setIsRejectDialogOpen(false);
                    setRejectReason('');
                    setRecruiterToReject(null);
                  }}
                  disabled={isProcessing}
                  variant="outline"
                  className="flex-1 rounded-xl py-6"
                >
                  Cancel
                </Button>
                <Button
                  onClick={confirmReject}
                  disabled={isProcessing || rejectReason.trim() === ''}
                  className="flex-1 bg-red-500 hover:bg-red-600 text-white rounded-xl py-6"
                >
                  {isProcessing ? (
                    <>
                      <RefreshCw className="mr-2 h-5 w-5 animate-spin" />
                      Rejecting...
                    </>
                  ) : (
                    <>
                      <XCircle className="mr-2 h-5 w-5" />
                      Confirm Rejection
                    </>
                  )}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
