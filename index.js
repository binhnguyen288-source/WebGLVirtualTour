

window.onload = () => {

	const image = document.createElement('img');
	image.onload = async () => {



		const canvas = document.getElementById('viewer');
		const gl = canvas.getContext("webgl2");
		gl.clearColor(1, 1, 1, 1);


		const program = await createProgramFromSources(gl, "vertex.vert", "fragment.frag");

		gl.useProgram(program);

		const vertBuffer = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, vertBuffer);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
			-1, -1,
			-1, 1,
			1, 1,
			1, -1,
			-1, -1,
			1, 1,
		]), gl.STATIC_DRAW);
		gl.enableVertexAttribArray(0);
		gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
		gl.bindBuffer(gl.ARRAY_BUFFER, null);



		const texture = gl.createTexture();

		gl.activeTexture(gl.TEXTURE0 + 0);
		gl.bindTexture(gl.TEXTURE_2D, texture);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
	   
		gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);

		gl.uniform1i(gl.getUniformLocation(program, "tex"), 0);
		gl.uniform2f(gl.getUniformLocation(program, "canvasSize"), canvas.width, canvas.height);


		let theta0 = 0;
		let phi0 = Math.PI / 2;
		let hfov = 100 * Math.PI / 180;

		const focalLoc = gl.getUniformLocation(program, "focal");
		const RotLoc = gl.getUniformLocation(program, "Rot");

	   

		function render() {

			gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

			gl.uniform1f(focalLoc, Math.tan(hfov / 2));

			gl.uniformMatrix3fv(RotLoc, true, [
				Math.cos(phi0) * Math.cos(theta0), -Math.sin(theta0), Math.sin(phi0) * Math.cos(theta0),
				Math.cos(phi0) * Math.sin(theta0), Math.cos(theta0), Math.sin(phi0) * Math.sin(theta0),
				-Math.sin(phi0), 0, Math.cos(phi0)
			]);

			gl.drawArrays(gl.TRIANGLES, 0, 6);

		

			requestAnimationFrame(render);
		}

		render();

		let clicking = false;
		let prevCoord = null;
		canvas.onmousedown = ev => {
			clicking = true;
			prevCoord = {
				x: ev.offsetX,
				y: ev.offsetY
			};
		}

		canvas.onmousemove = ev => {
			if (!clicking) return;

			const dy = ev.offsetY - prevCoord.y;
			const dx = ev.offsetX - prevCoord.x;

			phi0 += 0.001 * dy;
			theta0 += 0.001 * dx;
		}

		canvas.onmouseup = ev => clicking = false;

	}
	image.src = 'cubemap.jpg'

}