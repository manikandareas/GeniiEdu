import { fontInter } from '@/common/libs/Fonts';
import type { Metadata } from 'next';
import './globals.css';
import { ThemeProvider } from '@/common/components/providers/ThemeProvider';
import { Toaster } from '@/common/components/ui/sonner';
import SessionProvider from '@/common/components/providers/SessionProvider';
import { validateRequest } from '@/common/libs/lucia';
import ReactQueryProvider from '@/common/components/providers/ReactQueryProvider';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import ApplicationLayout from '@/common/components/elements/ApplicationLayout';

export const metadata: Metadata = {
    title: 'GeniiEdu',
    description: 'Generated by create next app',
};

export default async function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const session = await validateRequest();

    return (
        <html lang='en'>
            <body className={fontInter.className}>
                <SessionProvider data={session}>
                    <ReactQueryProvider>
                        <ThemeProvider
                            attribute='class'
                            defaultTheme='system'
                            enableSystem
                            disableTransitionOnChange
                        >
                            <ApplicationLayout>{children}</ApplicationLayout>
                            <Toaster richColors position='top-center' />
                        </ThemeProvider>

                        <ReactQueryDevtools initialIsOpen={false} />
                    </ReactQueryProvider>
                </SessionProvider>
            </body>
        </html>
    );
}
