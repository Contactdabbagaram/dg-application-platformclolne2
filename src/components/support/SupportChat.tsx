import { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Send, 
  Volume2, 
  VolumeX, 
  User, 
  Bot, 
  Clock,
  ThumbsUp,
  ThumbsDown,
  Sparkles
} from 'lucide-react';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot' | 'agent';
  timestamp: Date;
  isTyping?: boolean;
  buttons?: Array<{ text: string; action: string }>;
  helpful?: boolean | null;
}

interface SupportChatProps {
  selectedCategory: string | null;
}

export const SupportChat = ({ selectedCategory }: SupportChatProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [waitingForAgent, setWaitingForAgent] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (selectedCategory) {
      const greetingMessage = getCategoryGreeting(selectedCategory);
      setMessages([greetingMessage]);
    }
  }, [selectedCategory]);

  const getCategoryGreeting = (category: string): Message => {
    const greetings = {
      'order-issue': {
        text: "Hi there! 👋 I'm DabbaBot, your AI assistant. I'm here to help resolve your order issue quickly. Could you please share your order ID or describe what happened?",
        buttons: [
          { text: "🚫 Order not received", action: "order_not_received" },
          { text: "❌ Wrong items", action: "wrong_items" },
          { text: "🍽️ Food quality issue", action: "quality_issue" }
        ]
      },
      'delivery-delay': {
        text: "I understand you're concerned about a delayed order. Let me check the status and provide you with an immediate update! ⏰",
        buttons: [
          { text: "📍 Where is my order?", action: "track_order" },
          { text: "❌ Cancel order", action: "cancel_order" },
          { text: "⏱️ Get ETA update", action: "eta_update" }
        ]
      },
      'payment': {
        text: "I'm here to help with payment and billing issues. What seems to be the problem? 💳",
        buttons: [
          { text: "💰 Refund request", action: "refund" },
          { text: "⚠️ Payment failed", action: "payment_failed" },
          { text: "🔄 Double charged", action: "double_charge" }
        ]
      },
      'feedback': {
        text: "Thank you for wanting to share feedback! Your opinion helps us improve our service. What would you like to tell us? ⭐",
        buttons: [
          { text: "😊 Great experience", action: "positive_feedback" },
          { text: "💡 Suggestion", action: "suggestion" },
          { text: "😔 Complaint", action: "complaint" }
        ]
      },
      'track-order': {
        text: "I'll help you track your order in real-time! Please provide your order ID or phone number. 📦",
        buttons: [
          { text: "🔢 Enter order ID", action: "enter_order_id" },
          { text: "📱 Use phone number", action: "use_phone" }
        ]
      },
      'general': {
        text: "Hello! I'm DabbaBot, your friendly AI assistant. How can I help you today? ✨",
        buttons: [
          { text: "🕐 Store hours", action: "store_hours" },
          { text: "🍽️ Menu questions", action: "menu_info" },
          { text: "👨‍💼 Talk to agent", action: "human_agent" }
        ]
      }
    };

    return {
      id: Date.now().toString(),
      text: greetings[category as keyof typeof greetings]?.text || greetings.general.text,
      sender: 'bot',
      timestamp: new Date(),
      buttons: greetings[category as keyof typeof greetings]?.buttons || greetings.general.buttons
    };
  };

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    setTimeout(() => {
      const botResponse = generateBotResponse(inputValue);
      setMessages(prev => [...prev, botResponse]);
      setIsTyping(false);
    }, 1500);
  };

  const generateBotResponse = (userInput: string): Message => {
    const input = userInput.toLowerCase();
    
    if (input.includes('agent') || input.includes('human') || input.includes('talk')) {
      setWaitingForAgent(true);
      return {
        id: Date.now().toString(),
        text: "I'm connecting you with a human agent. Please wait while I find someone to help you... 🔄",
        sender: 'bot',
        timestamp: new Date()
      };
    }

    if (input.includes('cancel') || input.includes('refund')) {
      return {
        id: Date.now().toString(),
        text: "I understand you want to cancel your order. For orders placed within the last 5 minutes, I can help with immediate cancellation. Otherwise, let me connect you with our team. 💼",
        sender: 'bot',
        timestamp: new Date(),
        buttons: [
          { text: "❌ Cancel recent order", action: "cancel_recent" },
          { text: "💰 Request refund", action: "request_refund" },
          { text: "👨‍💼 Talk to agent", action: "human_agent" }
        ]
      };
    }

    if (input.includes('track') || input.includes('where') || input.includes('status')) {
      return {
        id: Date.now().toString(),
        text: "Let me help you track your order. Here's the current status based on our records: 📍",
        sender: 'bot',
        timestamp: new Date(),
        buttons: [
          { text: "🔍 View detailed tracking", action: "detailed_tracking" },
          { text: "⏰ Get ETA", action: "get_eta" }
        ]
      };
    }

    return {
      id: Date.now().toString(),
      text: "I'm here to help! Could you please provide more details about your issue? You can also choose from the quick options below: ✨",
      sender: 'bot',
      timestamp: new Date(),
      buttons: [
        { text: "📦 Track my order", action: "track_order" },
        { text: "💳 Billing issue", action: "billing" },
        { text: "👨‍💼 Talk to agent", action: "human_agent" }
      ]
    };
  };

  const handleButtonClick = (action: string) => {
    const responses = {
      track_order: "Let me check your order status. Please provide your order ID. 🔍",
      billing: "I'll help you with billing issues. What specific problem are you experiencing? 💳",
      human_agent: "Connecting you with a human agent... 🔄",
      cancel_recent: "I've initiated the cancellation process for your recent order. You'll receive a confirmation shortly. ✅",
      request_refund: "I've submitted your refund request. It will be processed within 3-5 business days. 💰"
    };

    const botMessage: Message = {
      id: Date.now().toString(),
      text: responses[action as keyof typeof responses] || "I'm processing your request... ⚡",
      sender: 'bot',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, botMessage]);

    if (action === 'human_agent') {
      setWaitingForAgent(true);
    }
  };

  const handleFeedback = (messageId: string, helpful: boolean) => {
    setMessages(prev => 
      prev.map(msg => 
        msg.id === messageId ? { ...msg, helpful } : msg
      )
    );
  };

  return (
    <Card className="h-[500px] md:h-[600px] flex flex-col bg-white shadow-sm border">
      <CardHeader className="flex-row items-center justify-between space-y-0 pb-3 border-b">
        <CardTitle className="text-base md:text-lg font-semibold flex items-center gap-2">
          <div className="w-6 h-6 md:w-8 md:h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center">
            <Sparkles className="h-3 w-3 md:h-4 md:w-4 text-white" />
          </div>
          <span className="bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
            DabbaBot AI Assistant
          </span>
        </CardTitle>
        <div className="flex items-center gap-2">
          {waitingForAgent && (
            <Badge variant="secondary" className="animate-pulse bg-blue-100 text-blue-700 text-xs">
              <Clock className="h-3 w-3 mr-1" />
              <span className="hidden sm:inline">Agent joining...</span>
              <span className="sm:hidden">Agent...</span>
            </Badge>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsMuted(!isMuted)}
            className="p-1.5 md:p-2 hover:bg-gray-100 rounded-lg transition-all duration-300"
          >
            {isMuted ? (
              <VolumeX className="h-3 w-3 md:h-4 md:w-4 text-gray-500" />
            ) : (
              <Volume2 className="h-3 w-3 md:h-4 md:w-4 text-blue-600" />
            )}
          </Button>
        </div>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col p-0">
        <div className="flex-1 overflow-y-auto p-3 md:p-4 space-y-3 md:space-y-4">
          {messages.map((message) => (
            <div key={message.id} className={`flex gap-2 md:gap-3 ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
              {message.sender !== 'user' && (
                <div className="w-6 h-6 md:w-8 md:h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center flex-shrink-0 shadow-md">
                  <Bot className="h-3 w-3 md:h-4 md:w-4 text-white" />
                </div>
              )}
              
              <div className={`max-w-[85%] md:max-w-[80%] ${message.sender === 'user' ? 'order-first' : ''}`}>
                <div className={`p-3 md:p-4 rounded-2xl shadow-sm transition-all duration-300 hover:shadow-md ${
                  message.sender === 'user' 
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white ml-auto' 
                    : 'bg-gray-50 text-gray-800 border border-gray-200'
                }`}>
                  <p className="text-xs md:text-sm leading-relaxed">{message.text}</p>
                </div>
                
                {message.buttons && (
                  <div className="mt-2 md:mt-3 flex flex-wrap gap-1.5 md:gap-2">
                    {message.buttons.map((button, index) => (
                      <Button
                        key={index}
                        variant="outline"
                        size="sm"
                        className="text-xs bg-white border border-gray-300 hover:bg-gray-50 hover:scale-105 transition-all duration-300 rounded-lg px-2 py-1 h-auto"
                        onClick={() => handleButtonClick(button.action)}
                      >
                        {button.text}
                      </Button>
                    ))}
                  </div>
                )}

                {message.sender === 'bot' && message.helpful === null && (
                  <div className="mt-2 md:mt-3 flex items-center gap-2">
                    <span className="text-xs text-gray-500">Helpful?</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleFeedback(message.id, true)}
                      className="p-1 h-auto hover:bg-green-100 rounded-lg transition-all duration-300"
                    >
                      <ThumbsUp className="h-3 w-3 text-green-600" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleFeedback(message.id, false)}
                      className="p-1 h-auto hover:bg-red-100 rounded-lg transition-all duration-300"
                    >
                      <ThumbsDown className="h-3 w-3 text-red-600" />
                    </Button>
                  </div>
                )}
              </div>

              {message.sender === 'user' && (
                <div className="w-6 h-6 md:w-8 md:h-8 rounded-full bg-gradient-to-r from-gray-400 to-gray-600 flex items-center justify-center flex-shrink-0 shadow-md">
                  <User className="h-3 w-3 md:h-4 md:w-4 text-white" />
                </div>
              )}
            </div>
          ))}

          {isTyping && (
            <div className="flex gap-2 md:gap-3 justify-start">
              <div className="w-6 h-6 md:w-8 md:h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center shadow-md">
                <Bot className="h-3 w-3 md:h-4 md:w-4 text-white" />
              </div>
              <div className="bg-gray-50 p-3 md:p-4 rounded-2xl border border-gray-200 shadow-sm">
                <div className="flex items-center gap-1">
                  <span className="text-xs text-gray-600 mr-2">DabbaBot is typing</span>
                  <div className="flex space-x-1">
                    <div className="w-1.5 h-1.5 md:w-2 md:h-2 bg-blue-500 rounded-full animate-bounce"></div>
                    <div className="w-1.5 h-1.5 md:w-2 md:h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-1.5 h-1.5 md:w-2 md:h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="p-3 md:p-4 border-t border-gray-200">
          <div className="flex gap-2 md:gap-3">
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Type your message..."
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              className="flex-1 bg-white border border-gray-300 rounded-xl px-3 md:px-4 py-2 md:py-3 focus:ring-2 focus:ring-blue-500/30 transition-all duration-300 text-sm"
            />
            <Button 
              onClick={handleSendMessage} 
              disabled={!inputValue.trim()}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-xl px-4 md:px-6 shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105"
            >
              <Send className="h-3 w-3 md:h-4 md:w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
