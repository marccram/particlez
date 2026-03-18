import { EffectComposer, DepthOfField, Bloom, Vignette } from '@react-three/postprocessing'
import { useControls } from 'leva'

export default function Effects() {
    const { focusDistance, focalLength, bokehScale } = useControls('Effects', {
        focusDistance: { value: 0, min: 0, max: 1, step: 0.01 },
        focalLength: { value: 0.02, min: 0, max: 0.1, step: 0.001 },
        bokehScale: { value: 2, min: 0, max: 10, step: 0.1 }
    })

    return (
        <EffectComposer disableNormalPass>
            <DepthOfField
                focusDistance={focusDistance}
                focalLength={focalLength}
                bokehScale={bokehScale}
                height={480}
            />
            <Bloom luminanceThreshold={0.9} luminanceSmoothing={0.025} height={300} />
        </EffectComposer>
    )
}
