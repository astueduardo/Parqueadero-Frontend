// utils/navigation.ts
import { Linking } from 'react-native';

export const openGoogleMaps = (
    latitude: number,
    longitude: number,
) => {
    const url = `google.navigation:q=${latitude},${longitude}`;
    const fallback = `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}&travelmode=driving`;

    Linking.canOpenURL(url).then((canOpen) => {
        Linking.openURL(canOpen ? url : fallback);
    });
};