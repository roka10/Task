import React from 'react';
import { BookOpen, Calculator, FlaskRound as Flask, Atom } from 'lucide-react';

interface Subject {
  id: string;
  name: string;
  icon: 'math' | 'physics' | 'chemistry';
  questionCount: number;
}

interface SubjectTabsProps {
  subjects: Subject[];
  activeSubject: string;
  onSubjectChange: (subjectId: string) => void;
}

const SubjectTabs: React.FC<SubjectTabsProps> = ({
  subjects,
  activeSubject,
  onSubjectChange,
}) => {
  const getIcon = (type: string) => {
    switch (type) {
      case 'math':
        return <Calculator className="h-5 w-5" />;
      case 'physics':
        return <Atom className="h-5 w-5" />;
      case 'chemistry':
        return <Flask className="h-5 w-5" />;
      default:
        return <BookOpen className="h-5 w-5" />;
    }
  };

  return (
    <div className="bg-white shadow-sm border-b border-gray-200">
      <div className="px-4">
        <nav className="-mb-px flex space-x-8">
          {subjects.map((subject) => (
            <button
              key={subject.id}
              onClick={() => onSubjectChange(subject.id)}
              className={`
                group inline-flex items-center py-4 px-1 border-b-2 font-medium text-sm
                ${
                  activeSubject === subject.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }
              `}
            >
              {getIcon(subject.icon)}
              <span className="ml-2">{subject.name}</span>
              <span
                className={`ml-2 py-0.5 px-2 rounded-full text-xs font-medium
                  ${
                    activeSubject === subject.id
                      ? 'bg-blue-100 text-blue-600'
                      : 'bg-gray-100 text-gray-900'
                  }
                `}
              >
                {subject.questionCount}
              </span>
            </button>
          ))}
        </nav>
      </div>
    </div>
  );
};

export default SubjectTabs;