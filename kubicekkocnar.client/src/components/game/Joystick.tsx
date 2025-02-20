import nipplejs, { JoystickManagerOptions } from 'nipplejs';
import { AppContext } from '../AppContextProvider';
import { useContext } from 'react';

export class JoystickOutputData {
  fwdValue: number = 0;
  bkdValue: number = 0;
  rgtValue: number = 0;
  lftValue: number = 0;
  up: boolean = false;

  AnyMovement() : boolean
  {
    return this.fwdValue > 0 || this.bkdValue > 0 || this.rgtValue > 0 || this.lftValue > 0;
  }

  SetFwdValue(fwd: number) {
    if (fwd > 0) {
      this.fwdValue = Math.abs(fwd)
      this.bkdValue = 0
    } else if (fwd < 0) {
      this.fwdValue = 0
      this.bkdValue = Math.abs(fwd)
    }
  }

  SetRgtValue(rgt: number) {
    if (rgt > 0) {
      this.rgtValue = Math.abs(rgt)
      this.lftValue = 0
    } else if (rgt < 0) {
      this.rgtValue = 0
      this.lftValue = Math.abs(rgt)
    }
  }

  Reset()
  {
    this.bkdValue = 0
    this.fwdValue = 0
    this.lftValue = 0
    this.rgtValue = 0
  }

  Clone() : JoystickOutputData
  {
    const clone = new JoystickOutputData();
    clone.bkdValue = this.bkdValue;
    clone.fwdValue = this.fwdValue;
    clone.lftValue = this.lftValue;
    clone.rgtValue = this.rgtValue;
    return clone;
  }
}
  

export function Joystick() {
  
  const output = new JoystickOutputData();

  const { setJoystickData } = useContext(AppContext);

  let joyManager;

  // added joystick + movement
  addJoystick();

  // function updatePlayer() {
  //   // move the player
  //   const angle = controls.getAzimuthalAngle()

  //   if (fwdValue > 0) {
  //     tempVector
  //       .set(0, 0, -fwdValue)
  //       .applyAxisAngle(upVector, angle)
  //     mesh.position.addScaledVector(
  //       tempVector,
  //       1
  //     )
  //   }

  //   if (bkdValue > 0) {
  //     tempVector
  //       .set(0, 0, bkdValue)
  //       .applyAxisAngle(upVector, angle)
  //     mesh.position.addScaledVector(
  //       tempVector,
  //       1
  //     )
  //   }

  //   if (lftValue > 0) {
  //     tempVector
  //       .set(-lftValue, 0, 0)
  //       .applyAxisAngle(upVector, angle)
  //     mesh.position.addScaledVector(
  //       tempVector,
  //       1
  //     )
  //   }

  //   if (rgtValue > 0) {
  //     tempVector
  //       .set(rgtValue, 0, 0)
  //       .applyAxisAngle(upVector, angle)
  //     mesh.position.addScaledVector(
  //       tempVector,
  //       1
  //     )
  //   }

  //   mesh.updateMatrixWorld()

  //   //controls.target.set( mesh.position.x, mesh.position.y, mesh.position.z );
  //   // reposition camera
  //   camera.position.sub(controls.target)
  //   controls.target.copy(mesh.position)
  //   camera.position.add(mesh.position)
  // };

  function addJoystick() {

    if (!document.getElementById('joystickWrapper1')) return;

    const options: JoystickManagerOptions = {
      zone: document.getElementById('joystickWrapper1')!,
      size: 120,
      multitouch: true,
      maxNumberOfNipples: 2,
      mode: 'static',
      restJoystick: true,
      shape: 'circle',
      // position: { top: 20, left: 20 },
      position: { top: '60px', left: '60px' },
      dynamicPage: true,
    }

    joyManager = nipplejs.create(options);

    joyManager.on('move', function (evt, data) {
      output.SetFwdValue(data.vector.y)
      output.SetRgtValue(data.vector.x)
      setJoystickData(output.Clone());
    })

    joyManager.on('end', function (evt) {
      output.Reset();

      // fix this later
      //setJoystickData(output.Clone());
    })

  }

  return (
    <div id="mobileInterface" className="noSelect">
      <div id="joystickWrapper1"></div>
      <div id="joystickWrapper2">
        <div id="jumpButton">
          <p>JUMP</p>
        </div>
      </div>
    </div>
  )
}