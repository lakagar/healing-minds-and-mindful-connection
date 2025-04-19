import { createContext, ReactNode, useContext } from "react";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useToast } from "./use-toast";
import { useAuth } from "./use-auth";
import { MoodEntry } from "@shared/schema";

type MoodAnalysis = {
  summary: string;
  insights: string[];
  suggestions: string[];
};

type MoodContextType = {
  moodEntries: MoodEntry[];
  moodAnalysis: MoodAnalysis | null;
  isLoading: boolean;
  isAnalysisLoading: boolean;
  addMoodEntry: (mood: string, note?: string) => void;
  isAddingMood: boolean;
  getMoodCountByType: () => Record<string, number>;
  getRecentMoods: (count: number) => MoodEntry[];
  getMoodsByMonth: (year: number, month: number) => MoodEntry[];
};

export const MoodContext = createContext<MoodContextType | null>(null);

export function MoodProvider({ children }: { children: ReactNode }) {
  const { toast } = useToast();
  const { user } = useAuth();
  
  // Get mood entries
  const { data: moodEntries = [], isLoading } = useQuery<MoodEntry[]>({
    queryKey: ["/api/mood"],
    enabled: !!user,
  });
  
  // Get mood analysis
  const { data: moodAnalysis = null, isLoading: isAnalysisLoading } = useQuery<MoodAnalysis>({
    queryKey: ["/api/mood/analysis"],
    enabled: !!user && moodEntries.length > 0,
  });
  
  // Add mood entry mutation
  const addMoodEntryMutation = useMutation({
    mutationFn: async ({ mood, note }: { mood: string, note?: string }) => {
      const res = await apiRequest("POST", "/api/mood", { mood, note });
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/mood"] });
      queryClient.invalidateQueries({ queryKey: ["/api/mood/analysis"] });
      toast({
        title: "Mood recorded",
        description: "Thank you for checking in today!",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to record mood",
        description: error.message,
        variant: "destructive",
      });
    },
  });
  
  const addMoodEntry = (mood: string, note?: string) => {
    addMoodEntryMutation.mutate({ mood, note });
  };
  
  const getMoodCountByType = (): Record<string, number> => {
    return moodEntries.reduce((counts: Record<string, number>, entry) => {
      counts[entry.mood] = (counts[entry.mood] || 0) + 1;
      return counts;
    }, {});
  };
  
  const getRecentMoods = (count: number): MoodEntry[] => {
    return [...moodEntries]
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, count);
  };
  
  const getMoodsByMonth = (year: number, month: number): MoodEntry[] => {
    return moodEntries.filter(entry => {
      const entryDate = new Date(entry.date);
      return entryDate.getFullYear() === year && entryDate.getMonth() === month;
    });
  };
  
  return (
    <MoodContext.Provider
      value={{
        moodEntries,
        moodAnalysis,
        isLoading,
        isAnalysisLoading,
        addMoodEntry,
        isAddingMood: addMoodEntryMutation.isPending,
        getMoodCountByType,
        getRecentMoods,
        getMoodsByMonth,
      }}
    >
      {children}
    </MoodContext.Provider>
  );
}

export function useMood() {
  const context = useContext(MoodContext);
  if (!context) {
    throw new Error("useMood must be used within a MoodProvider");
  }
  return context;
}
