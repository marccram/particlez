import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

export default function PlaneGroup({ data, size = 0.5, sides = 4, opacity = 0.6, connectParticles = false, connectionDistance = 4, connectorOpacity = 0.3 }) {
  const groupRef = useRef()

  // Organic floating motion
  useFrame((state) => {
    if (!groupRef.current) return
    const t = state.clock.getElapsedTime()
    
    groupRef.current.children.forEach((child, i) => {
      if (child.type === 'Mesh') {
        const offset = i * 100
        // Gentle drifting
        child.position.x += Math.sin(t * 0.2 + offset) * 0.002
        child.position.y += Math.cos(t * 0.3 + offset) * 0.002
        // Subtile rotation
        child.rotation.z += Math.sin(t * 0.1 + offset) * 0.001
      }
    })
  })

  const linesGeometry = useMemo(() => {
    if (!connectParticles) return null

    const points = []
    const positions = data.map(d => new THREE.Vector3(...d.position))

    for (let i = 0; i < positions.length; i++) {
        for (let j = i + 1; j < positions.length; j++) {
            if (positions[i].distanceTo(positions[j]) < connectionDistance) {
                points.push(positions[i])
                points.push(positions[j])
            }
        }
    }

    if (points.length === 0) return null

    const geometry = new THREE.BufferGeometry().setFromPoints(points)
    return geometry
  }, [data, connectParticles, connectionDistance])

  return (
    <group ref={groupRef}>
      {data.map((plane) => (
        <mesh
          key={plane.id}
          position={plane.position}
          rotation={plane.rotation}
          scale={plane.scale}
        >
          <circleGeometry args={[size, sides]} />
          <meshPhysicalMaterial
            color={plane.color} 
            side={THREE.DoubleSide}
            transparent
            opacity={opacity}
            transmission={0.5} // Glass-like transparency
            thickness={1}      // Material thickness
            roughness={0.1}
            metalness={0.1}
            iridescence={1}    // The "premium" shimmering look
            iridescenceIOR={1.5}
            iridescenceThicknessRange={[100, 400]}
            clearcoat={1}
            clearcoatRoughness={0.1}
            emissive={plane.color}
            emissiveIntensity={0.2}
            depthWrite={false}
          />
        </mesh>
      ))}
      {connectParticles && linesGeometry && (
        <lineSegments geometry={linesGeometry}>
          <lineBasicMaterial color="white" transparent opacity={connectorOpacity} />
        </lineSegments>
      )}
    </group>
  )
}
