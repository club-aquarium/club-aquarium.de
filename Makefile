all: karte hugo

DESTINATION ?= ../public

karte: clean-karte
	mkdir static/karte
	cp -Ra content/karte/* static/karte

clean-karte:
	rm -rfv static/karte

hugo:
	hugo --buildFuture --destination $(DESTINATION)

