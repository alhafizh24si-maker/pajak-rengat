import React from 'react';
import ChatWidget from './components/chatbot/ChatWidget';

function App() {
  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#E9ECEF',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: 'sans-serif'
    }}>
      <h1 style={{ color: '#002B49' }}>KPP Pratama Rengat - AI Assistant Demo</h1>
      
      {/* The new Chatbot Widget (Phase v1) */}
      <ChatWidget />
    </div>
  );
}

export default App;
