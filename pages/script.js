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
