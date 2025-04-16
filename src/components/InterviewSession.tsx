import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Send, SkipForward } from 'lucide-react';
import TextareaAutosize from 'react-textarea-autosize';
import { Question, InterviewType, Answer } from '../types';
import { RecordingIndicator } from './RecordingIndicator';
import { VideoFeedback } from './VideoFeedback';
import { SpeechSynthesisManager } from './SpeechSynthesisManager';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';

interface Props {
  type: InterviewType;
  questions: Question[];
  onComplete: (answers: Answer[]) => void;
  onBack: () => void;
}

export function InterviewSession({ type, questions, onComplete, onBack }: Props) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [currentAnswer, setCurrentAnswer] = useState('');
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [confidenceScore, setConfidenceScore] = useState(0);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [transcriptionBuffer, setTranscriptionBuffer] = useState('');

  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition,
    isMicrophoneAvailable
  } = useSpeechRecognition({
    commands: [],
    continuous: true,
  });

  useEffect(() => {
    if (transcript && isTranscribing) {
      // Accumulate transcription in buffer
      setTranscriptionBuffer(prev => prev + ' ' + transcript);
      // Update answer with slight delay to avoid rapid updates
      const timer = setTimeout(() => {
        setCurrentAnswer(prev => {
          const newText = prev + ' ' + transcriptionBuffer;
          setTranscriptionBuffer(''); // Clear buffer after updating
          return newText.trim();
        });
      }, 500);
      resetTranscript();
      return () => clearTimeout(timer);
    }
  }, [transcript, isTranscribing]);

  const currentQuestion = questions[currentQuestionIndex];

  const moveToNextQuestion = () => {
    setIsTransitioning(true);
    // Stop any ongoing recording
    if (listening) {
      SpeechRecognition.stopListening();
      setIsTranscribing(false);
    }
    // Add a delay before showing the next question
    setTimeout(() => {
      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex(prev => prev + 1);
        setCurrentAnswer('');
        setTranscriptionBuffer('');
        resetTranscript();
      } else {
        onComplete(answers);
      }
      setIsTransitioning(false);
    }, 1000); // 1 second delay for smooth transition
  };

  const handleSubmitAnswer = () => {
    if (!currentAnswer.trim() && !transcriptionBuffer.trim()) return;

    // Combine current answer with any pending transcription
    const finalAnswer = (currentAnswer + ' ' + transcriptionBuffer).trim();

    const newAnswer: Answer = {
      questionId: currentQuestion.id,
      text: finalAnswer,
      feedback: {
        clarity: Math.floor(Math.random() * 3) + 7,
        confidence: confidenceScore || (Math.floor(Math.random() * 3) + 7),
        completeness: Math.floor(Math.random() * 3) + 7,
        suggestions: [
          'Try to provide more specific examples',
          'Consider structuring your answer using the STAR method',
          'You could elaborate more on the outcome'
        ]
      }
    };

    setAnswers(prev => [...prev, newAnswer]);
    moveToNextQuestion();
  };

  const handleSkipQuestion = () => {
    const skippedAnswer: Answer = {
      questionId: currentQuestion.id,
      text: "[Question skipped]",
      feedback: {
        clarity: 0,
        confidence: 0,
        completeness: 0,
        suggestions: ['This question was skipped']
      }
    };

    setAnswers(prev => [...prev, skippedAnswer]);
    moveToNextQuestion();
  };

  const toggleRecording = async () => {
    if (listening) {
      SpeechRecognition.stopListening();
      setIsTranscribing(false);
      // Add any remaining transcription to the answer
      if (transcriptionBuffer.trim()) {
        setCurrentAnswer(prev => (prev + ' ' + transcriptionBuffer).trim());
        setTranscriptionBuffer('');
      }
    } else {
      try {
        setIsTranscribing(true);
        await SpeechRecognition.startListening({ continuous: true });
      } catch (error) {
        console.error('Failed to start recording:', error);
        setIsTranscribing(false);
      }
    }
  };

  const toggleVoice = () => {
    setVoiceEnabled(!voiceEnabled);
  };

  if (!browserSupportsSpeechRecognition || !isMicrophoneAvailable) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-yellow-50 p-4 rounded-lg">
          <p className="text-yellow-800">
            {!browserSupportsSpeechRecognition 
              ? "Your browser doesn't support speech recognition. Please use Chrome or Edge for the best experience."
              : "Microphone access is required for speech recognition. Please allow microphone access and reload the page."}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <button
          onClick={onBack}
          className="mb-6 text-indigo-600 hover:text-indigo-800 flex items-center"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          End Interview
        </button>

        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <motion.div 
            className="p-6 bg-indigo-50 border-b border-indigo-100"
            initial={{ opacity: 1 }}
            animate={{ opacity: isTransitioning ? 0 : 1 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  Question {currentQuestionIndex + 1} of {questions.length}
                </h2>
                <p className="text-gray-600 mt-1">
                  {currentQuestion.tip}
                </p>
              </div>
              <SpeechSynthesisManager
                text={currentQuestion.text}
                enabled={voiceEnabled}
                toggleEnabled={toggleVoice}
              />
            </div>
            <p className="text-lg text-gray-800 mt-4">
              {currentQuestion.text}
            </p>
          </motion.div>

          <div className="p-6">
            <div className="flex gap-6">
              <div className="flex-1">
                <TextareaAutosize
                  value={currentAnswer}
                  onChange={(e) => setCurrentAnswer(e.target.value)}
                  placeholder="Type your answer here..."
                  className="w-full p-4 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 min-h-[200px]"
                />
                <div className="flex justify-between items-center mt-4">
                  <div className="flex items-center gap-4">
                    <RecordingIndicator
                      isRecording={listening}
                      hasError={false}
                      onClick={toggleRecording}
                    />
                    {isTranscribing && (
                      <span className="text-sm text-indigo-600">
                        {transcriptionBuffer ? 'Transcribing...' : 'Listening...'}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-3">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleSkipQuestion}
                      className="bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-gray-600 flex items-center"
                      disabled={isTransitioning}
                    >
                      <SkipForward className="w-5 h-5 mr-2" />
                      Skip
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleSubmitAnswer}
                      className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 flex items-center"
                      disabled={isTransitioning}
                    >
                      <Send className="w-5 h-5 mr-2" />
                      Submit
                    </motion.button>
                  </div>
                </div>
              </div>
              <div className="w-[320px]">
                <VideoFeedback onConfidenceScore={setConfidenceScore} />
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}