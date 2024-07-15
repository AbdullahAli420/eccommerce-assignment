import axios from "axios";
import { z } from "zod";

export default async (email: string) => {
    const apiKey = env('api_key');
    const url = 'https://api.elasticemail.com/v2/email/send';

    try {
        const response = await axios.post(url, null, {
            params: {
                apikey: apiKey,
                email,
                subject,
                bodyHtml: body,
                from: 'your_email@example.com',
                fromName: 'Your Name'
            }
        });

        if (response.data.success) {
            console.log('Email sent successfully');
        } else {
            console.error('Error sending email:', response.data.error);
        }
    } catch (error) {
        console.error('Error sending email:', error);
    }
}