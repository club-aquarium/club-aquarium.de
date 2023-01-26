// @ts-ignore
import * as params from "@params"

window.addEventListener("message", (event) => {
	if (event.origin !== params.baseurl.match(/https?:\/\/[^\/]+/)[0]) {
		return;
	}

	if (event.data.type !== "resize-iframe") {
		return
	}

	const { width, height } = event.data.payload

	const iframe = document.getElementsByTagName('iframe')[0]
	iframe.height = height
	if (width < window.innerWidth) {
		iframe.width = width
	}
}, false);