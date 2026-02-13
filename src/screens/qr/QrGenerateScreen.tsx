import React, { useMemo } from 'react';
import { View, Text, TouchableOpacity, SafeAreaView } from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import { styles } from './QRGenerator.styles';

export const QRGeneratorScreen: React.FC = () => {
  // 👉 contenido del QR (luego vendrá del backend)
  const qrValue = useMemo(() => {
    return JSON.stringify({
      type: 'parking-access',
      userId: 'USER_ID',
      timestamp: Date.now(),
    });
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Código QR</Text>
      <Text style={styles.subtitle}>
        Muestra este código al ingresar o salir
      </Text>

      <View style={styles.qrContainer}>
        <QRCode
          value={qrValue}
          size={220}
          backgroundColor="white"
        />
      </View>

      <TouchableOpacity style={styles.button} activeOpacity={0.8}>
        <Text style={styles.buttonText}>Actualizar QR</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default QRGeneratorScreen;
