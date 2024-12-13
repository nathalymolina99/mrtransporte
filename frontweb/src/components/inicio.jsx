import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import '../App.css'
import logoImage from '../images/titulo.png';
import LoginForm from './loginForm';

export default function FullScreenLanding() {
    const [showLogin, setShowLogin] = useState(false)
  
    const handleImageClick = () => {
      setShowLogin(true)
    }
  
    return (
      <div className="full-screen-container">
        <AnimatePresence>
          {!showLogin && (
            <>
              <motion.div
                initial={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.8 }}
                className="background-container"
                onClick={handleImageClick}
              />
              <motion.div
                initial={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.8 }}
                className="logo-container"
              >
                <img 
                  src={logoImage} 
                  alt="Logo" 
                  className="logo" 
                  onClick={handleImageClick}
                />
              </motion.div>
            </>
          )}
        </AnimatePresence>
  
        <AnimatePresence>
          {showLogin && (
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="login-container"
            >
            <LoginForm/>
            
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    )
  }