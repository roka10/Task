import React, { useState } from 'react';
import { HelpCircle, ChevronDown, ChevronRight, Search, Book, MessageCircle, Mail, X } from 'lucide-react';

interface FAQItem {
  question: string;
  answer: string;
  category: string;
}

const faqs: FAQItem[] = [
  {
    question: "How do I start a test?",
    answer: "Navigate to your dashboard, find the test under 'Upcoming Tests' and click 'Start Test'. Make sure you're ready before starting as the timer begins immediately.",
    category: "Tests"
  },
  {
    question: "What happens if I lose internet connection during a test?",
    answer: "Your answers are automatically saved every few seconds. If you lose connection, reconnect and continue from where you left off. The timer continues running.",
    category: "Technical"
  },
  {
    question: "How are test results calculated?",
    answer: "Results are calculated based on the points assigned to each question. Multiple choice and single choice questions are automatically graded, while short answers may be manually reviewed.",
    category: "Grading"
  },
  {
    question: "How does the proctoring system work?",
    answer: "The system uses your webcam to ensure test integrity. It monitors for face presence and suspicious movements. Make sure to stay in frame and avoid looking away from the screen.",
    category: "Security"
  },
  {
    question: "Can I review my answers before submitting?",
    answer: "Yes, you can navigate between questions using the question tabs and review your answers before final submission.",
    category: "Tests"
  }
];

const HelpCenter: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedQuestion, setExpandedQuestion] = useState<string | null>(null);
  const [showLiveChat, setShowLiveChat] = useState(false);
  const [chatMessage, setChatMessage] = useState('');
  const [chatMessages, setChatMessages] = useState<{ text: string; isUser: boolean }[]>([]);

  const filteredFAQs = faqs.filter(faq =>
    faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const categories = Array.from(new Set(faqs.map(faq => faq.category)));

  const handleSendMessage = () => {
    if (!chatMessage.trim()) return;

    setChatMessages([...chatMessages, { text: chatMessage, isUser: true }]);
    setChatMessage('');

    // Simulate automated response
    setTimeout(() => {
      setChatMessages(prev => [...prev, {
        text: "Thank you for your message. A support representative will respond shortly.",
        isUser: false
      }]);
    }, 1000);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 text-gray-600 hover:text-gray-900 focus:outline-none"
      >
        <HelpCircle className="h-6 w-6" />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-96 bg-white rounded-lg shadow-lg z-50">
          <div className="p-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Help Center</h3>
            
            <div className="mt-4 relative">
              <input
                type="text"
                placeholder="Search help articles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
              />
              <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            </div>
          </div>

          <div className="max-h-96 overflow-y-auto">
            {/* Quick Links */}
            <div className="p-4 border-b border-gray-200">
              <div className="grid grid-cols-2 gap-4">
                <a
                  href="/user-guide"
                  target="_blank"
                  className="flex items-center justify-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50"
                >
                  <Book className="h-5 w-5 text-blue-600 mr-2" />
                  <span className="text-sm">User Guide</span>
                </a>
                <button
                  onClick={() => setShowLiveChat(true)}
                  className="flex items-center justify-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50"
                >
                  <MessageCircle className="h-5 w-5 text-green-600 mr-2" />
                  <span className="text-sm">Live Chat</span>
                </button>
              </div>
            </div>

            {/* FAQs */}
            <div className="p-4">
              <h4 className="text-sm font-medium text-gray-900 mb-4">Frequently Asked Questions</h4>
              
              {categories.map(category => (
                <div key={category} className="mb-4">
                  <h5 className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">
                    {category}
                  </h5>
                  
                  <div className="space-y-2">
                    {filteredFAQs
                      .filter(faq => faq.category === category)
                      .map(faq => (
                        <div
                          key={faq.question}
                          className="border border-gray-200 rounded-lg"
                        >
                          <button
                            onClick={() => setExpandedQuestion(
                              expandedQuestion === faq.question ? null : faq.question
                            )}
                            className="w-full text-left px-4 py-3 flex items-center justify-between"
                          >
                            <span className="text-sm font-medium text-gray-900">
                              {faq.question}
                            </span>
                            {expandedQuestion === faq.question ? (
                              <ChevronDown className="h-4 w-4 text-gray-500" />
                            ) : (
                              <ChevronRight className="h-4 w-4 text-gray-500" />
                            )}
                          </button>
                          
                          {expandedQuestion === faq.question && (
                            <div className="px-4 py-3 bg-gray-50 text-sm text-gray-600 border-t border-gray-200">
                              {faq.answer}
                            </div>
                          )}
                        </div>
                      ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Contact Support */}
            <div className="p-4 bg-gray-50 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-medium text-gray-900">Need more help?</h4>
                  <p className="text-xs text-gray-600 mt-1">Contact our support team</p>
                </div>
                <button
                  onClick={() => setShowLiveChat(true)}
                  className="flex items-center px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  <Mail className="h-4 w-4 mr-2" />
                  <span className="text-sm">Contact</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Live Chat Modal */}
      {showLiveChat && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
            <div className="p-4 border-b border-gray-200 flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-900">Live Support</h3>
              <button
                onClick={() => setShowLiveChat(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="p-4 h-96 flex flex-col">
              <div className="flex-1 overflow-y-auto space-y-4">
                {chatMessages.map((msg, index) => (
                  <div
                    key={index}
                    className={`flex ${msg.isUser ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-xs px-4 py-2 rounded-lg ${
                        msg.isUser
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 text-gray-900'
                      }`}
                    >
                      {msg.text}
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-4 flex items-center">
                <input
                  type="text"
                  value={chatMessage}
                  onChange={(e) => setChatMessage(e.target.value)}
                  placeholder="Type your message..."
                  className="flex-1 border border-gray-300 rounded-l-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                />
                <button
                  onClick={handleSendMessage}
                  className="px-4 py-2 bg-blue-600 text-white rounded-r-lg hover:bg-blue-700"
                >
                  Send
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HelpCenter;