import { StatusBar } from 'expo-status-bar';
import { AuthProvider } from './src/context/AuthContext';
import { ThemeProvider } from './src/context/ThemeContext';
import { RootNavigator } from './src/navigation/RootNavigator';
import { StripeProvider } from '@stripe/stripe-react-native';
import { useEffect, useState } from 'react';
import { paymentsApi } from './src/api/payments/payments.api';

export default function App() {
  const [publishableKey, setPublishableKey] = useState('');

  useEffect(() => {
    const loadStripe = async () => {
      try {
        const { publishable_key } = await paymentsApi.getConfig();
        setPublishableKey(publishable_key);
      } catch (error) {
        console.log('Error cargando Stripe');
      }
    };

    loadStripe();
  }, []);

  if (!publishableKey) return null;

  return (
    <StripeProvider publishableKey={publishableKey}>
      <AuthProvider>
        <ThemeProvider>
          <>
            <RootNavigator />
            <StatusBar style="auto" />
          </>
        </ThemeProvider>
      </AuthProvider>
    </StripeProvider>
  );
}