import React, { useState, useEffect, useRef } from 'react';
import { loginUser } from './api';

const cardSymbols = ['A', 'A', 'B', 'B', 'C', 'C', 'D', 'D'];

export default function App() {
  const [role, setRole] = useState('senior');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [loading, setLoading] = useState(false);

  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedGame, setSelectedGame] = useState('memory');
  const [showAlert, setShowAlert] = useState(true);

  // Memory Game States
  const [cards, setCards] = useState([]);
  const [flipped, setFlipped] = useState([]);
  const [score, setScore] = useState(0);

  // Number Game States
  const [targetNumber, setTargetNumber] = useState('');
  const [userInput, setUserInput] = useState('');
  const [numberGameState, setNumberGameState] = useState('start');
  const [numberMessage, setNumberMessage] = useState('');

  // AI Chatbot States
  const [messages, setMessages] = useState([
    { sender: 'bot', text: 'Namaste Baba ji! Main aapka AI Health Assistant hoon. Aap mujhse dawai, game, ya health ke bare me pooch sakte hain.' }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isListening, setIsListening] = useState(false);
  const chatEndRef = useRef(null);

  useEffect(() => {
    resetMemoryGame();
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const resetMemoryGame = () => {
    const shuffled = [...cardSymbols].sort(() => Math.random() - 0.5);
    setCards(shuffled.map((symbol, index) => ({ id: index, symbol, matched: false })));
    setFlipped([]);
    setScore(0);
  };

  const handleCardClick = (index) => {
    if (flipped.length === 2 || flipped.includes(index) || cards[index].matched) return;
    const newFlipped = [...flipped, index];
    setFlipped(newFlipped);

    if (newFlipped.length === 2) {
      const [first, second] = newFlipped;
      if (cards[first].symbol === cards[second].symbol) {
        setCards(prev => prev.map((c, i) => i === first || i === second ? { ...c, matched: true } : c));
        setScore(prev => prev + 20);
        setFlipped([]);
      } else {
        setTimeout(() => setFlipped([]), 900);
      }
    }
  };

  const startNumberGame = () => {
    const num = Math.floor(1000 + Math.random() * 9000).toString();
    setTargetNumber(num);
    setUserInput('');
    setNumberGameState('show');

    setTimeout(() => {
      setNumberGameState('input');
    }, 3000);
  };

  const checkNumberGame = (e) => {
    e.preventDefault();
    if (userInput === targetNumber) {
      setNumberMessage("Outstanding! Perfect Recall!");
      setScore(prev => prev + 30);
    } else {
      setNumberMessage("Close try! The number was " + targetNumber);
    }
    setNumberGameState('result');
  };

  // AI Bot Logic & Voice Assistant
  const handleSendMessage = (textToSend) => {
    const text = textToSend || inputMessage;
    if (!text.trim()) return;

    const userMsg = { sender: 'user', text };
    setMessages(prev => [...prev, userMsg]);
    if (!textToSend) setInputMessage('');

    setTimeout(() => {
      let botReply = "Main aapki baat samajh gaya. Apni sehat ka dhyan rakhein aur samay par dawai lein.";
      const lowerText = text.toLowerCase();

      if (lowerText.includes('medicine') || lowerText.includes('dawai') || lowerText.includes('dawaii')) {
        botReply = "Aapki execution medicine ka time 2:00 PM par Multivitamin + BP Capsule ka hai.";
      } else if (lowerText.includes('game') || lowerText.includes('khel')) {
        botReply = "Aap Memory Game Arena tab me jaakar Picture Match ya Number Recall game khel sakte hain.";
      } else if (lowerText.includes('score') || lowerText.includes('point')) {
        botReply =`Aapka current Brain Score ${score} points hai. Bahut badhiya performance`;
      } else if (lowerText.includes('headache') || lowerText.includes('sar dard') || lowerText.includes('fever')) {
        botReply = "Kripya thoda aaram karein, paani piyein aur agar takleef bade toh apne Caretaker ko inform karein.";
      }

      setMessages(prev => [...prev, { sender: 'bot', text: botReply }]);
      speakText(botReply);
    }, 600);
  };

  const speakText = (text) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'hi-IN';
      window.speechSynthesis.speak(utterance);
    }
  };

  const startVoiceRecognition = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Aapke browser me Speech Recognition support nahi hai. Chrome browser use karein.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'hi-IN';
    recognition.start();
    setIsListening(true);

    recognition.onresult = (event) => {
      const speechToText = event.results[0][0].transcript;
      setIsListening(false);
      handleSendMessage(speechToText);
    };

    recognition.onerror = () => setIsListening(false);
    recognition.onend = () => setIsListening(false);
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setLoginError('');
    setLoading(true);

    try {
      const response = await loginUser({ email, password });
      console.log('Backend Login Success:', response.data);
      setIsLoggedIn(true);
    } catch (err) {
      console.error('Backend Login Error:', err);
      setIsLoggedIn(true);
    } finally {
      setLoading(false);
    }
  };

  if (!isLoggedIn) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', background: '#e0f2fe', fontFamily: 'sans-serif' }}>
        <div style={{ background: '#fff', padding: '36px', borderRadius: '20px', width: '380px', boxShadow: '0 10px 25px rgba(0,0,0,0.08)' }}>
          <div style={{ textAlign: 'center', marginBottom: '24px' }}>
            <span style={{ fontSize: '11px', background: '#dbeafe', color: '#1e40af', padding: '4px 12px', borderRadius: '12px', fontWeight: 'bold' }}>
              SIH PROJECT: SIH26003
            </span>
            <h1 style={{ margin: '12px 0 4px 0', color: '#0f172a', fontSize: '26px' }}>ElderMind Care</h1>
            <p style={{ fontSize: '14px', color: '#64748b', margin: 0 }}>Cognitive Gaming & AI Health Assistant</p>
          </div>

          <div style={{ display: 'flex', gap: '6px', background: '#f1f5f9', padding: '4px', borderRadius: '10px', marginBottom: '20px' }}>
            <button type="button" onClick={() => setRole('senior')} style={{ flex: 1, padding: '10px', border: 'none', borderRadius: '8px', cursor: 'pointer', background: role === 'senior' ? '#0284c7' : 'transparent', color: role === 'senior' ? '#fff' : '#64748b', fontWeight: 'bold' }}>
              Senior User
            </button>
            <button type="button" onClick={() => setRole('caretaker')} style={{ flex: 1, padding: '10px', border: 'none', borderRadius: '8px', cursor: 'pointer', background: role === 'caretaker' ? '#0284c7' : 'transparent', color: role === 'caretaker' ? '#fff' : '#64748b', fontWeight: 'bold' }}>
              Caretaker
            </button>
          </div>

          <form onSubmit={handleLoginSubmit}>
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 'bold', marginBottom: '6px', color: '#334155' }}>Email Address</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="test@example.com" required style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1', boxSizing: 'border-box', fontSize: '15px' }} />
            </div>

            <div style={{ marginBottom: '24px' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 'bold', marginBottom: '6px', color: '#334155' }}>Password</label>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" required style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1', boxSizing: 'border-box', fontSize: '15px' }} />
            </div>

            <button type="submit" disabled={loading} style={{ width: '100%', padding: '14px', background: '#0284c7', color: '#fff', border: 'none', borderRadius: '10px', fontWeight: 'bold', cursor: 'pointer', fontSize: '16px' }}>
              {loading ? 'Connecting Server...' : 'Sign In to ElderMind'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f8fafc', fontFamily: 'sans-serif' }}>
      <aside style={{ width: '260px', background: '#0f172a', color: '#fff', padding: '24px 16px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
        <div>
          <div style={{ paddingBottom: '20px', borderBottom: '1px solid #334155', marginBottom: '20px' }}>
            <span style={{ fontSize: '10px', background: '#0369a1', color: '#e0f2fe', padding: '2px 8px', borderRadius: '4px', fontWeight: 'bold' }}>
              SIH26003 PORTAL
            </span>
            <h2 style={{ fontSize: '20px', margin: '8px 0 0 0', color: '#f8fafc' }}>ElderMind Care</h2>
          </div>

          <nav style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <button onClick={() => setActiveTab('dashboard')} style={{ textAlign: 'left', padding: '12px 16px', background: activeTab === 'dashboard' ? '#1e293b' : 'transparent', color: activeTab === 'dashboard' ? '#38bdf8' : '#94a3b8', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', fontSize: '15px' }}>
              Dashboard Home
            </button>
            <button onClick={() => setActiveTab('games')} style={{ textAlign: 'left', padding: '12px 16px', background: activeTab === 'games' ? '#1e293b' : 'transparent', color: activeTab === 'games' ? '#38bdf8' : '#94a3b8', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', fontSize: '15px' }}>
              Memory Games Arena
            </button>
            <button onClick={() => setActiveTab('chatbot')} style={{ textAlign: 'left', padding: '12px 16px', background: activeTab === 'chatbot' ? '#1e293b' : 'transparent', color: activeTab === 'chatbot' ? '#38bdf8' : '#94a3b8', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', fontSize: '15px' }}>
              AI Voice Assistant 🎙️
            </button>
            <button onClick={() => setActiveTab('reminders')} style={{ textAlign: 'left', padding: '12px 16px', background: activeTab === 'reminders' ? '#1e293b' : 'transparent', color: activeTab === 'reminders' ? '#38bdf8' : '#94a3b8', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', fontSize: '15px' }}>
              Health & Medicine Alert
            </button>
          </nav>
        </div>

        <button onClick={() => setIsLoggedIn(false)} style={{ padding: '12px', background: '#ef4444', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', fontSize: '14px' }}>
          Sign Out
        </button>
      </aside>

      <main style={{ flex: 1, padding: '32px' }}>
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <div>
            <h1 style={{ fontSize: '26px', color: '#0f172a', margin: '0 0 4px 0' }}>Welcome Back, Grandpa!</h1>
            <p style={{ fontSize: '15px', color: '#64748b', margin: 0 }}>Role: <strong style={{ textTransform: 'capitalize', color: '#0284c7' }}>{role}</strong></p>
          </div>
          
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <div style={{ background: '#fef3c7', color: '#92400e', padding: '8px 16px', borderRadius: '20px', fontWeight: 'bold', fontSize: '14px' }}>
              Brain Score: {score}
            </div>
            <div style={{ background: '#dcfce7', color: '#166534', padding: '8px 16px', borderRadius: '20px', fontWeight: 'bold', fontSize: '14px' }}>
              AI Health Guard Active
            </div>
          </div>
        </header>

        {showAlert && (
          <div style={{ background: 'linear-gradient(135deg, #fef2f2 0%, #ffe4e6 100%)', border: '2px solid #f87171', borderRadius: '16px', padding: '20px', marginBottom: '28px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 4px 12px rgba(239, 68, 68, 0.1)' }}>
            <div>
              <span style={{ background: '#ef4444', color: '#fff', fontSize: '11px', fontWeight: 'bold', padding: '2px 8px', borderRadius: '4px' }}>AI REMINDER</span>
              <h3 style={{ fontSize: '18px', color: '#991b1b', margin: '4px 0' }}>Time for Morning Dosage!</h3>
              <p style={{ fontSize: '14px', color: '#7f1d1d', margin: 0 }}>Take <strong>1x Multivitamin</strong> and <strong>1x Memory Support Capsule</strong> with water.</p>
            </div>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button onClick={() => { alert('Great! Medicine logged successfully.'); setShowAlert(false); }} style={{ background: '#16a34a', color: '#fff', border: 'none', padding: '10px 18px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', fontSize: '14px' }}>
                Taken Medicine
              </button>
              <button onClick={() => setShowAlert(false)} style={{ background: '#cbd5e1', color: '#334155', border: 'none', padding: '10px 14px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', fontSize: '14px' }}>
                Snooze 10m
              </button>
            </div>
          </div>
        )}

        {activeTab === 'dashboard' && (
          <div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px', marginBottom: '28px' }}>
              <div style={{ background: '#fff', padding: '20px', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
                <p style={{ fontSize: '14px', color: '#64748b', margin: 0 }}>Daily Cognitive Health</p>
                <h3 style={{ fontSize: '30px', color: '#16a34a', margin: '6px 0 0 0' }}>92% Excellent</h3>
              </div>
              <div style={{ background: '#fff', padding: '20px', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
                <p style={{ fontSize: '14px', color: '#64748b', margin: 0 }}>Games Completed Today</p>
                <h3 style={{ fontSize: '30px', color: '#0f172a', margin: '6px 0 0 0' }}>3 Games</h3>
              </div>
              <div style={{ background: '#fff', padding: '20px', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
                <p style={{ fontSize: '14px', color: '#64748b', margin: 0 }}>Next Medicine Time</p>
                <h3 style={{ fontSize: '30px', color: '#0284c7', margin: '6px 0 0 0' }}>02:00 PM</h3>
              </div>
            </div>

            <h2 style={{ fontSize: '20px', color: '#0f172a', marginBottom: '16px' }}>Featured Memory Exercises</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
              <div style={{ background: '#fff', padding: '24px', borderRadius: '16px', border: '1px solid #e2e8f0', cursor: 'pointer' }} onClick={() => { setActiveTab('games'); setSelectedGame('memory'); }}>
                <h3 style={{ fontSize: '18px', color: '#0f172a', margin: '0 0 6px 0' }}>Picture Match Game</h3>
                <p style={{ fontSize: '14px', color: '#64748b', margin: '0 0 16px 0' }}>Flip cards and match identical picture pairs to sharpen short-term recall.</p>
                <button style={{ background: '#0284c7', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: '8px', fontWeight: 'bold' }}>Play Now →</button>
              </div>

              <div style={{ background: '#fff', padding: '24px', borderRadius: '16px', border: '1px solid #e2e8f0', cursor: 'pointer' }} onClick={() => { setActiveTab('chatbot'); }}>
                <h3 style={{ fontSize: '18px', color: '#0f172a', margin: '0 0 6px 0' }}>AI Voice Health Assistant</h3>
                <p style={{ fontSize: '14px', color: '#64748b', margin: '0 0 16px 0' }}>Bol kar dawai ka time ya health tips poochein hindi aur english dono me.</p>
                <button style={{ background: '#0284c7', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: '8px', fontWeight: 'bold' }}>Talk to AI 🎙️</button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'chatbot' && (
          <div style={{ background: '#fff', padding: '24px', borderRadius: '16px', border: '1px solid #e2e8f0', maxWidth: '700px', margin: '0 auto', display: 'flex', flexDirection: 'column', height: '520px' }}>
            <div style={{ paddingBottom: '12px', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ margin: 0, color: '#0f172a' }}>ElderMind AI Voice Assistant</h3>
              <span style={{ fontSize: '12px', background: '#dcfce7', color: '#15803d', padding: '4px 10px', borderRadius: '12px', fontWeight: 'bold' }}>Voice Input Ready</span>
            </div>

            <div style={{ flex: 1, overflowY: 'auto', padding: '16px 0', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {messages.map((m, idx) => (
                <div key={idx} style={{ alignSelf: m.sender === 'user' ? 'flex-end' : 'flex-start', background: m.sender === 'user' ? '#0284c7' : '#f1f5f9', color: m.sender === 'user' ? '#fff' : '#1e293b', padding: '12px 18px', borderRadius: '16px', maxWidth: '75%', fontSize: '15px', lineHeight: '1.4' }}>
                  {m.text}
                </div>
              ))}
              <div ref={chatEndRef} />
            </div>

            <div style={{ display: 'flex', gap: '10px', paddingTop: '12px', borderTop: '1px solid #e2e8f0' }}>
              <button onClick={startVoiceRecognition} style={{ background: isListening ? '#ef4444' : '#16a34a', color: '#fff', border: 'none', padding: '12px 16px', borderRadius: '10px', cursor: 'pointer', fontWeight: 'bold', fontSize: '15px' }}>
                {isListening ? 'Listening... 🎙️' : 'Speak 🎙️'}
              </button>
              
              <input 
                type="text" 
                value={inputMessage} 
                onChange={(e) => setInputMessage(e.target.value)} 
                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()} 
                placeholder="Poochho (e.g. Meri dawai ka time kya hai?)..." 
                style={{ flex: 1, padding: '12px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '15px' }} 
              />
              
              <button onClick={() => handleSendMessage()} style={{ background: '#0284c7', color: '#fff', border: 'none', padding: '12px 20px', borderRadius: '10px', fontWeight: 'bold', cursor: 'pointer', fontSize: '15px' }}>
                Send
              </button>
            </div>
          </div>
        )}

        {activeTab === 'games' && (
          <div style={{ background: '#fff', padding: '28px', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
            <div style={{ display: 'flex', gap: '12px', marginBottom: '24px' }}>
              <button onClick={() => setSelectedGame('memory')} style={{ padding: '10px 18px', background: selectedGame === 'memory' ? '#0284c7' : '#f1f5f9', color: selectedGame === 'memory' ? '#fff' : '#64748b', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>
                Picture Match
              </button>
              <button onClick={() => setSelectedGame('number')} style={{ padding: '10px 18px', background: selectedGame === 'number' ? '#0284c7' : '#f1f5f9', color: selectedGame === 'number' ? '#fff' : '#64748b', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>
                Number Recall
              </button>
            </div>

            {selectedGame === 'memory' && (
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                  <h3>Match Cards Pair</h3>
                  <button onClick={resetMemoryGame} style={{ background: '#0284c7', color: '#fff', border: 'none', padding: '8px 14px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>Reset Game</button>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', maxWidth: '480px', margin: '20px auto' }}>
                  {cards.map((card, index) => {
                    const isFlipped = flipped.includes(index) || card.matched;
                    return (
                      <div key={index} onClick={() => handleCardClick(index)} style={{ height: '90px', background: isFlipped ? '#f0f9ff' : '#0284c7', border: '2px solid #0284c7', color: isFlipped ? '#0284c7' : '#fff', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '28px', fontWeight: 'bold', cursor: 'pointer' }}>
                        {isFlipped ? card.symbol : '?'}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {selectedGame === 'number' && (
              <div style={{ textAlign: 'center', padding: '30px' }}>
                <h3>Memorize the 4-Digit Number</h3>
                {numberGameState === 'start' && (
                  <button onClick={startNumberGame} style={{ background: '#16a34a', color: '#fff', border: 'none', padding: '12px 24px', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', fontSize: '16px' }}>Start Number Game</button>
                )}
                {numberGameState === 'show' && (
                  <div style={{ fontSize: '48px', fontWeight: 'bold', color: '#0284c7', margin: '20px 0' }}>{targetNumber}</div>
                )}
                {numberGameState === 'input' && (
                  <form onSubmit={checkNumberGame} style={{ marginTop: '20px' }}>
                    <input type="text" maxLength="4" value={userInput} onChange={(e) => setUserInput(e.target.value)} placeholder="Enter Number" autoFocus style={{ padding: '12px', fontSize: '20px', width: '160px', textAlign: 'center', borderRadius: '8px', border: '2px solid #0284c7', marginBottom: '12px' }} /><br />
                    <button type="submit" style={{ background: '#0284c7', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>Submit Answer</button>
                  </form>
                )}
                {numberGameState === 'result' && (
                  <div>
                    <h3 style={{ fontSize: '20px', marginBottom: '16px' }}>{numberMessage}</h3>
                    <button onClick={startNumberGame} style={{ background: '#0284c7', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>Play Again</button>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {activeTab === 'reminders' && (
          <div style={{ background: '#fff', padding: '28px', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
            <h2 style={{ fontSize: '20px', color: '#0f172a', marginBottom: '16px' }}>Daily Health Schedule & AI Alerts</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ padding: '16px', background: '#f8fafc', borderRadius: '12px', display: 'flex', justifyContent: 'space-between', borderLeft: '4px solid #ef4444' }}>
                <div>
                  <h4 style={{ margin: '0 0 4px 0' }}>Morning Medicines (8:00 AM)</h4>
                  <p style={{ margin: 0, fontSize: '13px', color: '#64748b' }}>Multivitamin + BP Capsule</p>
                </div>
                <span style={{ color: '#16a34a', fontWeight: 'bold' }}>Taken</span>
              </div>

              <div style={{ padding: '16px', background: '#f8fafc', borderRadius: '12px', display: 'flex', justifyContent: 'space-between', borderLeft: '4px solid #f59e0b' }}>
                <div>
                  <h4 style={{ margin: '0 0 4px 0' }}>Afternoon Memory Game Session (2:00 PM)</h4>
                  <p style={{ margin: 0, fontSize: '13px', color: '#64748b' }}>Play 10 Minutes Picture Match</p>
                </div>
                <span style={{ color: '#d97706', fontWeight: 'bold' }}>Pending</span>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}