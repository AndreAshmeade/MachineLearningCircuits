/* A single extra multiplication will turn a single (useless gate)
 * into a cog in the complex machine that is an entire neural network.
 */

//Expression: f(x, y , z) = (x + y)z

export let forwardMultiplyGate = (a, b) => {
  return a * b;
};

export let forwardAddGate = (a, b) => {
  return a + b;
};

let forwardCircuit = (x, y, z) => {
  let q = forwardAddGate(x, y);
  let f = forwardMultiplyGate(q, z);
  return f;
};

var x = -2,
  y = 5,
  z = -4;
var f = forwardCircuit(x, y, z); // output is -12

//inital conditions
var x = -2,
  y = 5,
  z = -4;
var q = forwardAddGate(x, y); // q is 3
var f = forwardMultiplyGate(q, z); //output is -12

//gradient of the MULTIPLY gate with respect to
//its input wrt is short for "with respect to"
var derivative_f_wrt_z = q; //3
var derivative_f_wrt_q = z; //-4

//derivative of the ADD gate with respect to
//its inputs
var derivative_q_wrt_x = 1.0;
var derivative_q_wrt_y = 1.0;

//chain rule
var derivative_f_wrt_x = derivative_q_wrt_x * derivative_f_wrt_q; //-4
var derivative_f_wrt_y = derivative_q_wrt_y * derivative_f_wrt_q; //-4

//final gradient, from above: [-4, -4, 3]
var gradient_f_wrt_xyz = [
  derivative_q_wrt_x,
  derivative_q_wrt_y,
  derivative_f_wrt_q,
];

//let the inputs respond to the force/tug:
var step_size = 0.01;
x = x + step_size * derivative_f_wrt_x; // -2.04
y = y + step_size * derivative_f_wrt_y; // 4.96
z = z + step_size * derivative_f_wrt_z; //-3.97

//Our circuit now better give higher output:
var q = forwardAddGate(x, y); //q becomes 2.92
var f = forwardMultiplyGate(q, z); //output is -11.59 up from -12! Nice !


//initial conditions
var x = -2,
  y = 5,
  z = -4;

//numerical gradient check
var h = 0.0001;
var x_derivative = (forwardCircuit(x + h, y, z) - forwardCircuit(x, y, z)) / h;
var y_derivative = (forwardCircuit(x, y + h, z) - forwardCircuit(x, y, z)) / h;
var z_derivative = (forwardCircuit(x, y, z + h) - forwardCircuit(x, y, z)) / h;

