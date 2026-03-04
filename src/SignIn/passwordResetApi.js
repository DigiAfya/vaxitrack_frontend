import axios from 'axios';

export async function requestPasswordReset(email) {
    const endpoint = import.meta.env.VITE_AUTH_FORGOT_PASSWORD_URL?.trim();
    const hasPlaceholderValue = endpoint?.includes('<') || endpoint?.includes('>');
    const isHttpEndpoint = /^https?:\/\//i.test(endpoint || '');

    if (!endpoint || hasPlaceholderValue || !isHttpEndpoint) {
        return {
            mailSent: true,
            isSimulated: true,
            resetPath: `/r-password?email=${encodeURIComponent(email)}`,
        };
    }

    try {
        const response = await axios.post(endpoint, { email });
        const data = response.data || {};

        return {
            mailSent: true,
            isSimulated: false,
            resetPath: data?.resetPath || data?.resetUrl || null,
            message: data?.message,
        };
    } catch (error) {
        throw new Error(error?.response?.data?.message || 'Unable to send reset email. Please try again.');
    }
}