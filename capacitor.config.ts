import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
    appId: 'com.shomuran.creditcardadvisor',
    appName: 'Credit Card Advisor',
    webDir: 'out', // keep for local fallback
    server: {
        // 👇 Load your live Vercel app
        url: 'https://credit-card-advisor-web.vercel.app', // Replace with your actual URL
        cleartext: false,
    },
};

export default config;
