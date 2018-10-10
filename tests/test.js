for (var i = 1; i <= 5; i++) {
    (function(t) {
        setTimeout(function timer() {
            console.log(t);
        }, i * 1000);
    })(i);

}