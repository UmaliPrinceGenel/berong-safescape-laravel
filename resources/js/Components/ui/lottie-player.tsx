import React from "react";
import { Lottie, LottieProps } from "lottie-react";

export interface LottiePlayerProps extends Partial<Omit<LottieProps, "src">> {
    animationData?: any;
    src?: any;
    className?: string;
    loop?: boolean;
    autoplay?: boolean;
}

export function LottiePlayer({
    animationData,
    src,
    className = "w-full h-full",
    loop = true,
    autoplay = true,
    ...props
}: LottiePlayerProps) {
    const data = src || animationData;
    if (!data) return null;

    return (
        <div className={className}>
            <Lottie
                src={data}
                loop={loop}
                autoplay={autoplay}
                {...props}
            />
        </div>
    );
}
