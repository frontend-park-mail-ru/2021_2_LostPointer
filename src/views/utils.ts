export function disableBrokenImg(event) {
    event.target.style.display = 'none';
}

export function addDisableBrokenImgListeners() {
    document.querySelectorAll('img').forEach(function (img) {
        img.addEventListener('error', disableBrokenImg);
    });
}

export function removeDisableBrokenImgListeners() {
    document.querySelectorAll('img').forEach(function (img) {
        img.removeEventListener('error', disableBrokenImg);
    });
}

export function scrollUp() {
    const app = document.querySelector('.main-layout__content');
    if (app) {
        app.scrollTo(0, 0);
    }
}
