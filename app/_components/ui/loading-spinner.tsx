'use client';
import * as animationData from 'public/loading.json';
import { useRef } from 'react';
import Lottie, { LottieRefCurrentProps } from 'lottie-react';
type LoadingSpinnerProps = {};

const LoadingSpinner: React.FC<LoadingSpinnerProps> = () => {
    const compRef = useRef<LottieRefCurrentProps>(null);
    return (
        <div className='size-16'>
            <Lottie lottieRef={compRef} animationData={animationData} />
        </div>
    );
};
export default LoadingSpinner;
