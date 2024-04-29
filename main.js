'use strict';
const printMovies = document.querySelector('#print_movie_data');
const printSearch = document.querySelector('#search_bar_head');
const modal = document.querySelector('.modal');


// 검색 기능 함수 상단 선언
let searchMovieData;
// 엔터 키 입력시 영화 내용 검색 함수 선언
let handle;
let movieDetails;

// TMDB의 인기 영화 FETCH REQUEST
const options = {
    method: 'GET',
    headers: {
        accept: 'application/json',
        Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI5ODdhMTgxNDZmNjMzMGRlMjE5MTcyNzQ2M2Q2ODE3NiIsInN1YiI6IjY2MjVhYjY1MTk3ZGU0MDE3ZDJiYWE0MiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.7gY3u-lwVVCJjR8-87GH6p_H79WRogxhMK7dBJZ3ML4'
    }
};
fetch('https://api.themoviedb.org/3/movie/top_rated?language=en-US&page=1', options)
    .then(response => response.json())
    .then(response => {
        movieData(response);
        return response;
    })
    .catch(err => console.error(err));

let cardListHtml = ``;

// TMDB API에서 가져온 JSON 형식 영화정보
let movieData = response => {
    console.log(response); // JSON 영화정보 콘솔 확인용

    response.results.forEach((element) => {
        // 카드 리스트 웹페이지 출력
        cardListHtml =
            cardListHtml +
            `
            <article class="each_card">
                <div>
                    <img src="https://image.tmdb.org/t/p/w200${element.poster_path}">
                </div>
                <div class="movie_details">
                    <h3 style='display:none;' class="movie_name">${element.title}</h3>
                </div>
            </article>
            `;
        printMovies.innerHTML = cardListHtml;

        const eachCard = document.querySelectorAll('.each_card');

        // 카드 클릭시 영화 ID alert 창 출력
        eachCard.forEach((card, cardIdx) => {
            card.addEventListener('click', () => {
                alert(`영화 ID : ${response.results[cardIdx].id}`);
            });
        });

        // 카드 마우스 오버 시 제목, 내용, 평점 모달창 팝업
        eachCard.forEach((card, cardIdx) => {
            card.addEventListener('mouseenter', () => {
                let movieDetailsHtml = ``;
                movieDetailsHtml =
                    movieDetailsHtml +
                    `
                <h2>${response.results[cardIdx].title}</h2>
                <p>${response.results[cardIdx].overview}</p>
                <p>Rating : ${response.results[cardIdx].vote_average.toFixed(1)}</p>
                `;

                const modal_body = document.querySelector('.modal_body');
                modal_body.innerHTML += movieDetailsHtml;

                modal.style.display = 'flex';
            });
        });

        // 카드에 마우스 아웃 시 모달창 팝업 아웃
        eachCard.forEach((card) => {
            card.addEventListener('mouseleave', () => {
                const modal_body = document.querySelector('.modal_body');
                modal_body.innerHTML = ``;
                modal.style.display = 'none';
            });
        });
    });

    // 검색 창 생성 및 웹페이지 출력
    const addSearchBar = document.createElement('input');
    addSearchBar.setAttribute('id', 'search_bar_body');
    addSearchBar.setAttribute('type', 'text');
    addSearchBar.setAttribute('onkeypress', 'handle(event)');
    addSearchBar.setAttribute('placeholder', 'Search for Movies...');
    printSearch.appendChild(addSearchBar);

    // 웹사이트 렌더링 or 새로고침 후 검색 입력란 커서 자동 위치
    addSearchBar.select();

    // 영화 이름 검색 시 해당 문자열 포함된 영화 웹페이지 출력
    searchMovieData = () => {
        let value, movieName, cardData, i;
        value = document.getElementById('search_bar_body').value.toUpperCase();
        cardData = document.getElementsByClassName('each_card');
        for (i = 0; i < cardData.length; i++) {
            movieName = cardData[i].getElementsByClassName("movie_name");
            if (movieName[0].innerHTML.toUpperCase().indexOf(value) > -1) {
                cardData[i].style.display = "block";
            } else {
                cardData[i].style.display = "none";
            }
        }
    };

    // 검색 버튼 생성 및 버튼 클릭 시 해당 문자열 포함된 영화 웹페이지 출력
    const addSearchBtn = document.createElement('button');
    addSearchBtn.setAttribute('id', 'search_btn');
    addSearchBtn.setAttribute('onclick', 'searchMovieData()');
    addSearchBtn.append('Search');
    printSearch.appendChild(addSearchBtn);

    // 엔터 키 입력시 영화 내용 검색
    handle = event => {
        if (event.keyCode === 13) {
            searchMovieData();
        }
    };

    // 장르별 영화 네비게이션 분류 기능 구현 (진행중)
    let mapMovieGenre = response.results.map((v) => {
        return v.genre_ids;
    });
    mapMovieGenre.forEach((e, idx) => {
        console.log(`${idx}번째 영화 장르 => ${e}`);
    });

    // 페이지네이션 구현 (구현 방법 확인중)
    // fetch() 함수에서 'page=1' 문자열을 2, 3, 4 등으로 바꿔서 페이지네이션 구현 예정
};

