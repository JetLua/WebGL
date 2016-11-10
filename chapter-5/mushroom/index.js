!function(e){function t(a){if(r[a])return r[a].exports;var n=r[a]={exports:{},id:a,loaded:!1};return e[a].call(n.exports,n,n.exports,t),n.loaded=!0,n.exports}var r={};return t.m=e,t.c=r,t.p="",t(0)}([function(e,t,r){"use strict";function a(e){return e&&e.__esModule?e:{"default":e}}var n=r(1),i=a(n),o=function(e){var t=e.map(function(e){return new Promise(function(t){fetch(e).then(function(e){return e.text()}).then(function(e){return t(e)})})});return Promise.all(t)};o(["shaders/vertex.glsl","shaders/fragment.glsl"]).then(function(e){var t=document.createElement("canvas"),r=t.getContext("webgl");t.width=window.innerWidth,t.height=window.innerHeight,document.body.appendChild(t),r.viewport(0,0,window.innerWidth,window.innerHeight);var a=r.createShader(r.FRAGMENT_SHADER),n=r.createShader(r.VERTEX_SHADER),o=r.createProgram();r.shaderSource(n,e[0]),r.shaderSource(a,e[1]),r.compileShader(n),r.compileShader(a),r.attachShader(o,n),r.attachShader(o,a),r.linkProgram(o),r.useProgram(o);var s=new Float32Array(i["default"].meshes[0].positions),u=new Uint8Array(i["default"].meshes[0].indices);r.bindBuffer(r.ARRAY_BUFFER,r.createBuffer()),r.bufferData(r.ARRAY_BUFFER,s,r.STATIC_DRAW);var m=r.getAttribLocation(o,"aPos");r.vertexAttribPointer(m,3,r.FLOAT,!1,0,0),r.enableVertexAttribArray(m);var c=new Float32Array(i["default"].meshes[0].uvs);r.bindBuffer(r.ARRAY_BUFFER,r.createBuffer()),r.bufferData(r.ARRAY_BUFFER,c,r.STATIC_DRAW);var l=r.getAttribLocation(o,"aCoord");r.vertexAttribPointer(l,2,r.FLOAT,!1,0,0),r.enableVertexAttribArray(l);var d=r.createTexture(),f=r.getUniformLocation(o,"uSampler"),h=new Image;h.onload=function(){r.pixelStorei(r.UNPACK_FLIP_Y_WEBGL,1),r.activeTexture(r.TEXTURE0),r.bindTexture(r.TEXTURE_2D,d),r.texParameteri(r.TEXTURE_2D,r.TEXTURE_MIN_FILTER,r.LINEAR),r.texImage2D(r.TEXTURE_2D,0,r.RGB,r.RGB,r.UNSIGNED_BYTE,this),r.uniform1i(f,0),r.clearColor(1,1,1,1),r.enable(r.DEPTH_TEST),r.clear(r.COLOR_BUFFER_BIT|r.DEPTH_BUFFER_BIT),r.drawElements(r.TRIANGLES,u.length,r.UNSIGNED_BYTE,0)},h.src="src/mushroom.png",r.bindBuffer(r.ELEMENT_ARRAY_BUFFER,r.createBuffer()),r.bufferData(r.ELEMENT_ARRAY_BUFFER,u,r.STATIC_DRAW);var E=mat4.create(),R=mat4.create(),_=mat4.create(),p=mat4.create(),v=(mat4.create(),[0,3,17]),T=[0,0,0],A=[0,1,0];mat4.perspective(R,Math.PI/6,t.width/t.height,.1,100),mat4.lookAt(_,v,T,A),mat4.mul(E,R,_);var x=r.getUniformLocation(o,"uViewMatrix");r.uniformMatrix4fv(x,!1,E);var g=function(){r.uniformMatrix4fv(x,!1,E),r.clear(r.COLOR_BUFFER_BIT|r.DEPTH_BUFFER_BIT),r.drawElements(r.TRIANGLES,u.length,r.UNSIGNED_BYTE,0)},b={x:[1,0,0],y:[0,1,0],z:[0,0,1]},F={},B=[],w=function(e){return B.push(e)},S=function(){return B.pop()},C=!1,I=function(e){return e*Math.PI/1600};t.addEventListener("mousemove",function(e){if(C){F.deltaX=e.pageX-F.x,F.deltaY=e.pageY-F.y;var t=mat4.create();mat4.identity(t),mat4.rotate(t,t,I(F.deltaX),b.y),mat4.rotate(t,t,I(F.deltaY),b.x),mat4.mul(p,t,p),w(mat4.clone(_)),mat4.mul(_,_,p),mat4.mul(E,R,_),g(),_=S(),F.x=e.pageX,F.y=e.pageY}}),t.addEventListener("mousedown",function(e){C=!0,F.x=e.pageX,F.y=e.pageY}),document.addEventListener("mouseup",function(e){C=!1})})},function(e,t){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t["default"]={producer:{name:"Blender",version:"2.78 (sub 0)",exporter_version:"4.6.1",file:"mushroom_js.babylon"},autoClear:!0,clearColor:[.0509,.0509,.0509],ambientColor:[0,0,0],gravity:[0,-9.81,0],materials:[{name:"mushroom_js.mushroom",id:"mushroom_js.mushroom",ambient:[.8,.8,.8],diffuse:[.64,.64,.64],specular:[.5,.5,.5],emissive:[0,0,0],specularPower:50,alpha:1,backFaceCulling:!0,checkReadyOnlyOnce:!1}],multiMaterials:[],skeletons:[],meshes:[{name:"mushroom",id:"mushroom",materialId:"mushroom_js.mushroom",billboardMode:0,position:[0,0,0],rotation:[0,0,0],scaling:[1,1,1],isVisible:!0,freezeWorldMatrix:!1,isEnabled:!0,checkCollisions:!1,receiveShadows:!1,positions:[.6422,-.2419,.8839,0,-1.9802,1.0925,0,-.2419,1.0925,0,2.7581,0,.5487,2.7581,.7552,0,2.7581,.9335,.8817,2.1783,1.2135,0,2.1783,1.5,-1.039,-.2419,.3376,-1.039,-1.9802,-.3376,-1.039,-.2419,-.3376,.8878,2.7581,.2885,1.4266,2.1783,.4635,1.039,-.2419,-.3376,1.039,-1.9802,.3376,1.039,-.2419,.3376,.8878,2.7581,-.2885,1.4266,2.1783,-.4635,-.6422,-.2419,.8839,-1.039,-1.9802,.3376,.5487,2.7581,-.7552,.8817,2.1783,-1.2135,.6422,-.2419,-.8839,1.039,-1.9802,-.3376,0,2.7581,-.9335,0,2.1783,-1.5,0,-.2419,1.0925,-.6422,-1.9802,.8839,-.5487,2.7581,-.7552,-.8817,2.1783,-1.2135,0,-.2419,-1.0925,.6422,-1.9802,-.8839,-.8878,2.7581,-.2885,-1.4266,2.1783,-.4635,-.6422,-.2419,-.8839,0,-1.9802,-1.0925,-.8878,2.7581,.2885,-1.4266,2.1783,.4635,-.6422,-1.9802,-.8839,-.5487,2.7581,.7552,-.8817,2.1783,1.2135,.6422,-1.9802,.8839,1.1487,.9957,1.581,0,.9957,1.9542,1.8586,.9957,.6039,1.8586,.9957,-.6039,1.1487,.9957,-1.581,0,.9957,-1.9542,-1.1487,.9957,-1.581,-1.8586,.9957,-.6039,-1.8586,.9957,.6039,-1.1487,.9957,1.581,1.2504,-.0261,-1.721,0,-.0261,2.1273,-2.0232,-.0261,.6574,1.2504,-.0261,1.721,-2.0232,-.0261,-.6574,2.0232,-.0261,-.6574,-1.2504,-.0261,-1.721,-1.2504,-.0261,1.721,0,-.2419,1.0925,0,-.0261,-2.1273,1.2504,-.0261,1.721,0,-.0261,2.1273,1.2504,-.0261,1.721,2.0232,-.0261,.6574,2.0232,-.0261,-.6574,2.0232,-.0261,-.6574,1.2504,-.0261,-1.721,1.2504,-.0261,-1.721,0,-.0261,-2.1273,-1.2504,-.0261,-1.721,0,-.0261,-2.1273,-2.0232,-.0261,-.6574,-1.2504,-.0261,-1.721,-2.0232,-.0261,.6574,-2.0232,-.0261,-.6574,-2.0232,-.0261,.6574,-1.2504,-.0261,1.721,0,-.0261,2.1273,-1.2504,-.0261,1.721,0,-2.1923,0,.9085,-2.1923,.2952,.9085,-2.1923,-.2952,0,-2.1923,0,-.5615,-2.1923,.7728,0,-2.1923,.9552,0,-2.1923,-.9552,-.5615,-2.1923,-.7728,0,-2.1923,0,-.9085,-2.1923,-.2952,0,-2.1923,0,-.9085,-2.1923,.2952,0,-2.1923,0,0,-2.1923,.9552,.5615,-2.1923,.7728,0,-1.9802,1.0925,.5615,-2.1923,-.7728,0,-2.1923,.9552,0,-.2419,1.0925,0,-1.9802,1.0925,2.0232,-.0261,.6574,2.0232,-.0261,.6574,0,-.0261,2.1273,0,-.2419,1.0925,1.2504,-.0261,1.721,1.2504,-.0261,1.721,2.0232,-.0261,-.6574,2.0232,-.0261,-.6574,1.2504,-.0261,-1.721,-1.2504,-.0261,-1.721,-2.0232,-.0261,-.6574,-2.0232,-.0261,.6574,-2.0232,-.0261,.6574,0,-.0261,2.1273,0,-2.1923,.9552,0,-1.9802,1.0925],normals:[.4203,-.6991,.5785,0,-.2693,.963,0,-.6991,.715,0,1,0,.2644,.8931,.3639,0,.8931,.4498,.5012,.5224,.6898,0,.5224,.8527,-.68,-.6991,.221,-.9159,-.2693,-.2976,-.68,-.6991,-.221,.4278,.8931,.139,.8109,.5224,.2635,.68,-.6991,-.221,.9159,-.2693,.2976,.68,-.6991,.221,.4278,.8931,-.139,.8109,.5224,-.2635,-.4203,-.6991,.5785,-.9159,-.2693,.2976,.2644,.8931,-.3639,.5012,.5224,-.6898,.4203,-.6991,-.5785,.9159,-.2693,-.2976,0,.8931,-.4498,0,.5224,-.8527,0,-.6991,.715,-.5661,-.2693,.7791,-.2644,.8931,-.3639,-.5012,.5224,-.6898,0,-.6991,-.715,.5661,-.2693,-.7791,-.4278,.8931,-.139,-.8109,.5224,-.2635,-.4203,-.6991,-.5785,0,-.2693,-.963,-.4278,.8931,.139,-.8109,.5224,.2635,-.5661,-.2693,-.7791,-.2644,.8931,.3639,-.5012,.5224,.6898,.5661,-.2693,.7791,.5677,.2592,.7813,0,.2592,.9658,.9185,.2592,.2984,.9185,.2592,-.2984,.5677,.2592,-.7813,0,.2592,-.9658,-.5677,.2592,-.7813,-.9185,.2592,-.2984,-.9185,.2592,.2984,-.5677,.2592,.7813,.5063,-.5078,-.6969,0,-.5078,.8614,-.8193,-.5078,.2662,.5063,-.5078,.6969,-.8193,-.5078,-.2662,.8193,-.5078,-.2662,-.5063,-.5078,-.6969,-.5063,-.5078,.6969,0,-.6991,.715,0,-.5078,-.8614,.5063,-.5078,.6969,0,-.5078,.8614,.5063,-.5078,.6969,.8193,-.5078,.2662,.8193,-.5078,-.2662,.8193,-.5078,-.2662,.5063,-.5078,-.6969,.5063,-.5078,-.6969,0,-.5078,-.8614,-.5063,-.5078,-.6969,0,-.5078,-.8614,-.8193,-.5078,-.2662,-.5063,-.5078,-.6969,-.8193,-.5078,.2662,-.8193,-.5078,-.2662,-.8193,-.5078,.2662,-.5063,-.5078,.6969,0,-.5078,.8614,-.5063,-.5078,.6969,0,-1,0,.5181,-.8386,.1683,.5181,-.8386,-.1683,0,-1,0,-.3202,-.8386,.4407,0,-.8386,.5447,0,-.8386,-.5447,-.3202,-.8386,-.4407,0,-1,0,-.5181,-.8386,-.1683,0,-1,0,-.5181,-.8386,.1683,0,-1,0,0,-.8386,.5447,.3202,-.8386,.4407,0,-.2693,.963,.3202,-.8386,-.4407,0,-.8386,.5447,0,-.6991,.715,0,-.2693,.963,.8193,-.5078,.2662,.8193,-.5078,.2662,0,-.5078,.8614,0,-.6991,.715,.5063,-.5078,.6969,.5063,-.5078,.6969,.8193,-.5078,-.2662,.8193,-.5078,-.2662,.5063,-.5078,-.6969,-.5063,-.5078,-.6969,-.8193,-.5078,-.2662,-.8193,-.5078,.2662,-.8193,-.5078,.2662,0,-.5078,.8614,0,-.8386,.5447,0,-.2693,.963],uvs:[.3445,.9011,.3844,.613,.3852,.9038,.7612,.268,.8171,.3449,.7612,.3631,.851,.3916,.7612,.4208,.125,.8897,.1498,.5875,.1571,.8783,.8517,.2974,.9065,.3152,.2746,.881,.3159,.6016,.3075,.8924,.8517,.2386,.9065,.2208,.089,.8994,.1163,.5989,.8171,.1911,.851,.1444,.2444,.8713,.2824,.5902,.7612,.1729,.7612,.1152,.0489,.9038,.0825,.6087,.7053,.1911,.6714,.1444,.2155,.8669,.2492,.5805,.6707,.2386,.6159,.2208,.1868,.8696,.2161,.5762,.6707,.2974,.6159,.3152,.1829,.5788,.7053,.3449,.6714,.3916,.35,.6103,.8782,.4291,.7612,.4671,.9506,.3295,.9506,.2065,.8782,.1069,.7612,.0689,.6442,.1069,.5718,.2065,.5718,.3295,.6442,.4291,.2466,.894,.3848,.9573,.1208,.9299,.3473,.9521,.1537,.9077,.2783,.913,.1851,.8908,.0856,.9488,.0489,.9038,.2158,.8856,.8886,.4433,.7612,.4847,.8886,.4433,.9673,.335,.9673,.201,.9673,.201,.8886,.0927,.8886,.0927,.7612,.0513,.6338,.0927,.7612,.0513,.5551,.201,.6338,.0927,.5551,.335,.5551,.201,.5551,.335,.6338,.4433,.7612,.4847,.6338,.4433,.3801,.391,.3169,.5653,.2834,.5553,.0439,.391,.0818,.5714,.048,.5752,.2162,.543,.1824,.5454,.0439,.391,.1488,.553,.0439,.391,.1153,.5629,.0439,.391,.3843,.5752,.3505,.5729,.0481,.613,.2499,.5468,.3843,.5752,.0489,.9038,.0481,.613,.3117,.9352,.3117,.9352,.0485,.9573,.0489,.9038,.8886,.4433,.8886,.4433,.9673,.201,.9673,.201,.8886,.0927,.6338,.0927,.5551,.201,.5551,.335,.5551,.335,.7612,.4847,.3843,.5752,.0481,.613],colors:[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],indices:[0,1,2,3,4,5,5,6,7,8,9,10,3,11,4,4,12,6,13,14,15,3,16,11,11,17,12,18,19,8,3,20,16,17,20,21,22,23,13,3,24,20,20,25,21,26,27,18,3,28,24,25,28,29,30,31,22,3,32,28,28,33,29,34,35,30,3,36,32,32,37,33,10,38,34,3,39,36,36,40,37,15,41,0,3,5,39,39,7,40,7,42,43,6,44,42,12,45,44,17,46,45,21,47,46,25,48,47,29,49,48,33,50,49,37,51,50,40,43,51,52,30,22,53,0,2,54,18,8,55,15,0,56,8,10,15,57,13,57,22,13,58,10,34,59,60,18,61,34,30,43,62,63,64,44,65,44,66,65,67,46,68,69,47,70,47,71,72,48,73,74,49,75,76,77,51,78,51,79,80,81,82,83,84,85,86,81,87,88,89,88,90,91,90,92,38,87,35,93,92,85,23,82,14,41,94,1,31,83,23,81,95,82,14,95,41,19,85,92,9,88,38,96,85,27,35,97,31,19,90,9,81,98,95,81,97,87,81,83,97,0,41,1,5,4,6,8,19,9,4,11,12,13,23,14,11,16,17,18,27,19,17,16,20,22,31,23,20,24,25,99,100,27,25,24,28,30,35,31,28,32,33,34,38,35,32,36,37,10,9,38,36,39,40,15,14,41,39,5,7,7,6,42,6,12,44,12,17,45,17,21,46,21,25,47,25,29,48,29,33,49,33,37,50,37,40,51,40,7,43,52,61,30,53,55,0,54,59,18,55,101,15,56,54,8,15,102,57,57,52,22,58,56,10,59,103,104,61,58,34,43,42,105,106,42,44,44,45,107,108,45,46,109,46,47,47,48,110,48,49,111,49,50,112,113,50,51,51,43,114,38,88,87,23,83,82,41,95,115,31,97,83,14,82,95,19,27,85,9,90,88,116,86,85,35,87,97,19,92,90],subMeshes:[{materialIndex:0,verticesStart:0,verticesCount:117,indexStart:0,indexCount:420}],instances:[]}],cameras:[{name:"Camera",id:"Camera",position:[7.4811,5.3437,-6.5076],rotation:[.4615,-.8149,.0108],fov:.8576,minZ:.1,maxZ:100,speed:1,inertia:.9,checkCollisions:!1,applyGravity:!1,ellipsoid:[.2,.9,.2],cameraRigMode:0,interaxial_distance:.0637,type:"FreeCamera"}],activeCamera:"Camera",lights:[],shadowGenerators:[]}}]);