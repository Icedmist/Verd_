import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lightbulb } from 'lucide-react';
import { auth, db } from '../lib/firebase';
import { collection, getDocs, QueryDocumentSnapshot, DocumentData } from 'firebase/firestore';

const DailyTip = () => {
  const [tip, setTip] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTipsAndShuffle = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'tips'));
        const tipsData: string[] = [];
        querySnapshot.forEach((doc: QueryDocumentSnapshot<DocumentData>) => {
          tipsData.push(doc.data().text);
        });

        if (tipsData.length === 0) {
          setTip("Consulting the soil...");
          return;
        }

        const today = new Date();
        const dateString = today.getFullYear().toString() + (today.getMonth() + 1).toString().padStart(2, '0') + today.getDate().toString().padStart(2, '0');
        
        // Seed generation
        let seed = parseInt(dateString);
        
        // Personalize if logged in
        if (auth.currentUser) {
          const uidPart = auth.currentUser.uid.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
          seed += uidPart;
        }
        
        // Deterministic "random" index
        const index = seed % tipsData.length;
        setTip(tipsData[index]);
      } catch (err) {
        console.error('Error fetching tips:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchTipsAndShuffle();
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-primary/10 border border-primary/20 rounded-3xl p-6 relative overflow-hidden group"
    >
      <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:rotate-12 transition-transform duration-500">
        <Lightbulb className="w-16 h-16 text-primary" />
      </div>
      
      <div className="relative z-10">
        <div className="flex items-center gap-2 mb-4">
          <div className="p-1.5 bg-primary/20 rounded-lg">
            <Lightbulb className="w-4 h-4 text-primary" />
          </div>
          <span className="text-[10px] font-bold text-primary uppercase tracking-widest">Daily Agronomy Insight</span>
        </div>
        
        <p className="text-sm text-white/90 leading-relaxed font-medium">
          {loading ? 'Consulting the soil...' : tip}
        </p>
      </div>
    </motion.div>
  );
};

export default DailyTip;
