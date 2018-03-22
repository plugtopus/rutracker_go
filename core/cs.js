chrome['browserAction'].onClicked.addListener(function(c) {
    chrome['storage']['local'].get(['page', 'custom'], function(a) {
        var b = (a.page ? a.page : 'id0');
        if (b == 'custom') {
            b = (a.custom ? a.custom : '')
        }
        window.open('http://rutracker.org/forum/index.php')
    })
});
chrome['runtime'].onMessage.addListener(function(a, b, c) {
    setIcon()
});