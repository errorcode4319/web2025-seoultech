
const canvas = document.getElementById('frame');
const ctx = canvas.getContext('2d');

const SPACING = 20;

// 벡터장 함수: 중심에서 방사형으로 퍼지는 벡터 생성
function calc_vector(x, y) {
    const centerX = canvas.width/2;
    const centerY = canvas.height/2;
    const dx = (x - centerX);
    const dy = (-(y - centerY));

    const polar_coord = convert_coord_cartesian2polar(dx, dy);
    const r = polar_coord.r;
    const c = polar_coord.c;

    console.log(`X: ${dx}, Y: ${dy} -> R: ${r}, C: ${c}`)

    let u = 0;
    let v = 0;

    const uv_list = get_uv_offset_list(r, c);

    console.log(uv_list)
    
    for (uv of uv_list) {
        u = u + uv.u;
        v = v + uv.v; 
    }

    return {u: u, v: v};    
}

// 벡터 그리기 함수
function draw_vector(x, y, vec) {

    magnitude = Math.sqrt(vec.u**2 + vec.v**2);

    vec.u = vec.u / magnitude;
    vec.v = vec.v / magnitude;

    const scale = SPACING * 0.5;
    const endX = x + vec.u * scale;
    const endY = y + -vec.v * scale;
    
    // 벡터 본체
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(endX, endY);
    ctx.strokeStyle = 'blue';
    ctx.stroke();

    // 화살표 머리
    const angle = Math.atan2(-vec.v, vec.u);
    ctx.beginPath();
    ctx.moveTo(endX, endY);
    ctx.lineTo(endX - 4*Math.cos(angle-Math.PI/6), endY - 4*Math.sin(angle-Math.PI/6));
    ctx.lineTo(endX - 4*Math.cos(angle+Math.PI/6), endY - 4*Math.sin(angle+Math.PI/6));
    ctx.closePath();
    ctx.fillStyle = 'blue';
    ctx.fill();
}



let calc_interval_id = null;

// 전체 캔버스 초기화 및 벡터장 그리기
function update_all() {


    let val = 0;
    let count = 0
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const spacing = SPACING;  // 벡터 간격
    const start_time = performance.now();
    for(let x=spacing/2; x<canvas.width; x+=spacing) {
        for(let y=spacing/2; y<canvas.height; y+=spacing) {
            const vec = calc_vector(x, y);
            console.log(vec)
            draw_vector(x, y, vec);
            
            for(let i=1; i<20000000;i++) {
                val = i * i;
            }

            count += 1;

            if (count == 125) {
                print_log("Progress: 20%");
            }
            if (count == 250) {
                print_log("Progress: 40%");
            }
            if (count == 375) {
                print_log("Progress: 60%");
            }
            if (count == 500) {
                print_log("Progress: 80%");
            }
            if (count == 625) {
                print_log("Progress: 100%");
            }

        }
    }

    const end_time = performance.now();
    const elapsed_time = end_time - start_time;
   
    print_log(`Done! (Time: ${parseFloat( elapsed_time.toFixed(4))} ms)`);
    
    document.getElementById('config-update-button').disabled = false;
}

print_log("Init Successed");


const button = document.getElementById('config-update-button');
button.addEventListener('click', function() {
    if (calc_interval_id) {
        clearInterval(calc_interval_id);
        calc_interval_id = null;
    }

    
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    
    document.getElementById('config-update-button').disabled = true;
    document.getElementById('report-button').disabled = true;

    const spinner = document.getElementById('loading');
    spinner.style.display = 'flex';
    
    print_log("Configure");
    const calc_list = [
        {check_id: "check_uniflow", val_id: "uniflow_val", name: "Uniform Flow", val_type: "Valocity(m/s)"},
        {check_id: "check_source", val_id: "source_val", name: "Source", val_type: "Strength(m^2/s)"},
        {check_id: "check_sink", val_id: "sink_val", name: "Sink", val_type: "Strength(m^2/s)"},
        {check_id: "check_vortex", val_id: "vortex_val", name: "Vortex", val_type: "Circulation(m^2/s)"},
        {check_id: "check_doublet", val_id: "doublet_val", name: "Doublet", val_type: "Moment(m^3/s)"},
    ];

    for (calc of calc_list) {
        const check = document.getElementById(calc.check_id);
        const val = document.getElementById(calc.val_id);
        if (check.checked) {
            print_log(calc.name+ ": enabled => " + calc.val_type + ":" + val.value, false);
        }
        else 
            print_log(calc.name+ ": disabled", false);
    }
    print_log("Calculate Start");

    let count = 0;
    update_progress(0);

    const spacing = SPACING;  // 벡터 간격
    let x=spacing/2;
    let y=spacing/2;
    
    const start_time = performance.now();

    calc_interval_id = setInterval(function(){
    
        const vec = calc_vector(x, y);
        console.log(vec)
        draw_vector(x, y, vec);

        if (count % 125 == 0 && count != 0) {
            print_log(`Progress: ${20 * count/125}%`);
        }

        count += 1;

        update_progress((count / 625.0) * 100);

        y += spacing;
        if (y >= canvas.height) {
            y = spacing/2;
            x += spacing;
            if (x >= canvas.width) {
                clearInterval(calc_interval_id);
                calc_interval_id = null;
                
                document.getElementById('config-update-button').disabled = false;
                document.getElementById('report-button').disabled = false;
                
                const end_time = performance.now();
                const elapsed_time = end_time - start_time;
            
                
                spinner.style.display = 'none';

                print_log(`Done! (Time: ${parseFloat( elapsed_time.toFixed(4))} ms)`);
            }
        }
    }, 15);

});


document.getElementById('report-button').disabled = true;


document.getElementById('report-button').addEventListener('click', function() {

    document.getElementById('main-container').style.height = '600px';

    const opt = {
    margin: 1, // 여백(선택)
    filename: `airflowx-report-${get_current_time()}.pdf`,
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { scale: 2 },
    jsPDF: {
        unit: 'mm', // 또는 'in' 등 사용 가능
        format: 'a4',
        orientation: 'landscape' // 가로방향 지정
    }
    };
    const element = document.getElementById('content-to-pdf');
    html2pdf().set(opt).from(element).save().then(() => {

        document.getElementById('main-container').style.height = '800px';
    });

    
});