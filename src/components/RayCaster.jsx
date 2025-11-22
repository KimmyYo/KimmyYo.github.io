import { useThree, useFrame } from '@react-three/fiber'
import { useRef, useEffect } from 'react'
import * as THREE from 'three'
import { gsap } from 'gsap'

export default function ProjectRaycaster({ projectMeshes, onProjectClick }) {
  const { camera, gl } = useThree()
  const raycasterRef = useRef(new THREE.Raycaster())
  const mouse = useRef(new THREE.Vector2())
  const hoveredIndexRef = useRef(-1)

  // mouse move + click
  useEffect(() => {
    const handleMouseMove = (event) => {
      const rect = gl.domElement.getBoundingClientRect()
      mouse.current.x = ((event.clientX - rect.left) / rect.width) * 2 - 1
      mouse.current.y = -((event.clientY - rect.top) / rect.height) * 2 + 1
    }

    const handleClick = () => {
      if (!projectMeshes.length) return
      const raycaster = raycasterRef.current
      raycaster.setFromCamera(mouse.current, camera)

      // 👇 intersect EXACTLY those meshes, no recursion into children
      const hits = raycaster.intersectObjects(projectMeshes, false)
      if (!hits.length) return

      const mesh = hits[0].object
      const index = projectMeshes.indexOf(mesh)
      if (index !== -1 && onProjectClick) {
        onProjectClick(index, mesh)
      }
    }

    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('click', handleClick)
    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('click', handleClick)
    }
  }, [camera, gl, projectMeshes, onProjectClick])
  
useFrame(() => {
  if (!projectMeshes.length) return;

  const raycaster = raycasterRef.current;
  raycaster.setFromCamera(mouse.current, camera);
  const hits = raycaster.intersectObjects(projectMeshes, false);

  const newIndex = hits.length ? projectMeshes.indexOf(hits[0].object) : -1;
  const ipadCollection = ["Mesh_1", "Mesh_2", "Mesh_3", "Mesh_4", "IPad_Tablet_1"];

  if (hoveredIndexRef.current !== newIndex) {
    hoveredIndexRef.current = newIndex;
    document.body.style.cursor = newIndex !== -1 ? 'pointer' : 'default';

    projectMeshes.forEach((m) => {
      const base = m.userData.baseScale || m.scale;

      let target = 1.0;

      // ✅ If hovered mesh is in iPad collection, scale all iPad meshes
      if (newIndex !== -1 && ipadCollection.includes(projectMeshes[newIndex].name)) {
        target = ipadCollection.includes(m.name) ? 1.08 : 1.0;
      } else {
        // ✅ Otherwise, only scale the hovered mesh
        target = m === projectMeshes[newIndex] ? 1.08 : 1.0;
      }

      gsap.to(m.scale, {
        x: base.x * target,
        y: base.y * target,
        z: base.z * target,
        duration: 0.3,
        ease: 'power2.out'
      });
    });
  }
});
  return null
}
