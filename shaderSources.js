


async function createProgramFromSources(gl, vs, fs) {
    const program = gl.createProgram();

    const vertexShader = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(vertexShader, await (await fetch(vs)).text());
    gl.compileShader(vertexShader);
    gl.attachShader(program, vertexShader);

    const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(fragmentShader, await (await fetch(fs)).text());
    gl.compileShader(fragmentShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);

    return program;
}