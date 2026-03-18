import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

export default function PlaneGroup({ data, size = 0.5, sides = 4, opacity = 0.6, connectParticles = false, connectionDistance = 4, connectorOpacity = 0.3 }) {
  const meshRef = useRef()

  // We can use InstancedMesh for performance if we have many planes, 
  // but for now let's stick to individual meshes for easier individual control/animation if needed.
  // Actually, for "beautiful backgrounds" with potentially many planes, InstancedMesh is better.
  // However, to keep it simple for the MVP and allow different materials/transparency per plane easily,
  // let's start with a group of meshes. If performance is an issue, we can refactor to InstancedMesh.

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
    <group>
      {data.map((plane) => (
        <mesh
          key={plane.id}
          position={plane.position}
          rotation={plane.rotation}
          scale={plane.scale}
        >
          <circleGeometry args={[size, sides]} />
          <meshStandardMaterial
            color={plane.color} 
            side={THREE.DoubleSide}
            transparent
            opacity={opacity}
            roughness={0.35}
            metalness={0.05}
            emissive={plane.color}
            emissiveIntensity={0.12}
            depthWrite={false} // Important for transparency
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
