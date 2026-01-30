import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function formatConfidence(score: number): {
    label: string;
    color: string;
} {
    if (score >= 80) return { label: 'High', color: 'text-green-500' };
    if (score >= 60) return { label: 'Medium', color: 'text-yellow-500' };
    return { label: 'Low', color: 'text-red-500' };
}
