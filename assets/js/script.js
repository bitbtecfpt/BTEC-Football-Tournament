window.onload = function () {
    getMatches();
}

function handleSubmit(event) {
    event.preventDefault();

    const form = document.getElementById('predictionForm');
    const formData = new FormData(form);

    // Simulate a page overwrite with the form data
    document.body.innerHTML = `
        <div class="container mt-5">
            <h2>Form Submitted</h2>
            <p><strong>Vai trò:</strong> ${formData.get('role')}</p>
            <p><strong>Mã:</strong> ${formData.get('Code')}</p>
            <p><strong>Họ và Tên:</strong> ${formData.get('fullname')}</p>
            <p><strong>Số Điện Thoại:</strong> ${formData.get('phone')}</p>
            <p><strong>Dự Đoán Đội Thắng:</strong> ${formData.get('winningTeam')}</p>
            <p><strong>Tổng Số Bàn Thắng:</strong> ${formData.get('totalGoals')}</p>
        </div>
    `;
}

function templateMatchPanelHTML(data) {
    return `
                <div class="card border-secondary mt-2">
                    <div class="card-body">
                        <div class="row align-items-center mb-4">
                            <div class="col-4 text-left">
                                <span class="live-badge text-left" style="font-size: small;"> 
                                 ${data.isLive ? 'Live' : 'Comming'}
                                </span>
                            </div>
                            <div class="col-5">
                            </div>
                            <div class="col-3 text-right">
                                <i class="far fa-star"></i>
                                <i class="far fa-bell ml-2"></i>
                            </div>
                        </div>
                        <div class="row align-items-center">
                            <div class="col-4 text-center team-logo">
                                <img src="https://btec.fpt.edu.vn/wp-content/uploads/2023/04/Asset-156@4x.png"
                                    alt="${data.team_a}" class="logo img-fluid">
                                <p class="fw-bold">${data.team_a}</p>
                            </div>
                            <div class="col-4 text-center">
                                <div class="score">${data.score_team_a} : ${data.score_team_b}</div>
                                <div class="match-info">${data.start_time}</div>
                                <div class="match-info match-details">60'</div>
                            </div>
                            <div class="col-4 text-center team-logo">
                                <img src="https://btec.fpt.edu.vn/wp-content/uploads/2023/04/Asset-156@4x.png"
                                    alt="${data.team_b}" class="logo img-fluid">
                                <p class="fw-bold">${data.team_b}</p>
                            </div>
                        </div>
                        <div class="row align-items-center mt-1">
                            <div class="col-12">
                                <p class="text-center fw-bolder">
                                    Dự đoán đội thắng: <span>${data.winner_pred}</span>
                                    <br>
                                    Tổng số bàn thắng: <span> ${data.total_score} </span>
                                </p>
                            </div>
                        </div>
                        <div class="row align-items-center">
                            <div class="col-3">
                            </div>
                            <div class="col-6">
                                <button class="btn btn-bet btn-primary w-100" onclick="openWinnerPredModel('${data.team_a}',${data.team_a_id},'${data.team_b}',${data.team_b_id})">Dự
                                    đoán</button>
                            </div>
                            <div class="col-3">
                            </div>
                        </div>
                    </div>
                </div>
    `
}

/**
 * Open Winner Prediction Modal
 */
function openWinnerPredModel(team_a, team_a_id, team_b, team_b_id) {
    try {
        let user_info = getUserInfo();
        console.log(user_info);
        let modal = null;
        if (user_info === null || user_info === undefined || user_info === 'undefined' || user_info === '') {
            modal = new bootstrap.Modal(document.getElementById('winnerPredModal'), {
            });
        }else{
            modal = new bootstrap.Modal(document.getElementById('optionPickerModal'), {
            });
            document.getElementById('user-code-pred').value = user_info.user_code;
            document.getElementById('match-pred-name').value = `${team_a} vs ${team_b}`;
            document.getElementById('match-pred-id').value = 1;
            let winner_selection = document.getElementById('winner-team-selection');
            winner_selection.innerHTML = `
                <option selected value="0" disabled>Chọn đội thắng</option>
                <option value="1">${team_a}</option>
                <option value="2">${team_b}</option>
                <option value="3">Hòa</option>
            `;
        }
        modal.show();
    } catch (error) {
        alert(`Đã có lỗi xảy ra: ${error}`);
    }
}

/**
 * 
 */
function registerUser() {
    try {
        let user_code = document.getElementById('user-code-1').value;
        let user_name = document.getElementById('user-name-1').value;
        let user_phone = document.getElementById('phone-number-1').value;
        let user_info = {
            user_code: user_code,
            user_name: user_name,
            phone_number: user_phone
        }
        // store user data to local storage
        localStorage.setItem('user_info', JSON.stringify(user_info));
        // store user data to session storage
        sessionStorage.setItem('user_info', JSON.stringify(user_info));
        // store user data to cookie
        document.cookie = `user_info=${JSON.stringify(user_info)}`;
        // close modal
        let myModalEl = document.getElementById('winnerPredModal');
        let modal = bootstrap.Modal.getInstance(myModalEl)
        modal.hide();
    } catch (error) {
        alert(`Đã có lỗi xảy ra: ${error}`);
    }
}

