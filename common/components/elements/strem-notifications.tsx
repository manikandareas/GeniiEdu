'use client';

import { Goreal } from '@/common/libs/goreal';
import { useSession } from '../providers/session-provider';
import React, { useEffect } from 'react';
import { useUserNotificationsQuery } from '@/common/hooks/user-notifications-query';

type StreamNotificationsProps = {};

const StreamNotifications: React.FC<StreamNotificationsProps> = () => {
    const { user } = useSession();
    const goreal = new Goreal(user?.id ?? '');
    const { invalidate } = useUserNotificationsQuery();

    useEffect(() => {
        goreal.streamNotifications((data) => {
            console.log({ data });

            if (data.includes('notification-updated')) {
                invalidate();
            }
        });

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user]);

    return null;
};
export default StreamNotifications;
