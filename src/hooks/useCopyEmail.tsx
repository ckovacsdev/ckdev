import { useCallback, useState } from 'react';
import { Toast, ToastRegion } from '../components/toast/toast';
import { EMAIL } from '../data/links';

const copyText = async (text: string) => {
    try {
        await navigator.clipboard.writeText(text);
        return true;
    } catch {
        return false;
    }
};

export const useCopyEmail = () => {
    const [ toast, setToast ] = useState<{ id: number; message: string } | null>(null);
    const dismiss = useCallback(() => setToast(null), []);

    const copyEmail = async () => {
        const copied = await copyText(EMAIL);
        const message = copied ? 'Email Copied to Clipboard' : `Couldn't copy. Email: ${EMAIL}`;
        setToast((current) => ({ id: (current?.id ?? 0) + 1, message }));
    };

    return {
        copyEmail,
        toast: (
            <ToastRegion>
                {toast && <Toast key={toast.id} message={toast.message} onDone={dismiss} />}
            </ToastRegion>
        ),
    };
};
