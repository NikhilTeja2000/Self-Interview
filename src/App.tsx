import React, { useState } from 'react';
import { Brain, Code, Briefcase, Plane, Globe, Upload } from 'lucide-react';
import { Navigation } from './components/Navigation';
import { HomePage } from './components/HomePage';
import { AboutPage } from './components/AboutPage';
import { DashboardPage } from './components/DashboardPage';
import { StartModal } from './components/StartModal';
import { CustomQuestions } from './components/CustomQuestions';
import { InterviewSession } from './components/InterviewSession';
import { FeedbackView } from './components/FeedbackView';
import {
  InterviewOption,
  InterviewType,
  Question,
  Answer,
  InterviewSession as IInterviewSession,
} from './types';

function App() {
  const [currentPage, setCurrentPage] = useState<
    'home' | 'about' | 'dashboard'
  >('home');
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [showStartModal, setShowStartModal] = useState(false);
  const [isInterviewActive, setIsInterviewActive] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [currentSession, setCurrentSession] =
    useState<IInterviewSession | null>(null);
  const [currentQuestions, setCurrentQuestions] = useState<Question[]>([]);

  const interviewTypes: InterviewOption[] = [
    {
      id: 'behavioral',
      title: 'Behavioral Interview',
      description: 'Practice common behavioral and situational questions',
      icon: Brain,
    },
    {
      id: 'technical',
      title: 'Technical Interview',
      description: 'Prepare for coding and system design questions',
      icon: Code,
    },
    {
      id: 'product',
      title: 'Product Management',
      description: 'Practice product strategy and leadership scenarios',
      icon: Briefcase,
    },
    {
      id: 'f1-visa',
      title: 'F1 Student Visa',
      description: 'Prepare for your student visa interview',
      icon: Plane,
    },
    {
      id: 'b1b2-visa',
      title: 'B1/B2 Visitor Visa',
      description: 'Practice for visitor visa interviews',
      icon: Globe,
    },
    {
      id: 'custom',
      title: 'Custom Interview',
      description: 'Create your own custom interview questions',
      icon: Upload,
    },
  ];

  const getDefaultQuestions = (type: InterviewType): Question[] => {
    switch (type) {
      case 'behavioral':
        return [
          {
            id: '1',
            text: 'Tell me about a time when you had to work with a difficult teammate.',
            type,
            tip: 'Use the STAR method (Situation, Task, Action, Result) to clearly outline your experience.',
          },
          {
            id: '2',
            text: 'Describe a situation where you had to manage multiple priorities under a tight deadline.',
            type,
            tip: 'Focus on how you organized your time and communicated with stakeholders.',
          },
          {
            id: '3',
            text: 'Tell me about a failure or mistake you made and how you handled it.',
            type,
            tip: 'Be honest, and show what you learned and how you improved.',
          },
        ];

      case 'technical':
        return [
          {
            id: '1',
            text: 'Design a scalable architecture for a real-time chat application.',
            type,
            tip: 'Mention components like WebSockets, load balancing, and database scaling.',
          },
          {
            id: '2',
            text: 'What are the differences between SQL and NoSQL databases?',
            type,
            tip: 'Include use cases where each would be preferable.',
          },
          {
            id: '3',
            text: 'Explain how you would debug a performance issue in a production app.',
            type,
            tip: 'Walk through tools and your thought process clearly.',
          },
        ];

      case 'product':
        return [
          {
            id: '1',
            text: 'How would you prioritize features for an MVP launch of a new product?',
            type,
            tip: 'Use frameworks like RICE or MoSCoW if applicable.',
          },
          {
            id: '2',
            text: 'Describe a time when you had to make a tradeoff between customer needs and technical limitations.',
            type,
            tip: 'Show how you communicated with both engineers and stakeholders.',
          },
          {
            id: '3',
            text: 'How do you measure the success of a product feature after it ships?',
            type,
            tip: 'Mention KPIs, user feedback, and iteration strategies.',
          },
        ];

      case 'f1-visa':
        return [
          {
            id: '1',
            text: 'Why did you choose this university and program in the U.S.?',
            type,
            tip: 'Talk about academic strengths and alignment with your goals.',
          },
          {
            id: '2',
            text: 'Who is sponsoring your education, and what do they do?',
            type,
            tip: 'Be specific about your financial plan and support.',
          },
          {
            id: '3',
            text: 'What are your plans after completing your degree?',
            type,
            tip: 'Focus on career aspirations and returning to your home country.',
          },
        ];

      case 'b1b2-visa':
        return [
          {
            id: '1',
            text: 'What is the purpose of your visit to the United States?',
            type,
            tip: 'Be clear about the reason and duration.',
          },
          {
            id: '2',
            text: 'Do you have any relatives in the U.S.? What do they do?',
            type,
            tip: 'Explain the relationship and provide brief context.',
          },
          {
            id: '3',
            text: 'What ties do you have to your home country?',
            type,
            tip: 'Mention family, job, property, or financial commitments.',
          },
        ];

      case 'custom':
      default:
        return [
          {
            id: '1',
            text: 'This is a custom interview. Please upload or define your own questions.',
            type,
            tip: 'Tailor this session by providing the most relevant questions.',
          },
        ];
    }
  };

  const handleStartInterview = () => {
    setShowStartModal(false);
    if (selectedType) {
      setCurrentQuestions(getDefaultQuestions(selectedType as InterviewType));
      setIsInterviewActive(true);
    }
  };

  const handleCustomQuestions = (questions: Question[]) => {
    setCurrentQuestions(questions);
    setIsInterviewActive(true);
  };

  const handleInterviewComplete = (answers: Answer[]) => {
    const session: IInterviewSession = {
      type: selectedType as InterviewType,
      questions: currentQuestions,
      answers,
      date: new Date().toISOString(),
    };
    setCurrentSession(session);
    setIsInterviewActive(false);
    setShowFeedback(true);
  };

  const handleEndSession = () => {
    setShowFeedback(false);
    setSelectedType(null);
    setCurrentSession(null);
    setCurrentQuestions([]);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation currentPage={currentPage} onPageChange={setCurrentPage} />

      <main>
        {currentPage === 'home' && !isInterviewActive && !showFeedback && (
          <>
            <HomePage
              interviewTypes={interviewTypes}
              selectedType={selectedType}
              setSelectedType={setSelectedType}
              setShowStartModal={setShowStartModal}
            />
            {showStartModal && selectedType && selectedType !== 'custom' && (
              <StartModal
                type={selectedType as InterviewType}
                onStart={handleStartInterview}
                onClose={() => setShowStartModal(false)}
              />
            )}
            {selectedType === 'custom' && (
              <CustomQuestions
                onSubmit={handleCustomQuestions}
                onBack={() => setSelectedType(null)}
              />
            )}
          </>
        )}

        {currentPage === 'home' && isInterviewActive && (
          <InterviewSession
            type={selectedType as InterviewType}
            questions={currentQuestions}
            onComplete={handleInterviewComplete}
            onBack={() => setIsInterviewActive(false)}
          />
        )}

        {currentPage === 'home' && showFeedback && currentSession && (
          <FeedbackView session={currentSession} onBack={handleEndSession} />
        )}

        {currentPage === 'about' && <AboutPage />}
        {currentPage === 'dashboard' && <DashboardPage />}
      </main>
    </div>
  );
}

export default App;
