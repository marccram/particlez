export const themes = {
    neon: ['#ff00ff', '#00ffff', '#ffff00', '#ff0099', '#00ff99'],
    ocean: ['#0077be', '#00a86b', '#0093af', '#005f69', '#004f98'],
    sunset: ['#ff7e5f', '#feb47b', '#ff6b6b', '#c44569', '#c0392b'],
    monochrome: ['#ffffff', '#cccccc', '#999999', '#666666', '#333333'],
    pastel: ['#ffb3ba', '#ffdfba', '#ffffba', '#baffc9', '#bae1ff'],
    custom: [] // Placeholder, will be populated from controls
}

export const getRandomColorFromTheme = (themeName, customColors = []) => {
    if (themeName === 'custom' && customColors.length > 0) {
        return customColors[Math.floor(Math.random() * customColors.length)]
    }
    const theme = themes[themeName] || themes.neon
    return theme[Math.floor(Math.random() * theme.length)]
}
