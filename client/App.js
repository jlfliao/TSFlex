import React from 'react';
import Routes from './routes';
import Navbar from './Navbar';
import Footer from './Footer';

const App = () => {
  return (
    <div>
      <Navbar />
      <Routes />
      <Footer />
    </div>
  );
};

export default App;
