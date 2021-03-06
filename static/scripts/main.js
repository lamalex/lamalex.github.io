// Party or death mode
function getActiveTheme() {
    return document.body.classList.contains('party') ? 'party' : 'death'
}

function setSelfieForTheme(theme) {
    const photo = document.getElementById('photo')
    photo.src = `/images/self${theme}.png`
}

(function() {
    const toggleSwitch = document.querySelector('.theme-switch input[type="checkbox"]');

    function switchTheme(e) {
        document.body.classList.toggle('party')
        document.body.classList.toggle('death')
        let activeTheme = getActiveTheme()
        localStorage.setItem('theme', activeTheme);
        setSelfieForTheme(activeTheme)
    }

    toggleSwitch.addEventListener('change', switchTheme, false);

    const currentTheme = localStorage.getItem('theme') ? localStorage.getItem('theme') : null;

    if (currentTheme) {
        document.body.className = ''
        document.body.classList.add(currentTheme)
        toggleSwitch.checked = currentTheme === 'death'

        if (currentTheme === 'death') {
            toggleSwitch.checked = true;
            setSelfieForTheme(currentTheme)
        }
    }
})();
