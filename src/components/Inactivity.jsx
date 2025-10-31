import { useState, useEffect, useRef, useCallback } from "react";
import { signOut } from "firebase/auth";
import { auth } from "../firebase/firebaseConfig";

const TIMEOUT_MINUTES = 30;
const TIMEOUT_SECONDS = TIMEOUT_MINUTES * 60;
const TIMEOUT_MS = TIMEOUT_SECONDS * 1000;

/**
 * * @param {function} navigate
 * @param {object} location
 * @returns {{formattedCountdown: string, countdownSeconds: number, clearTimers: function}}
 */
export function useInactivityTimer(navigate, location) {
    const [countdownSeconds, setCountdownSeconds] = useState(TIMEOUT_SECONDS);

    const inactivityTimeoutRef = useRef(null);
    const countdownIntervalRef = useRef(null);

    const formatTime = useCallback((seconds) => {
        if (seconds < 0) return "00:00";
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
    }, []);

    const clearTimers = useCallback(() => {
        if (inactivityTimeoutRef.current) {
            clearTimeout(inactivityTimeoutRef.current);
        }
        if (countdownIntervalRef.current) {
            clearInterval(countdownIntervalRef.current);
        }
    }, []);

    //Função de logout
    const handleLogoutTimer = useCallback(() => {
        clearTimers();

        console.warn(`Sessão encerrada por expiração de tempo (${TIMEOUT_MINUTES} minutos).`);

        signOut(auth)
            .then(() => {
                navigate("/", { replace: true });
            })
            .catch(error => {
                console.error("Erro ao fazer logout por expiração de tempo:", error);
            });
    }, [navigate, clearTimers]);


    const resetSessionTimer = useCallback(() => {
        clearTimers();

        //Chama a função de logout quando o tempo acaba
        inactivityTimeoutRef.current = setTimeout(handleLogoutTimer, TIMEOUT_MS);

        setCountdownSeconds(TIMEOUT_SECONDS);
    }, [handleLogoutTimer, clearTimers]);

    //Mudança de rota reinicia o tempo de sessão
    useEffect(() => {
        resetSessionTimer();

        return clearTimers;
    }, [location.pathname, resetSessionTimer, clearTimers]);

    useEffect(() => {
        countdownIntervalRef.current = setInterval(() => {
            setCountdownSeconds((prev) => {
                if (prev <= 1) {
                    clearInterval(countdownIntervalRef.current);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => {
            if (countdownIntervalRef.current) {
                clearInterval(countdownIntervalRef.current);
            }
        };
    }, []);

    return {
        formattedCountdown: formatTime(countdownSeconds),
        countdownSeconds,
        clearTimers
    };
}
