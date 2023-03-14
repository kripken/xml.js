;(function initWorker() {
	// #ifdef node
	const {parentPort} = require('worker_threads');
	// #endif

	function bytesToUtf8(buffer) {
		return new TextDecoder().decode(Uint8Array.from(buffer));
	}

	const stdoutBuffer = [];
	const stderrBuffer = [];

	function onExit(exitCode) {
		const message = {
			exitCode,
			stdout: bytesToUtf8(stdoutBuffer),
			stderr: bytesToUtf8(stderrBuffer),
		};
		// #ifdef node
		parentPort.postMessage(message);
		// #ifdef browser
		postMessage(message);
		// #endif
	};
	// #endif
	function onWorkerMessage(event) {
		// #ifdef browser
		var data = event.data;
		// #ifdef node
		var data = event;
		// #endif
		const wasmMemory = new WebAssembly.Memory({
			initial: data.initialMemory,
			maximum: data.maxMemory
		});

		Module({
			inputFiles: data.inputFiles,
			arguments: data.args,
			stderr: stderrBuffer.push.bind(stderrBuffer),
			stdout: stdoutBuffer.push.bind(stdoutBuffer),
			onExit,
			wasmMemory,
			// #ifdef browser
			locateFile(path) {
				if (path !== 'xmllint.wasm') {
					return path;
				}
				// Fix wasm file path to be relative to the worker file path.
				// This also makes bundlers automatically pick up the wasm file.
				return new URL('./xmllint.wasm', import.meta.url).href;
			}
			// #endif
		});
	}


	// #ifdef node
	parentPort.on('message', onWorkerMessage);
	// #ifdef browser
	addEventListener('message', onWorkerMessage);
	// #endif
})();
