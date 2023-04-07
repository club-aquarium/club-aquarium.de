declare const L: any
// @ts-ignore
import * as leaflet_urls from "@params"

const root = document.getElementById("map")
if(root) {
	const leaflet_css = document.createElement("link")
	leaflet_css.rel = "stylesheet"
	leaflet_css.href = leaflet_urls.css

	const leaflet_js = document.createElement("script")
	leaflet_js.src = leaflet_urls.js
	leaflet_js.addEventListener("load", (_: unknown): void => {
		root.classList.remove("unloaded")
		root.innerHTML = ""

		const map = L.map(root)
		L.tileLayer("https://tile.osmand.net/hd/{z}/{x}/{y}.png", {
			maxZoom: 19,
			attribution: '<a href="https://osmand.net/">OsmAnd</a> | <a href="https://www.openstreetmap.org/">OSM</a>',
		}).addTo(map)
		map.setView(L.marker([51.0448464, 13.7401122]).addTo(map).getLatLng(), 15)

		const flag = root.querySelector(".leaflet-attribution-flag")
		flag?.parentNode?.removeChild(flag)
	})

	const handleLoad = (event: Event): void => {
		if (event instanceof KeyboardEvent && event.key !== 'Enter') return

		event.preventDefault()
		document.head.appendChild(leaflet_css)
		document.head.appendChild(leaflet_js)
	}

	root.querySelector('a.btn')!.addEventListener("click", handleLoad)
	root.querySelector('a.btn')!.addEventListener("keyup", handleLoad)
}
