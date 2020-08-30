// Party or death mode
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
})();

//Dog image hover
(function() {
    const images = document.querySelectorAll('.image-rollover');
    images.forEach(dog => {
        dog.addEventListener('pointerover', (image) => {
            console.log(image)
            let photo =  document.getElementById('photo')
            photo.src = `/images/${image.srcElement.dataset.filename}`
        }, false)
    })

    const doglist = document.querySelector('.doglist')
    doglist.addEventListener('pointerleave', () => {
        let photo =  document.getElementById('photo')
        photo.src = `/images/selfdeath.png`
    }, false)
})();