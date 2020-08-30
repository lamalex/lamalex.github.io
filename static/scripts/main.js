(function() {
    const toggleSwitch = document.querySelector('.theme-switch input[type="checkbox"]');

    function switchTheme(e) {
        document.body.classList.toggle('party')
        document.body.classList.toggle('death')
        localStorage.setItem('theme', document.body.classList.contains('party') ? 'party' : 'death'); //add this
    }

    toggleSwitch.addEventListener('change', switchTheme, false);

    const currentTheme = localStorage.getItem('theme') ? localStorage.getItem('theme') : null;

    if (currentTheme) {
        document.body.className = ''
        document.body.classList.add(currentTheme)
        toggleSwitch.checked = currentTheme === 'death'

        if (currentTheme === 'dark') {
            toggleSwitch.checked = true;
        }
    }
})()