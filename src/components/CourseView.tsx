import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, CheckCircle2, Lock, Play, BookOpen } from 'lucide-react';
import { db, auth } from '../lib/firebase';
import { doc, getDoc, setDoc, updateDoc, arrayUnion } from 'firebase/firestore';

interface Lesson {
  id: string;
  title: string;
  content: string;
  technicalDetails: string[];
}

const CourseView = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState<any>(null);
  const [currentLessonIdx, setCurrentLessonIdx] = useState(0);
  const [completedLessons, setCompletedLessons] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!auth.currentUser || !courseId) return;
      try {
        // Fetch Course Content
        const courseRef = doc(db, 'courses', courseId);
        const courseSnap = await getDoc(courseRef);
        if (courseSnap.exists()) {
          setCourse(courseSnap.data());
        }

        // Fetch User Progress
        const progressRef = doc(db, 'userProgress', `${auth.currentUser.uid}_${courseId}`);
        const progressSnap = await getDoc(progressRef);
        if (progressSnap.exists()) {
          setCompletedLessons(progressSnap.data().completedLessons || []);
        }
      } catch (err) {
        console.error('Error fetching data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [courseId]);

  const lessons = course?.lessons || [];
  const currentLesson = lessons[currentLessonIdx];

  const handleNext = () => {
    if (currentLessonIdx < lessons.length - 1) {
      setCurrentLessonIdx(v => v + 1);
    }
  };

  const handlePrev = () => {
    if (currentLessonIdx > 0) {
      setCurrentLessonIdx(v => v - 1);
    }
  };

  const completeLesson = async () => {
    if (!auth.currentUser || !courseId || completedLessons.includes(currentLesson.id)) return;

    try {
      const docId = `${auth.currentUser.uid}_${courseId}`;
      const docRef = doc(db, 'userProgress', docId);
      
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        await updateDoc(docRef, {
          completedLessons: arrayUnion(currentLesson.id)
        });
      } else {
        await setDoc(docRef, {
          userId: auth.currentUser.uid,
          courseId: courseId,
          completedLessons: [currentLesson.id],
          status: 'started'
        });
      }
      setCompletedLessons(prev => [...prev, currentLesson.id]);
    } catch (err) {
      console.error('Error updating progress:', err);
    }
  };

  if (loading) return null;

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-8 bg-[#0d0f14]">
      <div className="max-w-6xl mx-auto">
        <button
          onClick={() => navigate('/learning')}
          className="flex items-center gap-2 text-muted-foreground hover:text-primary mb-8 transition-colors group"
        >
          <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          Back to Courses
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-4">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-primary" />
              Course Syllabus
            </h2>
            {lessons.map((lesson: any, idx: number) => (
              <button
                key={lesson.id}
                onClick={() => setCurrentLessonIdx(idx)}
                className={`w-full p-4 rounded-2xl border transition-all text-left flex items-center justify-between group ${
                  idx === currentLessonIdx
                    ? 'bg-primary/10 border-primary text-primary'
                    : 'bg-[#161b22] border-white/5 text-muted-foreground hover:border-white/20'
                }`}
              >
                <span className="text-sm font-semibold truncate pr-2">{lesson.title}</span>
                {completedLessons.includes(lesson.id) ? (
                  <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />
                ) : (
                  <Play className={`w-3 h-3 shrink-0 ${idx === currentLessonIdx ? 'text-primary' : 'text-muted-foreground/30'}`} />
                )}
              </button>
            ))}
          </div>

          {/* Lesson Content */}
          <div className="lg:col-span-3">
            <motion.div
              key={currentLesson.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-[#161b22] rounded-[32px] border border-white/5 p-8 sm:p-12 shadow-2xl relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 p-8 opacity-5">
                <BookOpen className="w-48 h-48 text-primary" />
              </div>

              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-6">
                  <span className="text-primary font-bold tracking-widest uppercase text-xs">Lesson {currentLessonIdx + 1} of {lessons.length}</span>
                </div>
                <h1 className="text-3xl sm:text-4xl font-bold mb-6 tracking-tight">{currentLesson.title}</h1>
                
                <div className="prose prose-invert max-w-none mb-12">
                  <p className="text-lg text-muted-foreground leading-relaxed">
                    {currentLesson.content}
                  </p>

                  <h3 className="text-xl font-bold mt-8 mb-4 flex items-center gap-2 text-white">
                    <CheckCircle2 className="w-5 h-5 text-primary" />
                    Key Technical Protocols
                  </h3>
                  <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 list-none p-0">
                    {currentLesson.technicalDetails.map((detail: string, idx: number) => (
                      <li key={idx} className="bg-white/5 p-4 rounded-2xl border border-white/5 text-sm text-muted-foreground">
                        {detail}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pt-12 border-t border-white/5 text-center sm:text-left">
                  <div className="flex gap-4">
                    <button
                      onClick={handlePrev}
                      disabled={currentLessonIdx === 0}
                      className="px-6 py-3 rounded-2xl border border-white/10 hover:bg-white/5 transition-colors disabled:opacity-30 disabled:cursor-not-allowed flex items-center gap-2 font-bold"
                    >
                      <ChevronLeft className="w-5 h-5" />
                      Previous
                    </button>
                    <button
                      onClick={handleNext}
                      disabled={currentLessonIdx === lessons.length - 1}
                      className="px-6 py-3 rounded-2xl border border-white/10 hover:bg-white/5 transition-colors disabled:opacity-30 disabled:cursor-not-allowed flex items-center gap-2 font-bold"
                    >
                      Next
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </div>

                  <button
                    onClick={completeLesson}
                    disabled={completedLessons.includes(currentLesson.id)}
                    className={`w-full sm:w-auto px-10 py-4 rounded-2xl font-bold transition-all shadow-lg flex items-center justify-center gap-2 ${
                      completedLessons.includes(currentLesson.id)
                        ? 'bg-transparent border border-primary/30 text-primary cursor-default'
                        : 'bg-primary text-white hover:scale-105 active:scale-95'
                    }`}
                  >
                    {completedLessons.includes(currentLesson.id) ? (
                      <>
                        <CheckCircle2 className="w-5 h-5" />
                        Lesson Completed
                      </>
                    ) : (
                      'Mark as Complete'
                    )}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseView;
