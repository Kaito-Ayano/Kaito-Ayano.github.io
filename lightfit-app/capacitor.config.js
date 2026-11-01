const config = {
  appId: 'com.qingti.app',
  appName: '轻体',
  webDir: '.',
  bundledWebRuntime: false,
  android: {
    allowMixedContent: true,
    captureInput: true,
    webContentsDebuggingEnabled: false
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: '#3ECFA8',
      showSpinner: false
    }
  }
};

module.exports = config;
