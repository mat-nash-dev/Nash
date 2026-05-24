import React from 'react';
import { ThemeProvider } from './contexts/ThemeContext';
import { AppProvider, useAppContext } from './context/AppContext';
import { AnimatePresence, motion } from 'framer-motion';
import CustomCursor from './components/CustomCursor';
import DashboardLayout from './components/DashboardLayout.jsx';
import Navbar from './components/Navbar.jsx';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

import Home from './pages/Home';
import Projects from './pages/Projects';
import Contact from './pages/Contact';
import JoinServer from './pages/JoinServer';
import Work from './pages/Work';
import Auth from './pages/Auth';
import Legal from './pages/Legal';
import Admin from './pages/Admin';
import Preloader from './components/Preloader';
import ThemeChooser from './components/ThemeChooser';

const MainApp = () => {
  const { appStatus } = useAppContext();

  return (
    <AnimatePresence mode="wait">
      {appStatus !== 'finished' ? (
        <Preloader key="preloader" />
      ) : (
        <motion.div
          key="main-app"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, staggerChildren: 0.1 }}
          className="w-full min-h-screen flex flex-col"
        >
          <Router>
            <CustomCursor />
            <ThemeChooser />
            <DashboardLayout>
              <Navbar />
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/projects" element={<Projects />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/join-server" element={<JoinServer />} />
                <Route path="/work" element={<Work />} />
                <Route path="/auth" element={<Auth />} />
                <Route path="/legal" element={<Legal />} />
                <Route path="/admin" element={<Admin />} />
              </Routes>
            </DashboardLayout>
            <Toaster />
          </Router>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

function App() {
  return (
    <ThemeProvider>
      <AppProvider>
        <MainApp />
      </AppProvider>
    </ThemeProvider>
  );
}

export default App;
