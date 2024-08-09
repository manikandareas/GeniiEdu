import ApplicationLayout from '@/common/components/elements/application-layout';

type LayoutProps = {
    children: React.ReactNode;
};

const Layout: React.FC<LayoutProps> = ({ children }) => {
    return <ApplicationLayout>{children}</ApplicationLayout>;
};
export default Layout;
