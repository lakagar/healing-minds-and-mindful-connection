import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useAuth } from "@/hooks/use-auth";
import { useLocation } from "wouter";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertUserSchema } from "@shared/schema";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, Check } from "lucide-react";
import { FaGoogle, FaApple } from "react-icons/fa";

// Login schema
const loginSchema = z.object({
  username: z.string().min(1, { message: "Username is required" }),
  password: z.string().min(1, { message: "Password is required" }),
  rememberMe: z.boolean().optional(),
});

// Registration schema
const registrationSchema = insertUserSchema.extend({
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
  confirmPassword: z.string(),
  terms: z.boolean().refine(val => val === true, {
    message: "You must accept the terms and conditions",
  }),
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

type LoginFormValues = z.infer<typeof loginSchema>;
type RegistrationFormValues = z.infer<typeof registrationSchema>;

export default function AuthPage() {
  const { t } = useTranslation();
  const [_, navigate] = useLocation();
  const { user, loginMutation, registerMutation } = useAuth();
  const [activeTab, setActiveTab] = useState<string>("login");
  
  // Redirect if user is already logged in
  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user, navigate]);
  
  // Login form
  const loginForm = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
      rememberMe: false,
    },
  });
  
  // Registration form
  const registrationForm = useForm<RegistrationFormValues>({
    resolver: zodResolver(registrationSchema),
    defaultValues: {
      username: "",
      password: "",
      confirmPassword: "",
      firstName: "",
      lastName: "",
      email: "",
      terms: false,
    },
  });
  
  const onLoginSubmit = (data: LoginFormValues) => {
    loginMutation.mutate({
      username: data.username,
      password: data.password,
    });
  };
  
  const onRegisterSubmit = (data: RegistrationFormValues) => {
    const { confirmPassword, terms, ...userData } = data;
    registerMutation.mutate(userData);
  };
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-blue-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl w-full">
        <Card className="overflow-hidden shadow-xl">
          <div className="flex flex-col md:flex-row">
            <div className="md:w-1/2 bg-primary-dark dark:bg-primary p-8 text-white flex flex-col justify-center">
              <h1 className="font-montserrat font-bold text-3xl mb-6">{t("auth.welcomeBack")}</h1>
              <p className="mb-6">Sign in to continue your mental health journey. Your well-being is our priority.</p>
              <div className="mb-6">
                <div className="flex items-center mb-4">
                  <Check className="text-green-300 mr-3 h-5 w-5" />
                  <span>Access your personalized therapy tools</span>
                </div>
                <div className="flex items-center mb-4">
                  <Check className="text-green-300 mr-3 h-5 w-5" />
                  <span>Track your progress and insights</span>
                </div>
                <div className="flex items-center">
                  <Check className="text-green-300 mr-3 h-5 w-5" />
                  <span>Connect with your support network</span>
                </div>
              </div>
              <div className="mt-auto">
                <p className="text-sm text-white/80">
                  {activeTab === "login" ? t("auth.dontHaveAccount") : t("auth.alreadyHaveAccount")}
                </p>
                <Button 
                  variant="outline" 
                  className="mt-2 text-white border-white hover:bg-white/10"
                  onClick={() => setActiveTab(activeTab === "login" ? "register" : "login")}
                >
                  {activeTab === "login" ? t("auth.createAccount") : t("auth.signin")}
                </Button>
              </div>
            </div>
            
            <div className="md:w-1/2 p-8">
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid grid-cols-2 mb-8">
                  <TabsTrigger value="login">{t("auth.login")}</TabsTrigger>
                  <TabsTrigger value="register">{t("auth.register")}</TabsTrigger>
                </TabsList>
                
                {/* Login Tab */}
                <TabsContent value="login">
                  <Form {...loginForm}>
                    <form onSubmit={loginForm.handleSubmit(onLoginSubmit)} className="space-y-4">
                      <FormField
                        control={loginForm.control}
                        name="username"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{t("auth.username")}</FormLabel>
                            <FormControl>
                              <Input placeholder="Your username" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={loginForm.control}
                        name="password"
                        render={({ field }) => (
                          <FormItem>
                            <div className="flex justify-between items-center">
                              <FormLabel>{t("auth.password")}</FormLabel>
                              <a href="#forgot" className="text-xs text-primary hover:underline">
                                {t("auth.forgotPassword")}
                              </a>
                            </div>
                            <FormControl>
                              <Input type="password" placeholder="Your password" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={loginForm.control}
                        name="rememberMe"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                            <FormControl>
                              <Checkbox 
                                checked={field.value} 
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                            <div className="space-y-1 leading-none">
                              <FormLabel className="text-sm font-normal">
                                {t("auth.rememberMe")}
                              </FormLabel>
                            </div>
                          </FormItem>
                        )}
                      />
                      
                      <Button 
                        type="submit" 
                        className="w-full" 
                        disabled={loginMutation.isPending}
                      >
                        {loginMutation.isPending && (
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        )}
                        {t("auth.signin")}
                      </Button>
                    </form>
                  </Form>
                  
                  <div className="mt-6">
                    <div className="relative flex items-center justify-center">
                      <div className="border-t border-gray-300 dark:border-gray-600 flex-grow"></div>
                      <span className="mx-4 text-sm text-gray-500 dark:text-gray-400">{t("auth.orContinueWith")}</span>
                      <div className="border-t border-gray-300 dark:border-gray-600 flex-grow"></div>
                    </div>
                    
                    <div className="flex gap-4 mt-4">
                      <Button variant="outline" className="flex-1">
                        <FaGoogle className="text-red-500 mr-2" />
                        Google
                      </Button>
                      <Button variant="outline" className="flex-1">
                        <FaApple className="mr-2" />
                        Apple
                      </Button>
                    </div>
                  </div>
                </TabsContent>
                
                {/* Register Tab */}
                <TabsContent value="register">
                  <Form {...registrationForm}>
                    <form onSubmit={registrationForm.handleSubmit(onRegisterSubmit)} className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <FormField
                          control={registrationForm.control}
                          name="firstName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>{t("auth.firstName")}</FormLabel>
                              <FormControl>
                                <Input placeholder="First Name" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={registrationForm.control}
                          name="lastName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>{t("auth.lastName")}</FormLabel>
                              <FormControl>
                                <Input placeholder="Last Name" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      
                      <FormField
                        control={registrationForm.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{t("auth.email")}</FormLabel>
                            <FormControl>
                              <Input type="email" placeholder="Your email" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={registrationForm.control}
                        name="username"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{t("auth.username")}</FormLabel>
                            <FormControl>
                              <Input placeholder="Username" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={registrationForm.control}
                        name="password"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{t("auth.password")}</FormLabel>
                            <FormControl>
                              <Input type="password" placeholder="Create password" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={registrationForm.control}
                        name="confirmPassword"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{t("auth.confirmPassword")}</FormLabel>
                            <FormControl>
                              <Input type="password" placeholder="Confirm password" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={registrationForm.control}
                        name="terms"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                            <FormControl>
                              <Checkbox 
                                checked={field.value} 
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                            <div className="space-y-1 leading-none">
                              <FormLabel className="text-sm font-normal">
                                I agree to the <a href="#terms" className="text-primary hover:underline">Terms of Service</a> and <a href="#privacy" className="text-primary hover:underline">Privacy Policy</a>
                              </FormLabel>
                              <FormMessage />
                            </div>
                          </FormItem>
                        )}
                      />
                      
                      <Button 
                        type="submit" 
                        className="w-full" 
                        disabled={registerMutation.isPending}
                      >
                        {registerMutation.isPending && (
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        )}
                        {t("auth.createAccount")}
                      </Button>
                    </form>
                  </Form>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
