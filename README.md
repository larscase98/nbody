# nbody

### about this project

I'm working on this for fun. I love the physics of it, and find that many of the n-body simulators out there tend to not be totally accurate. This one is a true n-body simulator.

This means that it has to check each object with every other object, including redundancies. This gets tough, since there's obviously a O(n^2) tiem complexity when computing trajectories.
