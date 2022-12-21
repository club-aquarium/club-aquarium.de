# club-aquarium.de

🏠✨ [Example website](https://aqua.club-aquarium.de/)

## git

### clone

Because the theme at [themes/hugo-scroll](https://git.club-aquarium.de/technik/website_theme)
is a submodule `--recursive` is recommended when cloning the repository.

```sh
git clone --recursive https://git.club-aquarium.de/technik/website.git
```

### update theme

To keep the theme up-to-date [janraasch/hugo-scroll](https://github.com/janraasch/hugo-scroll)
should be added as a git remote.

```sh
git -C themes/hugo-scroll remote add janraasch https://github.com/janraasch/hugo-scroll.git
```

Then changes in the upstream theme can be merged.

```sh
git -C themes/hugo-scroll fetch janraasch master
git -C themes/hugo-scroll merge janraasch/master
git commit -m 'update theme' themes/hugo-scroll
```
