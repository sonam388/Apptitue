import { useEffect, useContext, useState, createContext } from 'react'
import { useNavigate } from 'react-router-dom'
import './Style/AuthLoader.css' // Import the new High-End CSS

const Authcontext = createContext()

export const Authprovider = ({children}) => {
    const [isloggedIn, setIsloggedIn] = useState(false)
    const [loading, setLoading] = useState(true)
    const [systemMsg, setSystemMsg] = useState("INITIALIZING CORE...")
    const navigate = useNavigate()

    useEffect(() => {
        const sequence = async () => {
            // Cinematic Loading Sequence
            setTimeout(() => setSystemMsg("ESTABLISHING SECURE UPLINK..."), 800)
            setTimeout(() => setSystemMsg("VERIFYING BIOMETRICS..."), 1800)
            setTimeout(() => setSystemMsg("DECRYPTING USER DATA..."), 2800)
            
            const token = localStorage.getItem('token')
            
            // Final Check
            setTimeout(() => {
                setSystemMsg(token ? "ACCESS GRANTED. WELCOME." : "ACCESS DENIED. REDIRECTING...")
            }, 3800)

            // Finish Loading
            setTimeout(() => {
                setIsloggedIn(!!token)
                setLoading(false)
            }, 4500) // 4.5 Seconds total for the full visual effect
        }
        sequence()
    }, [])

    const login = (token) => {
        setIsloggedIn(true)
        localStorage.setItem('token', token)
        navigate('/profile')
    }

    const logout = () => {
        setIsloggedIn(false)
        localStorage.removeItem('token')
        navigate('/home')
    }

    // 🔥 THE QUANTUM HUD LOADER STRUCTURE
    if (loading) {
        return (
            <div className="hud-container">
                {/* Background Grid & Scanlines */}
                <div className="scanlines"></div>
                <div className="cyber-grid"></div>
                
                {/* Main Content */}
                <div className="hud-wrapper">
                    <div className="reactor-core">
                        <div className="coil coil-1"></div>
                        <div className="coil coil-2"></div>
                        <div className="coil coil-3"></div>
                        <div className="coil coil-4"></div>
                        <div className="core-sphere"></div>
                    </div>
                    
                    <div className="hologram-base"></div>

                    <div className="info-panel">
                        <h1 className="glitch-title" data-text="APPTITUDE">APPTITUDE</h1>
                        <div className="system-status">
                            <span className="blink">█</span> {systemMsg}
                        </div>
                        <div className="progress-bar-hud">
                            <div className="progress-fill"></div>
                        </div>
                    </div>
                </div>

                {/* Decorative Particles */}
                <div className="particles">
                    <span></span><span></span><span></span><span></span><span></span>
                </div>
            </div>
        )
    }

    return (
        <Authcontext.Provider value={{isloggedIn, login, logout, loading}}>
            {children}
        </Authcontext.Provider>
    )
}

export const useAuth = () => useContext(Authcontext)