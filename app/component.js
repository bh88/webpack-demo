module.exports = function() {
    var element = document.createElement('h1');

    element.classList.add('pure-button');
    element.innerHTML = 'Hello world!';

    return element;
};
