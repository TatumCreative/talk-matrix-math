//-------------------------------------------------
// Some urls:
//
// Matrix multiplication: https://www.youtube.com/watch?v=bFeM4ICRt0M
//
// This code: https://github.com/tatumcreative/talk-matrix-math

//-------------------------------------------------
// Magic some functions and values into existence

function toThreeJsMatrix( array ) {
	var mat = new THREE.Matrix4()
	mat.set.apply( mat, array )
	mat.transpose()
	return mat
}
function toCssMatrix( array ) {
	return "matrix3d(" + array.join(',') + ")"
}
function multiply( mats ) {
	
	var memo = toThreeJsMatrix( mats[0] )
	
	for( var i=1; i < mats.length; i++ ) {
		var mat = toThreeJsMatrix( mats[i] )
		memo.multiply( mat )
	}
	memo.transpose()
	return memo.flattenToArrayOffset( [], 0 )
}
function makeThreeJsScene( matrix ) {
	
	var scene = new THREE.Scene()
	var camera = new THREE.PerspectiveCamera( 75, window.innerWidth/(window.innerHeight * 0.5), 0.1, 1000 )

	var renderer = new THREE.WebGLRenderer()
	renderer.setSize( window.innerWidth, window.innerHeight * 0.5 )
	$('body').append( renderer.domElement )

	var geometry = new THREE.BoxGeometry( 3, 3, 3 )
	var material = new THREE.MeshPhongMaterial( { color: 0x00ff00 } )
	var cube = new THREE.Mesh( geometry, material )
	
	var ambient = new THREE.AmbientLight( 0x111111, 1, 0 );
		ambient.position.set(0, 2000, 1000);
	
	var rightFill = new THREE.PointLight( 0xffffff, 1, 0 );
		rightFill.position.set(3000, 2000, 5000);
	
	var rimBottom = new THREE.PointLight( 0xffffff, 1, 0 );
		rimBottom.position.set(-1000, -1000, -1000);
		
	var rimBackLeft = new THREE.PointLight( 0xffffff, 2, 0 );
		rimBackLeft.position.set(-700, 500, -1000);
	
	scene.add( ambient );
	scene.add( rightFill );
	scene.add( rimBottom );
	scene.add( rimBackLeft );
	
	scene.add( cube )

	camera.position.z = 5
	
	var matrixWorld = toThreeJsMatrix(matrix)
	
	cube.matrixAutoUpdate = false
	cube.matrix.copy( matrixWorld )
	console.log(matrixWorld.elements)
	
	renderer.render(scene, camera)

}
function makeCssScene( matrix ) {
	
	// var $el = $([
	// 	'<iframe src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d12885',
	// 	'.750989535434!2d-95.982994!3d36.155901000000014!3m2!1i1024!2i768!4f13.1',
	// 	'!3m3!1m2!1s0x0%3A0xbf8c258fc1d37672!2si2E%2C+Inc!5e0!3m2!1sen!2sus!4v14',
	// 	'34387743696" width="250" height="250" frameborder="0" style="border:0">',
	// 	'</iframe>'
	// ].join(''))

	var $el = $([
		'<div style="background:#fff;">',
			'<h1>This is a div!</h1>',
			'<p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>',
		'</div>'
	].join(''))
	
	$('body').append( $el )
	
	var width = height = 250
	
	$el.css({
		position: "absolute",
		top: (window.innerHeight * 0.7) - (width / 2),
		left: (window.innerWidth * 0.5) - (height / 2),
		width: 250 - 20,
		height: 250 - 20,
		color: "#555555",
		boxModel: "content-box",
		padding: "10px",
		overflow: "scroll",
		transform: toCssMatrix( matrix )
	})

}

var sin = Math.sin
var cos = Math.cos
var twoPi = Math.PI * 2

var a = twoPi * 0.0 // rotate x
var b = twoPi * 0.0 // rotate y
var c = twoPi * 0.0 // rotate z


//-------------------------------------------------
// Create some matrices

var identityMatrix = [
    1,    0,    0,    0,
    0,    1,    0,    0,
    0,    0,    1,    0,
    0,    0,    0,    1
]

var translationMatrix = [
    1,    0,    0,   0,
    0,    1,    0,   0,
    0,    0,    1,   0,
    0,    0,    0,   1
]

var scalingMatrix = [
    1,    0,    0,    0,
    0,    1,    0,    0,
    0,    0,    1,    0,
    0,    0,    0,    1
]

var rotateXMatrix = [
	
     1,       0,        0,     0,
     0,  cos(a),  -sin(a),     0,
     0,  sin(a),   cos(a),     0,
     0,       0,        0,     1
]

var rotateYMatrix = [
	
     cos(b),      0,   sin(b),     0,
         0,       1,        0,     0,
    -sin(b),      0,   cos(b),     0,
         0,       0,        0,     1
]

var rotateZMatrix = [
	
    cos(c), -sin(c),    0,    0,
    sin(c),  cos(c),    0,    0,
         0,       0,    1,    0,
         0,       0,    0,    1
]


//-------------------------------------------------
// Use the matrices

var resultMatrix = multiply([
	identityMatrix,
])

jQuery(function($) {
	makeThreeJsScene( resultMatrix )
	makeCssScene( resultMatrix )
});