import { EffectComposer, DepthOfField, Bloom, Noise, ChromaticAberration } from '@react-three/postprocessing'

export default function Effects({ config }) {
    // Default values if not provided in config
    const { 
        focusDistance = 0, 
        focalLength = 0.02, 
        bokehScale = 2, 
        noiseOpacity = 0.04, 
        chromaticAberrationOffset = 0.0015 
    } = config || {}

    return (
        <EffectComposer disableNormalPass>
            <DepthOfField
                focusDistance={focusDistance}
                focalLength={focalLength}
                bokehScale={bokehScale}
                height={480}
            />
            <Bloom luminanceThreshold={0.9} luminanceSmoothing={0.025} height={300} />
            <Noise opacity={noiseOpacity} />
            <ChromaticAberration offset={[chromaticAberrationOffset, chromaticAberrationOffset]} />
        </EffectComposer>
    )
}
