import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Send,
  Phone,
  Video,
  Info,
  Paperclip,
  MoreVertical,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useVoiceGuidance } from "@/hooks/useVoiceGuidance";

interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  timestamp: Date;
  read: boolean;
  type: "text" | "image" | "location" | "system";
  metadata?: any;
}

interface ChatInterfaceProps {
  recipientId: string;
  recipientName: string;
  recipientAvatar?: string;
  recipientType: "helper" | "hub" | "elderly" | "caregiver";
  initialMessages?: Message[];
  onSendMessage?: (message: string) => void;
  onCallInitiate?: () => void;
  className?: string;
  simplified?: boolean;
}

const ChatInterface = ({
  recipientId,
  recipientName,
  recipientAvatar,
  recipientType,
  initialMessages = [],
  onSendMessage = () => {},
  onCallInitiate = () => {},
  className = "",
  simplified = false,
}: ChatInterfaceProps) => {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [newMessage, setNewMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { speak } = useVoiceGuidance();

  // Mock user ID - in a real app, this would come from authentication
  const currentUserId = "current-user-id";

  useEffect(() => {
    // Scroll to bottom whenever messages change
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Mock function to simulate receiving a message
  useEffect(() => {
    if (initialMessages.length === 0) {
      // Add a welcome message if no initial messages
      const welcomeMessage: Message = {
        id: `system-${Date.now()}`,
        senderId: recipientId,
        receiverId: currentUserId,
        content: `Hello! This is ${recipientName}. How can I assist you today?`,
        timestamp: new Date(),
        read: true,
        type: "system",
      };
      setMessages([welcomeMessage]);
    }
  }, [initialMessages, recipientId, recipientName, currentUserId]);

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;

    const message: Message = {
      id: `msg-${Date.now()}`,
      senderId: currentUserId,
      receiverId: recipientId,
      content: newMessage,
      timestamp: new Date(),
      read: false,
      type: "text",
    };

    setMessages((prev) => [...prev, message]);
    onSendMessage(newMessage);
    setNewMessage("");

    // Simulate recipient typing
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      // Simulate a response
      const response: Message = {
        id: `msg-${Date.now() + 1}`,
        senderId: recipientId,
        receiverId: currentUserId,
        content:
          recipientType === "hub"
            ? "Thank you for your message. A staff member will assist you shortly."
            : "I've received your message and will respond as soon as possible.",
        timestamp: new Date(),
        read: true,
        type: "text",
      };
      setMessages((prev) => [...prev, response]);
      speak(`New message from ${recipientName}`, true);
    }, 2000);
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const renderMessageBubble = (message: Message) => {
    const isCurrentUser = message.senderId === currentUserId;
    const bubbleClass = isCurrentUser
      ? "bg-primary text-primary-foreground ml-auto"
      : "bg-muted text-muted-foreground mr-auto";

    return (
      <div
        key={message.id}
        className={`flex flex-col max-w-[80%] ${isCurrentUser ? "items-end" : "items-start"} mb-4`}
      >
        <div className="flex items-center gap-2 mb-1">
          {!isCurrentUser && (
            <Avatar className="h-6 w-6">
              <AvatarImage src={recipientAvatar} alt={recipientName} />
              <AvatarFallback>
                {recipientName.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
          )}
          <span className="text-xs text-gray-500">
            {isCurrentUser ? "You" : recipientName},{" "}
            {formatTime(message.timestamp)}
          </span>
        </div>
        <div
          className={`rounded-lg py-2 px-3 ${bubbleClass} ${message.type === "system" ? "italic bg-gray-100 text-gray-700" : ""}`}
        >
          {message.content}
        </div>
      </div>
    );
  };

  return (
    <Card className={`w-full ${className}`}>
      <CardHeader className="p-4 border-b">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarImage src={recipientAvatar} alt={recipientName} />
              <AvatarFallback>
                {recipientName.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-lg">{recipientName}</CardTitle>
              <div className="flex items-center">
                <span className="text-xs text-gray-500">
                  {recipientType.charAt(0).toUpperCase() +
                    recipientType.slice(1)}
                </span>
                <Badge
                  variant="outline"
                  className="ml-2 bg-green-100 text-green-800 text-xs"
                >
                  Online
                </Badge>
              </div>
            </div>
          </div>
          {!simplified && (
            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={onCallInitiate}
                aria-label="Voice call"
              >
                <Phone className="h-5 w-5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={onCallInitiate}
                aria-label="Video call"
              >
                <Video className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" aria-label="Information">
                <Info className="h-5 w-5" />
              </Button>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea className="h-[400px] p-4">
          <div className="flex flex-col">
            {messages.map(renderMessageBubble)}
            {isTyping && (
              <div className="flex items-center gap-1 text-gray-500 text-sm mb-4">
                <Avatar className="h-6 w-6">
                  <AvatarImage src={recipientAvatar} alt={recipientName} />
                  <AvatarFallback>
                    {recipientName.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <span>{recipientName} is typing...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>
        <div className="p-4 border-t flex gap-2 items-center">
          {!simplified && (
            <Button variant="ghost" size="icon" aria-label="Attach file">
              <Paperclip className="h-5 w-5" />
            </Button>
          )}
          <Input
            placeholder="Type your message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={handleKeyPress}
            className="flex-1"
          />
          <Button
            onClick={handleSendMessage}
            disabled={!newMessage.trim()}
            aria-label="Send message"
          >
            <Send className="h-5 w-5" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ChatInterface;
