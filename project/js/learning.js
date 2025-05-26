function handleFileClick(event) {
    const item = event.currentTarget;
    const item_all = document.querySelectorAll('.file-item');
    item_all.forEach(btn => btn.classList.remove('selected-item'));
    item.classList.add('selected-item');
    document.getElementById("pdf-viewer").src = `docs/${item.value}`;
}

// 페이지 로드 시 실행
window.addEventListener('DOMContentLoaded', function() {
    const fileList = document.getElementById('file-list');
  
    // 예시 데이터 (실제로는 서버에서 받아오거나, 배열로 관리)
    const files = [
        {name: '1. 공기역학이란?', value: 'doc-01.pdf'},
        {name: '2. 주요 운동 방정식', value: 'doc-02.pdf'},
    ];

    // 각 파일에 대해 file-item div 생성 및 추가
    files.forEach(file => {
        const fileItem = document.createElement('button');
        fileItem.className = 'file-item';
        fileItem.textContent = file.name;
        fileItem.value = file.value;
        fileItem.addEventListener('click', handleFileClick);
        fileList.appendChild(fileItem);
    });

});