import { useEffect, useState, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { FiCheck } from 'react-icons/fi';
import './toast.css';

const SHOW_MS = 2600;
const LEAVE_MS = 300;

type ToastProps = {
    message: string;
    onDone: () => void;
};

export const Toast = ({ message, onDone }: ToastProps) => {
    const [ leaving, setLeaving ] = useState(false);

    useEffect(() => {
        const leave = window.setTimeout(() => setLeaving(true), SHOW_MS);
        const done = window.setTimeout(onDone, SHOW_MS + LEAVE_MS);
        return () => {
            window.clearTimeout(leave);
            window.clearTimeout(done);
        };
    }, [onDone]);

    return (
        <div className='toast' data-leaving={leaving || undefined}>
            <FiCheck className='toast-icon' aria-hidden='true' />
            <span>{message}</span>
        </div>
    );
};

export const ToastRegion = ({ children }: { children: ReactNode }) => createPortal(
    <div className='toast-region' role='status' aria-live='polite'>
        {children}
    </div>,
    document.body,
);
