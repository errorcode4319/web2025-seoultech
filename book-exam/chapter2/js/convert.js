// C = (F - 32) / 1.8

let F = parseFloat(prompt("화씨 온도 입력력"));
let C;

C = ((F - 32) / 1.8).toFixed(1);

alert(`화씨 ${F} -> 섭씨 ${C}`);
