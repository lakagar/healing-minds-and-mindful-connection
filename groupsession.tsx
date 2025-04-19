import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useAuth } from "@/hooks/use-auth";
import { format, isToday, isTomorrow, formatDistanceToNow } from "date-fns";
import { GroupSession, Therapist } from "@shared/schema";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Users, Calendar, Clock, User, AlertTriangle } from "lucide-react";

export default function GroupSessions() {
  const { t } = useTranslation();
  const { toast } = useToast();
  const { user } = useAuth();
  const [selectedSession, setSelectedSession] = useState<GroupSession | null>(null);
  const [showConfirmLeave, setShowConfirmLeave] = useState(false);
  
  // Fetch group sessions
  const { data: groupSessions = [], isLoading: isLoadingGroupSessions } = useQuery<GroupSession[]>({
    queryKey: ["/api/group-sessions"],
    enabled: !!user,
  });
  
  // Fetch therapists
  const { data: therapists = [], isLoading: isLoadingTherapists } = useQuery<Therapist[]>({
    queryKey: ["/api/therapists"],
    enabled: !!user,
  });
  
  // Fetch session participants for current user
  const { data: mySessionIds = [] } = useQuery<number[]>({
    queryKey: ["/api/user/group-sessions"],
    queryFn: async () => {
      if (!user) return [];
      // This is a mock implementation since the actual endpoint wasn't created
      // In a real implementation, this would call a specific endpoint to get user's sessions
      const allSessions = await Promise.all(
        groupSessions.map(async (session) => {
          try {
            const res = await fetch(`/api/group-sessions/${session.id}/participants`);
            const participants = await res.json();
            return { sessionId: session.id, isJoined: participants.some((p: any) => p.userId === user.id) };
          } catch (e) {
            return { sessionId: session.id, isJoined: false };
          }
        })
      );
      return allSessions.filter(s => s.isJoined).map(s => s.sessionId);
    },
    enabled: !!user && groupSessions.length > 0,
  });
  
  // Join session mutation
  const joinSessionMutation = useMutation({
    mutationFn: async (sessionId: number) => {
      const res = await apiRequest("POST", `/api/group-sessions/${sessionId}/join`, {});
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/group-sessions"] });
      queryClient.invalidateQueries({ queryKey: ["/api/user/group-sessions"] });
      toast({
        title: "Session joined",
        description: "You have successfully joined the group session.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to join",
        description: error.message,
        variant: "destructive",
      });
    },
  });
  
  // Leave session mutation
  const leaveSessionMutation = useMutation({
    mutationFn: async (sessionId: number) => {
      const res = await apiRequest("DELETE", `/api/group-sessions/${sessionId}/leave`, {});
      return res.status === 204;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/group-sessions"] });
      queryClient.invalidateQueries({ queryKey: ["/api/user/group-sessions"] });
      setShowConfirmLeave(false);
      toast({
        title: "Session left",
        description: "You have left the group session.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to leave",
        description: error.message,
        variant: "destructive",
      });
    },
  });
  
  const handleJoinSession = (session: GroupSession) => {
    setSelectedSession(session);
    joinSessionMutation.mutate(session.id);
  };
  
  const handleLeaveSession = () => {
    if (selectedSession) {
      leaveSessionMutation.mutate(selectedSession.id);
    }
  };
  
  const confirmLeaveSession = (session: GroupSession) => {
    setSelectedSession(session);
    setShowConfirmLeave(true);
  };
  
  // Format date for display
  const formatSessionDate = (dateString: string) => {
    const date = new Date(dateString);
    if (isToday(date)) {
      return `Today at ${format(date, "h:mm a")}`;
    } else if (isTomorrow(date)) {
      return `Tomorrow at ${format(date, "h:mm a")}`;
    } else {
      return format(date, "MMM d, yyyy 'at' h:mm a");
    }
  };
  
  // Get time until session
  const getTimeUntilSession = (dateString: string) => {
    const date = new Date(dateString);
    return formatDistanceToNow(date, { addSuffix: true });
  };
  
  // Get therapist name by ID
  const getTherapistName = (id: number) => {
    const therapist = therapists.find(t => t.id === id);
    return therapist ? therapist.name : "Unknown";
  };
  
  // Check if user has joined a session
  const hasJoinedSession = (sessionId: number) => {
    return mySessionIds.includes(sessionId);
  };
  
  // Filter upcoming sessions (scheduled for the future and not canceled)
  const upcomingSessions = groupSessions
    .filter(session => 
      new Date(session.sessionDate) > new Date() && 
      session.status !== "canceled"
    )
    .sort((a, b) => new Date(a.sessionDate).getTime() - new Date(b.sessionDate).getTime());
  
  // Filter past sessions
  const pastSessions = groupSessions
    .filter(session => 
      new Date(session.sessionDate) <= new Date() || 
      session.status === "canceled"
    )
    .sort((a, b) => new Date(b.sessionDate).getTime() - new Date(a.sessionDate).getTime());
  
  if (isLoadingGroupSessions || isLoadingTherapists) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }
  
  return (
    <div className="container mx-auto max-w-6xl py-8">
      <div className="text-center mb-8">
        <h2 className="font-montserrat font-bold text-3xl md:text-4xl text-primary-dark dark:text-primary mb-4">{t("group.title")}</h2>
        <p className="text-neutral-dark dark:text-gray-300 max-w-2xl mx-auto">{t("group.description")}</p>
      </div>
      
      <Tabs defaultValue="upcoming" className="w-full">
        <TabsList className="grid grid-cols-2 mb-8">
          <TabsTrigger value="upcoming">Upcoming Sessions</TabsTrigger>
          <TabsTrigger value="past">Past Sessions</TabsTrigger>
        </TabsList>
        
        {/* Upcoming Sessions Tab */}
        <TabsContent value="upcoming">
          {upcomingSessions.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Calendar className="h-12 w-12 text-gray-400 mb-4" />
                <p className="text-gray-500 dark:text-gray-400">{t("group.noSessions")}</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {upcomingSessions.map((session) => (
                <Card key={session.id} className="overflow-hidden">
                  <div className={`h-1 ${session.currentParticipants >= session.maxParticipants ? 'bg-red-500' : 'bg-green-500'}`}></div>
                  <CardContent className="pt-6">
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="font-montserrat font-semibold text-lg text-primary-dark dark:text-primary">{session.name}</h3>
                      <Badge variant={hasJoinedSession(session.id) ? "default" : "outline"}>
                        {session.currentParticipants} / {session.maxParticipants} {t("group.participants")}
                      </Badge>
                    </div>
                    
                    <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">{session.description}</p>
                    
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center text-sm">
                        <Calendar className="w-4 h-4 mr-2 text-primary" />
                        <span>{formatSessionDate(session.sessionDate)}</span>
                        <span className="ml-2 text-xs text-gray-500 dark:text-gray-400">
                          ({getTimeUntilSession(session.sessionDate)})
                        </span>
                      </div>
                      
                      <div className="flex items-center text-sm">
                        <Clock className="w-4 h-4 mr-2 text-primary" />
                        <span>{session.duration} minutes</span>
                      </div>
                      
                      <div className="flex items-center text-sm">
                        <User className="w-4 h-4 mr-2 text-primary" />
                        <span>Led by {getTherapistName(session.therapistId)}</span>
                      </div>
                    </div>
                    
                    <div className="mb-4">
                      <div className="flex justify-between text-xs mb-1">
                        <span>Spaces filled</span>
                        <span>{session.currentParticipants}/{session.maxParticipants}</span>
                      </div>
                      <Progress 
                        value={(session.currentParticipants / session.maxParticipants) * 100}
                        className="h-2"
                      />
                    </div>
                    
                    {hasJoinedSession(session.id) ? (
                      <div className="flex items-center justify-between">
                        <div className="flex items-center text-green-600 dark:text-green-400">
                          <Users className="w-4 h-4 mr-1" />
                          <span className="text-sm font-medium">{t("group.joined")}</span>
                        </div>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => confirmLeaveSession(session)}
                        >
                          {t("group.leave")}
                        </Button>
                      </div>
                    ) : session.currentParticipants >= session.maxParticipants ? (
                      <Button disabled className="w-full">
                        {t("group.full")}
                      </Button>
                    ) : (
                      <Button 
                        className="w-full" 
                        onClick={() => handleJoinSession(session)}
                        disabled={joinSessionMutation.isPending}
                      >
                        {joinSessionMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        {t("group.join")}
                      </Button>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
        
        {/* Past Sessions Tab */}
        <TabsContent value="past">
          {pastSessions.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Calendar className="h-12 w-12 text-gray-400 mb-4" />
                <p className="text-gray-500 dark:text-gray-400">No past sessions found.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {pastSessions.map((session) => (
                <Card key={session.id} className="overflow-hidden">
                  <CardContent className="pt-6">
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="font-montserrat font-semibold text-lg text-primary-dark dark:text-primary">{session.name}</h3>
                      <Badge variant="outline" className={
                        session.status === "completed" 
                          ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300" 
                          : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300"
                      }>
                        {session.status.charAt(0).toUpperCase() + session.status.slice(1)}
                      </Badge>
                    </div>
                    
                    <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">{session.description}</p>
                    
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center text-sm">
                        <Calendar className="w-4 h-4 mr-2 text-primary" />
                        <span>{format(new Date(session.sessionDate), "MMM d, yyyy 'at' h:mm a")}</span>
                      </div>
                      
                      <div className="flex items-center text-sm">
                        <Clock className="w-4 h-4 mr-2 text-primary" />
                        <span>{session.duration} minutes</span>
                      </div>
                      
                      <div className="flex items-center text-sm">
                        <User className="w-4 h-4 mr-2 text-primary" />
                        <span>Led by {getTherapistName(session.therapistId)}</span>
                      </div>
                      
                      <div className="flex items-center text-sm">
                        <Users className="w-4 h-4 mr-2 text-primary" />
                        <span>{session.currentParticipants} participants joined</span>
                      </div>
                    </div>
                    
                    {hasJoinedSession(session.id) && session.status === "completed" && (
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline" className="w-full">View Session Notes</Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>{session.name} - Session Notes</DialogTitle>
                          </DialogHeader>
                          <div className="py-4">
                            <h4 className="font-medium mb-2">Session Summary</h4>
                            <p className="text-sm text-gray-600 dark:text-gray-300">
                              This group session focused on sharing strategies for managing anxiety in daily life. 
                              Participants discussed various techniques including deep breathing, progressive muscle relaxation, 
                              and cognitive reframing.
                            </p>
                            
                            <h4 className="font-medium mt-4 mb-2">Key Takeaways</h4>
                            <ul className="list-disc pl-5 space-y-1 text-sm text-gray-600 dark:text-gray-300">
                              <li>Regular practice of mindfulness can reduce anxiety over time</li>
                              <li>Support from others facing similar challenges is valuable</li>
                              <li>Small daily actions can lead to significant improvements</li>
                            </ul>
                            
                            <h4 className="font-medium mt-4 mb-2">Recommended Resources</h4>
                            <ul className="list-disc pl-5 space-y-1 text-sm text-gray-600 dark:text-gray-300">
                              <li>Mindfulness Meditation app</li>
                              <li>"The Anxiety and Worry Workbook" by Clark and Beck</li>
                              <li>Weekly support group meetings</li>
                            </ul>
                          </div>
                        </DialogContent>
                      </Dialog>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
      
      {/* Confirm Leave Dialog */}
      <Dialog open={showConfirmLeave} onOpenChange={setShowConfirmLeave}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Leave Group Session</DialogTitle>
            <DialogDescription>
              Are you sure you want to leave this group session? Your spot will be available for someone else to join.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-center py-4">
            <AlertTriangle className="h-12 w-12 text-yellow-500" />
          </div>
          {selectedSession && (
            <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-md">
              <h4 className="font-medium">{selectedSession.name}</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">{formatSessionDate(selectedSession.sessionDate)}</p>
            </div>
          )}
          <DialogFooter className="gap-2 sm:gap-0">
            <Button 
              variant="outline" 
              onClick={() => setShowConfirmLeave(false)}
            >
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleLeaveSession}
              disabled={leaveSessionMutation.isPending}
            >
              {leaveSessionMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Leave Session
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
