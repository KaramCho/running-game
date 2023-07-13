import * as THREE from 'three'
import { CuboidCollider, RigidBody } from '@react-three/rapier'
import { useRef, useState, useMemo } from "react";
import { useFrame } from '@react-three/fiber'
import { useGLTF } from "@react-three/drei";

const boxGeometry = new THREE.BoxGeometry(1,1,1);

const floor1Material = new THREE.MeshStandardMaterial({ color : 'limegreen'})
const floor2Material = new THREE.MeshStandardMaterial({ color : 'greenyellow'})
const obstacleMaterial = new THREE.MeshStandardMaterial({ color : 'orangered'})
const wallMaterial = new THREE.MeshStandardMaterial({ color : 'slategrey'})

export function BlockStart({ position = [0,0,0]}) {

  // 정사각형 판이 position 값에따라 길게 배치됨

  return <group position={position}>
    <mesh
      geometry={ boxGeometry }
      material={floor1Material}
      position={ [0, -0.1, 0] }
      scale={[4, 0.2, 4]}
      receiveShadow
    />
  </group>

}

export function BlockEnd({ position = [0,0,0]}) {

  const hamburger = useGLTF('/hamburger.glb')

  hamburger.scene.children.forEach((mesh)=>{
    mesh.castShadow = true;
    // 햄버거 그림자 추가
  })

  return <group position={position}>
    <mesh
      geometry={ boxGeometry }
      material={floor1Material}
      position={ [0, 0, 0] }
      // 바닥을 조금 높게 해줌
      scale={[4, 0.2, 4]}
      receiveShadow
    />
    <RigidBody
      type="fixed"
      colliders="hull"
      position={[0,0.25,0]}
      restitution={0.2}
      friction={0}
    >
      {/*colliders 충돌체가 hull (복잡한 구조체로 정의되어 있음을 의미)*/}
    <primitive
      object = {hamburger.scene }
      scale ={0.2} />
    </RigidBody>
  </group>

}
export function BlockSpinner({ position = [0,0,0]}) {

  const obstacle = useRef()
  const [ speed ] =  useState(() => (Math.random() + 0.2) * (Math.random() < 0.5 ? - 1 : 1))
  // 너무 느려지는것을 막기 위해서 0.2를 더해줌 음의 수로 가면 반대편으로 돌 수 있음 -> 0.5 보다 작으면 음수로 반영해서 반대로 돌게 해줌


  useFrame((state) => {
    const time = state.clock.getElapsedTime()
    // 시간으로 프레임 나눠줌

    const rotation = new THREE.Quaternion();
    rotation.setFromEuler(new THREE.Euler(0, time * speed, 0))
    // 랜덤한 값으로 회전할 수 있도록 설정해줌

    obstacle.current.setNextKinematicRotation(rotation)
  })

  return <group position={position}>
    <mesh
      geometry={ boxGeometry }
      material={floor2Material}
      position={ [0, -0.1, 0] }
      scale={[4, 0.2, 4]}
      receiveShadow
    />
    <RigidBody
      ref={obstacle}
      type="kinematicPosition"
      position={[0, 0.3, 0]}
      restitution={0.2}
      friction={0}
    >
      {/*물체 움직이도록 RigidBody로 감싸줌*/}
      <mesh
        geometry={ boxGeometry }
        material={ obstacleMaterial }
        scale={[3.5, 0.3, 0.3]}
        castShadow
        receiveShadow
      />
    </RigidBody>
  </group>

}

