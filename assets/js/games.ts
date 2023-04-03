const COMPLEXITY_LEVELS = [
    'sehr einfach',
    'einfach',
    'mittel',
    'fortgeschritten',
    'Experte'
]

const FILTERS = {
    complexity: {
        value: false,
        element: document.getElementById('filter-sw-complexity') as HTMLInputElement,
    },
    'player-age': {
        value: false,
        element: document.getElementById('filter-sw-player-age') as HTMLInputElement
    },
    players: {
        value: false,
        element: document.getElementById('filter-sw-players') as HTMLInputElement,
    },
    'play-time': {
        value: false,
        element: document.getElementById('filter-sw-play-time') as HTMLInputElement,
    },
    search: {
        value: false,
        element: document.getElementById('filter-sw-search') as HTMLInputElement,
    },
}

const FILTER_VALUES = {
    complexityMin: {
        value: 0,
        limit: 99,
        element: document.getElementById('filter-complexity-min') as HTMLInputElement,
    },
    complexityMax: {
        value: 99,
        limit: 0,
        element: document.getElementById('filter-complexity-max') as HTMLInputElement,
    },
    playerAgeMin: {
        value: 0,
        limit: 99,
        element: document.getElementById('filter-player-age-min') as HTMLInputElement,
    },
    playerAgeMax: {
        value: 99,
        limit: 0,
        element: document.getElementById('filter-player-age-max') as HTMLInputElement,
    },
    playersMin: {
        value: 0,
        limit: 99,
        element: document.getElementById('filter-players-min') as HTMLInputElement,
    },
    playersMax: {
        value: 99,
        limit: 0,
    },
    playTimeMin: {
        value: 0,
        limit: 99,
        element: document.getElementById('filter-play-time-min') as HTMLInputElement,
    },
    playTimeMax: {
        value: 99,
        limit: 0,
        element: document.getElementById('filter-play-time-max') as HTMLInputElement,
    },
    search: {
        value: '',
        limit: 0,
        element: document.getElementById('filter-search') as HTMLInputElement,
    },
}

const GAMES = [...document.querySelectorAll('section.articles article')].map(article => {
    const game = {
        title: article.getAttribute('data-title') || '',
        playersMin: Number.parseInt(article.getAttribute('data-players-min')!),
        playersMax: Number.parseInt(article.getAttribute('data-players-max')!),
        playTime: Number.parseInt(article.getAttribute('data-play-time')!),
        playerAge: Number.parseInt(article.getAttribute('data-player-age')!),
        complexity: Number.parseInt(article.getAttribute('data-complexity')!),
        element: article as HTMLElement
    }
    FILTER_VALUES.playerAgeMin.limit = Math.min(FILTER_VALUES.playerAgeMin.limit, game.playerAge)
    FILTER_VALUES.playerAgeMax.limit = Math.max(FILTER_VALUES.playerAgeMax.limit, game.playerAge)
    FILTER_VALUES.playersMin.limit = Math.min(FILTER_VALUES.playersMin.limit, game.playersMin)
    FILTER_VALUES.playersMax.limit = Math.max(FILTER_VALUES.playersMax.limit, game.playersMax)
    FILTER_VALUES.playTimeMin.limit = Math.min(FILTER_VALUES.playTimeMin.limit, game.playTime)
    FILTER_VALUES.playTimeMax.limit = Math.max(FILTER_VALUES.playTimeMax.limit, game.playTime)
    FILTER_VALUES.complexityMin.limit = Math.min(FILTER_VALUES.complexityMin.limit, game.complexity)
    FILTER_VALUES.complexityMax.limit = Math.max(FILTER_VALUES.complexityMax.limit, game.complexity)
    return game
});

