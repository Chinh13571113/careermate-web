'use client';

import { getRecruiters } from '@/lib/recruiter-api';
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
  Briefcase, 
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
  Clock
} from 'lucide-react';

export default function RecruiterManagementPage() {
  const [recruiters, setRecruiters] = useState<Recruiter[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedRecruiter, setSelectedRecruiter] = useState<Recruiter | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');

  const fetchRecruiters = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await getRecruiters();
      if (response.code === 200 || response.result) {
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

  const getVerificationBadge = (status: string) => {
    const normalizedStatus = status.toUpperCase();
    switch (normalizedStatus) {
      case 'PENDING':
      case 'PENDING_APPROVAL':
        return {
          color: 'bg-yellow-100 text-yellow-700 border-yellow-200',
          icon: <Clock className="h-3 w-3 mr-1" />
        };
      case 'APPROVED':
      case 'VERIFIED':
        return {
          color: 'bg-green-100 text-green-700 border-green-200',
          icon: <CheckCircle className="h-3 w-3 mr-1" />
        };
      case 'REJECTED':
        return {
          color: 'bg-red-100 text-red-700 border-red-200',
          icon: <XCircle className="h-3 w-3 mr-1" />
        };
      default:
        return {
          color: 'bg-gray-100 text-gray-700 border-gray-200',
          icon: <Clock className="h-3 w-3 mr-1" />
        };
    }
  };

  const filteredRecruiters = recruiters.filter(recruiter => {
    const matchesSearch = 
      recruiter.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      recruiter.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      recruiter.companyName.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesFilter = 
      filterStatus === 'all' || 
      recruiter.verificationStatus.toLowerCase() === filterStatus ||
      (filterStatus === 'pending' && recruiter.verificationStatus.toLowerCase().includes('pending'));
    
    return matchesSearch && matchesFilter;
  });

  const pendingCount = recruiters.filter(r => 
    r.verificationStatus.toLowerCase().includes('pending')
  ).length;

  const approvedCount = recruiters.filter(r => 
    r.verificationStatus.toLowerCase() === 'approved' || 
    r.verificationStatus.toLowerCase() === 'verified'
  ).length;

  const rejectedCount = recruiters.filter(r => 
    r.verificationStatus.toLowerCase() === 'rejected'
  ).length;

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
            <h1 className="text-3xl font-light mb-6 text-gray-800">Recruiter Management</h1>
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
              <div className="p-3 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl shadow-lg">
                <Briefcase className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-light text-gray-800">Recruiter Management</h1>
                <p className="text-sm text-gray-500 mt-1">Manage recruiter accounts and approvals</p>
              </div>
            </div>
            
            {!isLoading && (
              <div className="flex items-center gap-3">
                <div className="text-center px-4 py-3 bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-xl border border-yellow-200">
                  <p className="text-xs text-gray-600 mb-1">Pending</p>
                  <p className="text-xl font-semibold text-yellow-600">{pendingCount}</p>
                </div>
                <div className="text-center px-4 py-3 bg-gradient-to-br from-green-50 to-green-100 rounded-xl border border-green-200">
                  <p className="text-xs text-gray-600 mb-1">Approved</p>
                  <p className="text-xl font-semibold text-green-600">{approvedCount}</p>
                </div>
                <div className="text-center px-4 py-3 bg-gradient-to-br from-red-50 to-red-100 rounded-xl border border-red-200">
                  <p className="text-xs text-gray-600 mb-1">Rejected</p>
                  <p className="text-xl font-semibold text-red-600">{rejectedCount}</p>
                </div>
              </div>
            )}
          </div>

          {/* Search Bar and Filter */}
          <div className="mt-6 flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by company, username, or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
              />
            </div>
            <div className="flex gap-2">
              <Button
                variant={filterStatus === 'all' ? 'default' : 'outline'}
                onClick={() => setFilterStatus('all')}
                className="rounded-lg"
              >
                All
              </Button>
              <Button
                variant={filterStatus === 'pending' ? 'default' : 'outline'}
                onClick={() => setFilterStatus('pending')}
                className="rounded-lg bg-yellow-500 hover:bg-yellow-600 text-white"
              >
                <Clock className="h-4 w-4 mr-1" />
                Pending
              </Button>
              <Button
                variant={filterStatus === 'approved' ? 'default' : 'outline'}
                onClick={() => setFilterStatus('approved')}
                className="rounded-lg"
              >
                Approved
              </Button>
              <Button
                variant={filterStatus === 'rejected' ? 'default' : 'outline'}
                onClick={() => setFilterStatus('rejected')}
                className="rounded-lg"
              >
                Rejected
              </Button>
            </div>
          </div>
        </div>
        
        {isLoading ? (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-20">
            <div className="flex flex-col items-center justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-purple-500 border-t-transparent mb-4"></div>
              <p className="text-gray-500">Loading recruiters...</p>
            </div>
          </div>
        ) : filteredRecruiters.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-20">
            <div className="text-center">
              <div className="text-gray-400 text-6xl mb-4">💼</div>
              <p className="text-gray-600 text-lg">
                {searchQuery || filterStatus !== 'all' 
                  ? 'No recruiters found matching your criteria' 
                  : 'No recruiters found'}
              </p>
            </div>
          </div>
        ) : (
          <>
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
                    <TableHead className="font-semibold text-gray-700 py-4">Company</TableHead>
                    <TableHead className="font-semibold text-gray-700">Contact Person</TableHead>
                    <TableHead className="font-semibold text-gray-700">Email</TableHead>
                    <TableHead className="font-semibold text-gray-700">Phone</TableHead>
                    <TableHead className="font-semibold text-gray-700">Rating</TableHead>
                    <TableHead className="font-semibold text-gray-700">Status</TableHead>
                    <TableHead className="font-semibold text-gray-700 text-center">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredRecruiters.map((recruiter) => {
                    const verificationBadge = getVerificationBadge(recruiter.verificationStatus);
                    return (
                      <TableRow 
                        key={recruiter.recruiterId}
                        className="hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-0"
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
                              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center text-white font-semibold shadow-sm">
                                <Building2 className="h-5 w-5" />
                              </div>
                            )}
                            <div>
                              <p className="font-semibold">{recruiter.companyName}</p>
                              <p className="text-xs text-gray-500">{recruiter.username}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="text-gray-600">{recruiter.contactPerson}</TableCell>
                        <TableCell className="text-gray-600">{recruiter.email}</TableCell>
                        <TableCell className="text-gray-600">{recruiter.phoneNumber}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                            <span className="font-semibold">{recruiter.rating.toFixed(1)}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className={`${verificationBadge.color} px-3 py-1 font-medium flex items-center w-fit`}>
                            {verificationBadge.icon}
                            {recruiter.verificationStatus}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-center">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleViewDetails(recruiter)}
                            className="hover:bg-purple-50 hover:text-purple-600 transition-colors rounded-lg"
                            title="View details"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>

            {/* Summary */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mt-6">
              <div className="text-sm text-gray-600 text-center">
                Showing <span className="font-medium">{filteredRecruiters.length}</span> of <span className="font-medium">{recruiters.length}</span> recruiters
              </div>
            </div>
          </>
        )}

        {/* Recruiter Details Dialog */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="max-w-4xl rounded-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-2xl font-light text-gray-800">Recruiter Details</DialogTitle>
              <DialogDescription className="text-gray-500">
                Complete information about the recruiter and company
              </DialogDescription>
            </DialogHeader>
            
            {selectedRecruiter && (
              <div className="space-y-6 mt-4">
                {/* Company Header */}
                <div className="flex items-start gap-6 p-6 bg-gradient-to-br from-purple-50 to-indigo-50 rounded-xl">
                  {selectedRecruiter.logoUrl ? (
                    <img 
                      src={selectedRecruiter.logoUrl} 
                      alt={selectedRecruiter.companyName}
                      className="w-24 h-24 rounded-xl object-cover border-2 border-white shadow-lg"
                    />
                  ) : (
                    <div className="w-24 h-24 rounded-xl bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center text-white shadow-lg">
                      <Building2 className="h-12 w-12" />
                    </div>
                  )}
                  <div className="flex-1">
                    <h3 className="text-2xl font-semibold text-gray-800">{selectedRecruiter.companyName}</h3>
                    <p className="text-gray-600 mt-1">{selectedRecruiter.username}</p>
                    <div className="flex items-center gap-3 mt-3">
                      <Badge className={`${getVerificationBadge(selectedRecruiter.verificationStatus).color} px-3 py-1 flex items-center`}>
                        {getVerificationBadge(selectedRecruiter.verificationStatus).icon}
                        {selectedRecruiter.verificationStatus}
                      </Badge>
                      <div className="flex items-center gap-1 bg-white px-3 py-1 rounded-lg border border-gray-200">
                        <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                        <span className="font-semibold">{selectedRecruiter.rating.toFixed(1)}</span>
                      </div>
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

                {/* Account Information */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-gray-50 rounded-xl">
                    <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Account Status</p>
                    <p className="text-gray-800 font-medium">{selectedRecruiter.accountStatus}</p>
                  </div>
                  
                  <div className="p-4 bg-gray-50 rounded-xl">
                    <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Account Role</p>
                    <p className="text-gray-800 font-medium">{selectedRecruiter.accountRole}</p>
                  </div>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
