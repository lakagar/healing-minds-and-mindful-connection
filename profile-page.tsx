import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useAuth } from "@/hooks/use-auth";
import { useLanguage } from "@/hooks/use-language";
import { useTheme } from "next-themes";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import LanguageSelector from "@/components/LanguageSelector";
import ThemeToggle from "@/components/ThemeToggle";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Loader2, User, Settings, Calendar, Shield, LogOut } from "lucide-react";

// Profile update schema
const profileSchema = z.object({
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  email: z.string().email().optional(),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

export default function ProfilePage() {
  const { t } = useTranslation();
  const { user, isLoading, updateUserMutation, logoutMutation } = useAuth();
  const { language, setLanguage } = useLanguage();
  const { theme, setTheme } = useTheme();
  const [activeTab, setActiveTab] = useState("profile");
  
  const [_, navigate] = useLocation();
  
  useEffect(() => {
    // Set page title
    document.title = `${t("profile.title")} | ${t("app.name")}`;
  }, [t]);
  
  const profileForm = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      firstName: user?.firstName || "",
      lastName: user?.lastName || "",
      email: user?.email || "",
    },
  });
  
  // Update form values when user data changes
  useEffect(() => {
    if (user) {
      profileForm.reset({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        email: user.email || "",
      });
    }
  }, [user, profileForm]);
  
  const onSubmit = (data: ProfileFormValues) => {
    updateUserMutation.mutate(data);
  };
  
  const handleLogout = () => {
    logoutMutation.mutate();
    navigate("/auth");
  };
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }
  
  if (!user) {
    return <div>No user data available</div>;
  }
  
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-grow bg-blue-50 dark:bg-gray-900">
        <div className="container mx-auto max-w-6xl px-4 py-8">
          <div className="text-center mb-8">
            <h1 className="font-montserrat font-bold text-3xl md:text-4xl text-primary-dark dark:text-primary mb-4">
              {t("profile.title")}
            </h1>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-[250px_1fr] gap-8">
            {/* Profile Sidebar */}
            <div className="space-y-4">
              <Card>
                <CardContent className="p-6">
                  <div className="flex flex-col items-center text-center">
                    <div className="h-24 w-24 bg-primary/20 rounded-full flex items-center justify-center text-primary text-2xl font-bold mb-4">
                      {user.firstName?.charAt(0) || ''}{user.lastName?.charAt(0) || ''}
                      {!user.firstName && !user.lastName && user.username.substring(0, 2).toUpperCase()}
                    </div>
                    <h2 className="text-xl font-semibold">
                      {user.firstName} {user.lastName}
                    </h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400">@{user.username}</p>
                  </div>
                </CardContent>
              </Card>
              
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
                <div className="divide-y divide-gray-200 dark:divide-gray-700">
                  <button 
                    className={`w-full flex items-center px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${activeTab === "profile" ? "bg-blue-50 dark:bg-blue-900/20 text-primary" : ""}`}
                    onClick={() => setActiveTab("profile")}
                  >
                    <User className="h-5 w-5 mr-3" />
                    <span>Personal Information</span>
                  </button>
                  
                  <button 
                    className={`w-full flex items-center px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${activeTab === "preferences" ? "bg-blue-50 dark:bg-blue-900/20 text-primary" : ""}`}
                    onClick={() => setActiveTab("preferences")}
                  >
                    <Settings className="h-5 w-5 mr-3" />
                    <span>Preferences</span>
                  </button>
                  
                  <button 
                    className={`w-full flex items-center px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${activeTab === "sessions" ? "bg-blue-50 dark:bg-blue-900/20 text-primary" : ""}`}
                    onClick={() => setActiveTab("sessions")}
                  >
                    <Calendar className="h-5 w-5 mr-3" />
                    <span>Session History</span>
                  </button>
                  
                  <button 
                    className={`w-full flex items-center px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${activeTab === "security" ? "bg-blue-50 dark:bg-blue-900/20 text-primary" : ""}`}
                    onClick={() => setActiveTab("security")}
                  >
                    <Shield className="h-5 w-5 mr-3" />
                    <span>Security</span>
                  </button>
                  
                  <button 
                    className="w-full flex items-center px-4 py-3 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                    onClick={handleLogout}
                  >
                    <LogOut className="h-5 w-5 mr-3" />
                    <span>Logout</span>
                  </button>
                </div>
              </div>
            </div>
            
            {/* Content Area */}
            <div>
              {activeTab === "profile" && (
                <Card>
                  <CardHeader>
                    <CardTitle>{t("profile.personalInfo")}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Form {...profileForm}>
                      <form onSubmit={profileForm.handleSubmit(onSubmit)} className="space-y-6">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <FormField
                            control={profileForm.control}
                            name="firstName"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>{t("auth.firstName")}</FormLabel>
                                <FormControl>
                                  <Input {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={profileForm.control}
                            name="lastName"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>{t("auth.lastName")}</FormLabel>
                                <FormControl>
                                  <Input {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                        
                        <FormField
                          control={profileForm.control}
                          name="email"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>{t("auth.email")}</FormLabel>
                              <FormControl>
                                <Input {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <Button 
                          type="submit" 
                          disabled={updateUserMutation.isPending}
                        >
                          {updateUserMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                          {t("profile.updateInfo")}
                        </Button>
                      </form>
                    </Form>
                  </CardContent>
                </Card>
              )}
              
              {activeTab === "preferences" && (
                <Card>
                  <CardHeader>
                    <CardTitle>Preferences</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div>
                      <h3 className="text-lg font-medium mb-4">{t("profile.language")}</h3>
                      <LanguageSelector variant="buttons" />
                    </div>
                    
                    <Separator />
                    
                    <div>
                      <h3 className="text-lg font-medium mb-4">{t("profile.theme")}</h3>
                      <ThemeToggle variant="buttons" />
                    </div>
                  </CardContent>
                </Card>
              )}
              
              {activeTab === "sessions" && (
                <Card>
                  <CardHeader>
                    <CardTitle>{t("profile.sessions")}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                      <Calendar className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                      <p>{t("profile.noSessions")}</p>
                    </div>
                  </CardContent>
                </Card>
              )}
              
              {activeTab === "security" && (
                <Card>
                  <CardHeader>
                    <CardTitle>Security</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div>
                      <h3 className="text-lg font-medium mb-4">Change Password</h3>
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="current-password">Current Password</Label>
                          <Input id="current-password" type="password" />
                        </div>
                        <div>
                          <Label htmlFor="new-password">New Password</Label>
                          <Input id="new-password" type="password" />
                        </div>
                        <div>
                          <Label htmlFor="confirm-password">Confirm New Password</Label>
                          <Input id="confirm-password" type="password" />
                        </div>
                        <Button>Change Password</Button>
                      </div>
                    </div>
                    
                    <Separator />
                    
                    <div>
                      <h3 className="text-lg font-medium mb-4">Two-Factor Authentication</h3>
                      <p className="text-gray-600 dark:text-gray-300 mb-4">
                        Add an extra layer of security to your account by enabling two-factor authentication.
                      </p>
                      <Button variant="outline">Enable 2FA</Button>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}

// Add missing import for useLocation
import { useLocation } from "wouter";
