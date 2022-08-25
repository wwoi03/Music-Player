const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const playList = $('.playlist');
const player = $('.player');
const cd = $('.cd');
const heading = $('.header .name-song');
const cdThumb = $('.cd-thumb');
const audio = $('#audio');
const playBtn = $('.btn-play');
const progress = $('.progress');
const nextBtn = $('.btn-next');
const prevBtn = $('.btn-prev');
const randomBtn = $('.btn-random');
const repeatBtn = $('.btn-repeat');

const app = {
    songs: [
        {
            name: 'Pretty Savage',
            singer: 'Blackpink',
            path: './assets/musics/song1.mp3',
            image: './assets/img/img-song/song1.jpg'
        },
        {
            name: 'Pink Venom',
            singer: 'Blackpink',
            path: './assets/musics/song2.mp3',
            image: './assets/img/img-song/song2.jpg'
        },
        {
            name: 'Play',
            singer: 'Alan Walker',
            path: './assets/musics/song3.mp3',
            image: './assets/img/img-song/song3.jpg'
        },
        {
            name: 'Candyland',
            singer: 'Tobu',
            path: './assets/musics/song4.mp3',
            image: './assets/img/img-song/song4.jpg'
        },
        {
            name: 'Waiting For Love',
            singer: 'Avicii',
            path: './assets/musics/song5.mp3',
            image: './assets/img/img-song/song5.jpg'
        },
        {
            name: 'Money',
            singer: 'Lisa',
            path: './assets/musics/song6.mp3',
            image: './assets/img/img-song/song6.jpg'
        },
        {
            name: 'Cheer Up',
            singer: 'Hong Jinyoung',
            path: './assets/musics/song7.mp3',
            image: './assets/img/img-song/song7.jpg'
        },
        {
            name: 'Don\'t Wake Me Up',
            singer: 'jonas blue',
            path: './assets/musics/song8.mp3',
            image: './assets/img/img-song/song8.jpg'
        },
        {
            name: 'Butterfly',
            singer: 'Marnik',
            path: './assets/musics/song9.mp3',
            image: './assets/img/img-song/song9.jpg'
        },
        {
            name: 'End Of Time',
            singer: 'K-391',
            path: './assets/musics/song10.mp3',
            image: './assets/img/img-song/song10.jpg'
        },
    ],

    currentIndex: 0,
    isPlaying: false,
    isRandom: false,
    isRepeat: false,

    currentSong: function () {
        return this.songs[this.currentIndex];
    },
    
    handleEvent: function () {
        const _this = this;

        // xử lý phóng to / thu nhỏ cd
        const cdWidth = cd.offsetWidth;
        document.onscroll = function () {
            const scrollTop = window.scrollY || document.documentElement.scrollTop;   
            const newCdWidth = cdWidth - scrollTop;
            cd.style.width = newCdWidth > 0 ? newCdWidth + "px" : 0;
            cd.style.opacity = newCdWidth / cdWidth;
        }  

        // xử lý đĩa cd quay
        const cdThumbAnimate = cdThumb.animate(
            { 
                transform: "rotate(360deg)" 
            },
            {
                duration: 10000, // 10 seconds
                iterations: Infinity
            }
        )
        cdThumbAnimate.pause();
        
        // xử lý khi click nút play
        playBtn.onclick = function () {
            if (_this.isPlaying) {
                audio.pause();
            } else {
                audio.play();
            }
        }

        // xử lý khi song đươc play
        audio.onplay = function () {
            _this.isPlaying = true;
            player.classList.add('playing');
            cdThumbAnimate.play();
        }

        // xử lý khi song pause
        audio.onpause = function () {
            _this.isPlaying = false;
            player.classList.remove('playing');
            cdThumbAnimate.pause();
        }

        // khi tiến độ bài hát thay đổi
        audio.ontimeupdate = function () {
            if (audio.duration) {
                const progressPercent = audio.currentTime / audio.duration * 100;
                progress.value = progressPercent;
            }
        }

        // chức năng tua bài hát
        progress.oninput = function () {
            const skipTime = progress.value / 100 * audio.duration;  
            audio.currentTime = skipTime;
        }

        //  khi next song
        nextBtn.onclick = () => {
            if (_this.isRandom) {
                _this.playRandomSong();
            } else {
                _this.nextSong();
            }
            _this.loadAll();
        }

        // khi prev song
        prevBtn.onclick = () => {
            if (_this.isRandom) {
                _this.playRandomSong();
            } else {
                _this.prevSong();
            }
            _this.loadAll();
        }

        // xử lý bât / tắt nút random
        randomBtn.onclick = () => {
            if (_this.isRandom) {
                randomBtn.classList.remove('active');
                _this.isRandom = false;
            } else {
                randomBtn.classList.add('active');
                _this.isRandom = true;
            }
        }

        // xử lý bật / tắt nút repeat
        repeatBtn.onclick = () => {
            if (_this.isRepeat) {
                repeatBtn.classList.remove('active');
                _this.isRepeat = false;
            } else { 
                repeatBtn.classList.add('active');
                _this.isRepeat = true;
            }
        }

        // xử lý tự động chuyển bài khi audio ended
        audio.onended = () => {
            if (_this.isRepeat) {
                audio.play();
            } else {
                nextBtn.click(); // tư động click
            }
        }

        // xử lý khi click vào playlist
        playList.onclick = (e) => {
            const songNode = e.target.closest('.song:not(.active)');
            const optionNode = e.target.closest('.song__option');
            // xử lý khi bấm song
            if (songNode) {
                _this.currentIndex = Number(songNode.getAttribute('data-index'));
                _this.loadAll();
            }

            // xử lý khi bấm nút option
            if (optionNode) {

            }
        }
    },

    render: function () {
        const htmls = this.songs.map((song, index) => {
            return `
                <div class="song ${index === this.currentIndex ? 'active' : ''}" data-index="${index}">
                    <div class="song__img" style="background-image: url(${song.image})"></div>

                    <div class="song__content">
                        <h3 class="song-name">${song.name}</h3>
                        <p class="song-author">${song.singer}</p>
                    </div>

                    <div class="song__wave-motion">
                        <span class="song__wave-item"></span>
                        <span class="song__wave-item"></span>
                        <span class="song__wave-item"></span>
                        <span class="song__wave-item"></span>
                        <span class="song__wave-item"></span>
                    </div>

                    <div class="song__option">
                        <i class="song-option-icon fa-solid fa-ellipsis-h"></i>
                    </div>
                </div>
            `
        })
        playList.innerHTML = htmls.join('');
    },

    loadCurrentSong: function () {
        heading.innerText = this.currentSong().name;
        cdThumb.style.backgroundImage = `url(${this.currentSong().image})`;
        audio.src = this.currentSong().path;       
    },

    loadAll: function () {
        this.render();
        this.loadCurrentSong();
        this.scrollToActiveSong();
        audio.play();
    },

    nextSong: function () {
        this.currentIndex++;
        if (this.currentIndex >= this.songs.length) {
            this.currentIndex = 0;
        }
        this.loadCurrentSong();
    },

    prevSong: function () {
        this.currentIndex--;
        if (this.currentIndex < 0) {
            this.currentIndex = this.songs.length - 1;
        }
        this.loadCurrentSong();
    },

    playRandomSong: function () {
        let newIndex;
        do {
            newIndex = Math.floor(Math.random() * this.songs.length);
        } while (this.currentIndex === newIndex);
        this.currentIndex = newIndex;
        this.loadCurrentSong();
    },

    scrollToActiveSong: function () {
        setTimeout(() => {
            if (this.currentIndex != 0) {
                $('.song.active').scrollIntoView({
                    behavior: 'smooth',
                    block: 'center',
                })
                
            } else {
                $('.song.active').scrollIntoView({
                    behavior: 'smooth',
                    block: 'end'
                })
            }
        }, 200)
    },

    start: function () {
        // lắng nghe sử lý các sư kiên
        this.handleEvent();

        // tải thông tin song đầu tiên vào UI khi chạy ứng dụng
        this.loadCurrentSong();

        // render playlist
        this.render();  
    },
}

app.start();                                