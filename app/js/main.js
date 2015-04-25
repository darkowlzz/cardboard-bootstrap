(function () {

var scene, camera, renderer, effect, controls, element, container;
var geometry, material, mesh;

// For cardboard app
var isCardboard = true;

init();
animate();

function init () {

  // Create a container 
  container = document.createElement('div');
  document.body.appendChild(container);

  // Create a renderer
  renderer = new THREE.WebGLRenderer();
  renderer.setClearColor(0xf0f0f0);
  renderer.setSize( window.innerWidth, window.innerHeight );
  element = renderer.domElement;

  // Add the renderer to the container
  container.appendChild( renderer.domElement );

  // Add Stereo effect -- CARDBOARD ONLY
  if (isCardboard) {
    effect = new THREE.StereoEffect(renderer);
    effect.setSize( window.innerWidth, window.innerHeight );
  }

  // Create a scene
  scene = new THREE.Scene();

  // Create a camera
  camera = new THREE.PerspectiveCamera( 90, window.innerWidth / window.innerHeight, 1, 5000 );
  camera.position.y = 250;
  camera.position.z = 800;
  // Add the camera to the scene
  scene.add(camera);

  // Create Orbit Controls -- CARDBOARD ONLY
  if (isCardboard) {
    controls = new THREE.OrbitControls(camera, element);
    // Raise the controller
    controls.rotateUp(Math.PI / 4);
    controls.noZoom = true;
    controls.noPan = true;

    window.addEventListener('deviceorientation', setOrientationControls, true);
  }

  // Light
  var light = new THREE.HemisphereLight(0x777777, 0x000000, 0.6);
  scene.add(light);

  // Texture for the plane
  var texture = new THREE.ImageUtils.loadTexture('images/checker.png');
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat = new THREE.Vector2(50, 50);
  texture.anisotropy = renderer.getMaxAnisotropy();

  // Material for the plane
  material = new THREE.MeshPhongMaterial({
    color: 0xffffff,
    specular: 0xffffff,
    shininess: 20,
    shading: THREE.FlatShading,
    map: texture
  });

  // Geometry for the plane
  geometry = new THREE.PlaneBufferGeometry(2000, 2000);

  // Plane mesh object
  mesh = new THREE.Mesh(geometry, material);
  mesh.rotation.x = -Math.PI / 2;
  scene.add(mesh);

  window.addEventListener('resize', onWindowResize, false);

}


// Animation loop
function animate () {

  requestAnimationFrame( animate );

  onWindowResize();
  // Render using the effect
  if (isCardboard) {
    effect.render( scene, camera );

    // Update the controls !important
    controls.update();
  } else {
    renderer.render( scene, camera );
  }

}


// Handle window resize.
function onWindowResize () {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize(window.innerWidth, window.innerHeight);

  if (isCardboard) {
    effect.setSize(window.innerWidth, window.innerHeight);
  }
}


// Set orientation controls -- CARDBOARD ONLY
function setOrientationControls(e) {
  if (! e.alpha) {
    return;
  }

  controls = new THREE.DeviceOrientationControls(camera, true);
  controls.connect();
  controls.update();

  element.addEventListener('click', fullscreen, false);

  window.removeEventListener('deviceorientation', setOrientationControls, true);
}


// Go fullscreen
function fullscreen () {
  if (container.requestFullscreen) {
    container.requestFullscreen();
  } else if (container.webkitRequestFullscreen) {
    container.webkitRequestFullscreen();
  }
}

})();
