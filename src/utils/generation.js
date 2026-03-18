import * as THREE from 'three'
import { v4 as uuidv4 } from 'uuid'
import { getRandomColorFromTheme } from './themes'

export const generatePlanes = (count, layout, spread, themeName, customColors, sizeVariation, rotationVariation) => {
    const planes = []

    for (let i = 0; i < count; i++) {
        let position = [0, 0, 0]
        let rotation = [0, 0, 0]
        let scale = [1, 1, 1]

        if (layout === 'grid') {
            const size = Math.ceil(Math.sqrt(count))
            const x = (i % size) - size / 2
            const y = Math.floor(i / size) - size / 2
            position = [x * spread, y * spread, 0]
        } else if (layout === 'scatter') {
            position = [
                (Math.random() - 0.5) * spread * 10,
                (Math.random() - 0.5) * spread * 10,
                (Math.random() - 0.5) * spread * 10
            ]
            rotation = [
                Math.random() * Math.PI,
                Math.random() * Math.PI,
                Math.random() * Math.PI
            ]
        } else if (layout === 'spiral') {
            const angle = i * 0.5
            const radius = i * 0.1 * spread
            position = [
                Math.cos(angle) * radius,
                Math.sin(angle) * radius,
                i * 0.05
            ]
            rotation = [0, 0, angle]
        }

        // Apply variations
        // Allow for much larger/smaller sizes. 
        // If sizeVariation is 0, scale is 1.
        // If sizeVariation is 2, scale can range from ~0.2 to ~3.
        // Let's make it exponential for more dramatic effect
        const randScale = Math.pow(2, (Math.random() - 0.5) * sizeVariation * 2)
        scale = [randScale, randScale, 1]

        const randRot = (Math.random() - 0.5) * rotationVariation
        rotation = [
            rotation[0] + randRot,
            rotation[1] + randRot,
            rotation[2] + randRot
        ]

        planes.push({
            id: uuidv4(),
            position,
            rotation,
            scale,
            color: getRandomColorFromTheme(themeName, customColors)
        })
    }

    return planes
}
