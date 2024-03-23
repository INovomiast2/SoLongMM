// Put the explanation cards in random postions on the X axis (left to right and right to left)
// With tranform: translateX() the cards are not in the same position
function randomizeCards() {
    // When scroll is detected, the cards are randomized again
    window.addEventListener('DOMContentLoaded', function() {
        var cards = document.querySelectorAll('.card');
        var cardPositions = [];
        for (var i = 0; i < cards.length; i++) {
            cardPositions.push(cards[i].style.transform);
        }
        for (var i = 0; i < cards.length; i++) {
            var random = Math.floor(Math.random() * 2);
            if (random === 0) {
                cards[i].style.transform = 'translateX(' + Math.floor(Math.random() * 500) + 'px)';
            } else {
                cards[i].style.transform = 'translateX(-' + Math.floor(Math.random() * 500) + 'px)';
            }
        }
        // If the cards are in the same position, they are randomized again
        for (var i = 0; i < cards.length; i++) {
            if (cardPositions[i] === cards[i].style.transform) {
                randomizeCards();
            }
        }
    });
}

document.body.onload = randomizeCards();