function removeUserInfo() {
    try {
        localStorage.removeItem('user_info');
        sessionStorage.removeItem('user_info');
        document.cookie = 'user_info=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
        // close modal
        let myModalEl = document.getElementById('optionPickerModal');
        let modal = bootstrap.Modal.getInstance(myModalEl)
        modal.hide();
    }catch(error){
        alert(`Đã có lỗi xảy ra: ${error}`);
    }
}

/**
 * Lấy thông tin người dùng từ local storage, session storage hoặc cookie
 * @returns @object {user_code, user_name, user_phone}
 */
function getUserInfo() {
    try {
        let user_info = localStorage.getItem('user_info');
        let user_info_2 = sessionStorage.getItem('user_info');
        let user_info_3 = document.cookie.split(';').find(cookie => cookie.includes('user_info'));
        if (user_info) {
            user_info = JSON.parse(user_info);
        } else if (user_info_2) {
            user_info = JSON.parse(user_info_2);
        } else if (user_info_3) {
            user_info = JSON.parse(user_info_3);
        } else {
            user_info = null;
        }
        return user_info;
    } catch (error) {
        alert("Không thể lấy thông tin người dùng, xin vui lòng đăng ký tài khoản ");
        return null;
    }

}


function getMatches() {
    let dummyData = [
        {
            id: 1,
            round: 1,
            start_time: "2024-08-10 07:30:00",
            end_time: null,
            team_a: "Brazil",
            team_a_id: 1,
            team_b: "Germany",
            team_b_id: 2,
            score_team_a: 0,
            score_team_b: 0,
            winner_pred: '-',
            total_score: '-'
        },
        {
            id: 2,
            round: 1,
            start_time: "2024-08-10 10:30:00",
            end_time: null,
            team_a: "France",
            team_a_id: 3,
            team_b: "Argentina",
            team_b_id: 4,
            score_team_a: 0,
            score_team_b: 0,
            winner_pred: '-',
            total_score: '-'
        },
        {
            id: 3,
            round: 1,
            start_time: "2024-08-11 07:30:00",
            end_time: null,
            team_a: "Portugal",
            team_a_id: 5,
            team_b: "Spain",
            team_b_id: 6,
            score_team_a: 0,
            score_team_b: 0,
            winner_pred: '-',
            total_score: '-'
        },
        {
            id: 4,
            round: 1,
            start_time: "2024-08-11 10:30:00",
            end_time: null,
            team_a: "Italy",
            team_a_id: 7,
            team_b: "England",
            team_b_id: 8,
            score_team_a: 0,
            score_team_b: 0,
            winner_pred: '-',
            total_score: '-'
        },
        {
            id: 5,
            round: 2,
            start_time: "2024-08-12 07:30:00",
            end_time: null,
            team_a: "Brazil",
            team_a_id: 1,
            team_b: "France",
            score_team_a: 0,
            team_b_id: 3,
            score_team_b: 0,
            winner_pred: '-',
            total_score: '-'
        },
        {
            id: 6,
            round: 2,
            start_time: "2024-08-12 10:30:00",
            end_time: null,
            team_a: "Portugal",
            team_a_id: 5,
            team_b: "Italy",
            team_b_id: 7,
            score_team_a: 0,
            score_team_b: 0,
            winner_pred: '-',
            total_score: '-'
        },
        {
            id: 7,
            round: 3,
            start_time: "2024-08-13 07:30:00",
            end_time: 0,
            team_a: "Brazil",
            team_a_id: 1,
            team_b: "Portugal",
            team_b_id: 5,
            score_team_a: 0,
            score_team_b: 0,
            winner_pred: '-',
            total_score: '-'
        }
    ];
    let data = dummyData;
    let html_round_tab_1 = document.getElementById('round1-tab-content');
    let html_round_tab_2 = document.getElementById('round2-tab-content');
    let html_round_tab_3 = document.getElementById('round3-tab-content');
    data.forEach(match => {
        let html = templateMatchPanelHTML(match);
        if (match.round === 1) {
            html_round_tab_1.innerHTML += html;
        } else if (match.round === 2) {
            html_round_tab_2.innerHTML += html;
        } else if (match.round === 3) {
            html_round_tab_3.innerHTML += html;
        }
    });
}
/**
 * Lưu dự đoán của người dùng
 */
function submitWinnerPrediction() {
    try {
        let user_info = getUserInfo();
        let match_id = document.getElementById('match-pred-id').value;
        let winner_team = document.getElementById('winner-team-selection').value;
        let total_score = document.getElementById('total-score-input').value;
        let data = {
            user_code: user_info.user_code,
            match_id: match_id,
            winner_pred: winner_team,
            total_score: total_score
        }
        console.log(data);
        // Call API to submit prediction
        alert('Dự đoán của bạn đã được ghi nhận');
        // close modal
        let myModalEl = document.getElementById('optionPickerModal');
        let modal = bootstrap.Modal.getInstance(myModalEl)
        modal.hide();
    } catch (error) {
        alert(`Đã có lỗi xảy ra: ${error}`);
    }
}
