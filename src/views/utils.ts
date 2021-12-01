export function disableBrokenImg(event) {
    if (event.target.classList.contains('mobile-player__artwork')) {
        //TODO=FIXME
        return;
    }
    event.target.style.display = 'none';
}
