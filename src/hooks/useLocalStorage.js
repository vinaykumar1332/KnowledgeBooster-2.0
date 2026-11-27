/**
 * useLocalStorage Hook
 * Custom hook for managing localStorage with React state
 */

import { useState, useEffect } from 'react';

/**
 * Custom hook for localStorage
 * Syncs with localStorage and state automatically
 *
 * @param {string} key - The localStorage key
 * @param {any} initialValue - Initial value if key doesn't exist
 * @returns {[any, (value: any) => void, () => void]} - [storedValue, setValue, removeValue]
 *
 * @example
 * const [name, setName, removeName] = useLocalStorage('userName', 'Guest');
 */
export const useLocalStorage = (key, initialValue) => {
    const [storedValue, setStoredValue] = useState(() => {
        try {
            const item = window.localStorage.getItem(key);
            return item ? JSON.parse(item) : initialValue;
        } catch (error) {
            console.error(`Error reading localStorage key "${key}":`, error);
            return initialValue;
        }
    });

    const setValue = (value) => {
        try {
            const valueToStore = value instanceof Function ? value(storedValue) : value;
            setStoredValue(valueToStore);

            if (valueToStore === undefined || valueToStore === null) {
                window.localStorage.removeItem(key);
            } else {
                window.localStorage.setItem(key, JSON.stringify(valueToStore));
            }
        } catch (error) {
            console.error(`Error setting localStorage key "${key}":`, error);
        }
    };

    const removeValue = () => {
        try {
            window.localStorage.removeItem(key);
            setStoredValue(initialValue);
        } catch (error) {
            console.error(`Error removing localStorage key "${key}":`, error);
        }
    };

    return [storedValue, setValue, removeValue];
};

/**
 * Hook to sync localStorage across tabs/windows
 * @param {string} key - The localStorage key
 * @returns {[any, (value: any) => void]} - [storedValue, setValue]
 */
export const useLocalStorageSync = (key, initialValue) => {
    const [storedValue, setStoredValue] = useLocalStorage(key, initialValue);

    useEffect(() => {
        const handleStorageChange = (e) => {
            if (e.key === key && e.newValue) {
                try {
                    setStoredValue(JSON.parse(e.newValue));
                } catch (error) {
                    console.error('Error syncing localStorage:', error);
                }
            }
        };

        window.addEventListener('storage', handleStorageChange);
        return () => window.removeEventListener('storage', handleStorageChange);
    }, [key, setStoredValue]);

    return [storedValue, setStoredValue];
};

/**
 * Hook for session storage (similar to useLocalStorage)
 * @param {string} key - The sessionStorage key
 * @param {any} initialValue - Initial value
 * @returns {[any, (value: any) => void, () => void]} - [storedValue, setValue, removeValue]
 */
export const useSessionStorage = (key, initialValue) => {
    const [storedValue, setStoredValue] = useState(() => {
        try {
            const item = window.sessionStorage.getItem(key);
            return item ? JSON.parse(item) : initialValue;
        } catch (error) {
            console.error(`Error reading sessionStorage key "${key}":`, error);
            return initialValue;
        }
    });

    const setValue = (value) => {
        try {
            const valueToStore = value instanceof Function ? value(storedValue) : value;
            setStoredValue(valueToStore);

            if (valueToStore === undefined || valueToStore === null) {
                window.sessionStorage.removeItem(key);
            } else {
                window.sessionStorage.setItem(key, JSON.stringify(valueToStore));
            }
        } catch (error) {
            console.error(`Error setting sessionStorage key "${key}":`, error);
        }
    };

    const removeValue = () => {
        try {
            window.sessionStorage.removeItem(key);
            setStoredValue(initialValue);
        } catch (error) {
            console.error(`Error removing sessionStorage key "${key}":`, error);
        }
    };

    return [storedValue, setValue, removeValue];
};

export default useLocalStorage;
