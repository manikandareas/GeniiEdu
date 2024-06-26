'use client';
import {
    AlertDialog,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@/common/components/ui/alert-dialog';
import { Button } from '@/common/components/ui/button';
import Confetti, { ConfettiRef } from '@/common/components/ui/confetti';
import { Copy } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useRef } from 'react';

const CreateModuleSuccessDialog = (props: {
    data: {
        name: string;
        slug: string;
    };
    isShown: boolean;
    onContinueClicked: () => void;
    onCloseClicked: () => void;
}) => {
    const confettiRef = useRef<ConfettiRef>(null);

    useEffect(() => {
        confettiRef.current?.fire({});
    }, []);

    return (
        <AlertDialog open={props.isShown}>
            <AlertDialogTrigger asChild>
                <Button className='sr-only'>Show Dialog</Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>
                        Successfully created module 🎉
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                        Module Introduction to Web Development successfully
                        created, continue to add learning materials and
                        assignments.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter className='z-10'>
                    <Button onClick={props.onCloseClicked} variant={'outline'}>
                        Close
                    </Button>
                    <Button asChild>
                        <Link
                            onClick={props.onContinueClicked}
                            href={`/modules/${props.data.slug}`}
                        >
                            Continue
                        </Link>
                    </Button>
                </AlertDialogFooter>
                <Confetti
                    ref={confettiRef}
                    className='absolute left-0 top-0 z-0 h-full w-full'
                />
            </AlertDialogContent>
        </AlertDialog>
    );
};

export default CreateModuleSuccessDialog;
