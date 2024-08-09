const moment = require('moment');

// Hàm phân loại dữ liệu dự đoán
function categoryPoint(dataBets) {
    let allPoint = [];

    for (let data of dataBets) {
        if (data.score_team_a !== null || data.score_team_b !== null) {

            //lấy kết quả trận đầu
            let result = matchResult(data.score_team_a, data.score_team_b);

            //lấy điểm của lần dự đoán
            let score = calculateScore(result, data.winner_pred, data.total_score);

            //lưu thông tin dự đoán
            let point = ({
                user_code: data.user_code,
                point: score,
                index: data.bet_id
            });

            allPoint.push(point);
        }
    }
    return allPoint;
}

// Hàm nhóm dữ liệu dự đoán theo user_code
function groupBetData(allPoints) {
    // Tạo đối tượng lưu trữ thông tin tổng hợp theo user_code
    const result = {};

    allPoints.forEach(dataPoint => {
        const { user_code, point, index } = dataPoint;

        // Nếu user_code chưa tồn tại trong result, tạo một đối tượng mới
        if (!result[user_code]) {
            result[user_code] = {
                user_code: user_code,
                point: 0,
                total_index: 0,
                count: 0
            };
        }

        // Cộng dồn score, index và tăng số lượng
        result[user_code].point += point;
        result[user_code].total_index += index;
        result[user_code].count += 1;
    });

    // Tạo mảng mới với các đối tượng có user_code duy nhất
    let arrayData =  Object.values(result).map(item => ({
        user_code: item.user_code,
        point: item.point,
        average_index: item.total_index / item.count
    }));
    return sortByScoreAndIndex(arrayData);
}

function checkTime(start){
    // Chuyển đổi các chuỗi thời gian thành đối tượng Date
    let now = new Date(moment().format('YYYY-MM-DD HH:mm:ss')
        .replace(/-/g, '/'));

    return start - now >= 30 * 60 * 1000;
}

// hàm cho vào bàn thắng của hai đội trả về đội thắng (1,2,3) và tổng số bàn thắng
function matchResult(aScore, bScore) {

    let result = {
        'winner': 0,
        'total': 0,
    };

    result.total = aScore + bScore;

    if (aScore > bScore) {
        result.winner = 1;
        return result;
    } else if (aScore < bScore) {
        result.winner = 2;
        return result;
    } else {
        result.winner = 3;
        return result;
    }
}

// Hàm tính điểm dự đoán
function calculateScore(result, winner_pred, total_score) {
    let score = 0;
    if (result.winner === winner_pred) {
        score += 700;
    }
    if (result.total === total_score) {
        score += 1000;
    }
    return score;
}

// Hàm sắp xếp mảng dựa trên total_score và average_index
function sortByScoreAndIndex(points) {
    return points.sort((a, b) => {
        // Sắp xếp theo total_score trước
        if (a.point !== b.point) {
            return b.point - a.point;
        }
        // Nếu total_score bằng nhau, sắp xếp theo average_index
        return b.average_index - a.average_index;
    });
}

module.exports =
    {
        checkTime,
        groupBetData,
        categoryPoint,
    };