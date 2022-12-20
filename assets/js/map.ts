declare const L: any

const root = document.getElementById("map")
if(root) {
	const leaflet_css = document.createElement("link")
	leaflet_css.rel = "stylesheet"
	leaflet_css.href = "https://unpkg.com/leaflet/dist/leaflet.css"
	leaflet_css.crossOrigin = ""

	const leaflet_js = document.createElement("script")
	leaflet_js.src = "https://unpkg.com/leaflet/dist/leaflet.js"
	leaflet_js.crossOrigin = ""
	leaflet_js.addEventListener("load", (_: unknown): void => {
		root.classList.remove("unloaded")
		root.innerHTML = ""

		const map = L.map(root)
		L.tileLayer("https://tile.osmand.net/hd/{z}/{x}/{y}.png", {
			maxZoom: 19,
			attribution: '<a href="https://osmand.net/">OsmAnd</a> | <a href="https://www.openstreetmap.org/">OSM</a>',
		}).addTo(map)
		map.setView(L.marker([51.0448464, 13.7401122]).addTo(map).getLatLng(), 15)
	})

	root.addEventListener("click", (_: unknown): void => {
		document.head.appendChild(leaflet_css)
		document.head.appendChild(leaflet_js)
	})
}
