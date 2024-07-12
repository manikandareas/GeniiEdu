import { TabsList, TabsTrigger } from '@/common/components/ui/tabs';

type TabsListClassProps = {
    tabs: TabsTriggerClassProps[];
};

const TabsListClass: React.FC<TabsListClassProps> = ({ tabs }) => {
    return (
        <TabsList className='flex overflow-x-scroll'>
            {tabs.map((tab) => (
                <TabsTriggerClass key={tab.value} value={tab.value}>
                    {tab.children}
                </TabsTriggerClass>
            ))}
        </TabsList>
    );
};
export default TabsListClass;

type TabsTriggerClassProps = {
    value: string;

    children: React.ReactNode;
};
export const TabsTriggerClass: React.FC<TabsTriggerClassProps> = ({
    children,
    value,
}) => {
    return (
        <TabsTrigger className='flex-1 space-x-2' value={value}>
            {children}
        </TabsTrigger>
    );
};
