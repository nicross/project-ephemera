content.demo.bread.video.oscilloscope = (() => {
  const fftBinCount = 96

  const fragmentShader = `#version 300 es

precision highp float;

${content.demo.bread.glsl.defineIns()}
${content.demo.bread.glsl.commonFragment()}

${Array(fftBinCount/16).fill().map((_,i) => `in mat4 bins${i};`).join('')}

in float repetitions;
in float rotation;

out vec4 color;

float binAt(int index) {
  ${Array(fftBinCount).fill().map((_,i) => `if (index == ${i}){return bins${Math.floor(i/16)}[${Math.floor(i / 4) % 4}][${i % 4}];}`).join('')}
  return 0.0;
}

int toIndex(float angle) {
  for (int i = 0; i <= int(repetitions); i += 1) {
    float min = float(i) / repetitions;
    float max = float(i + 1) / repetitions;

    if (angle >= min && angle < max) {
      return int(floor(
        (
          mod(float(i), 2.0) > 0.0
            ? scale(angle, min, max, 1.0, 0.0)
            : scale(angle, min, max, 0.0, 1.0)
        ) * ${fftBinCount}.0
      ));
    }
  }

  return 0;
}

void main() {
  float x = (gl_FragCoord.x / resolution.x) - 0.5;
  float y = (gl_FragCoord.y / resolution.y) - 0.5;

  if (resolution.x > resolution.y) {
    x *= resolution.x / resolution.y;
  } else {
    y *= resolution.y / resolution.x;
  }

  float x0 = x;
  float y0 = y;

  x = (x0 * cos(rotation)) - (y0 * sin(rotation));
  y = (y0 * cos(rotation)) + (x0 * sin(rotation));

  float angle = clamp(abs(atan(y, x) / PI), 0.0, 1.0);
  int index = toIndex(angle);

  float bin = binAt(index);

  float d = min(1.0, distance(vec2(x, y), vec2(0, 0)));
  d = d * 2.0;

  float alpha = 0.0;
  float threshold = 0.01;
  float position = 0.5 + (bin * 0.5);

  if (position < d + threshold && position > d - threshold) {
    alpha = 1.0;
  }

  color = vec4(
    mix(
      vec3(0.0, 0.0, 0.0),
      hsv2rgb(vec3(perlin2d(angle, time / 6.0) * 3.0, bin, 1.0)),
      alpha
    ),
    1.0
  );
}
`

  const vertexShader = `#version 300 es

precision highp float;

${content.demo.bread.glsl.defineOuts()}
${content.demo.bread.glsl.defineUniforms()}
${content.demo.bread.glsl.commonVertex()}

${Array(fftBinCount/16).fill().map((_,i) => `uniform mat4 u_bins${i};`).join('')}

in vec3 vertex;
${Array(fftBinCount/16).fill().map((_,i) => `out mat4 bins${i};`).join('')}

out float repetitions;
out float rotation;

void main(void) {
  gl_Position = vec4(vertex, 1.0);

  ${content.demo.bread.glsl.passUniforms()}
  ${Array(fftBinCount/16).fill().map((_,i) => `bins${i} = u_bins${i};`).join('')}

  repetitions = mix(1.0, 6.0, perlin2d(-1.0, time / 30.0));
  rotation = perlin2d(1.0, time / 120.0) * PI * 3.0;
}
`

  let program

  return {
    draw: function () {
      const gl = content.demo.bread.video.context()

      gl.useProgram(program.program)
      content.demo.bread.glsl.bindUniforms(gl, program)

      // Bind u_bins
      const data = [...content.demo.bread.audio.fft.data()]

      for (let i = 0; i < fftBinCount/16; i += 1) {
        gl.uniformMatrix4fv(program.uniforms[`u_bins${i}`], false, new Float32Array(data.slice(i * 16, (i + 1) * 16)))
      }

      // Draw full-screen triangle
      gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer())
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
        [-1, 3, 1], [-1, -1, 1], [3, -1, 1],
      ].flat()), gl.STATIC_DRAW)

      gl.enableVertexAttribArray(program.attributes.vertex)
      gl.vertexAttribPointer(program.attributes.vertex, 3, gl.FLOAT, false, 0, 0)

      gl.drawArrays(gl.TRIANGLES, 0, 3)

      return this
    },
    load: function () {
      const gl = content.demo.bread.video.context()

      program = content.gl.createProgram({
        attributes: [
          ...content.demo.bread.glsl.attributeNames(),
          'vertex',
        ],
        context: gl,
        shaders: [
          {
            source: fragmentShader,
            type: gl.FRAGMENT_SHADER,
          },
          {
            source: vertexShader,
            type: gl.VERTEX_SHADER,
          },
        ],
        uniforms: [
          ...content.demo.bread.glsl.uniformNames(),
          ...Array(fftBinCount/16).fill().map((_,i) => `u_bins${i}`),
        ],
      })

      return this
    },
    unload: function () {
      return this
    },
  }
})()
