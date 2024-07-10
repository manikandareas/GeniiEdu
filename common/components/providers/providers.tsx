import ReactQueryProvider from './react-query-provider';
import SessionProvider, { SessionProviderContext } from './session-provider';
import { ThemeProvider } from './theme-provider';

type ProvidersProps = {
    children: React.ReactNode;
    session: SessionProviderContext;
};

const Providers: React.FC<ProvidersProps> = ({ children, session }) => {
    return (
        <SessionProvider data={session}>
            <ReactQueryProvider>
                <ThemeProvider
                    attribute='class'
                    defaultTheme='system'
                    enableSystem
                    disableTransitionOnChange
                >
                    {children}
                </ThemeProvider>
            </ReactQueryProvider>
        </SessionProvider>
    );
};
export default Providers;
