function gcd(n, m) {
  let max = n > m ? n : m;
  let result = 0;
  for (let i = 1; i <= max; i++) {
    if (n % i === 0 && m % i === 0) {
      result = i;
    }
  }
  return result;
}

console.log(`308, 20 최대공약수 -> ${gcd(308, 20)}`);
console.log(`45,38 최대공약수 -> ${gcd(45, 38)}`);

