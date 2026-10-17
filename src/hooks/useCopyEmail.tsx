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

/**
 * Copies my email address to the clipboard and confirms with a toast, so the address never has to
 * appear on the page. If the clipboard is unavailable, the toast shows the address so it can still
 * be copied by hand. Render the returned `toast` anywhere in the component.
 */
export const useCopyEmail = () => {
    const [ toast, setToast ] = useState<{ id: number; message: string } | null>(null);
    const dismiss = useCallback(() => setToast(null), []);

    const copyEmail = async () => {
        const copied = await copyText(EMAIL);
        const message = copied ? 'Email Copied to Clipboard' : `Couldn't copy. Email: ${EMAIL}`;
        // A new id restarts the toast when clicked again while one is showing
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
