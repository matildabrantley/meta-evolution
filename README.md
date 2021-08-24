# Meta-Evolution Lab
Online Lab for Open-ended AI through Hierarchical Evolution

## Description
This project is a custom neural network framework for creating artificial intelligence without the normal restrictions. The neural networks are trained through
natural selection of partly random mutations (similar to genetic algorithms) rather than gradient descent (backpropagation). This frees the neural networks to grow 
and change in myriad ways not possible with supervised learning, such as incremental neural architecture changes. However, unlike simple genetic algorithms, the 
mutations are not totally random and the natural selection is hierarchical. For example, groups of AI have an average fitness enabling the selection of one group over another, with different groups having divergent properties such as mutation rate, neural architecture, population size and generation length.

Evolution occurs in a Phaser.js world, which handles collisions and 2d vector physics quite efficiently. 

## Classes 
* Net: Custom neural network with zero-centered charges and weights to work
best in a 2D simulation in which origin is an agent's own location.
    * Three architectures so far: Feedforward, RNN and LSTM
    * When the agent a Net belongs to doesn't get selected for next generation or "dies" for whatever reason, another agent's Net in the same Group simply clones its weights into this Net to increase efficiency.
* Mind: Higher-level architectures exist here, in which Nets connect together
into multidimensional constructs. Each Net acts as a kind of neuron, wiring up
to other Nets.
* Life: Extends Phaser's Arcade Physics Sprite class. Contains sprites, animations, coordinates, fitness. This class activates and feeds formatted input into Mind
* Group: Extends Phaser's Group class. Manages the fitness calculations, selection and collision events of all of its Life objects. All members of a class have the same neural architecture to enable mixing of neural weights.
* Species: Also extends Phaser's Group class. Manages fitness calculations of
each subgroup, the group-level selection and collision events between different species. Each Group within a Species also has the same higher-level Mind architecture (Net of Nets), and also a very similar Net-level architecture to enable gene flow. Different Species can have predator/prey relationships.
* Genus: Basically just a higher level version of Species to enable selection of entire Species over one another. Also highly divergent neural architectures can arise at this level of selection. Will use _cloneDeep when overwriting Minds of entirely different architectures.
