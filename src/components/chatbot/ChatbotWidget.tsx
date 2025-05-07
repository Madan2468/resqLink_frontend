import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, Send, X } from 'lucide-react';

const INITIAL_MESSAGES = [
  { 
    text: "Hello! I'm ResQBot, here to help with animal rescue situations. How can I assist you today?", 
    type: 'bot' 
  }
];

// Predefined responses for common animal rescue scenarios
const RESCUE_RESPONSES: Record<string, string> = {
  'injured animal': "If you've found an injured animal, it's important to approach with caution. Animals in pain may react defensively. Consider these steps:\n\n1. Maintain a safe distance\n2. Call a local wildlife rehabilitator or animal control\n3. If it's safe, place a box or crate over the animal to prevent it from running away\n4. Report the case immediately through our 'Report Case' feature with photos and location details",
  
  'stray dog': "When you encounter a stray dog:\n\n1. Keep a safe distance and avoid sudden movements\n2. Don't chase the dog as this might frighten it\n3. If the dog seems approachable, check for ID tags\n4. Report the case with our 'Report Case' feature, including photos and location\n5. Contact local animal control or shelters in the area",
  
  'stray cat': "For stray cats:\n\n1. Approach slowly and quietly if the cat seems friendly\n2. Check for ID tags or signs that it might be someone's pet\n3. Provide food and water if possible\n4. Report the case through our app with details and photos\n5. Consider contacting local TNR (Trap-Neuter-Return) programs if it's a feral cat",
  
  'animal abuse': "If you suspect animal abuse:\n\n1. Document the situation with photos/videos if it's safe to do so\n2. Do not confront the suspected abuser\n3. Report the case immediately through our app with detailed information\n4. Contact local animal control, police, or animal protection services\n5. Follow up on the case after reporting",
  
  'wildlife': "For wildlife situations:\n\n1. Keep a safe distance and observe from afar\n2. Do not attempt to feed or capture wild animals\n3. For injured wildlife, contact wildlife rehabilitators or animal control\n4. Report the case with our app, including species information if known\n5. Do not attempt to keep wildlife as pets - this is often illegal and harmful",
  
  'emergency': "For animal emergencies requiring immediate attention:\n\n1. Call animal emergency services immediately\n2. Provide clear location details\n3. Follow any first aid instructions given by professionals\n4. Report the case on our app after addressing the immediate emergency\n5. Emergency animal hospital locations are available under our Resources section"
};

const ChatbotWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState(INITIAL_MESSAGES);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const toggleChatbot = () => {
    setIsOpen(!isOpen);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  const handleSendMessage = () => {
    if (input.trim() === '') return;

    // Add user message
    setMessages(prevMessages => [
      ...prevMessages,
      { text: input, type: 'user' }
    ]);

    // Generate response based on user input
    setTimeout(() => {
      const response = generateResponse(input);
      setMessages(prevMessages => [
        ...prevMessages,
        { text: response, type: 'bot' }
      ]);
    }, 500);

    setInput('');
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  const generateResponse = (userInput: string): string => {
    const lowerInput = userInput.toLowerCase();
    
    // Check for keywords in the predefined responses
    for (const [keyword, response] of Object.entries(RESCUE_RESPONSES)) {
      if (lowerInput.includes(keyword)) {
        return response;
      }
    }
    
    // Check for specific questions or greetings
    if (lowerInput.includes('hello') || lowerInput.includes('hi') || lowerInput.includes('hey')) {
      return "Hello! How can I help with your animal rescue concerns today?";
    }
    
    if (lowerInput.includes('thank')) {
      return "You're welcome! Remember that you can report animal cases through our app at any time. Is there anything else I can help with?";
    }
    
    if (lowerInput.includes('report') && lowerInput.includes('case')) {
      return "To report a case, tap on the 'Report Case' option in the menu. You'll need to provide details about the animal, upload a photo, and specify the location. Your report will be processed right away.";
    }
    
    if (lowerInput.includes('location') || lowerInput.includes('map')) {
      return "Our map feature shows all reported animal cases. You can view it by clicking on 'Rescue Map' in the navigation menu. Each pin represents a case, and you can click on them for more details.";
    }
    
    // Default response
    return "I'm here to help with animal rescue situations. Could you provide more details about the animal you're concerned about? For immediate assistance with injured animals, please report a case through our app or contact local animal services.";
  };

  return (
    <div className="chatbot-widget">
      {isOpen && (
        <div className="chatbot-panel animate-fade-in">
          <div className="chatbot-header flex justify-between items-center">
            <div className="flex items-center">
              <MessageCircle size={18} className="mr-2" />
              <h3 className="font-medium text-sm">ResQBot</h3>
            </div>
            <button 
              onClick={toggleChatbot}
              className="text-white hover:text-gray-200 transition-colors"
            >
              <X size={18} />
            </button>
          </div>
          
          <div className="chatbot-messages">
            {messages.map((message, index) => (
              <div 
                key={index}
                className={`message ${message.type === 'user' ? 'user-message' : 'bot-message'}`}
              >
                {message.text.split('\n').map((line, i) => (
                  <React.Fragment key={i}>
                    {line}
                    {i < message.text.split('\n').length - 1 && <br />}
                  </React.Fragment>
                ))}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
          
          <div className="chatbot-input">
            <input
              type="text"
              placeholder="Type your question here..."
              value={input}
              onChange={handleInputChange}
              onKeyPress={handleKeyPress}
              className="flex-grow rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-400 text-gray-700 bg-gray-100"
            />
            <button 
              onClick={handleSendMessage}
              className="ml-2 bg-green-500 hover:bg-green-600 text-white rounded-full p-2 transition-colors"
              disabled={input.trim() === ''}
            >
              <Send size={18} />
            </button>
          </div>
        </div>
      )}
      
      <button 
        onClick={toggleChatbot}
        className="chatbot-toggle"
        aria-label="Toggle chatbot"
      >
        <MessageCircle className="h-6 w-6 text-white" />
      </button>
    </div>
  );
};

export default ChatbotWidget;