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
        document.documentElement.setAttribute('data-theme', currentTheme);

        if (currentTheme === 'dark') {
            toggleSwitch.checked = true;
        }
    }
})()