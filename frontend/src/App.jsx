import { initializeApp } from 'firebase/app';
import { getAuth, onAuthStateChanged, signInAnonymously } from 'firebase/auth';
import {
  doc,
  getFirestore,
  onSnapshot,
  setDoc,
  updateDoc,
} from 'firebase/firestore';
import { Fragment, useCallback, useEffect, useRef, useState } from 'react';
import LandingScreen from './components/LandingScreen';
import LobbyScreen from './components/LobbyScreen';

function App() {
  // Your web app's Firebase configuration
  // For Firebase JS SDK v7.20.0 and later, measurementId is optional
  const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MSG_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID,
    measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
  };
  const initialAuthToken =
    typeof __initial_auth_token !== 'undefined' ? __initial_auth_token : null;
  const [db, setDb] = useState(null);
  const [userId, setUserId] = useState(null);
  const [isAuthReady, setIsAuthReady] = useState(false);
  const [currentView, setCurrentView] = useState('start');

  const DEFAULT_QUIZ = [
    { question: 'What is the chemical symbol for water?', answer: 'H2O' },
    {
      question: 'What is the largest organ in the human body?',
      answer: 'Skin',
    },
    { question: "Who wrote 'Romeo and Juliet'?", answer: 'Shakespeare' },
    { question: 'What is 15 multiplied by 9?', answer: '135' },
    {
      question: 'What is the process by which plants make their food?',
      answer: 'Photosynthesis',
    },
  ];

  const [gameIdInput, setGameIdInput] = useState('');
  const [gameId, setGameId] = useState(null);
  const [gameData, setGameData] = useState(null);
  const [isHost, setIsHost] = useState(false);
  const [userName, setUserName] = useState('');

  // Firebase stuff
  useEffect(() => {
    try {
      if (Object.keys(firebaseConfig).length === 0) {
        throw new Error('Firebase config is missing. Cannot initialize.');
      }
      const app = initializeApp(firebaseConfig);
      const firestore = getFirestore(app);
      const firebaseAuth = getAuth(app);
      console.log(
        'Firebase initialized successfully. Auth Domain used:',
        firebaseConfig.authDomain
      );
      setDb(firestore);

      onAuthStateChanged(firebaseAuth, async (user) => {
        if (!user) {
          if (initialAuthToken) {
            await signInWithCustomToken(firebaseAuth, initialAuthToken);
          } else {
            await signInAnonymously(firebaseAuth);
          }
        }
        setUserId(firebaseAuth.currentUser?.uid || 'anonymous');
        setIsAuthReady(true);
      });
    } catch (e) {
      console.error('Firebase Initialization Error:', e);
    }
  }, []);

  // Game Listener
  useEffect(() => {
    if (!db || !gameId || !isAuthReady) return;

    const gameRef = doc(db, `quizRaces`, gameId);

    const unsubscribe = onSnapshot(
      gameRef,
      (docSnap) => {
        if (docSnap.exists()) {
          const data = docSnap.data();
          setGameData(data);
          // TODO: Update view based on status
          if(data.status === 'in_progress' && currentView !== 'race') {
            setCurrentView('race');
            // TODO: timer stuff
          } else if(data.status === 'finished' && currentView !== 'results') {
            setCurrentView('results');
            // TODO: timer stuff
          }
        } else {
          setGameData(null);
          // TODO: go back to start & send error
        }
      },
      (e) => {
        console.error('Firestore Snapshot Error:', e);
      }
    );

    return () => unsubscribe();
  }, [db, gameId, isAuthReady, currentView]);

  // Game stuff
  const getPlayerKey = useCallback(() => {
    if (!gameData || !userId) return null;
    if (gameData.hostId === userId) return 'hostProgress';
    if (gameData.joinerId === userId) return 'joinerProgress';
    return null;
  }, [gameData, userId]);

  const createGame = async () => {
    if (!db || !userId) return;

    const newGameId = Math.random().toString(36).substring(2, 8).toUpperCase();
    const gameRef = doc(db, `quizRaces`, newGameId);

    const initialData = {
      gameId: newGameId,
      hostId: userId,
      hostName: userName,
      joinerId: null,
      joinerName: null,
      status: 'waiting',
      questions: DEFAULT_QUIZ,
      hostProgress: { currentIndex: 0, correctCount: 0, timeTaken: null },
      joinerProgress: { currentIndex: 0, correctCount: 0, timeTaken: null },
      winnerId: null,
      createdAt: new Date(),
    };

    try {
      await setDoc(gameRef, initialData);
      setGameId(newGameId);
      setIsHost(true);
      setCurrentView('lobby');
    } catch (e) {
      console.error('Error creating game:', e);
    }
  };

  const joinGame = async () => {
    if (!db || !userId || !gameIdInput) return;
    const id = gameIdInput.trim().toUpperCase();
    const gameRef = doc(db, `quizRaces`, id);
    1;

    try {
      await updateDoc(gameRef, {
        joinerId: userId,
        joinerName: userName,
      });
      setGameId(id);
      setIsHost(false);
      setCurrentView('lobby');
    } catch (e) {
      console.error('Error joining game:', e);
    }
  };

  const startGame = async () => {
    if (!db || !gameId || !gameData || !isHost) return;

    // Set the status to 'in_progress'
    try {
      await updateDoc(doc(db, `quizRaces`, gameId), {
        status: 'in_progress',
      });
    } catch (e) {
      console.error('Error starting game:', e);
    }
  };

  const router = () => {
    switch (currentView) {
      case 'start':
        return (
          <LandingScreen
            createGame={createGame}
            joinGame={joinGame}
            gameIdInput={gameIdInput}
            setGameIdInput={setGameIdInput}
            userName={userName}
            setUserName={setUserName}
          />
        );
      case 'lobby':
        return (
          <LobbyScreen
            gameId={gameId}
            gameData={gameData}
            isHost={isHost}
            startGame={startGame}
            userName={userName}
          />
        );
      case 'race':
        return <div>TODO</div>;
      case 'results':
        return <div>TODO</div>;
    }
  };

  return <Fragment>{isAuthReady ? router() : <h3>Connecting to server</h3>}</Fragment>;
}

export default App;
