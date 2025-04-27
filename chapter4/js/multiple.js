function multiple(a, b = 5, c = 10) {
  return a * b + c;
}

console.log(multiple(5, 10, 20));  
console.log(multiple(10, 20));
console.log(multiple(10)); 