export function BlockLimbo({ position = [0,0,0]}) {

  const obstacle = useRef()
  const [ timeOffset ] =  useState(()=>Math.random() * Math.PI *2)


  useFrame((state) => {
    const time = state.clock.getElapsedTime()
    const y = Math.sin(time + timeOffset) + 1.15
    obstacle.current.setNextKinematicTranslation({
      x:position[0],
      y:position[1] + y,
      z:position[2]
    })
  })

  return <group position={position}>
    <mesh
      geometry={ boxGeometry }
      material={floor2Material}
      position={ [0, -0.1, 0] }
      scale={[4, 0.2, 4]}
      receiveShadow
    />
    <RigidBody
      ref={obstacle}
      type="kinematicPosition"
      position={[0, 0.3, 0]}
      restitution={0.2}
      friction={0}
    >
      {/*물체 움직이도록 RigidBody로 감싸줌*/}
      <mesh
        geometry={ boxGeometry }
        material={ obstacleMaterial }
        scale={[3.5, 0.3, 0.3]}
        castShadow
        receiveShadow
      />
    </RigidBody>
  </group>

}

export function BlockAxe({ position = [0,0,0]}) {

  const obstacle = useRef()
  const [ timeOffset ] =  useState(()=>Math.random() * Math.PI *2)


  useFrame((state) => {
    const time = state.clock.getElapsedTime()
    const x = Math.sin(time + timeOffset)* 1.25
    obstacle.current.setNextKinematicTranslation({
      x:position[0] + x,
      y:position[1] + 0.75,
      z:position[2]
    })
  })

  return <group position={position}>
    <mesh
      geometry={ boxGeometry }
      material={floor2Material}
      position={ [0, -0.1, 0] }
      scale={[4, 0.2, 4]}
      receiveShadow
    />
    <RigidBody
      ref={obstacle}
      type="kinematicPosition"
      position={[0, 0.3, 0]}
      restitution={0.2}
      friction={0}
    >
      {/*물체 움직이도록 RigidBody로 감싸줌*/}
      <mesh
        geometry={ boxGeometry }
        material={ obstacleMaterial }
        scale={[1.5, 1.5, 0.3]}
        castShadow
        receiveShadow
      />
    </RigidBody>
  </group>

}

// 양쪽 벽
function Bounds( {length = 1} ){
  return <>
    <RigidBody type = "fixed" restitution={0.2} friction={0}>
    {/*양쪽 벽*/}
    <mesh
      position ={ [2.15, 0.75, - ( length * 2 ) + 2] }
      geometry ={ boxGeometry }
      material = { wallMaterial }
      scale = { [0.3, 1.5, 4 * length] }
      castShadow
    />
    <mesh
      position ={ [ - 2.15, 0.75, - ( length * 2 ) + 2] }
      geometry ={ boxGeometry }
      material = { wallMaterial }
      scale = { [0.3, 1.5, 4 * length] }
      receiveShadow
    />

    {/*뒤쪽 벽*/}
    <mesh
      position ={ [ 0, 0.75, - ( length * 4 ) + 2] }
      geometry ={ boxGeometry }
      material = { wallMaterial }
      scale = { [4, 1.5, 0.3] }
      receiveShadow
    />
      <CuboidCollider
        args={ [2,0.1, 2*length] }
        // collider 크기 설정
        position = {[0, -0.1, -(length *2) + 2]}
        // collider 위치
        restitution={0.2}
        // 반발력
        friction={1}
        // 마찰력
      />
    </RigidBody>
  </>
}

export function Level({ count = 5, types = [ BlockSpinner, BlockAxe, BlockLimbo]})

// count로 총 거리를 설정함
{
  const blocks = useMemo(() =>
  {
    const blocks = []

    for(let i = 0; i < count; i++){
      const type = types[ Math.floor(Math.random() * types.length) ]
      // type을 랜덤하게 설정
      blocks.push(type)
    }


    return blocks
  },[ count, types ])

  return <>
    <BlockStart position={ [0,0,0] }/>
    { blocks.map((Block, index) =>
      <Block key={index} position={ [ 0, 0, - ( index + 1 ) * 4 ] }/>
      // index로 z 거리를 설정해줌 4 단위로 거리가 있으므로 4를 곱해줌
      // 3D에서 Z축은 화면을 향하는 방향을 나타내므로 화면 안쪽으로 배치하기 위해 -를 곱해줌
    ) }
    <BlockEnd position={ [ 0, 0,-(count + 1) * 4 ] }/>
    <Bounds length={ count + 2 }/>
  </>
}