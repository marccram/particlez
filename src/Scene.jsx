import { Canvas } from '@react-three/fiber'
import { PerspectiveCamera, OrbitControls } from '@react-three/drei'
import { useControls } from 'leva'
import { useState, useEffect, useMemo, useRef } from 'react'
import PlaneGroup from './components/PlaneGroup'
import Effects from './components/Effects'
import ExportUI from './components/ExportUI'
import { generatePlanes } from './utils/generation'
import { themes } from './utils/themes'

const hexToRgba = (hex, alpha = 1) => {
    const cleaned = hex.replace('#', '')
    const normalized = cleaned.length === 3
        ? cleaned.split('').map((char) => char + char).join('')
        : cleaned

    const r = parseInt(normalized.slice(0, 2), 16)
    const g = parseInt(normalized.slice(2, 4), 16)
    const b = parseInt(normalized.slice(4, 6), 16)

    return `rgba(${r}, ${g}, ${b}, ${alpha})`
}

export default function Scene() {
    const renderStateRef = useRef(null)

    const controls = useControls('Scene', {
        count: { value: 50, min: 1, max: 200, step: 1 },
        layout: { value: 'scatter', options: ['grid', 'scatter', 'spiral'] },
        spread: { value: 5, min: 1, max: 20, step: 0.5 },
        theme: { value: 'neon', options: ['neon', 'ocean', 'sunset', 'monochrome', 'pastel', 'custom'] },
        size: { value: 0.5, min: 0.1, max: 2, step: 0.1 },
        sides: { value: 32, min: 3, max: 64, step: 1 },
        opacity: { value: 0.6, min: 0, max: 1, step: 0.05 },
        sizeVariation: { value: 1, min: 0, max: 3, step: 0.1 },
        rotationVariation: { value: Math.PI, min: 0, max: Math.PI * 2, step: 0.1 },
        connectParticles: { value: false },
        connectionDistance: { value: 4, min: 1, max: 10, step: 0.5 },
        connectorOpacity: { value: 0.3, min: 0, max: 1, step: 0.05 },
        enableEffects: { value: false }
    })

    const customColors = useControls('Custom Colors', {
        color1: { value: '#ff00ff' },
        color2: { value: '#00ffff' },
        color3: { value: '#ffff00' },
        color4: { value: '#ff0099' },
        color5: { value: '#00ff99' }
    })

    const backgroundControls = useControls('Background', {
        mode: { value: 'gradient', options: ['solid', 'gradient'] },
        solidColorIndex: { value: 1, min: 1, max: 5, step: 1 },
        gradientType: { value: 'organic', options: ['linear', 'radial', 'organic'] },
        gradientAngle: { value: 135, min: 0, max: 360, step: 1 }
    })

    const [planes, setPlanes] = useState([])

    const customColorArray = useMemo(() => ([
        customColors.color1,
        customColors.color2,
        customColors.color3,
        customColors.color4,
        customColors.color5
    ]), [customColors.color1, customColors.color2, customColors.color3, customColors.color4, customColors.color5])

    const themeColors = useMemo(() => {
        if (controls.theme === 'custom') return customColorArray
        return themes[controls.theme] || themes.neon
    }, [controls.theme, customColorArray])

    const palette = useMemo(() => {
        const filtered = themeColors.filter(Boolean)
        return filtered.length > 0 ? filtered : themes.neon
    }, [themeColors])

    const backgroundStyle = useMemo(() => {
        const colors = [
            palette[0] || '#0a0f1f',
            palette[1] || palette[0] || '#14213d',
            palette[2] || palette[0] || '#1f4068',
            palette[3] || palette[1] || '#2a9d8f',
            palette[4] || palette[2] || '#264653'
        ]

        if (backgroundControls.mode === 'solid') {
            const index = Math.max(0, Math.min(4, backgroundControls.solidColorIndex - 1))
            return {
                backgroundColor: colors[index]
            }
        }

        if (backgroundControls.gradientType === 'linear') {
            return {
                backgroundImage: `linear-gradient(${backgroundControls.gradientAngle}deg, ${colors[0]} 0%, ${colors[1]} 25%, ${colors[2]} 50%, ${colors[3]} 75%, ${colors[4]} 100%)`
            }
        }

        if (backgroundControls.gradientType === 'radial') {
            return {
                backgroundImage: [
                    `radial-gradient(circle at 15% 20%, ${colors[0]} 0%, ${hexToRgba(colors[0], 0)} 45%)`,
                    `radial-gradient(circle at 85% 20%, ${colors[1]} 0%, ${hexToRgba(colors[1], 0)} 45%)`,
                    `radial-gradient(circle at 50% 80%, ${colors[2]} 0%, ${hexToRgba(colors[2], 0)} 50%)`,
                    `linear-gradient(180deg, ${colors[3]} 0%, ${colors[4]} 100%)`
                ].join(', ')
            }
        }

        return {
            backgroundImage: [
                `radial-gradient(45% 45% at 18% 24%, ${hexToRgba(colors[0], 0.82)} 0%, ${hexToRgba(colors[0], 0)} 72%)`,
                `radial-gradient(40% 40% at 74% 20%, ${hexToRgba(colors[1], 0.8)} 0%, ${hexToRgba(colors[1], 0)} 70%)`,
                `radial-gradient(42% 42% at 30% 80%, ${hexToRgba(colors[2], 0.78)} 0%, ${hexToRgba(colors[2], 0)} 68%)`,
                `radial-gradient(38% 38% at 78% 72%, ${hexToRgba(colors[3], 0.75)} 0%, ${hexToRgba(colors[3], 0)} 65%)`,
                `linear-gradient(145deg, ${hexToRgba(colors[4], 0.95)} 0%, ${hexToRgba(colors[0], 0.88)} 100%)`
            ].join(', ')
        }
    }, [palette, backgroundControls.mode, backgroundControls.solidColorIndex, backgroundControls.gradientType, backgroundControls.gradientAngle])

    useEffect(() => {
        const newPlanes = generatePlanes(
            controls.count,
            controls.layout,
            controls.spread,
            controls.theme,
            customColorArray,
            controls.sizeVariation,
            controls.rotationVariation
        )
        setPlanes(newPlanes)
    }, [controls.count, controls.layout, controls.spread, controls.theme, controls.sizeVariation, controls.rotationVariation, customColors.color1, customColors.color2, customColors.color3, customColors.color4, customColors.color5])

    const handleExport = async (ratioLabel, targetRatio) => {
        const state = renderStateRef.current
        if (!state || !targetRatio) return

        const { gl, scene, camera } = state
        const originalSize = { width: gl.domElement.width, height: gl.domElement.height }
        const originalAspect = camera.aspect
        const size = 1920
        let width
        let height

        if (targetRatio > 1) {
            width = size
            height = size / targetRatio
        } else {
            height = size
            width = size * targetRatio
        }

        await new Promise((resolve) => setTimeout(resolve, 100))

        gl.setSize(width, height, false)
        camera.aspect = targetRatio
        camera.updateProjectionMatrix()
        gl.render(scene, camera)

        const dataURL = gl.domElement.toDataURL('image/png')
        const link = document.createElement('a')
        link.download = `background-${ratioLabel.replace(':', '-')}-${Date.now()}.png`
        link.href = dataURL
        link.click()

        gl.setSize(originalSize.width, originalSize.height, false)
        camera.aspect = originalAspect
        camera.updateProjectionMatrix()
    }

    return (
        <div style={{ width: '100vw', height: '100vh', position: 'relative' }}>
            <div
                style={{
                    position: 'absolute',
                    inset: 0,
                    ...backgroundStyle
                }}
            />
            <Canvas
                gl={{ antialias: true, alpha: true }}
                onCreated={(state) => {
                    state.gl.setClearColor('#000000', 0)
                    renderStateRef.current = state
                }}
                style={{ position: 'relative', zIndex: 1 }}
            >
                <PerspectiveCamera makeDefault position={[0, 0, 20]} fov={50} />
                <OrbitControls enablePan={true} enableZoom={true} enableRotate={true} />
                <ambientLight intensity={0.5} />
                <directionalLight position={[10, 10, 5]} intensity={1} />
                <PlaneGroup
                    data={planes}
                    size={controls.size}
                    sides={controls.sides}
                    opacity={controls.opacity}
                    connectParticles={controls.connectParticles}
                    connectionDistance={controls.connectionDistance}
                    connectorOpacity={controls.connectorOpacity}
                />
                {controls.enableEffects && <Effects />}
            </Canvas>
            <ExportUI onExport={handleExport} />
        </div>
    )
}
