
importScripts('xmllint.js');

onmessage = function(event) {
	function stdout(txt) {
		postMessage({stdout: txt});
	}

	function stderr(txt) {
		postMessage({stderr: txt});
	}

	function onExit(exitCode) {
		postMessage({exitCode: exitCode});
	}

	Module({
		inputFiles: event.data.inputFiles,
		args: event.data.args,
		stdout: stdout,
		stderr: stderr,
		onExit: onExit
	});
}
