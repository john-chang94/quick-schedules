import { createContext, useState, useEffect } from 'react';

export const DimensionContext = createContext();

export default function DimensionContextProvider({ children }) {
    const [width, setWidth] = useState(window.innerWidth);
    const [isMobile, setIsMobile] = useState(false);

    const setWindowWidth = () => {
        setWidth(window.innerWidth);
    }

    useEffect(() => {
        setWidth(window.innerWidth);

        if (window.innerWidth < 740) setIsMobile(true);
        else setIsMobile(false);

        window.addEventListener('resize', setWindowWidth);

        return () => window.removeEventListener('resize', setWindowWidth);
    }, [width])

    return (
        <DimensionContext.Provider value={{ isMobile }}>
            {children}
        </DimensionContext.Provider>
    )
}