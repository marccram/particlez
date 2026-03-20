import { Canvas, useFrame } from '@react-three/fiber'
import { PerspectiveCamera, OrbitControls, Environment, ContactShadows } from '@react-three/drei'
import * as THREE from 'three'
import { useState, useEffect, useMemo, useRef } from 'react'
import PlaneGroup from './components/PlaneGroup'
import Effects from './components/Effects'
import ExportUI from './components/ExportUI'
import Controls from './components/Controls'
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

const INITIAL_CONFIG = {
    // Scene
    count: 50,
    layout: 'scatter',
    spread: 5,
    theme: 'neon',
    size: 0.5,
    sides: 32,
    opacity: 0.6,
    sizeVariation: 1,
    rotationVariation: Math.PI,
    
    // Connections
    connectParticles: false,
    connectionDistance: 4,
    connectorOpacity: 0.3,
    
    // Effects
    enableEffects: true,
    focusDistance: 0,
    focalLength: 0.02,
    bokehScale: 2,
    noiseOpacity: 0.04,
    chromaticAberrationOffset: 0.0015,
    
    // Background
    backgroundMode: 'gradient',
    solidColorIndex: 1,
    gradientType: 'organic',
    gradientAngle: 135,
    
    // Custom Colors
    color1: '#ff00ff',
    color2: '#00ffff',
    color3: '#ffff00',
    color4: '#ff0099',
    color5: '#00ff99'
}

function CameraRig({ targetPosition }) {
    const vec = new THREE.Vector3()
    useFrame((state) => {
        state.camera.position.lerp(vec.set(...targetPosition), 0.05)
        state.camera.lookAt(0, 0, 0)
    })
    return null
}

export default function Scene() {
    const renderStateRef = useRef(null)
    const [config, setConfig] = useState(INITIAL_CONFIG)
    const [planes, setPlanes] = useState([])
    const [targetCameraPos, setTargetCameraPos] = useState([0, 0, 20])

    const customColorArray = useMemo(() => ([
        config.color1,
        config.color2,
        config.color3,
        config.color4,
        config.color5
    ]), [config.color1, config.color2, config.color3, config.color4, config.color5])

    const themeColors = useMemo(() => {
        if (config.theme === 'custom') return customColorArray
        return themes[config.theme] || themes.neon
    }, [config.theme, customColorArray])

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

        if (config.backgroundMode === 'solid') {
            const index = Math.max(0, Math.min(4, config.solidColorIndex - 1))
            return {
                backgroundColor: colors[index]
            }
        }

        if (config.gradientType === 'linear') {
            return {
                backgroundImage: `linear-gradient(${config.gradientAngle}deg, ${colors[0]} 0%, ${colors[1]} 25%, ${colors[2]} 50%, ${colors[3]} 75%, ${colors[4]} 100%)`
            }
        }

        if (config.gradientType === 'radial') {
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
    }, [palette, config.backgroundMode, config.solidColorIndex, config.gradientType, config.gradientAngle])

    useEffect(() => {
        const newPlanes = generatePlanes(
            config.count,
            config.layout,
            config.spread,
            config.theme,
            customColorArray,
            config.sizeVariation,
            config.rotationVariation
        )
        setPlanes(newPlanes)
    }, [config.count, config.layout, config.spread, config.theme, config.sizeVariation, config.rotationVariation, config.color1, config.color2, config.color3, config.color4, config.color5])

    const handleRandomize = () => {
        const possibleThemes = Object.keys(themes).filter(t => t !== 'custom')
        const randomTheme = possibleThemes[Math.floor(Math.random() * possibleThemes.length)]
        const randomLayout = ['scatter', 'grid', 'spiral'][Math.floor(Math.random() * 3)]
        
        setConfig(prev => ({
            ...prev,
            theme: randomTheme,
            layout: randomLayout,
            count: Math.floor(Math.random() * 100) + 30,
            spread: Math.random() * 15 + 5,
            size: Math.random() * 0.8 + 0.2,
            sides: Math.floor(Math.random() * 6) + 3,
            opacity: Math.random() * 0.5 + 0.2
        }))

        // Randomize camera position for variety
        setTargetCameraPos([
            (Math.random() - 0.5) * 10,
            (Math.random() - 0.5) * 10,
            15 + Math.random() * 10
        ])
    }

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
        <div style={{ width: '100vw', height: '100vh', position: 'relative', overflow: 'hidden' }}>
            <div
                style={{
                    position: 'absolute',
                    inset: 0,
                    transition: 'all 0.5s ease',
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
                <CameraRig targetPosition={targetCameraPos} />
                <PerspectiveCamera makeDefault position={[0, 0, 20]} fov={50} />
                <OrbitControls enablePan={true} enableZoom={true} enableRotate={true} />
                <ambientLight intensity={0.5} />
                <directionalLight position={[10, 10, 5]} intensity={1} />
                <Environment preset="city" />
                <ContactShadows position={[0, -10, 0]} opacity={0.4} scale={40} blur={2} far={20} />
                <PlaneGroup
                    data={planes}
                    size={config.size}
                    sides={config.sides}
                    opacity={config.opacity}
                    connectParticles={config.connectParticles}
                    connectionDistance={config.connectionDistance}
                    connectorOpacity={config.connectorOpacity}
                />
                {config.enableEffects && <Effects config={config} />}
            </Canvas>
            <Controls config={config} setConfig={setConfig} setTargetCameraPos={setTargetCameraPos} onRandomize={handleRandomize} />
            <ExportUI onExport={handleExport} />
        </div>
    )
}
