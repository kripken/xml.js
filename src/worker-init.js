console.log('init');
addEventListener('message', function onWorkerMessage(event) {
	console.log('onmessage', event);
	function stderr(txt) {
		postMessage({stderr: txt});
	}

	Module({
		inputFiles: event.data.inputFiles,
		args: event.data.args,
		stderr: stderr,
	});
});
