document.addEventListener('DOMContentLoaded', () => {
      
      // ▼▼▼▼▼▼▼▼▼▼ 固定値セット（テスト用） ▼▼▼▼▼▼▼▼▼▼
      document.getElementById('name').value = "大阪 春太郎";
      document.getElementById('email').value = "halhal@ohs.hal.ac.jp";
      document.getElementById('year').value = "2000";
      document.getElementById('month').value = "8";
      document.getElementById('day').value = "9";
      document.getElementById('password').value = "osakahalhaltaro";

      // プログラムで「男性ボタン」をクリックさせる
      const maleBtn = document.querySelector('.gender-btn[data-value="男性"]');
      if (maleBtn) {
          maleBtn.click(); 
      }
      // ▲▲▲▲▲▲▲▲▲▲ 固定値セットここまで ▲▲▲▲▲▲▲▲▲▲


      // ▼▼▼ 性別ボタンの処理（ ▼▼▼
      const genderBtns = document.querySelectorAll('.gender-btn');
      const genderInput = document.getElementById('gender');

      genderBtns.forEach(btn => {
          btn.addEventListener('click', () => {
              // 1. 全員の 'active' クラスを外す
              genderBtns.forEach(b => b.classList.remove('active')); 
              
              // 2. クリックされたボタンだけに 'active' クラスをつける
              
              btn.classList.add('active'); 
              
              // 3. 値をセット
              genderInput.value = btn.dataset.value;
          });
      });
      

      
      // 送信処理
      document.getElementById('registerForm').addEventListener('submit', (e) => {
          e.preventDefault();

          sessionStorage.setItem('reg_name', document.getElementById('name').value);
          sessionStorage.setItem('reg_email', document.getElementById('email').value);
          sessionStorage.setItem('reg_gender', document.getElementById('gender').value || '未選択');
          
          const birthDate = document.getElementById('year').value + '年 ' + 
                            document.getElementById('month').value + '月 ' + 
                            document.getElementById('day').value + '日';
          sessionStorage.setItem('reg_birth', birthDate);
          
          sessionStorage.setItem('reg_password', document.getElementById('password').value);

          window.location.href = 'user_confirm03.html';
      });
  });