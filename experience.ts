import { Engine, Scene, SceneLoader, StandardMaterial, VideoTexture, VideoTextureSettings } from "@babylonjs/core";
import "@babylonjs/loaders";

const canvas = <HTMLCanvasElement> document.getElementById("renderCanvas");
const engine = new Engine(canvas);
const scene = new Scene(engine);

scene.createDefaultCamera(true);
scene.createDefaultLight(true);

const filePrefix = "https://allotropeijk.blob.core.windows.net/2021summerexhibit/";
SceneLoader.ImportMeshAsync(null, filePrefix, "room.01.glb", scene).then((meshData) => {
    console.log("model loaded");
    scene.createDefaultXRExperienceAsync({ floorMeshes: meshData.meshes }).then((xr) => {
        console.log("xr created");
        xr.baseExperience.sessionManager.onXRSessionInit.add((session) => {
            console.log("xr entered");
            const videoTexture = new VideoTexture("videoTexture", filePrefix + "video.01.mp4", scene, false, true);
            const videoMaterial = new StandardMaterial("videoMaterial", scene);
            videoMaterial.diffuseTexture = videoTexture;
            videoMaterial.emissiveTexture = videoTexture;
            meshData.meshes?.forEach((mesh) => {
                if (!!mesh.material) {
                    mesh.material = videoMaterial;
                }
            });
        });
    });
});

engine.runRenderLoop(() => {
    scene.render();
});

window.addEventListener("resize", () => {
    engine.resize();
});

