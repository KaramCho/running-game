import { useRapier, RigidBody} from "@react-three/rapier";
import {useFrame} from "@react-three/fiber";
import {useKeyboardControls} from "@react-three/drei";
import { useEffect, useRef } from "react";
import * as RAPIER from '@dimforge/rapier3d-compat';

export default function Player()
{
  const body = useRef();
  const [ subscribeKeys, getKeys ] = useKeyboardControls()
  const { rapier, world } = useRapier()
  const rapierWorld = world;

  const jump = () => {

    const origin = body.current.translation()
    origin.y -= 0.31

    const direction = { x : 0, y : -1, z : 0 }
    const ray = new rapier.Ray(origin, direction)

    body.current.applyImpulse({ x:0, y:0.5, z:0})
  }

  useEffect(() => {
    subscribeKeys(
      (state) => state.jump,
      (value) => {
        if(value){
          jump()
        }
      }
    )
  })


  useFrame((state, delta)=>{
    const { forward, backward, leftward, rightward } = getKeys()
    // 눌린 키보드 값 반환

    const impulse = { x:0, y:0, z:0 }
    // 움직임에 적용할 힘
    const torque = { x:0, y:0, z:0 }
    // 회전력을 적용하는 힘

    const impulseStrength = 0.6 * delta
    const torqueStrength = 0.2 * delta

    if(forward){
      impulse.z -= impulseStrength
      torque.x -= torqueStrength
    }

    if(rightward){
      impulse.x += impulseStrength
      torque.z -= torqueStrength
    }

    if(backward){
      impulse.z += impulseStrength
      torque.x -= torqueStrength
    }

    if(leftward){
      impulse.x -= impulseStrength
      torque.z += torqueStrength
    }

    body.current.applyImpulse(impulse)
    body.current.applyTorqueImpulse(torque)
  })

  return <>
    <RigidBody
      ref={ body }
      colliders="ball"
      restitution={ 0.2 }
      friction={ 1 }
      position={ [0,1,0] }>
      linearDamping = { 0.5 }
      angularDamping = { 0.5 }
      canSleep={false}
      {/*일정기간 움직이지 않을 경우 비활성 상태로 전환해라*/}
      <mesh castShadow>
      <icosahedronGeometry
        args = { [ 0.3, 1 ] }
      />
      <meshStandardMaterial
        flatShading
        color = "mediumpurple"
      />
    </mesh>
    </RigidBody>
  </>
}