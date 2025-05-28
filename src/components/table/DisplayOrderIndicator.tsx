interface DisplayOrderIndicatorProps {
    displayOrder: number;
    maxOrder?: number;
}

export default function DisplayOrderIndicator({ displayOrder, maxOrder = 10 }: DisplayOrderIndicatorProps) {
    return (
        <div className="flex items-center gap-2">
            <span className="text-sm text-gray-900 font-medium">{displayOrder}</span>
            <div className="w-8 h-2 bg-gray-200 rounded-full relative">
                <div
                    className="h-full bg-blue-500 rounded-full"
                    style={{
                        width: `${Math.min((displayOrder / maxOrder) * 100, 100)}%`,
                    }}
                />
            </div>
        </div>
    );
}
