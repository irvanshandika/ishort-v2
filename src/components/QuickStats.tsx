/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/src/components/ui/card";
import { Link2, Eye, BarChart3, TrendingUp } from "lucide-react";
import { app, db } from "@/src/lib/firebase";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, collection, query, where, getDocs } from "firebase/firestore";

export default function QuickStats() {
  const [user, setUser] = useState<any>(null);
  const [totalShortUrls, setTotalShortUrls] = useState<number>(0);
  const [roles, setRoles] = useState<string | null>(null);
  const [totalVisitors, setTotalVisitors] = useState<number>(0);
  
  useEffect(() => {
      const fetchData = async () => {
        if (user) {
          const q = query(collection(db, "shorturls"), where("uid", "==", user.uid));
          const querySnapshot = await getDocs(q);
          type ShortUrl = {
            id: string;
            visitorCount?: number;
            [key: string]: any;
          };
          const urls: ShortUrl[] = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  
          setTotalShortUrls(urls.length);
          setTotalVisitors(urls.reduce((acc, url) => acc + (url.visitorCount || 0), 0));
        }
      };
  
      fetchData();
    }, [user]);
  
    useEffect(() => {
      const authInstance = getAuth(app);
      const unsubscribe = onAuthStateChanged(authInstance, async (user) => {
        if (user) {
          setUser(user);
  
          // Fetch role from Firestore
          const userRef = doc(db, "users", user.uid);
          const userSnap = await getDoc(userRef);
          if (userSnap.exists()) {
            setRoles(userSnap.data().roles); // Ambil peran dari Firestore
          } else {
            setRoles(null);
          }
        } else {
          setUser(null);
          setRoles(null);
        }
      });
  
      return () => unsubscribe();
    }, []);

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-medium text-gray-900 dark:text-white px-3">Quick Stats</h3>
      <div className="grid grid-cols-2 gap-2">
        <Card className="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
          <CardContent className="p-3">
            <div className="flex items-center space-x-2">
              <Link2 className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              <div>
                <p className="text-lg font-bold text-blue-700 dark:text-blue-300">{totalShortUrls}</p>
                <p className="text-xs text-blue-600 dark:text-blue-400">URLs</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-800">
          <CardContent className="p-3">
            <div className="flex items-center space-x-2">
              <Eye className="h-4 w-4 text-purple-600 dark:text-purple-400" />
              <div>
                <p className="text-lg font-bold text-purple-700 dark:text-purple-300">{totalVisitors}</p>
                <p className="text-xs text-purple-600 dark:text-purple-400">Total Clicks</p>
              </div>
            </div>
          </CardContent>
        </Card>
        {/* <Card className="bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800">
          <CardContent className="p-3">
            <div className="flex items-center space-x-2">
              <BarChart3 className="h-4 w-4 text-green-600 dark:text-green-400" />
              <div>
                <p className="text-lg font-bold text-green-700 dark:text-green-300">{stats.todayClicks}</p>
                <p className="text-xs text-green-600 dark:text-green-400">Today</p>
              </div>
            </div>
          </CardContent>
        </Card> */}
      </div>
    </div>
  );
}
