const duration = 300; // 5분 (300초)
const circle = document.querySelector('.circle-progress');
const timeDisplay = document.querySelector('.time-display');

let remainingTime = duration;
let startTime = null;
let ongoing = false;
let radius, circumference;

function updateCircleSize() {
    let svg = document.querySelector("svg");
    let boundingBox = svg.getBoundingClientRect();
    let size = Math.min(boundingBox.width, boundingBox.height) / 2; // 정사각형 기준 크기 조정

    radius = size * 0.9; // 반지름을 동적으로 설정 (여백 고려)
    circumference = 2 * Math.PI * radius;

    circle.setAttribute("r", radius); // 반지름 업데이트
    circle.setAttribute("cx", boundingBox.width / 2);
    circle.setAttribute("cy", boundingBox.height / 2);
    circle.style.strokeDasharray = circumference;
    circle.style.strokeDashoffset = circumference; // 초기값 설정
}

function updateTimer(timestamp) {
    if (!startTime) startTime = timestamp;
    let elapsed = (timestamp - startTime) / 1000; // 경과 시간(초)
    remainingTime = Math.max(0, duration - elapsed); // 남은 시간 계산

    let minutes = Math.floor(remainingTime / 60);
    let seconds = Math.floor(remainingTime % 60);

    timeDisplay.textContent = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    document.title = timeDisplay.textContent;

    const progress = (remainingTime / duration); // 0 → 1로 변하게 변경
    circle.style.strokeDashoffset = circumference * progress;

    if (remainingTime > 0) {
        requestAnimationFrame(updateTimer);
    } else {
        alert("타이머 종료!");
        ongoing = false;
    }
}

function start_or_pause() {
    if (ongoing) {
        ongoing = false;
    } else {
        startTime = performance.now() - (duration - remainingTime) * 1000; // 일시정지 고려
        ongoing = true;
        requestAnimationFrame(updateTimer);
    }
}

// 창 크기 변경 시 반지름 자동 조정
window.addEventListener("resize", updateCircleSize);
updateCircleSize(); // 초기 크기 설정
