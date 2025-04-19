import { useState, useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useAuth } from "@/hooks/use-auth";
import { apiRequest } from "@/lib/queryClient";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { AlertCircle, Send, User, Bot } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

type Message = {
  id: string;
  type: "user" | "bot";
  content: string;
  timestamp: Date;
};

export default function ChatBot() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const { toast } = useToast();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      type: "bot",
      content: t("chat.greeting"),
      timestamp: new Date(),
    },
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  
  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!inputMessage.trim()) return;
    
    const userMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      content: inputMessage,
      timestamp: new Date(),
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInputMessage("");
    setIsLoading(true);
    
    try {
      const response = await apiRequest("POST", "/api/chat", { message: inputMessage });
      const data = await response.json();
      
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: "bot",
        content: data.response,
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });
      console.error("Chat error:", error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  
  return (
    <Card className="w-full max-w-4xl mx-auto shadow-lg">
      <CardHeader className="bg-primary-dark text-white dark:bg-primary py-4 px-6">
        <CardTitle className="flex items-center">
          <Bot className="w-6 h-6 mr-3" />
          <div>
            <h3 className="font-medium">{t("chat.assistant")}</h3>
            <p className="text-xs opacity-80">{t("chat.alwaysHere")}</p>
          </div>
        </CardTitle>
      </CardHeader>
      
      <ScrollArea className="h-96 p-4 bg-blue-50 dark:bg-gray-800/20">
        <div className="space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.type === "user" ? "justify-end" : ""}`}
            >
              {message.type === "bot" && (
                <div className="w-8 h-8 rounded-full bg-primary-dark dark:bg-primary flex items-center justify-center mr-2 flex-shrink-0">
                  <Bot className="text-white w-4 h-4" />
                </div>
              )}
              <div
                className={`py-2 px-4 rounded-lg shadow-sm max-w-[80%] ${
                  message.type === "user"
                    ? "bg-primary-light text-white dark:bg-primary"
                    : "bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200"
                }`}
              >
                <p>{message.content}</p>
                <div className="text-xs mt-1 opacity-70 text-right">
                  {formatTime(message.timestamp)}
                </div>
              </div>
              {message.type === "user" && (
                <div className="w-8 h-8 rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center ml-2 flex-shrink-0">
                  <User className="text-white w-4 h-4" />
                </div>
              )}
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>
      
      <CardContent className="p-4 border-t border-gray-200 dark:border-gray-700">
        <form onSubmit={handleSubmit} className="flex items-center">
          <Input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder={t("chat.placeholder")}
            className="flex-grow"
            disabled={isLoading}
          />
          <Button 
            type="submit" 
            className="ml-2" 
            disabled={isLoading || !inputMessage.trim()}
          >
            <Send className="h-4 w-4" />
          </Button>
        </form>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 flex items-center">
          <AlertCircle className="h-3 w-3 mr-1" />
          {t("chat.privacy")}
        </p>
      </CardContent>
    </Card>
  );
}
