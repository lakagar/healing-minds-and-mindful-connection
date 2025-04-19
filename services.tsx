import { useTranslation } from "react-i18next";
import { Link } from "wouter";
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";

export default function Services() {
  const { t } = useTranslation();
  
  const services = [
    {
      icon: "user-doctor",
      title: t("services.individual.title"),
      description: t("services.individual.description"),
      features: [
        t("services.individual.feature1"),
        t("services.individual.feature2"),
        t("services.individual.feature3")
      ],
      cta: t("services.individual.cta"),
      href: "/counseling"
    },
    {
      icon: "users",
      title: t("services.group.title"),
      description: t("services.group.description"),
      features: [
        t("services.group.feature1"),
        t("services.group.feature2"),
        t("services.group.feature3")
      ],
      cta: t("services.group.cta"),
      href: "/group-sessions"
    },
    {
      icon: "spa",
      title: t("services.meditation.title"),
      description: t("services.meditation.description"),
      features: [
        t("services.meditation.feature1"),
        t("services.meditation.feature2"),
        t("services.meditation.feature3")
      ],
      cta: t("services.meditation.cta"),
      href: "/#meditations"
    },
    {
      icon: "toolbox",
      title: t("services.tools.title"),
      description: t("services.tools.description"),
      features: [
        t("services.tools.feature1"),
        t("services.tools.feature2"),
        t("services.tools.feature3")
      ],
      cta: t("services.tools.cta"),
      href: "/mood-tracker"
    },
    {
      icon: "robot",
      title: t("services.ai.title"),
      description: t("services.ai.description"),
      features: [
        t("services.ai.feature1"),
        t("services.ai.feature2"),
        t("services.ai.feature3")
      ],
      cta: t("services.ai.cta"),
      href: "/#chat"
    },
    {
      icon: "pills",
      title: t("services.medication.title"),
      description: t("services.medication.description"),
      features: [
        t("services.medication.feature1"),
        t("services.medication.feature2"),
        t("services.medication.feature3")
      ],
      cta: t("services.medication.cta"),
      href: "/medicine"
    }
  ];
  
  // These icons correspond to the icon names used in the services array
  const iconComponents: Record<string, JSX.Element> = {
    "user-doctor": (
      <svg xmlns="http://www.w3.org/2000/svg" className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
    "users": (
      <svg xmlns="http://www.w3.org/2000/svg" className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
    ),
    "spa": (
      <svg xmlns="http://www.w3.org/2000/svg" className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14.121 14.121L19 19m-7-7l7-7m-7 7l-2.879 2.879M12 12L9.121 9.121m0 5.758a3 3 0 10-4.243 4.243 3 3 0 004.243-4.243zm0-5.758a3 3 0 10-4.243-4.243 3 3 0 004.243 4.243z" />
      </svg>
    ),
    "toolbox": (
      <svg xmlns="http://www.w3.org/2000/svg" className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 react";
import { useTranslation } from "react-i18next";
import { useMood } from "@/hooks/use-mood";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";
import { Loader2 } from "lucide-react";

type MoodOption = {
  value: string;
  label: string;
  emoji: string;
  color: string;
};

export default function MoodTracker() {
  const { t } = useTranslation();
  const { moodEntries, moodAnalysis, isLoading, isAnalysisLoading, addMoodEntry, isAddingMood, getMoodCountByType } = useMood();
  
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [note, setNote] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);
  const [activeTab, setActiveTab] = useState("track");
  
  const moodOptions: MoodOption[] = [
    { value: "happy", label: t("mood.happy"), emoji: "😊", color: "#4CAF50" },
    { value: "calm", label: t("mood.calm"), emoji: "😌", color: "#2196F3" },
    { value: "tired", label: t("mood.tired"), emoji: "😴", color: "#9C27B0" },
    { value: "anxious", label: t("mood.anxious"), emoji: "😰", color: "#FF9800" },
    { value: "sad", label: t("mood.sad"), emoji: "😢", color: "#03A9F4" },
    { value: "angry", label: t("mood.angry"), emoji: "😠", color: "#F44336" }
  ];

  const handleMoodSelection = (mood: string) => {
    setSelectedMood(mood);
  };

  const handleSaveMood = () => {
    if (selectedMood) {
      addMoodEntry(selectedMood, note);
      setNote("");
      setSelectedMood(null);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    }
  };
  
  // Generate chart data
  const moodCounts = getMoodCountByType();
  const pieChartData = moodOptions.map(option => ({
    name: option.label,
    value: moodCounts[option.value] || 0,
    color: option.color
  })).filter(item => item.value > 0);
  
  const lineChartData = moodEntries
    .slice(-14) // Last 14 entries
    .map(entry => {
      const moodOption = moodOptions.find(option => option.value === entry.mood);
      return {
        date: format(new Date(entry.date), 'MMM dd'),
        mood: entry.mood,
        value: moodOptions.findIndex(option => option.value === entry.mood) + 1,
        color: moodOption?.color
      };
    })
    .reverse();
  
  const renderCalendarDay = (date: Date) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    const entriesForDay = moodEntries.filter(entry => 
      format(new Date(entry.date), 'yyyy-MM-dd') === dateStr
    );
    
    if (entriesForDay.length === 0) return null;
    
    const latestEntry = entriesForDay[entriesForDay.length - 1];
    const moodOption = moodOptions.find(option => option.value === latestEntry.mood);
    
    if (!moodOption) return null;
    
    return (
      <div 
        className="w-full h-full flex items-center justify-center rounded-full" 
        style={{ backgroundColor: `${moodOption.color}30` }}
      >
        <span className="text-xs">{moodOption.emoji}</span>
      </div>
    );
  };
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-6xl py-8">
      <div className="text-center mb-8">
        <h2 className="font-montserrat font-bold text-3xl md:text-4xl text-primary-dark dark:text-primary mb-4">{t("mood.title")}</h2>
        <p className="text-neutral-dark dark:text-gray-300 max-w-2xl mx-auto">{t("mood.description")}</p>
      </div>
      
      <Tabs defaultValue="track" onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-3 mb-8">
          <TabsTrigger value="track">Track Mood</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
          <TabsTrigger value="insights">Insights</TabsTrigger>
        </TabsList>
        
        {/* Track Mood Tab */}
        <TabsContent value="track">
          <Card>
            <CardContent className="pt-6">
              <h3 className="font-montserrat font-semibold text-xl mb-6 text-primary-dark dark:text-primary">{t("mood.question")}</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
                {moodOptions.map((mood) => (
                  <Button
                    key={mood.value}
                    variant={selectedMood === mood.value ? "default" : "outline"}
                    className={`h-24 flex flex-col items-center justify-center ${selectedMood === mood.value ? "" : "hover:bg-secondary/20"}`}
                    onClick={() => handleMoodSelection(mood.value)}
                  >
                    <span className="text-3xl mb-2">{mood.emoji}</span>
                    <span className="font-medium text-sm">{mood.label}</span>
                  </Button>
                ))}
              </div>
              
              <div className="mb-6">
                <label htmlFor="moodNotes" className="block text-sm font-medium text-neutral-dark dark:text-gray-300 mb-2">
                  {t("mood.notes")}
                </label>
                <Textarea
                  id="moodNotes"
                  rows={4}
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  className="w-full"
                />
              </div>
              
              <Button 
                onClick={handleSaveMood} 
                disabled={!selectedMood || isAddingMood}
                className="w-full md:w-auto"
              >
                {isAddingMood && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {t("mood.save")}
              </Button>
              
              {showSuccess && (
                <Alert className="mt-4 bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-300 border-green-200 dark:border-green-900">
                  <AlertDescription>{t("mood.saved")}</AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* History Tab */}
        <TabsContent value="history">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>{t("mood.history")}</CardTitle>
              </CardHeader>
              <CardContent>
                <Calendar 
                  mode="single"
                  selected={new Date()}
                  className="rounded-md border"
                  components={{
                    DayContent: ({ date }) => renderCalendarDay(date)
                  }}
                />
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>{t("mood.trends")}</CardTitle>
              </CardHeader>
              <CardContent>
                {lineChartData.length > 0 ? (
                  <ResponsiveContainer width="100%" height={250}>
                    <LineChart data={lineChartData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#ccc" />
                      <XAxis dataKey="date" />
                      <YAxis 
                        domain={[0, moodOptions.length + 1]}
                        ticks={moodOptions.map((_, i) => i + 1)}
                        tickFormatter={(value) => {
                          const option = moodOptions[value - 1];
                          return option ? option.emoji : '';
                        }}
                      />
                      <Tooltip 
                        formatter={(value, name, props) => {
                          const option = moodOptions.find(o => o.value === props.payload.mood);
                          return [option?.label || '', ''];
                        }}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="value" 
                        stroke="#5C6BC0" 
                        strokeWidth={2} 
                        dot={{ fill: "#5C6BC0", strokeWidth: 2, r: 6 }}
                        activeDot={{ r: 8 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-48 bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 flex items-center justify-center">
                    <p className="text-center text-neutral-dark dark:text-gray-300">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mx-auto mb-2 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      {t("mood.visualization")}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        {/* Insights Tab */}
        <TabsContent value="insights">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Mood Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                {pieChartData.length > 0 ? (
                  <ResponsiveContainer width="100%" height={250}>
                    <PieChart>
                      <Pie
                        data={pieChartData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {pieChartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Legend />
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-48 bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 flex items-center justify-center">
                    <p className="text-center text-neutral-dark dark:text-gray-300">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mx-auto mb-2 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                      </svg>
                      No mood data to display yet
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>AI Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                {isAnalysisLoading ? (
                  <div className="flex justify-center items-center h-48">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  </div>
                ) : moodAnalysis ? (
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium text-primary-dark dark:text-primary mb-2">Summary</h4>
                      <p className="text-sm text-neutral-dark dark:text-gray-300">{moodAnalysis.summary}</p>
                    </div>
                    
                    {moodAnalysis.insights.length > 0 && (
                      <div>
                        <h4 className="font-medium text-primary-dark dark:text-primary mb-2">Insights</h4>
                        <ul className="list-disc pl-5 space-y-1">
                          {moodAnalysis.insights.map((insight, index) => (
                            <li key={index} className="text-sm text-neutral-dark dark:text-gray-300">{insight}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                    
                    {moodAnalysis.suggestions.length > 0 && (
                      <div>
                        <h4 className="font-medium text-primary-dark dark:text-primary mb-2">Suggestions</h4>
                        <ul className="list-disc pl-5 space-y-1">
                          {moodAnalysis.suggestions.map((suggestion, index) => (
                            <li key={index} className="text-sm text-neutral-dark dark:text-gray-300">{suggestion}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="h-48 bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 flex items-center justify-center">
                    <p className="text-center text-neutral-dark dark:text-gray-300">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mx-auto mb-2 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Not enough data to analyze mood patterns yet
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
