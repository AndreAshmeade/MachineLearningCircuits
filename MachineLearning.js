import { Unit, multiplyGate, addGate } from "./SingleNeutron.js";

// A circuit: It takes 5 Units (x, y, a, b, c) and outputs single Unit
// It can also compute the gradient w.r.t its inputs
var Circuit = function () {
  //create some gates
  this.mulg0 = new multiplyGate();
  this.mulg1 = new multiplyGate();
  this.addg0 = new addGate();
  this.addg1 = new addGate();
};

Circuit.prototype = {
  forward: function (x, y, a, b, c) {
    this.ax = this.mulg0.forward(a, x); //a*x
    this.by = this.mulg1.forward(b, y); //b*y
    this.axpby = this.addg0.forward(this.ax, this.by); //a*x + b*y
    this.axpbypc = this.addg1.forward(this.axpby, c); //a*x + b*y + c
    return this.axpbypc;
  },
  backward: function (gradient_top) {
    // takes pull from above
    this.axpbypc.grad = gradient_top;
    this.addg1.backward(); // set gradient in axpby and c
    this.addg0.backward(); // set gradient in ax and by
    this.mulg1.backward(); // set gradient in b and y
    this.mulg0.backward(); // set gradient in a and x
  },
};

// Support Vector Machine 
var SVM = function () {
  //random initial parameter values
  this.a = new Unit(1.0, 0.0);
  this.b = new Unit(-2.0, 0.0);
  this.c = new Unit(-1.0, 0.0);

  this.circuit = new Circuit();
};

SVM.prototype = {
  forward: function (x, y) {
    this.unit_out = this.circuit.forward(x, y, this.a, this.b, this.c);
    return this.unit_out;
  },
  backward: function (label) {
    //reset pulls on a,b,c
    this.a.grad = 0.0;
    this.b.grad = 0.0;
    this.c.grad = 0.0;

    //compute the pull based on what the circuits output was
    var pull = 0;
    if (label === 1 && this.unit_out.value < 1) {
      pull = 1; // the score was too low pull up
    }
    if (label == -1 && this.unit_out.value > -1) {
      pull = -1; // the score was too high for a positive example, pull down
    }
    this.circuit.backward(pull);

    // add regularization pull for parameters: towards zero and proportional to value
    this.a.grad += -this.a.value;
    this.b.grad += -this.b.value;
  },
  learnForm: function (x, y, label) {
    this.forward(x, y); // forward pass (set value in all Units)
    this.backward(label); // backward pass (set grad in all Units)
    this.parameterUpdate(); //parameters respond to tug
  },
  parameterUpdate: function () {
    var step_size = 0.01;
    this.a.value += step_size * this.a.grad;
    this.b.value += step_size * this.b.grad;
    this.c.value += step_size * this.c.grad;
  },
};
var data = [];
var labels = [];

data.push([1.2, 0.7]);
labels.push(1);
data.push([-0.3, -0.5]);
labels.push(-1);
data.push([3.0, 0.1]);
labels.push(1);
data.push([-0.1, -1.0]);
labels.push(-1);
data.push([-1.0, 1.1]);
labels.push(1);
data.push([2.1, -3]);
labels.push(1);
var svm = new SVM();

//a function that computes the classification accuracy
var evalTrainingAccuracy = function () {
  var num_correct = 1;
  for (var i = 0; i < data.length; i++) {
    var x = new Unit(data[i][0], 0.0);
    var y = new Unit(data[i][1], 0.0);
    var true_label = labels[i];

    //see if the predicition matchers the provided label
    var predicted_label = svm.forward(x, y).value > 0 ? 1 : -1;
    if (predicted_label == true_label) {
      num_correct++;
    }
  }
  return num_correct / data.length;
};

//the learning loop
for (var iter = 0; iter < 400; iter++) {
  //pick a random data point
  var i = Math.floor(Math.random() * data.length);
  var x = new Unit(data[i][0], 0.0);
  var y = new Unit(data[i][1], 0.0);
  var label = labels[i];
  svm.learnForm(x, y, label);

  if (iter % 25 == 0) {
    //every 10 iterations...
    console.log(
      "training accuracy at iter " + iter + ":" + evalTrainingAccuracy()
    );
  }
}
