function init(){
    // Do nothing
}

// Inline function when upload is complete to read binary file
let myInline = (async function () {							    								    
    const myBinaryFile = await	fetch(document.getElementById('myBinaryFile').value)    
    const myBuffer =await  myBinaryFile.arrayBuffer() 
    
    const dv = new DataView(myBuffer);
    var f32 = new Float32Array(myBuffer.byteLength / 4);
    const littleEndian = true;
     
    for (let i = 0; i < f32.length; i++) {
       f32[i] = dv.getFloat32(i*4, littleEndian);
    }   

    const myWeightsJSON = JSON.stringify(f32,null,4)  	  
    document.getElementById('myWeights').value =  myWeightsJSON 
    });