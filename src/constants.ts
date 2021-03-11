import Constants from 'expo-constants';

const testID = 'ca-app-pub-3940256099942544/6300978111';
const productionID = 'ca-app-pub-2356378721117875/1728554417';

// Is a real device and running in production.
export const adUnitID = Constants.isDevice && !__DEV__ ? productionID : testID;