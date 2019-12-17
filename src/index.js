import * as THREE from "three"

var mouseDown=0,prevPos=null,nextPos=null


var scene = new THREE.Scene();

var camera = new THREE.PerspectiveCamera( 50, (window.innerWidth*2)/(window.innerHeight*2), 0.1, 5000 );
console.log(window.innerWidth,window.innerHeight)
camera.position.z = 500;
var zoom=camera.position.z

var renderer = new THREE.WebGLRenderer({antialias:true});
renderer.setClearColor("#000");
renderer.setSize( 1000,1000 );
document.body.appendChild( renderer.domElement );

var geometry = new THREE.BoxGeometry(400,200,10);
var material =new THREE.MeshBasicMaterial( {transparent:true,opacity:0.2, color: "#f2f2f2" })
var glass = new THREE.Mesh( geometry, material );
var glassEdges = new THREE.EdgesHelper(glass, 0x5cd65c);
glassEdges.material.linewidth = 0.5;
console.log("glass",glass)
scene.add(glass)
glass.add(glassEdges)

document.body.addEventListener('wheel',function(e){
    zoom+=e.deltaY*0.1
})
document.body.addEventListener('mousedown',function(e){
    var p=getMousePos(e)
    console.log("p-",p)
    prevPos=p
    mouseDown=1
})
document.body.addEventListener('mouseup',function(e){
    mouseDown=0
    prevPos=null
    nextPos=null
})
document.body.addEventListener('mousemove',function(e){
    if(mouseDown){
        var p=getMousePos(e)
        nextPos=p
        moveCamera()
    }
})
document.body.addEventListener('click',function(e){
    var p=getMousePos(e)
    console.log("P",p)
   // nextPos=p
    breakGlass(p)
})
function breakGlass(p){
    console.log("breaking glass")
    var triangleGeometry = new THREE.Geometry(); 
    triangleGeometry.vertices.push(new THREE.Vector3(0,  0, 0));  0
    triangleGeometry.vertices.push(new THREE.Vector3(10, 10, 0)); 1
    triangleGeometry.vertices.push(new THREE.Vector3( 10, 0, 0)); 2
    triangleGeometry.vertices.push(new THREE.Vector3(0,  0, 5));  3
    triangleGeometry.vertices.push(new THREE.Vector3(10, 10,5)); 4
    triangleGeometry.vertices.push(new THREE.Vector3( 10, 0, 5));5

    triangleGeometry.faces.push(new THREE.Face3(0, 1, 2)); //front
    triangleGeometry.faces.push(new THREE.Face3(3, 4, 5)); //back
 
    triangleGeometry.faces.push(new THREE.Face3(0, 2, 5)); //botton
    triangleGeometry.faces.push(new THREE.Face3(0, 3, 5));

    triangleGeometry.faces.push(new THREE.Face3(0, 1, 4)); //right
    triangleGeometry.faces.push(new THREE.Face3(0, 3, 5));

    var triangleMaterial = new THREE.MeshBasicMaterial({ 
    color:0xFFFFFF, 
    side:THREE.DoubleSide 
    });

    var triangleMesh = new THREE.Mesh(triangleGeometry, triangleMaterial); 
    triangleMesh.position.set(1, 0.0, 0.0); 

    scene.add(triangleMesh); 
}
var render = function () {

    requestAnimationFrame( render );
    camera.position.z=zoom
    renderer.render(scene, camera);
};
function getMousePos(e){
    var mouse={x:0,y:0}
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    console.log(",mouse",mouse)
    return{
        x:e.clientX-7,
        y:e.clientY-7
    }
}
function moveCamera(){
    var x=(nextPos.x-prevPos.x)*0.001
    var y=(nextPos.y-prevPos.y)*0.001
    
    scene.rotation.y+=x
    scene.rotation.x+=y
}
render();