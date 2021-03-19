import Constants from 'expo-constants';

const testId = 'ca-app-pub-3940256099942544/6300978111';
const productionIdMain = 'ca-app-pub-2356378721117875/1728554417';
const productionIdCompose = 'ca-app-pub-2356378721117875/4998936771';
const productionIdDetails = 'ca-app-pub-2356378721117875/1942895578';

// Is a real device and running in production.
export const adUnitIdMain = Constants.isDevice && !__DEV__ ? productionIdMain : testId;
export const adUnitIdCompose = Constants.isDevice && !__DEV__ ? productionIdCompose : testId;
export const adUnitIdDetails = Constants.isDevice && !__DEV__ ? productionIdDetails : testId;