let filterDebounce
type Game = typeof GAMES[0]
function realFilterGames() {
    /**
     * True if a game should be removed 
     */
    const filterByPlayers = (game: Game) => FILTER_VALUES.playersMin.value && (FILTER_VALUES.playersMin.value < game.playersMin || FILTER_VALUES.playersMin.value > game.playersMax)
    const filterByTitle = (game: Game) => FILTER_VALUES.search.value && FILTER_VALUES.search.value.toLowerCase().split(' ').some(needle => !game.title.toLowerCase().includes(needle))
    const filterByPlayTime = (game: Game) => (FILTER_VALUES.playTimeMin.value && game.playTime < FILTER_VALUES.playTimeMin.value) || (FILTER_VALUES.playTimeMax.value && game.playTime > FILTER_VALUES.playTimeMax.value)
    const filterByPlayerAge = (game: Game) => (FILTER_VALUES.playerAgeMin.value && game.playerAge < FILTER_VALUES.playerAgeMin.value) || (FILTER_VALUES.playerAgeMax.value && game.playerAge > FILTER_VALUES.playerAgeMax.value)
    const filterByComplexity = (game: Game) => (FILTER_VALUES.complexityMin.value && game.complexity < FILTER_VALUES.complexityMin.value) || (FILTER_VALUES.complexityMax.value && game.complexity > FILTER_VALUES.complexityMax.value)

    GAMES.forEach(game => {
        if ((FILTERS.search.value && filterByTitle(game))
            || (FILTERS.players.value && filterByPlayers(game))
            || (FILTERS["play-time"].value && filterByPlayTime(game))
            || (FILTERS["player-age"].value && filterByPlayerAge(game))
            || (FILTERS.complexity.value && filterByComplexity(game))) {
            game.element.style.display = 'none'
        } else {
            game.element.style.display = 'block'
        }
    })
}

function filterGames() {
    if (filterDebounce) window.clearTimeout(filterDebounce)
    filterDebounce = window.setTimeout(realFilterGames, 300)
}

function enableFilter(filter: string, enabled: boolean) {
    FILTERS[filter].value = enabled
    let el = (FILTERS[filter].element as HTMLElement)
    while (el && !el.classList.contains('filter')) el = el.parentElement!;
    if (el) {
        if (el.classList.contains('active') && !enabled) el.classList.remove('active')
        else if (!el.classList.contains('active') && enabled) el.classList.add('active')
    }
    if (Object.values(FILTERS).some(f => f.value)) {
        const output = document.querySelector('.filters output')! as HTMLOutputElement
        output.innerHTML = 'Aktive Filter: ' + Object.values(FILTERS).map(f => f.value ? (f.element.labels![0].innerHTML) : undefined).filter(f => f !== undefined).join(', ')
    } else {
        document.querySelector('.filters output')!.textContent = 'Keine Filter aktiv'
    }
    filterGames()
}

function searchGames(needle: string) {
    FILTER_VALUES.search.value = needle
    filterGames()
}

function updateFilter(element: HTMLInputElement, value: number) {
    if (!element.checkValidity()) return
    const filter = Object.values(FILTER_VALUES).filter(f => 'element' in f && f.element === element)[0]
    if (Number.isNaN(value)) {
        filter.value = filter.limit
        element.value = String(filter.limit)
    } else {
        filter.value = value
    }
    filterGames()

    // set limits of other inputs
    const inputMin = document.getElementById(`${element.id.slice(0, -3) + 'min'}`) as HTMLInputElement
    const inputMax = document.getElementById(`${element.id.slice(0, -3) + 'max'}`) as HTMLInputElement
    if (element.id.endsWith('max')) {
        inputMin.max = String(Number.parseInt(element.value))
    } else if (inputMax) {
        inputMax.min = String(Number.parseInt(element.value))
    }
}

function clearFilter(id: string) {
    const input = document.getElementById(id) as HTMLInputElement
    input.value = ''
    updateFilter(input, NaN)
}

// Setup limits
Object.entries(FILTER_VALUES).forEach(([key, filter]) => {
    if ("element" in filter) {
        if (filter.element.type === 'number') {
            filter.value = filter.limit
            if (key.endsWith('Max')) {
                filter.element.max = String(filter.limit)
                console.log(key, filter.limit)
                filter.element.min = String(FILTER_VALUES[key.slice(0, -2) + 'in'].limit)
            } else {
                filter.element.min = String(filter.limit)
                filter.element.max = String(FILTER_VALUES[key.slice(0, -2) + 'ax'].limit)
            }
        }
        filter.element.value = String(filter.value)
    }
})
// reset filter state
Object.values(FILTERS).forEach(filter => {
    filter.element.checked = filter.value
})

// initial filter without debounce to prevent flickering
realFilterGames()

// register globally to be used from template
window.clearFilter = clearFilter
window.enableFilter = enableFilter
window.filterGames = filterGames
window.searchGames = searchGames
window.updateFilter = updateFilter
