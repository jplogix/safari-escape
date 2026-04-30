const baseConfig = require("./app.json");

module.exports = () => ({
    ...baseConfig,
    expo: {
        ...baseConfig.expo,
        ios: {
            ...baseConfig.expo.ios,
            supportsTablet: true,
            requireFullScreen: true,
        },
    },
});
