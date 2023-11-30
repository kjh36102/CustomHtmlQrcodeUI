/**
 * 사용자의 운영체제를 판별함
 * @returns {string} 'ios', 'android', 'unknown' 중 하나를 반환함
 */
function getDeviceType() {
    var userAgent = navigator.userAgent || navigator.vendor || window.opera;
    userAgent = userAgent.toLowerCase() //소문자로 변환

    if (userAgent.includes('mac')) return 'ios'
    else if (userAgent.includes('android')) return 'android'
    else return 'unknown'
}

/**
 * 사용자에게 카메라 권한을 요청함
 * @returns {Promise<void>} 카메라 접근 권한이 허용되면 then, 오류시 catch
 * @throws 카메라 접근 권한이 거부되거나 카메라를 사용할 수 없는 경우
 */
function requestCameraAccess() {
    return navigator.mediaDevices.getUserMedia({ video: true })
        .then(stream => {
            // 스트림을 사용할 수 있으면 실행될 코드
            console.log('카메라 접근 권한이 허용되었습니다.');

            // 스트림 사용 후 해제
            stream.getTracks().forEach(track => track.stop());
        })
        .catch(error => {
            // 에러 처리
            console.error('카메라 접근 권한이 거부되었거나, 카메라를 사용할 수 없습니다.', error);
            throw error; // 권한 거부로 인한 에러를 상위로 전파
        });
}

/**
 * 카메라 목록을 가져옴
 * @returns {Promise<MediaDeviceInfo[]>} 카메라 장치 정보 목록을 반환함
 */
function getCameraList() {
    return navigator.mediaDevices.enumerateDevices()
        .then(devices => devices.filter(device => device.kind === 'videoinput'));
}

/**
 * 카메라의 label을 알아보기 쉽게 변환함
 * @param {string} label - 카메라 장치의 label
 * @returns {string} '후면', '전면', '일반' 중 하나를 리턴함
 */
function convertCameraName(label) {
    if(['back', '후면'].some(item => label.includes(item))) return '후면'
    else if(['front', '전면'].some(item => label.includes(item))) return '전면'
    else return '일반'  //pc등에서 웹캠 쓸때
}

/**
 * 콤보박스에 카메라 목록을 추가함
 */
function populateCameraList() {
    const cameraSelect = document.getElementById('camera-select');
    getCameraList().then(cameras => {
        cameras.forEach(camera => {
            const option = document.createElement('option');
            option.value = camera.deviceId;
            option.text = `Camera ${cameraSelect.options.length + 1} (${convertCameraName(camera.label)})`;
            cameraSelect.appendChild(option);
        });
    });
}

/**
 * 페이지가 로드될 때 실행될 함수를 등록함
 * @param {Function} fn - 실행될 함수
 */
function docReady(fn) {
    // Document가 로드되면 함수 실행
    if (document.readyState === "complete" || document.readyState === "interactive") {
        setTimeout(fn, 1);
    } else {
        document.addEventListener("DOMContentLoaded", fn);
    }
}

docReady(function () {
    //카메라 권한 요청하고 성공하면 카메라목록을 콤보박스에 추가함
    requestCameraAccess().then(populateCameraList).catch(error => {
        //실패 시 오류 출력함
        console.error('카메라 접근 권한 요청 중 오류가 발생했습니다.', error);
    });

    var deviceType = getDeviceType();
    var html5QrcodeScanner = new Html5Qrcode("qr-reader");
    var startButton = document.getElementById('start-button');
    var stopButton = document.getElementById('stop-button');

    function onScanSuccess(decodedText, decodedResult) {
        // 스캔 성공 시 콜백
        document.getElementById('qr-reader-results').innerHTML = decodedText;

        if (!deviceType.includes('ios')) //ios에서는 alert사용하면 카메라 멈춤
            alert('결과: ' + decodedText);  
    }

    //스캔 시작버튼 리스너 등록
    startButton.addEventListener('click', function() {
        const selectedCameraId = document.getElementById('camera-select').value;
        const config = { deviceId: selectedCameraId };
        html5QrcodeScanner.start(config, { fps: 10, qrbox: 500 }, onScanSuccess);   //qrbox 수치 조정으로 인식영역 크기조절
    });

    //스캔 종료버튼 리스너 등록
    stopButton.addEventListener('click', function() {
        html5QrcodeScanner.stop();
    });
});
