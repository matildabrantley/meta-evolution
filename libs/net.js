
//Just a perceptron/feedforward net for now
class Net {
	constructor(...layerSizes)
	{		
		//initialize all charges to zero
		this.charges = new Array(layerSizes.length);
		for (let layer = 0; layer < layerSizes.length; layer++)
		{
			this.charges[layer] = new Array(layerSizes[layer]);
			for (let neuron = 0; neuron < layerSizes[layer]; neuron++)
				this.charges[layer][neuron] = 0;
		}
		
		//fully interconnected random weights 
		this.weights = new Array(layerSizes.length - 1);
		for (let layer = 0; layer < this.weights.length; layer++)
		{
			this.weights[layer] = new Array(layerSizes[layer]);
			for (let neuron = 0; neuron < layerSizes[layer]; neuron++)
			{
				this.weights[layer][neuron] = new Array(layerSizes[layer + 1])
				for (let w = 0; w < layerSizes[layer + 1]; w++)
					this.weights[layer][neuron][w] = (Math.random() * 2) - 1;
			}
		}
		
		//random thresholds
		this.thresholds = new Array(layerSizes.length - 1);
		for (let layer = 0; layer < this.thresholds.length; layer++)
		{
			this.thresholds[layer] = new Array(layerSizes[layer]);
			for (let neuron = 0; neuron < layerSizes[layer]; neuron++)
				if (layer == 0)
					this.thresholds[layer][neuron] = 0;
				else
					this.thresholds[layer][neuron] = 0;//Math.random() * 5 - 2.5;
		}
	}

	//Run the net, feeding charges forward based on weights
	activate(input) {
		//set first layer to input array
		this.charges[0] = input;
		
		//index of output layer
		let outputLayer = this.charges.length - 1;

		//Propagate charges forward
		//each layer
		for (let layer = 0, nextLayer = 1; layer < outputLayer; layer++, nextLayer++) {
			//each neuron
			for (let neuron = 0; neuron < this.charges[layer].length; neuron++) {
				//charge checked against threshold
				//if (layer == 0 || this.charges[layer][neuron] > this.charges[layer - 1].length / 2  ) {
					//each weight
					for (let w = 0; w < this.charges[nextLayer].length; w++)
						this.charges[nextLayer][w] += this.charges[layer][neuron] * this.weights[layer][neuron][w];
				//}
			}
			//activation function on next layer's neurons after they're all charged up
			for (let neuron = 0; neuron < this.charges[nextLayer].length; neuron++) 
				this.charges[nextLayer][neuron] = this.zeroCentered(this.charges[nextLayer][neuron]);
		}
	
		//squish outputs with sigmoid
		for (let neuron = 0; neuron < this.charges[outputLayer].length; neuron++)
			this.charges[outputLayer][neuron] = this.zeroCentered(this.charges[outputLayer][neuron]);


		//return output layer
		return this.charges[outputLayer];
	}

	//copy over this net's weights with another net's weights, mutating in the process
	replaceAndMutate (otherNet, mutationRate=0) { 
		//weights overwritten
		for (let layer = 0; layer < otherNet.charges.length; layer++) {
			for (let neuron = 0; neuron < otherNet.charges[layer].length; neuron++) {
				for (let w = 0; w < otherNet.charges[layer].length; w++) {	
					this.weights[layer][neuron][w] = otherNet.weights[layer][neuron][w];
					//if (Math.random() < mutationRate)
				}
			}
		}
		//thresholds overwritten
		for (let layer = 0; layer < otherNet.charges.length - 1; layer++)
		{
			for (let neuron = 0; neuron < otherNet.charges[layer].length; neuron++)
				this.thresholds[layer][neuron] = otherNet.thresholds[layer][neuron];
		}
	}

	//Activation functions:
	//0.5-centered sigmoid (negatives cannot propagate)
	pointFiveCentered(x, base = 2.5) { return 1 / (1 + Math.pow(base, -x)); };
	//0-centered sigmoid (negatives can propagate)
	zeroCentered(x, scale = 1) { return Math.tanh(x) * scale; };
	//ReLU for hidden layer (no negatives, no max positive)
	relu(x) { return Math.max(0, x); };
}

const testNet = new Net(2, 3, 3, 3);
console.log(testNet.activate([1,1]));
console.log(testNet.activate([-1,-1]));
console.log(testNet.activate([1,-1]));
console.log(testNet.activate([-1,1]));
console.log(testNet.activate([0,0]));


//module.exports = Net;