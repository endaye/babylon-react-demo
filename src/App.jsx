import React from "react";
import { FreeCamera, ArcRotateCamera, Vector3, HemisphericLight, MeshBuilder, SceneLoader } from "@babylonjs/core";
import "@babylonjs/loaders/glTF";
import SceneComponent from "babylonjs-hook";
import "./App.css";

let box;

const onSceneReady = async (scene) => {
  // This creates and positions a free camera (non-mesh)
  // const camera = new FreeCamera("camera1", new Vector3(0, 5, -10), scene);
  var camera = new ArcRotateCamera("camera1", Math.PI / 2, Math.PI / 4, 10, new Vector3(0, -5, 0), scene);

  // This targets the camera to scene origin
  camera.setTarget(Vector3.Zero());

  const canvas = scene.getEngine().getRenderingCanvas();

  // This attaches the camera to the canvas
  camera.attachControl(canvas, true);

  // This creates a light, aiming 0,1,0 - to the sky (non-mesh)
  const light = new HemisphericLight("light", new Vector3(0, 1, 0), scene);

  // Default intensity is 1. Let's dim the light a small amount
  light.intensity = 0.7;

  // Our built-in 'box' shape.
  box = MeshBuilder.CreateBox("box", { size: 2 }, scene);

  // Move the box upward 1/2 its height
  box.position = new Vector3(2, 2, 0);

  const ball = MeshBuilder.CreateSphere("sphere", { diameter: 2 }, scene);
  ball.position = new Vector3(-4, 2, 0);

  // Our built-in 'ground' shape.
  MeshBuilder.CreateGround("ground", { width: 6, height: 6 }, scene);

  SceneLoader.ImportMesh(
    "",
    "https://assets.babylonjs.com/meshes/",
    "HVGirl.glb",
    scene,
    function (newMeshes, particleSystems, skeletons, animationGroups) {
      var hero = newMeshes[0];

      //Scale the model down
      hero.scaling.scaleInPlace(0.1);

      //Lock camera on the character
      camera.target = hero;

      // //Get the Samba animation Group
      // const sambaAnim = scene.getAnimationGroupByName("Samba");

      // //Play the Samba animation
      // sambaAnim.start(true, 1.0, sambaAnim.from, sambaAnim.to, false);
    }
  );
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
    <SceneComponent antialias onSceneReady={onSceneReady} onRender={onRender} id="my-canvas" />
  </div>
);

export default App;
