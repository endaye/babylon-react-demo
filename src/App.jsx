import React from "react";
import {
  FreeCamera,
  ArcRotateCamera,
  Vector2,
  Vector3,
  HemisphericLight,
  MeshBuilder,
  SceneLoader,
  Color4,
} from "@babylonjs/core";
import "@babylonjs/loaders/glTF";
import SceneComponent from "babylonjs-hook";
import "./App.css";

let box;

const onSceneReady = async (scene) => {
  scene.clearColor = new Color4(0, 0, 0, 0.000001);
  scene.getEngine().setHardwareScalingLevel(0.5);

  // This creates and positions a free camera (non-mesh)
  // const camera = new FreeCamera("camera1", new Vector3(0, 5, -10), scene);
  var camera = new ArcRotateCamera("camera1", Math.PI / 2, Math.PI / 3, 10, new Vector3(0, -5, 0), scene);

  // This targets the camera to scene origin
  camera.setTarget(Vector3.Up());
  camera.minZ = 0.1;
  camera.maxZ = 100;

  const canvas = scene.getEngine().getRenderingCanvas();

  // This attaches the camera to the canvas
  camera.attachControl(canvas, true);

  // This creates a light, aiming 0,1,0 - to the sky (non-mesh)
  const light = new HemisphericLight("light", new Vector3(0, 1, 0), scene);

  // Default intensity is 1. Let's dim the light a small amount
  light.intensity = 2;

  // Our built-in 'box' shape.
  box = MeshBuilder.CreateBox("box", { size: 2 }, scene);

  // Move the box upward 1/2 its height
  box.position = new Vector3(2, 2, 0);

  const ball = MeshBuilder.CreateSphere("sphere", { diameter: 2 }, scene);
  ball.position = new Vector3(-4, 2, 0);

  // Our built-in 'ground' shape.
  MeshBuilder.CreateGround("ground", { width: 6, height: 6 }, scene);

  SceneLoader.ImportMesh("", "/3d/", "female.glb", scene, (newMeshes, particleSystems, skeletons, animationGroups) => {
    var hero = newMeshes[0];

    //Scale the model down
    hero.scaling.scaleInPlace(1);

    //Lock camera on the character
    camera.target = hero;
    camera.targetScreenOffset = new Vector2(0, -1);

    // //Get the Samba animation Group
    // const sambaAnim = scene.getAnimationGroupByName("Samba");

    // //Play the Samba animation
    // sambaAnim.start(true, 1.0, sambaAnim.from, sambaAnim.to, false);
  });
};

/**
 * Will run on every frame render.  We are spinning the box on y-axis.
 */
const onRender = (scene) => {
  if (box !== undefined) {
    const deltaTimeInMillis = scene.getEngine().getDeltaTime();

    const rpm = 10;
    box.rotation.y += (rpm / 60) * Math.PI * 2 * (deltaTimeInMillis / 1000);
  }
};

const App = () => (
  <div>
    <SceneComponent antialias adaptToDeviceRatio onSceneReady={onSceneReady} onRender={onRender} id="my-canvas" />
  </div>
);

export default App;
