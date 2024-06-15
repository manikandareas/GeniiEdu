import { Dashboard } from '@/common/components/elements/Dashboard';
import { validateRequest } from '@/common/libs/lucia';
import { redirect } from 'next/navigation';

const HomePage = async () => {
    const { session } = await validateRequest();
    if (!session) {
        return redirect('/login');
    }
    return (
        <main>
            <Dashboard />
        </main>
    );
};

export default HomePage;
