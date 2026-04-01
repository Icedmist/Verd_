import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Trophy, Clock, CheckCircle2, ChevronRight, Play } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { db, auth } from '../lib/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';

interface CourseProgress {
  courseId: string;
  completedLessons: string[];
  status: 'started' | 'completed';
}

const LearningCenter = () => {
  const navigate = useNavigate();
  const [courses, setCourses] = useState<any[]>([]);
  const [progress, setProgress] = useState<Record<string, CourseProgress>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch Courses
        const coursesSnap = await getDocs(collection(db, 'courses'));
        const coursesData: any[] = [];
        coursesSnap.forEach(doc => coursesData.push(doc.data()));
        setCourses(coursesData);

        // Fetch Progress
        if (auth.currentUser) {
          const q = query(
            collection(db, 'userProgress'),
            where('userId', '==', auth.currentUser.uid)
          );
          const querySnapshot = await getDocs(q);
          const progressData: Record<string, CourseProgress> = {};
          querySnapshot.forEach((doc) => {
            const data = doc.data() as CourseProgress;
            progressData[data.courseId] = data;
          });
          setProgress(progressData);
        }
      } catch (err) {
        console.error('Error fetching data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-8 bg-[#0d0f14]">
      <div className="max-w-7xl mx-auto">
        <header className="mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-3 mb-4"
          >
            <div className="p-2 bg-primary/20 rounded-lg">
              <BookOpen className="w-6 h-6 text-primary" />
            </div>
            <span className="text-primary font-bold tracking-widest uppercase text-xs">Agri-Neural Academy</span>
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl sm:text-5xl font-bold mb-4 tracking-tight"
          >
            Learning <span className="text-primary">Center</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-muted-foreground text-lg max-w-2xl"
          >
            Enhance your agronomy expertise with professional courses designed for modern digital farmers.
          </motion.p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {courses.map((course, index) => {
            const courseProgress = progress[course.id];
            const completedCount = courseProgress?.completedLessons.length || 0;
            const lessonsCount = course.lessons?.length || 0;
            const progressPercentage = lessonsCount > 0 ? (completedCount / lessonsCount) * 100 : 0;

            return (
              <motion.div
                key={course.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                className="group relative bg-[#161b22] rounded-[32px] overflow-hidden border border-white/5 hover:border-primary/50 transition-all duration-500 shadow-2xl"
              >
                <div className="aspect-video relative overflow-hidden">
                  <img
                    src={course.image}
                    alt={course.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#161b22] via-transparent to-transparent" />
                  <div className="absolute top-4 right-4 px-3 py-1 bg-black/50 backdrop-blur-md rounded-full border border-white/10">
                    <span className="text-[10px] font-bold text-white uppercase tracking-wider">{course.level}</span>
                  </div>
                </div>

                <div className="p-8">
                  <h3 className="text-2xl font-bold mb-3 tracking-tight group-hover:text-primary transition-colors">
                    {course.title}
                  </h3>
                  <p className="text-muted-foreground text-sm mb-6 leading-relaxed">
                    {course.description}
                  </p>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <Clock className="w-3 h-3" />
                        {course.duration}
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-3 h-3 text-primary" />
                        {completedCount}/{lessonsCount} Lessons
                      </div>
                    </div>

                    <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${progressPercentage}%` }}
                        className="h-full bg-primary"
                      />
                    </div>

                    <button
                      onClick={() => navigate(`/learning/${course.id}`)}
                      className="w-full mt-4 flex items-center justify-center gap-2 py-4 bg-white/5 hover:bg-primary hover:text-white rounded-2xl font-bold transition-all group/btn"
                    >
                      {completedCount === lessonsCount && lessonsCount > 0 ? (
                        <>
                          <Trophy className="w-4 h-4" />
                          Certified
                        </>
                      ) : completedCount > 0 ? (
                        <>
                          <Play className="w-4 h-4" />
                          Resume Course
                        </>
                      ) : (
                        <>
                          <Play className="w-4 h-4" />
                          Start Course
                        </>
                      )}
                      <ChevronRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default LearningCenter;
