import { Canvas, useFrame } from '@react-three/fiber'
import { PerspectiveCamera, OrbitControls, Environment } from '@react-three/drei'
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

    const handleExport = async (ratioLabel, targetRatio, transparentBackground, matchCurrentView) => {
        const state = renderStateRef.current
        if (!state) return

        const { gl, scene, camera } = state

        // Save current camera state
        const originalSize = { width: gl.domElement.width, height: gl.domElement.height }
        const originalAspect = camera.aspect
        const originalFov = camera.fov
        const originalPosition = camera.position.clone()
        const originalQuaternion = camera.quaternion.clone()

        // If matchCurrentView is true, use current viewport aspect ratio
        const exportRatio = matchCurrentView ? originalAspect : targetRatio
        const size = 1920
        let width
        let height

        if (exportRatio > 1) {
            width = size
            height = size / exportRatio
        } else {
            height = size
            width = size * exportRatio
        }

        // Temporarily restore camera to captured state (in case CameraRig moved it)
        camera.position.copy(originalPosition)
        camera.quaternion.copy(originalQuaternion)

        // Adjust FOV to prevent stretching when aspect ratio changes
        // We maintain the horizontal field of view to prevent distortion
        if (!matchCurrentView && exportRatio !== originalAspect) {
            // Convert FOV to radians and calculate new vertical FOV to maintain horizontal FOV
            const vFovRad = (originalFov * Math.PI) / 180
            const hFov = 2 * Math.atan(Math.tan(vFovRad / 2) * originalAspect)
            const newVFovRad = 2 * Math.atan(Math.tan(hFov / 2) / exportRatio)
            camera.fov = (newVFovRad * 180) / Math.PI
        }

        // Update size and aspect
        gl.setSize(width, height, false)
        camera.aspect = exportRatio
        camera.updateProjectionMatrix()

        // Wait for the next frame to render with effects
        await new Promise((resolve) => {
            requestAnimationFrame(() => {
                requestAnimationFrame(resolve)
            })
        })

        let dataURL

        if (transparentBackground) {
            // Export with transparent background
            dataURL = gl.domElement.toDataURL('image/png')
        } else {
            // Composite background with 3D scene
            const compositeCanvas = document.createElement('canvas')
            compositeCanvas.width = width
            compositeCanvas.height = height
            const ctx = compositeCanvas.getContext('2d')

            // Draw background
            if (backgroundStyle.backgroundColor) {
                // Solid color
                ctx.fillStyle = backgroundStyle.backgroundColor
                ctx.fillRect(0, 0, width, height)
            } else if (backgroundStyle.backgroundImage) {
                // Gradient
                const tempDiv = document.createElement('div')
                tempDiv.style.width = `${width}px`
                tempDiv.style.height = `${height}px`
                tempDiv.style.backgroundImage = backgroundStyle.backgroundImage
                document.body.appendChild(tempDiv)

                // Use html2canvas or manually recreate gradient
                // For now, we'll recreate the gradient patterns manually
                const colors = [
                    palette[0] || '#0a0f1f',
                    palette[1] || palette[0] || '#14213d',
                    palette[2] || palette[0] || '#1f4068',
                    palette[3] || palette[1] || '#2a9d8f',
                    palette[4] || palette[2] || '#264653'
                ]

                if (config.gradientType === 'linear') {
                    const angle = (config.gradientAngle * Math.PI) / 180
                    const gradient = ctx.createLinearGradient(
                        width / 2 - Math.cos(angle) * width,
                        height / 2 - Math.sin(angle) * height,
                        width / 2 + Math.cos(angle) * width,
                        height / 2 + Math.sin(angle) * height
                    )
                    gradient.addColorStop(0, colors[0])
                    gradient.addColorStop(0.25, colors[1])
                    gradient.addColorStop(0.5, colors[2])
                    gradient.addColorStop(0.75, colors[3])
                    gradient.addColorStop(1, colors[4])
                    ctx.fillStyle = gradient
                    ctx.fillRect(0, 0, width, height)
                } else if (config.gradientType === 'radial') {
                    // Base gradient
                    const baseGradient = ctx.createLinearGradient(0, 0, 0, height)
                    baseGradient.addColorStop(0, colors[3])
                    baseGradient.addColorStop(1, colors[4])
                    ctx.fillStyle = baseGradient
                    ctx.fillRect(0, 0, width, height)

                    // Radial overlays
                    const positions = [
                        [0.15, 0.20, colors[0]],
                        [0.85, 0.20, colors[1]],
                        [0.50, 0.80, colors[2]]
                    ]
                    positions.forEach(([x, y, color]) => {
                        const radialGradient = ctx.createRadialGradient(
                            width * x, height * y, 0,
                            width * x, height * y, Math.min(width, height) * 0.45
                        )
                        radialGradient.addColorStop(0, color)
                        radialGradient.addColorStop(1, hexToRgba(color, 0))
                        ctx.fillStyle = radialGradient
                        ctx.fillRect(0, 0, width, height)
                    })
                } else {
                    // Organic gradient (default)
                    const baseGradient = ctx.createLinearGradient(0, 0, width, height)
                    baseGradient.addColorStop(0, hexToRgba(colors[4], 0.95))
                    baseGradient.addColorStop(1, hexToRgba(colors[0], 0.88))
                    ctx.fillStyle = baseGradient
                    ctx.fillRect(0, 0, width, height)

                    // Organic radial overlays
                    const organicPositions = [
                        [0.18, 0.24, 0.45, 0.45, colors[0], 0.82],
                        [0.74, 0.20, 0.40, 0.40, colors[1], 0.8],
                        [0.30, 0.80, 0.42, 0.42, colors[2], 0.78],
                        [0.78, 0.72, 0.38, 0.38, colors[3], 0.75]
                    ]
                    organicPositions.forEach(([x, y, radiusX, radiusY, color, alpha]) => {
                        const radialGradient = ctx.createRadialGradient(
                            width * x, height * y, 0,
                            width * x, height * y, Math.min(width * radiusX, height * radiusY)
                        )
                        radialGradient.addColorStop(0, hexToRgba(color, alpha))
                        radialGradient.addColorStop(0.7, hexToRgba(color, 0))
                        ctx.fillStyle = radialGradient
                        ctx.fillRect(0, 0, width, height)
                    })
                }

                document.body.removeChild(tempDiv)
            }

            // Draw 3D scene on top
            ctx.drawImage(gl.domElement, 0, 0, width, height)

            dataURL = compositeCanvas.toDataURL('image/png')
        }

        const link = document.createElement('a')
        const filename = matchCurrentView
            ? `background-current-view-${Date.now()}.png`
            : `background-${ratioLabel.replace(':', '-')}-${Date.now()}.png`
        link.download = filename
        link.href = dataURL
        link.click()

        gl.setSize(originalSize.width, originalSize.height, false)
        camera.aspect = originalAspect
        camera.fov = originalFov
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
