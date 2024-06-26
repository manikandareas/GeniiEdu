import ApplicationLayout from '@/common/components/elements/ApplicationLayout';

type LayoutProps = {
    children: React.ReactNode;
};

const Layout: React.FC<LayoutProps> = ({ children }) => {
    return <ApplicationLayout>{children}</ApplicationLayout>;
};
export default Layout;
