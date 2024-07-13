/* NeuralNetwork represented as Real-Value Circuits */

// Expression: x * y


var forwardMultiplyGate = function (x, y) {
  return x * y;
};
forwardMultiplyGate(-2, 3); // returns -6. Exciting.

// real-valued function: f(x,y) = xy

// Strategy #1: Random Local Search

//circuit with single gate for now
var forwardMultiplyGate = function (x, y) {
  return x * y;
};

var x = -2,
  y = 3; // some input values

//try changing x,y randomly small amounts
//and keep track of what works best

var tweak_amount = 0.01;
var best_out = -Infinity;
var best_x = x,
  best_y = y;
for (var k = 0; k < 100; k++) {
  var x_try = x + tweak_amount * (Math.random() * 2 - 1); //tweak x a bit
  var y_try = y + tweak_amount * (Math.random() * 2 - 1); //tweak y a bit
  if (out > best_out) {
    //best improvement yet! Keep track of the x and y
    best_out = out;
    (best_x = x_try), (best_y = y_try);
  }
}

//Strategy #2: Numerical Gradient

//The derivative can be thought of as force on each input
//as we pull on the output to become higher.

var x = -2,
  y = 3;
var out = forwardMultiplyGate(x, y);
var h = 0.0001;

//compute derivative with respect to x
var xph = x + h; // -1.9999
var out2 = forwardMultiplyGate(xph, y); // -5.9997
var x_derivative = (out2 - out) / h; //3.0

//comput derivative with respect to y
var yph = y + h;
var out3 = forwardMultiplyGate(x, xph); // -6.002
var y_derivative = (out3 - out) / h; // -2.0

//The derivative will respect to some input can be computed
//by tweaking that input by a small amount and observing
//the change on the output value.

//add derivative on top of every input
var step_size = 0.01;
var out = forwardMultiplyGate(x, y); // before: -6
x = x + step_size * x_derivative; // x becomes -1.97
y = y + step_size * y_derivative; // y becomes 2.98
var out_new = forwardMultiplyGate(x, y); //-5.87! Exciting

//The analytic requires no tweaking of the inputs. It can be
//derived using mathematics (calculus).

var x = -2,
  y = 3;
var out = forwardMultiplyGate(x, y); //before: -6
var x_gradient = y;
var y_gradient = x;

var step_size = 0.01;
x += step_size * x_gradient; // -1.97
y += step_size * y_gradient; // 2.98
var out_new = forwardMultiplyGate(x, y); //-5.97. Higher output!

/*  INPUT:  We are given a circuit, some inputs and compute an output value.
 *  OUTPUT: We are then interested finding small changes to each input
 *
 *  Strategy #1: A random search for small pertubations of the inputs and keep
 *               track of what gives the highest increase output.
 *
 *  Strategy #2: We saw we can do much better by computing the gradient.
 *               Regardless of how complicated the circuit is, the numerical
 *               gradient s very simple( but relatively expensive) to compute.
 *               We compute it by probing the circuit's output value as we tweak
 *               the inputs one at a time.
 *
 *  Strategy #3: In the end, we saw that we can be even more clever and analytic
 *               derive a direct expression to get the analytic gradient. It is
 *               idenitical to the numerical gradient, it is fastest by far and
 *               there  is no need for any tweaking.
 */
