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
	var material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } )
	var cube = new THREE.Mesh( geometry, material )
	
	scene.add( cube )

	camera.position.z = 5
	
	var matrixWorld = toThreeJsMatrix(matrix)
	
	cube.matrixAutoUpdate = false
	cube.matrix.copy( matrixWorld )
	console.log(matrixWorld.elements)
	
	renderer.render(scene, camera)

}
function makeCssScene( matrix ) {
	
	var $el = $([
		'<iframe src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d12885',
		'.750989535434!2d-95.982994!3d36.155901000000014!3m2!1i1024!2i768!4f13.1',
		'!3m3!1m2!1s0x0%3A0xbf8c258fc1d37672!2si2E%2C+Inc!5e0!3m2!1sen!2sus!4v14',
		'34387743696" width="250" height="250" frameborder="0" style="border:0">',
		'</iframe>'
	].join(''))
	
	$('body').append( $el )
	
	$el.css({
		position: "absolute",
		top: (window.innerHeight * 0.7) - ($el.height() / 2),
		left: (window.innerWidth * 0.5) - ($el.width() / 2),
		transform: toCssMatrix( matrix )
	})

}

var sin = Math.sin
var cos = Math.cos
var twoPi = Math.PI * 2

var a = twoPi * 0.0 // rotate x
var b = twoPi * 0.1 // rotate y
var c = twoPi * 0.0 // rotate z


//-------------------------------------------------
// The matrices

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
	scalingMatrix,
	rotateXMatrix,
	rotateYMatrix,
	rotateZMatrix,
	translationMatrix,
])

jQuery(function($) {
	makeThreeJsScene( resultMatrix )
	makeCssScene( resultMatrix )
});