var glapp;
var scene;

function init() {
    scene = Vue.createApp({
        data() {
            return {
                
                default_path: "/data/MJTestDataRun"
            }
        },
    }).mount('#gui');
    glapp = new GlApp('view', 800, 600, scene.$data);

    // event handler for pressing arrow keys
    // document.addEventListener('keydown', onKeyDown, false);
}

function loadNewScene() {
    var bin_file = document.getElementById('bin_file');



    var reader = new FileReader();
    reader.onload = (event) => {
        // First parse binary file into Buffer?

        // Next, go through each point and store theta into array
        // Run sav golay to get theta_dot into array

        // Create new scene and glapp updateScene

        // 
        //glapp.updateScene(scene);


        /*
        let new_scene = JSON.parse(event.target.result);
        
        vec3.set(scene.background, new_scene.background[0],
                 new_scene.background[1], new_scene.background[2]);
        
        vec3.set(scene.camera.position, new_scene.camera.position[0], 
                 new_scene.camera.position[1], new_scene.camera.position[2]);
        vec3.set(scene.camera.target, new_scene.camera.target[0], 
                 new_scene.camera.target[1], new_scene.camera.target[2]);
        vec3.set(scene.camera.up, new_scene.camera.up[0], 
                 new_scene.camera.up[1], new_scene.camera.up[2]);

        scene.models = [];
        for (let i = 0; i < new_scene.models.length; i++) {
            let m = {};
            m.type = new_scene.models[i].type;
            m.shader = new_scene.models[i].shader;
            m.material = {};
            m.material.color = vec3.fromValues(new_scene.models[i].material.color[0], 
                                               new_scene.models[i].material.color[1],
                                               new_scene.models[i].material.color[2]);
            m.material.specular = vec3.fromValues(new_scene.models[i].material.specular[0], 
                                                  new_scene.models[i].material.specular[1],
                                                  new_scene.models[i].material.specular[2]);
            m.material.shininess = new_scene.models[i].material.shininess;
            m.center = vec3.fromValues(new_scene.models[i].center[0], 
                                       new_scene.models[i].center[1],
                                       new_scene.models[i].center[2]);
            m.size = vec3.fromValues(new_scene.models[i].size[0], 
                                     new_scene.models[i].size[1],
                                     new_scene.models[i].size[2]);
            m.rotate_x = new_scene.models[i].rotate_x || 0;
            m.rotate_x *= Math.PI / 180;
            m.rotate_y = new_scene.models[i].rotate_y || 0;
            m.rotate_y *= Math.PI / 180;
            m.rotate_z = new_scene.models[i].rotate_z || 0;
            m.rotate_z *= Math.PI / 180;
            if (m.shader === 'texture') {
                m.texture = {};
                m.texture.url = new_scene.models[i].texture.url;
                m.texture.scale = vec2.fromValues(new_scene.models[i].texture.scale[0],
                                                  new_scene.models[i].texture.scale[1]);
                m.texture.id = glapp.initializeTexture(m.texture.url);
            }
            scene.models.push(m);
        }

        vec3.set(scene.light.ambient, new_scene.light.ambient[0], 
                 new_scene.light.ambient[1], new_scene.light.ambient[2]);
        scene.light.point_lights = [];
        for (let i = 0; i < new_scene.light.point_lights.length; i++) {
            let l = {}
            l.position = vec3.fromValues(new_scene.light.point_lights[i].position[0],
                                         new_scene.light.point_lights[i].position[1],
                                         new_scene.light.point_lights[i].position[2]);
            l.color = vec3.fromValues(new_scene.light.point_lights[i].color[0],
                                      new_scene.light.point_lights[i].color[1],
                                      new_scene.light.point_lights[i].color[2]);
            scene.light.point_lights.push(l);
        }

        glapp.updateScene(scene);
        */
    };
    reader.readAsText(scene_file.files[0], 'UTF-8');
}

