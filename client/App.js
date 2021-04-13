import React from 'react';
import Routes from './routes';
import Navbar from './Navbar';
import Footer from './Footer';
import Main from './Main';

const App = () => {
  return (
    <div>
      <Navbar />
      <Routes />
      <Main />
      <Footer />
    </div>
  );
};

export default App;
