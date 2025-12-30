interface LoadingSpinnerProps {
    size?: 'sm' | 'md' | 'lg';
    className?: string;
    light?: boolean;
}

export default function LoadingSpinner({
    size = 'md',
    className = '',
    light = false
}: LoadingSpinnerProps) {
    const sizeClasses = {
        sm: 'spinner-sm',
        md: 'spinner-md',
        lg: 'spinner-lg'
    };

    const colorClasses = light
        ? 'border-white/30 border-t-white'
        : 'border-neutral-200 border-t-neutral-900';

    return (
        <div className={`flex items-center justify-center ${className}`}>
            <div
                className={`${sizeClasses[size]} ${colorClasses}`}
                role="status"
                aria-label="로딩 중"
            />
        </div>
    );
}
