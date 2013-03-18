### HTML5 Canvas Crossroad

Simple simulation of a crossroad with:

- html5 canvas
- javascript

Cars are abstracted and displayed as circles, simulation can easily scale by increasing car radius size. There are two paired
semaphores for vertical and horizontal lane. New car generating rate is linear and represented as a number of frames passed
before new car is pushed into a lane. If there is no room for the cars, no new cars are added.

Semaphore cycle is linear and set in number of animation frames with a distribution:

- 60% red
- 5% yellow
- 35% green

enjoy ;)