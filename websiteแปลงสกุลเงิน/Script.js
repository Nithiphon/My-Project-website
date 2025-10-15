// Script.js
const currency_one = document.getElementById('currency_one');
const currency_two = document.getElementById('currency_two');
const amount_one = document.getElementById('amount_one');
const amount_two = document.getElementById('amount_two');
const rateText = document.getElementById('rate');
const swapBtn = document.getElementById('btn');

// ไอคอนสกุลเงิน (เพิ่มความน่ารัก)
const currencyIcons = {
  USD: '$', EUR: '€', THB: '฿', JPY: '¥', GBP: '£', CNY: '¥',
  AUD: 'A$', CAD: 'C$', CHF: 'Fr', INR: '₹', KRW: '₩', SGD: 'S$',
  MYR: 'RM', IDR: 'Rp', PHP: '₱', VND: '₫', HKD: 'HK$', TWD: 'NT$'
};

// สร้างตัวเลือกสกุลเงิน
function populateCurrencies() {
  const currencies = [
    "THB", "USD", "EUR", "JPY", "GBP", "AUD", "CAD", "CHF", "CNY", "HKD",
    "INR", "KRW", "SGD", "MYR", "IDR", "PHP", "VND", "TWD", "NZD", "SEK"
  ];

  currencies.forEach(code => {
    const option1 = document.createElement('option');
    const option2 = document.createElement('option');
    
    const icon = currencyIcons[code] || code;
    option1.value = code;
    option2.value = code;
    option1.textContent = `${icon} ${code}`;
    option2.textContent = `${icon} ${code}`;
    
    if (code === 'THB') option1.selected = true;
    if (code === 'USD') option2.selected = true;
    
    currency_one.appendChild(option1);
    currency_two.appendChild(option2);
  });
}

// โหลดอัตราแลกเปลี่ยน
let lastFrom = 'THB';
let lastTo = 'USD';

async function convert(from, to, amount, targetInput) {
  if (!from || !to || amount === '' || amount < 0) {
    targetInput.value = '';
    return;
  }

  try {
    rateText.textContent = 'กำลังคำนวณ...';
    const res = await fetch(`https://v6.exchangerate-api.com/v6/b7bb9f3e96ce9ef1b9e7a09a/latest/${from}`);
    
    if (!res.ok) throw new Error('API Error');
    
    const data = await res.json();
    const rate = data.conversion_rates[to];
    
    if (rate === undefined) throw new Error('Invalid currency');
    
    const result = (amount * rate).toFixed(4);
    targetInput.value = result;
    
    // อัปเดตอัตราแลกเปลี่ยน
    rateText.textContent = `1 ${from} = ${rate.toFixed(4)} ${to}`;
    
    lastFrom = from;
    lastTo = to;
  } catch (err) {
    console.error(err);
    rateText.textContent = '❌ ไม่สามารถโหลดข้อมูลได้';
    targetInput.value = '';
  }
}

// ฟังก์ชันหลัก
function handleConversion() {
  const from = currency_one.value;
  const to = currency_two.value;
  const amount = parseFloat(amount_one.value) || 0;
  
  if (from === to) {
    amount_two.value = amount.toFixed(4);
    rateText.textContent = `1 ${from} = 1 ${to}`;
  } else {
    convert(from, to, amount, amount_two);
  }
}

function handleReverseConversion() {
  const from = currency_two.value;
  const to = currency_one.value;
  const amount = parseFloat(amount_two.value) || 0;
  
  if (from === to) {
    amount_one.value = amount.toFixed(4);
  } else {
    convert(from, to, amount, amount_one);
  }
}

// เหตุการณ์
currency_one.addEventListener('change', handleConversion);
currency_two.addEventListener('change', handleConversion);
amount_one.addEventListener('input', handleConversion);
amount_two.addEventListener('input', handleReverseConversion);

swapBtn.addEventListener('click', () => {
  const temp = currency_one.value;
  currency_one.value = currency_two.value;
  currency_two.value = temp;
  
  const tempAmount = amount_one.value;
  amount_one.value = amount_two.value;
  amount_two.value = tempAmount;
  
  handleConversion();
});

// เริ่มต้น
populateCurrencies();
handleConversion();