import { initializeApp } from 'firebase/app';
import { getAuth, onAuthStateChanged, signInAnonymously } from 'firebase/auth';
import {
  doc,
  getFirestore,
  onSnapshot,
  setDoc,
  updateDoc,
} from 'firebase/firestore';
import { Fragment, useCallback, useEffect, useState } from 'react';
import LandingScreen from './components/LandingScreen';
import LobbyScreen from './components/LobbyScreen';
import QuizRoute from './components/QuizRoute';
import Results from './components/Results';
import { generateQuizFromFile } from './openrouter';

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
  const [uploadedFile, setUploadedFile] = useState(null);
  const [quizGen, setQuizGen] = useState(false);

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
          if (data.status === 'in_progress' && currentView !== 'race') {
            setCurrentView('race');
            // TODO: timer stuff
          } else if (data.status === 'finished' && currentView !== 'results') {
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
      questions: null,
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

  const submitAnswer = async (answer) => {
    if (!db || !gameId || !gameData) return;

    const playerKey = getPlayerKey();

    const currentProgress = gameData[playerKey];
    const currentQuestionIndex = currentProgress.currentIndex;
    const currentQuestion = gameData.questions[currentQuestionIndex];

    const isCorrect = currentQuestion.correct_answer.trim().toLowerCase() === answer.trim().toLowerCase();

    if(isCorrect){
        alert("Correct")
    }else{
        alert("Incorrect")
    }

    let newIndex = currentQuestionIndex + 1;
    let newCorrectCount = currentProgress.correctCount + (isCorrect ? 1 : 0);
    let updatePayload = {
      [`${playerKey}.currentIndex`]: newIndex,
      [`${playerKey}.correctCount`]: newCorrectCount,
    };

    console.log(newIndex >= gameData.questions.length)
    if (newIndex >= gameData.questions.length) {
      // TODO: timer
      
      let winnerUpdate = {};
      const hostFinished = playerKey === 'hostProgress' ? true : gameData.hostProgress.timeTaken !== null;
      const joinerFinished = playerKey === 'joinerProgress' ? true : gameData.joinerProgress.timeTaken !== null;
      
      if (hostFinished && joinerFinished) {
          const hostTime = playerKey === 'hostProgress' ? finalTime : gameData.hostProgress.timeTaken;
          const joinerTime = playerKey === 'joinerProgress' ? finalTime : gameData.joinerProgress.timeTaken;
          
          if (hostTime !== null && joinerTime !== null) {
            // Check for tie explicitly
            if (hostTime === joinerTime) {
                winnerUpdate.winnerId = null; // null signifies a tie
            } else {
                winnerUpdate.winnerId = hostTime < joinerTime ? gameData.hostId : gameData.joinerId;
            }
            winnerUpdate.status = 'finished';
          }
      } else if (hostFinished || joinerFinished) {
          winnerUpdate.status = 'finished';
      }

      updatePayload = { ...updatePayload, ...winnerUpdate };
    }

    try {
      await updateDoc(doc(db, `/quizRaces`, gameId), updatePayload);
    } catch (e) {
      console.error("Error submitting answer:", e);
      setError("Error updating progress.");
    }
  };

  // 💡 NEW: Gemini quiz generator (host-only)
  const handleGenerateQuiz = async () => {
    if (!uploadedFile) {
      alert('Please upload a file first.');
      return;
    }
    if (!db || !gameId) {
      alert('Game not initialized yet.');
      return;
    }

    try {
      const flashcards = await generateQuizFromFile(
        uploadedFile,
        import.meta.env.VITE_OPENROUTER_API_KEY
      );
      console.log('Generated flashcards:', flashcards);

      // 🔥 Update Firestore so both players get the same quiz
      await updateDoc(doc(db, `quizRaces`, gameId), {
        questions: flashcards,
      });

      alert('✅ Quiz generated!');
      setQuizGen(true);
    } catch (e) {
      console.error(e);
      alert('nah bruh it didnt work');
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
            setUploadedFile={setUploadedFile}
            handleGenerateQuiz={handleGenerateQuiz}
            quizGen={quizGen}
          />
        );
      case 'race':
        return (
          <QuizRoute
            gameData={gameData}
            userId={userId}
            getPlayerKey={getPlayerKey}
            submitAnswer={submitAnswer}
          />
        );
      case 'results':
        return <Results />;
    }
  };

  return <Fragment>{isAuthReady ? router() : <h3>Connecting to server</h3>}</Fragment>;
}

export default App;
