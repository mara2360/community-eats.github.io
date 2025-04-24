import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from './firebaseConfig';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import googleLogo from './assets/images/google-logo.png';

const LoginPage = () => {
    const navigate = useNavigate();
    const [authError, setAuthError] = useState(null);
    const [isSigningIn, setIsSigningIn] = useState(false);

    const styles = {
        container: {
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: "100vh",
            background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
            padding: "20px",
        },
        loginBox: {
            backgroundColor: "#ffffff",
            borderRadius: "16px",
            padding: "2.5rem",
            width: "100%",
            maxWidth: "420px",
            boxShadow: "0 10px 30px rgba(0, 0, 0, 0.1)",
            border: "1px solid rgba(66, 133, 244, 0.2)",
            textAlign: "center", 
        },
        welcomeBox: {
            background: "linear-gradient(to right, #E8F0FE, #f0f7ff)",
            borderRadius: "12px",
            padding: "25px",
            marginBottom: "30px",
            borderLeft: "6px solid #4285F4",
        },
        title: {
            fontSize: "28px",
            fontWeight: "700",
            color: "#1a73e8",
            marginBottom: "15px",
            fontFamily: "'Segoe UI', Roboto, sans-serif",
        },
        description: {
            fontFamily: "'Instrument Sans', sansSerif",
            fontSize: "16px",
            color: "#5f6368",
            lineHeight: "1.6",
            marginBottom: "5px",
        },
        button: {
            background: "#4285F4",
            color: "#fff",
            padding: "14px 24px",
            fontSize: "16px",
            fontWeight: "600",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "12px",
            width: "100%",
            transition: "all 0.3s ease",
            position: "relative",
            overflow: "hidden",
        },
        buttonHover: {
            background: "#3367D6",
            transform: "translateY(-2px)",
            boxShadow: "0 6px 12px rgba(66, 133, 244, 0.3)",
        },
        buttonDisabled: {
            opacity: 0.7,
            cursor: "not-allowed",
        },
        error: {
            color: "#d32f2f",
            marginTop: "20px",
            fontSize: "14px",
            padding: "10px",
            background: "#ffebee",
            borderRadius: "6px",
        },
        googleIcon: {
            width: "20px",
            height: "20px",
            background: "white",
            padding: "5px",
            borderRadius: "4px",
        }
    };

    const handleSignIn = async () => {
        setIsSigningIn(true);
        setAuthError(null);
        const provider = new GoogleAuthProvider();
      
        try {
            await signInWithPopup(auth, provider);
            navigate("/home");
        } catch (error) {
            console.error("Google sign-in error:", error);
            setAuthError("Failed to sign in. Please try again.");
        } finally {
            setIsSigningIn(false);
        }
    };

    return (
        <div style={styles.container}>
            <div style={styles.loginBox}>
                <div style={styles.welcomeBox}>
                    <h1 style={styles.title}>Welcome to Community Eats!</h1>
                    <p style={styles.description}>
                        To use our awesome features please login to continue.
                    </p>
                </div>
                
                <button
                    style={{
                        ...styles.button,
                        ...(isSigningIn ? styles.buttonDisabled : {})
                    }}
                    onClick={handleSignIn}
                    disabled={isSigningIn}
                    onMouseEnter={(e) => !isSigningIn && (e.target.style.backgroundColor = styles.buttonHover.backgroundColor)}
                    onMouseLeave={(e) => !isSigningIn && (e.target.style.backgroundColor = styles.button.backgroundColor)}
                >
                    {isSigningIn ? (
                        "Signing In..."
                    ) : (
                        <>
                            <img
                                src={googleLogo}
                                alt="Google logo"
                                style={styles.googleIcon}
                            />
                            Sign in with Google
                        </>
                    )}
                </button>
                {authError && <div style={styles.error}>{authError}</div>}
            </div>
        </div>
    );
};

export default LoginPage;
