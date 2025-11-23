// MuseumModel.jsx
import { useGLTF } from '@react-three/drei'
import { useEffect } from 'react'
import * as THREE from 'three'

// ✅ Centralize the names so it's easier to maintain
const PROJECT_MESH_NAMES = new Set([
  'Plane001',
  'Plane002',
  'Plane003',
  'Plane004',
  'Mesh_1',
  'Mesh_2',
  'Mesh_3',
  'Mesh_4',
  'IPad_Tablet_1',
  'Curve',
  'Curve001',
  'Curve002',
  'Spiral',
  'Spiral_1',
  'Spiral_2',
  'Spiral_3',
  'Spiral_4',
  'Spiral_5',
  'Spiral_6',
  'Spiral_7',


])

/**
 * MuseumModel
 * - Loads a GLB scene
 * - Softens lights
 * - Marks project meshes and returns them via onProjectsReady
 */
export default function MuseumModel({ url, onLoaded, onProjectsReady }) {
  const { scene } = useGLTF(url)

  useEffect(() => {
    if (!scene) return
    onLoaded?.()       

    const projectMeshes = []

    scene.traverse((o) => {
      // ✅ Soften lights but keep them
      if (o.isLight) {
        o.intensity *= 0.03
        return
      }

      // Only work with real meshes
      if (!o.isMesh) return
      // Enable shadows on meshes
      o.castShadow = true
      o.receiveShadow = true

      // Check if this mesh is one of your "project" surfaces
      if (!PROJECT_MESH_NAMES.has(o.name)) return

      // Avoid applying setup twice if effect ever reruns
      if (!o.userData.isProjectMesh) {
        o.userData.isProjectMesh = true

        // Store original scale for hover animation
        if (!o.userData.baseScale) {
          o.userData.baseScale = o.scale.clone()
        }

        // Tiny Z offset so they visually pop from the wall,
        // but only apply once
        o.position.z += 0.01
      }

      projectMeshes.push(o)
    })

    onProjectsReady?.(projectMeshes)

  }, [scene, onProjectsReady])

  return <primitive object={scene} />
}

useGLTF.preload('/models/room.glb')
