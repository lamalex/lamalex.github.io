//Dog image hover
(function() {
    const images = document.querySelectorAll('.image-rollover');
    images.forEach(dog => {
        dog.addEventListener('pointerover', (image) => {
            let photo =  document.getElementById('photo')
            photo.src = `/images/${image.srcElement.dataset.filename}`
        }, false)
    })

    const doglist = document.querySelector('.doglist')
    doglist.addEventListener('pointerleave', () => {
        const photo =  document.getElementById('photo')
        const theme = getActiveTheme()
        photo.src = `/images/self${theme}.png`
    }, false)
})();
