document.addEventListener("DOMContentLoaded", function () {
    const dropZone = document.getElementById('dropZone');
    const fileInput = document.getElementById('fileInput');
    const videoElement = document.getElementById('videoElement');
    const canvasElement = document.getElementById('canvasElement');
    const randomFrameButton = document.getElementById('randomFrameButton');
    const ctx = canvasElement.getContext('2d');

    // 阻止浏览器默认的拖拽事件
    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
        dropZone.addEventListener(eventName, preventDefaults, false);
    });

    function preventDefaults(e) {
        e.preventDefault();
        e.stopPropagation();
    }

    // 添加拖动高亮效果
    ['dragenter', 'dragover'].forEach(eventName => {
        dropZone.addEventListener(eventName, () => dropZone.classList.add('hover'), false);
    });

    ['dragleave', 'drop'].forEach(eventName => {
        dropZone.addEventListener(eventName, () => dropZone.classList.remove('hover'), false);
    });

    // 处理拖拽文件
    dropZone.addEventListener('drop', handleDrop, false);

    function handleDrop(e) {
        const file = e.dataTransfer.files[0];
        if (file && file.type.startsWith('video/')) {
            handleVideoFile(file);
        }
    }

    // 点击区域时打开文件选择器
    dropZone.addEventListener('click', () => fileInput.click());

    fileInput.addEventListener('change', function () {
        const file = fileInput.files[0];
        if (file && file.type.startsWith('video/')) {
            handleVideoFile(file);
        }
    });

    function handleVideoFile(file) {
        const url = URL.createObjectURL(file);
        videoElement.src = url;
        videoElement.style.display = 'block';
        randomFrameButton.style.display = 'inline-block';
    }

    // 获取视频的封面（第一帧）
    videoElement.addEventListener('loadeddata', function () {
        canvasElement.width = videoElement.videoWidth;
        canvasElement.height = videoElement.videoHeight;
        ctx.drawImage(videoElement, 0, 0, canvasElement.width, canvasElement.height);
    });

    // 抽取随机帧
    randomFrameButton.addEventListener('click', function () {
        const duration = videoElement.duration;
        const randomTime = Math.random() * duration;

        videoElement.currentTime = randomTime;

        videoElement.addEventListener('seeked', function extractFrame() {
            ctx.drawImage(videoElement, 0, 0, canvasElement.width, canvasElement.height);
            videoElement.removeEventListener('seeked', extractFrame);
        });
    });
});
