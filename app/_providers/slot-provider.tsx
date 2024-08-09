'use client';

import React from 'react';

type SlotContextProps = {
    slots: {
        name: string;
        children: React.ReactNode;
    }[];
    setSlots: React.Dispatch<
        React.SetStateAction<{ name: string; children: React.ReactNode }[]>
    >;
};

const SlotContext = React.createContext<SlotContextProps | null>(null);

export const SlotProvider: React.FC<{ children: React.ReactNode }> = ({
    children,
}) => {
    const [slots, setSlots] = React.useState<
        { name: string; children: React.ReactNode }[]
    >([]);

    const value = React.useMemo(() => ({ slots, setSlots }), [slots, setSlots]);

    return (
        <SlotContext.Provider value={value}>{children}</SlotContext.Provider>
    );
};

const useSlot = () => {
    const context = React.useContext(SlotContext);
    if (!context) {
        throw new Error('useSlot must be used within a SlotProvider');
    }
    return context;
};

export const Slot: React.FC<{ name: string }> = ({ name }) => {
    const { slots } = useSlot();
    const matchedSlot = React.useMemo(
        () => slots.find((slot) => slot.name === name),
        [slots, name],
    );
    if (!matchedSlot) {
        return null;
    }
    return matchedSlot.children;
};

export const SetSlot: React.FC<{ name: string; children: React.ReactNode }> =
    React.memo(({ name, children }) => {
        const { setSlots } = useSlot();

        React.useEffect(() => {
            setSlots((prevSlots) => {
                const newSlots = prevSlots.filter((slot) => slot.name !== name);
                return [...newSlots, { name, children }];
            });
        }, [name, children, setSlots]);
        return null;
    });
SetSlot.displayName = 'SetSlot';
