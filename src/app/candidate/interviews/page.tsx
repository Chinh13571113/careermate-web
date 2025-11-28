"use client";

import { useEffect, useState } from "react";
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Video, 
  Phone, 
  Users, 
  CheckCircle, 
  AlertCircle,
  MessageSquare,
  RotateCcw,
  ExternalLink
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import {
  getCandidateUpcomingInterviews,
  getCandidatePastInterviews,
  confirmInterview,
  requestReschedule,
  getInterviewTypeText,
  formatInterviewDateTime,
  getInterviewDateTimeStr,
  isToday,
  isUpcoming,
  type InterviewScheduleResponse
} from "@/lib/interview-api";

export default function CandidateInterviewsPage() {
  const [loading, setLoading] = useState(true);
  const [upcomingInterviews, setUpcomingInterviews] = useState<InterviewScheduleResponse[]>([]);
  const [pastInterviews, setPastInterviews] = useState<InterviewScheduleResponse[]>([]);
  
  // Dialog states
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [rescheduleDialogOpen, setRescheduleDialogOpen] = useState(false);
  const [selectedInterview, setSelectedInterview] = useState<InterviewScheduleResponse | null>(null);
  
  // Form state
  const [rescheduleForm, setRescheduleForm] = useState({
    newDateTime: "",
    reason: ""
  });

  useEffect(() => {
    loadInterviews();
  }, []);

  const loadInterviews = async () => {
    try {
      setLoading(true);

      const [upcoming, past] = await Promise.all([
        getCandidateUpcomingInterviews(),
        getCandidatePastInterviews()
      ]);
      
      setUpcomingInterviews(upcoming);
      setPastInterviews(past);
    } catch (error: any) {
      console.error("Failed to load interviews:", error);
      toast.error(error.response?.data?.message || "Failed to load interviews");
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmInterview = async () => {
    if (!selectedInterview) return;

    try {
      await confirmInterview(selectedInterview.id);
      toast.success("Interview confirmed successfully");
      setConfirmDialogOpen(false);
      loadInterviews();
    } catch (error: any) {
      console.error("Failed to confirm interview:", error);
      toast.error(error.response?.data?.message || "Failed to confirm interview");
    }
  };

  const handleRequestReschedule = async () => {
    if (!selectedInterview) return;
    
    if (!rescheduleForm.newDateTime) {
      toast.error("Please select a new date and time");
      return;
    }

    if (!rescheduleForm.reason.trim()) {
      toast.error("Please provide a reason for rescheduling");
      return;
    }

    try {
      await requestReschedule(selectedInterview.id, {
        newRequestedDate: rescheduleForm.newDateTime,
        reason: rescheduleForm.reason,
        requestedBy: 'CANDIDATE'
      });
      
      toast.success("Reschedule request submitted");
      setRescheduleDialogOpen(false);
      setRescheduleForm({ newDateTime: "", reason: "" });
      loadInterviews();
    } catch (error: any) {
      console.error("Failed to request reschedule:", error);
      toast.error(error.response?.data?.message || "Failed to submit request");
    }
  };

  const getInterviewStatusBadge = (status: string) => {
    const config: Record<string, { variant: "default" | "secondary" | "destructive" | "outline", label: string }> = {
      SCHEDULED: { variant: "outline", label: "Awaiting Confirmation" },
      CONFIRMED: { variant: "default", label: "Confirmed" },
      COMPLETED: { variant: "secondary", label: "Completed" },
      CANCELLED: { variant: "destructive", label: "Cancelled" },
      NO_SHOW: { variant: "destructive", label: "Missed" }
    };
    
    const { variant, label } = config[status] || { variant: "outline" as const, label: status };
    return <Badge variant={variant}>{label}</Badge>;
  };

  const getInterviewTypeIcon = (type: string) => {
    switch (type) {
      case "PHONE": return <Phone className="h-4 w-4" />;
      case "VIDEO_CALL": return <Video className="h-4 w-4" />;
      case "IN_PERSON": return <MapPin className="h-4 w-4" />;
      case "ONLINE_ASSESSMENT": return <Calendar className="h-4 w-4" />;
      default: return <Calendar className="h-4 w-4" />;
    }
  };

  const getResultBadge = (result?: string) => {
    if (!result) return null;
    
    const config: Record<string, { variant: "default" | "secondary" | "destructive" | "outline", label: string }> = {
      PASS: { variant: "default", label: "Passed" },
      FAIL: { variant: "destructive", label: "Not Selected" },
      PENDING: { variant: "secondary", label: "Under Review" },
      NEEDS_SECOND_ROUND: { variant: "outline", label: "Second Round Required" },
      // Legacy support
      PASSED: { variant: "default", label: "Passed" },
      FAILED: { variant: "destructive", label: "Not Selected" }
    };
    
    const { variant, label } = config[result] || { variant: "secondary" as const, label: result };
    return <Badge variant={variant}>{label}</Badge>;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">My Interviews</h1>
        <p className="text-muted-foreground">
          View and manage your upcoming and past interviews
        </p>
      </div>

      <Tabs defaultValue="upcoming" className="space-y-6">
        <TabsList>
          <TabsTrigger value="upcoming">
            Upcoming ({upcomingInterviews.length})
          </TabsTrigger>
          <TabsTrigger value="past">
            Past ({pastInterviews.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="upcoming" className="space-y-4">
          {upcomingInterviews.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <Calendar className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-semibold mb-2">No Upcoming Interviews</h3>
                <p className="text-muted-foreground">
                  You don't have any scheduled interviews at the moment.
                </p>
              </CardContent>
            </Card>
          ) : (
            upcomingInterviews.map((interview) => (
              <Card 
                key={interview.id} 
                className={`${isToday(interview) ? "border-primary" : ""} ${
                  interview.status === "SCHEDULED" ? "border-l-4 border-l-yellow-500" : ""
                }`}
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        {getInterviewTypeIcon(interview.interviewType)}
                        <CardTitle className="text-xl">
                          {getInterviewTypeText(interview.interviewType)}
                        </CardTitle>
                        {isToday(interview) && (
                          <Badge variant="destructive">Today!</Badge>
                        )}
                        {isUpcoming(interview) && !isToday(interview) && (
                          <Badge variant="outline">Soon</Badge>
                        )}
                      </div>
                      <CardDescription>
                        Company: {interview.companyName || "N/A"}
                      </CardDescription>
                    </div>
                    {getInterviewStatusBadge(interview.status)}
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {interview.status === "SCHEDULED" && (
                    <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-md flex items-start gap-2">
                      <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5" />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-yellow-900">
                          Confirmation Required
                        </p>
                        <p className="text-sm text-yellow-700">
                          Please confirm your attendance for this interview
                        </p>
                      </div>
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">
                        {formatInterviewDateTime(getInterviewDateTimeStr(interview))}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span>{interview.durationMinutes} minutes</span>
                    </div>
                    {interview.location && (
                      <div className="flex items-center gap-2 text-sm">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <span>{interview.location}</span>
                      </div>
                    )}
                    {interview.meetingLink && (
                      <div className="flex items-center gap-2 text-sm">
                        <Video className="h-4 w-4 text-muted-foreground" />
                        <a 
                          href={interview.meetingLink} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-primary hover:underline flex items-center gap-1"
                        >
                          Join Meeting
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      </div>
                    )}
                  </div>

                  {interview.preparationNotes && (
                    <div className="pt-2 border-t">
                      <p className="text-sm">
                        <MessageSquare className="h-4 w-4 inline mr-1 text-muted-foreground" />
                        <span className="font-medium">Notes:</span> {interview.preparationNotes}
                      </p>
                    </div>
                  )}

                  {interview.rescheduleRequests && interview.rescheduleRequests.length > 0 && (
                    <div className="pt-2 border-t">
                      <p className="text-sm font-medium mb-2">Reschedule Request Status:</p>
                      {interview.rescheduleRequests.map((request) => (
                        <div key={request.id} className="p-2 bg-muted rounded-md text-sm">
                          <Badge variant="outline" className="mb-1">
                            {request.status}
                          </Badge>
                          <p className="text-muted-foreground">
                            New time: {formatInterviewDateTime(request.proposedDateTime)}
                          </p>
                          {request.responseMessage && (
                            <p className="text-muted-foreground mt-1">
                              Response: {request.responseMessage}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="flex gap-2 pt-2">
                    {interview.status === "SCHEDULED" && (
                      <Button
                        size="sm"
                        onClick={() => {
                          setSelectedInterview(interview);
                          setConfirmDialogOpen(true);
                        }}
                      >
                        <CheckCircle className="h-4 w-4 mr-1" />
                        Confirm Attendance
                      </Button>
                    )}
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setSelectedInterview(interview);
                        setRescheduleDialogOpen(true);
                      }}
                      disabled={interview.status === "COMPLETED"}
                    >
                      <RotateCcw className="h-4 w-4 mr-1" />
                      Request Reschedule
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>

        <TabsContent value="past" className="space-y-4">
          {pastInterviews.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <Calendar className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-semibold mb-2">No Past Interviews</h3>
                <p className="text-muted-foreground">
                  Your completed interviews will appear here.
                </p>
              </CardContent>
            </Card>
          ) : (
            pastInterviews.map((interview) => (
              <Card key={interview.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        {getInterviewTypeIcon(interview.interviewType)}
                        <CardTitle className="text-xl">
                          {getInterviewTypeText(interview.interviewType)}
                        </CardTitle>
                      </div>
                      <CardDescription>
                        Company: {interview.companyName || "N/A"}
                      </CardDescription>
                    </div>
                    <div className="flex gap-2">
                      {getInterviewStatusBadge(interview.status)}
                      {interview.result && getResultBadge(interview.result)}
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span>{formatInterviewDateTime(interview.interviewDateTime)}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span>{interview.durationMinutes} minutes</span>
                    </div>
                  </div>

                  {interview.feedback && (
                    <div className="pt-2 border-t">
                      <p className="text-sm font-medium mb-2">Interviewer Feedback:</p>
                      <div className="p-3 bg-muted rounded-md">
                        <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                          {interview.feedback}
                        </p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>
      </Tabs>

      {/* Confirm Interview Dialog */}
      <Dialog open={confirmDialogOpen} onOpenChange={setConfirmDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Confirm Interview Attendance</DialogTitle>
            <DialogDescription>
              Please confirm that you will attend this interview
            </DialogDescription>
          </DialogHeader>
          {selectedInterview && (
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">
                    {formatInterviewDateTime(selectedInterview.interviewDateTime)}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span>{selectedInterview.durationMinutes} minutes</span>
                </div>
              </div>
              <p className="text-sm text-muted-foreground">
                By confirming, you're committing to attend this interview. If you need to reschedule,
                please use the "Request Reschedule" option instead.
              </p>
            </div>
          )}
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setConfirmDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleConfirmInterview}>
              <CheckCircle className="h-4 w-4 mr-1" />
              Confirm Attendance
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Request Reschedule Dialog */}
      <Dialog open={rescheduleDialogOpen} onOpenChange={setRescheduleDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Request Reschedule</DialogTitle>
            <DialogDescription>
              Request a new date and time for your interview
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="new-datetime">New Date & Time *</Label>
              <input
                id="new-datetime"
                type="datetime-local"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                value={rescheduleForm.newDateTime}
                onChange={(e) =>
                  setRescheduleForm({ ...rescheduleForm, newDateTime: e.target.value })
                }
                min={new Date().toISOString().slice(0, 16)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="reschedule-reason">Reason *</Label>
              <Textarea
                id="reschedule-reason"
                placeholder="Please explain why you need to reschedule..."
                value={rescheduleForm.reason}
                onChange={(e) =>
                  setRescheduleForm({ ...rescheduleForm, reason: e.target.value })
                }
                rows={4}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setRescheduleDialogOpen(false);
                setRescheduleForm({ newDateTime: "", reason: "" });
              }}
            >
              Cancel
            </Button>
            <Button onClick={handleRequestReschedule}>
              <RotateCcw className="h-4 w-4 mr-1" />
              Submit Request
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
