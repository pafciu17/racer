window.addEventListener('load', function() {
    new paper.PaperScope();
    var canvas = document.getElementById('main-canvas');
    paper.setup(canvas);

    var view = paper.view;

    var car = new paper.Path.RegularPolygon(new paper.Point(80, 70), 3, 15);
    car.fillColor = '#000000';

    car.position = paper.Point.random().multiply(view.size);

    var direction = {x: 0, y: 0};

    var rotation = 0;
    var speed = 0;

    var direction = 0;
    var oldDirection = 0;

    paper.view.onFrame = function(event) {
        car.rotate(direction - oldDirection);

        var directionInRadians = direction * (Math.PI / 180)
        var vector = {
            x: Math.sin(directionInRadians) * speed,
            y: -Math.cos(directionInRadians) * speed
        }

        car.position = car.position.add(vector);

        oldDirection = direction;
    };

    var isBelowTheLimit = function(change, speed) {
        return Math.abs(change + speed) < 3;
    };

    var socket = io.connect('http://racer.eu-gb.mybluemix.net');
    socket.on('move', function (data) {
        if (data.x > 0) {
            direction += 5;
        } else if (data.x < 0) {
            direction -= 5;
        }
        if (data.y < 0 && speed < 3) {
            speed += 1;
        } else if (data.y > 0 && speed > -1) {
            speed -= 1;
        }
    });
});
