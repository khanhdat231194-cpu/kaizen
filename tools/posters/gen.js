const fs = require('fs');
const path = require('path');
const T = fs.readFileSync(path.join(__dirname, 'template.html'), 'utf8');

const pages = [
  { key:'focus', title:'Bích Chương Focus', name:'Focus',
    eyebrow:'Bích chương · mực manga', accent:'#DCE3E8', rgb:'220,227,232', ui:'#DCE3E8',
    rw:736, rh:1307,
    caption:'Lưng dàn thành cánh, từng thớ cơ khắc bằng nét mực; chữ FOCUS uốn theo vòm sọ.',
    alt:'Tranh manga đen trắng: tấm lưng cơ bắp nhìn từ phía sau, chữ FOCUS uốn cong phía trên đầu.' },

  { key:'artverse', title:'Bích Chương Artverse', name:'Artverse',
    eyebrow:'Bích chương · kính vỡ', accent:'#C8342B', rgb:'200,52,43', ui:'#E8756C',
    rw:736, rh:1313,
    caption:'Mặt nạ đỏ sau lớp kính nứt, mỗi vết nứt thành một đường bắt sáng.',
    alt:'Tranh nhân vật mặt nạ đỏ nhìn qua tấm kính nứt trong một phòng tối.' },

  { key:'whynotme', title:'Bích Chương Why Not Me', name:'Why Not Me',
    eyebrow:'Bích chương · chữ khoét', accent:'#EDEDED', rgb:'237,237,237', ui:'#EDEDED',
    rw:736, rh:1308,
    caption:'Câu hỏi dựng thành ba tầng chữ, đôi tay băng trắng khoét ngang dòng giữa.',
    alt:'Chữ WHY NOT ME cỡ lớn màu trắng, đôi tay băng trắng siết vào nhau chồng lên dòng giữa, một người trẻ ngồi thu mình phía dưới.' },

  { key:'mevsme', title:'Bích Chương Me Vs Me', name:'Me Vs Me',
    eyebrow:'Bích chương · thép xám', accent:'#A9B2B8', rgb:'169,178,184', ui:'#A9B2B8',
    rw:736, rh:1308,
    caption:'Bốn lần ME VS ME xếp thành vách chữ vây quanh bộ giáp chiến binh.',
    alt:'Chiến binh đội mũ giáp Sparta nhìn ngang, chữ ME VS ME lặp lại nhiều lần quanh hình.' },
];

const sub = (s, k, v) => s.split(k).join(v);

for (const p of pages) {
  let out = T;
  out = sub(out, '__TITLE__', p.title);
  out = sub(out, '__NAME__', p.name);
  out = sub(out, '__EYEBROW__', p.eyebrow);
  out = sub(out, '__CAPTION__', p.caption);
  out = sub(out, '__ALT__', p.alt);
  out = sub(out, '__ACCENT_RGB__', p.rgb);
  out = sub(out, '__ACCENT_UI__', p.ui);
  out = sub(out, '__ACCENT__', p.accent);
  out = sub(out, '__RW__', String(p.rw));
  out = sub(out, '__RH__', String(p.rh));
  out = sub(out, '__IMG__', 'art.jpg');
  out = sub(out, '__KEY__', p.key);
  const left = out.match(/__[A-Z_]+__/g);
  if (left) throw new Error('con placeholder chua thay: ' + [...new Set(left)].join(', '));
  const f = path.join(__dirname, 'page-' + p.key + '.html');
  fs.writeFileSync(f, out, 'utf8');
  console.log('page-' + p.key + '.html'.padEnd(6), (out.length/1024).toFixed(1) + ' KB');
}
