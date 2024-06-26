'use client';
import { Session, User } from 'lucia';
import React from 'react';

type SessionProviderContext = {
    user: User | null;
    session: Session | null;
};

const sessionContext = React.createContext<SessionProviderContext>(
    {} as SessionProviderContext,
);

type SessionProviderProps = {
    children: React.ReactNode;
    data: SessionProviderContext;
};

const SessionProvider: React.FC<SessionProviderProps> = (props) => {
    const {
        children,
        data: { user, session },
    } = props;

    console.log('Session provider rerender');

    return (
        <sessionContext.Provider value={{ user, session }}>
            {children}
        </sessionContext.Provider>
    );
};
export default SessionProvider;

export const useSession = () => {
    const context = React.useContext(sessionContext);
    if (!context) {
        throw new Error('useSession must be used within a SessionProvider');
    }

    return context;
};
