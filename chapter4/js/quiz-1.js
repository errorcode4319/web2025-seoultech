function isPositive(n) {
  if (n > 0) {
    alert(`${n}: 양수`);
  } else if (n < 0) {
    alert(`${n}: 음수`);
  } else {
    alert(`${n}: 0`);
  }
}

const number = parseInt(prompt('숫자 입력'));

if(!isNaN(number)) {
  isPositive(number);
}