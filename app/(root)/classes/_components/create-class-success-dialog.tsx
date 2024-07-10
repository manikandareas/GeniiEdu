import {
    AlertDialog,
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
import { useEffect, useRef } from 'react';

const CreateClassSuccessDialog = (props: {
    onCopyClicked: () => void;
    onOkClicked: () => void;
    data: {
        name: string;
        code: string;
    };
    isShown: boolean;
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
                        Yeayy success created class🥳
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                        Class {props.data.name} successfully created, share the
                        code with your students
                        <br />
                        <br />
                        <pre className='mt-2 rounded-md bg-secondary p-4'>
                            <code className='text-white'>
                                {JSON.stringify(props.data, null, 2)}
                            </code>
                        </pre>
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter className='z-10'>
                    <Button onClick={props.onCopyClicked} variant={'outline'}>
                        Copy <Copy size={16} className='ml-2' />
                    </Button>
                    <Button onClick={props.onOkClicked}>Ok</Button>
                </AlertDialogFooter>
                <Confetti
                    ref={confettiRef}
                    className='absolute left-0 top-0 z-0 h-full w-full'
                />
            </AlertDialogContent>
        </AlertDialog>
    );
};

export default CreateClassSuccessDialog;
