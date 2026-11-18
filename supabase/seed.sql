-- Siap CPNS — seed data (reference + content). Run AFTER schema.sql.

insert into public.instansi (id,name,parent_id,category) values
  ('kemenkes','Kementerian Kesehatan',null,'Kementerian'),
  ('kemenkeu','Kementerian Keuangan',null,'Kementerian'),
  ('kemendikdasmen','Kementerian Pendidikan Dasar & Menengah',null,'Kementerian'),
  ('kemenkum','Kementerian Hukum',null,'Kementerian'),
  ('atrbpn','Kementerian ATR/BPN',null,'Kementerian'),
  ('kejaksaan','Kejaksaan Agung',null,'Lembaga'),
  ('bps','Badan Pusat Statistik',null,'Lembaga'),
  ('rs-sardjito','RSUP Dr. Sardjito','kemenkes','Unit'),
  ('rs-cipto','RSUPN Dr. Cipto Mangunkusumo','kemenkes','Unit'),
  ('pemprov-jabar','Pemprov Jawa Barat',null,'Pemda'),
  ('pemkot-bandung','Pemkot Bandung','pemprov-jabar','Pemda'),
  ('pemprov-jateng','Pemprov Jawa Tengah',null,'Pemda'),
  ('pemprov-jatim','Pemprov Jawa Timur',null,'Pemda'),
  ('pemprov-dki','Pemprov DKI Jakarta',null,'Pemda')
on conflict (id) do nothing;

insert into public.jabatan (id,name) values
  ('dokter-ap','Dokter Ahli Pertama'),
  ('perawat-ap','Perawat Ahli Pertama'),
  ('analis-kebijakan-ap','Analis Kebijakan Ahli Pertama'),
  ('prakom-ap','Pranata Komputer Ahli Pertama'),
  ('guru-ap','Guru Ahli Pertama'),
  ('auditor-ap','Auditor Ahli Pertama'),
  ('analis-sdm-ap','Analis SDM Aparatur Ahli Pertama'),
  ('perawat-tr','Perawat Terampil'),
  ('bidan-tr','Bidan Terampil'),
  ('prakom-tr','Pranata Komputer Terampil'),
  ('pelaksana-umum','Pelaksana / Staf Umum'),
  ('pengelola-keuangan','Pengelola Keuangan')
on conflict (id) do nothing;

insert into public.provinsi (id,name) values
  ('dki-jakarta','DKI Jakarta'),
  ('jawa-barat','Jawa Barat'),
  ('jawa-tengah','Jawa Tengah'),
  ('jawa-timur','Jawa Timur'),
  ('banten','Banten'),
  ('di-yogyakarta','DI Yogyakarta'),
  ('sumatera-utara','Sumatera Utara'),
  ('sumatera-barat','Sumatera Barat'),
  ('sulawesi-selatan','Sulawesi Selatan'),
  ('bali','Bali'),
  ('kalimantan-timur','Kalimantan Timur'),
  ('papua','Papua')
on conflict (id) do nothing;

insert into public.lessons (id,sub,title,minutes,body,ingat,ord) values
  ('twk-pancasila','TWK','Pancasila: lima sila dan nilainya',4,'<p>Pancasila adalah dasar negara sekaligus pandangan hidup bangsa.</p><ul><li><b>Sila 1</b> — Ketuhanan: toleransi beragama.</li><li><b>Sila 2</b> — Kemanusiaan: menghormati HAM.</li><li><b>Sila 3</b> — Persatuan: utamakan kepentingan bangsa.</li><li><b>Sila 4</b> — Kerakyatan: <span class=''hl''>musyawarah untuk mufakat</span>.</li><li><b>Sila 5</b> — Keadilan: adil dan gotong royong.</li></ul>','Sila 4 = musyawarah/mufakat. Sila 5 = keadilan & gotong royong.',0),
  ('twk-uud','TWK','UUD 1945: struktur dan amandemen',4,'<p>UUD 1945 terdiri dari <b>Pembukaan</b> dan <b>Batang Tubuh</b>.</p><p>Rumusan Pancasila yang sah ada di <span class=''hl''>Pembukaan alinea keempat</span>. UUD 1945 diamandemen <b>empat kali</b> (1999–2002).</p>','Pancasila sah = Pembukaan alinea 4. Amandemen = 4 kali.',1),
  ('twk-bhinneka','TWK','Bhinneka Tunggal Ika & NKRI',3,'<p>Semboyan <b>Bhinneka Tunggal Ika</b> berasal dari kitab <span class=''hl''>Sutasoma</span> karya Mpu Tantular. Bentuk negara: kesatuan (NKRI), bentuk pemerintahan: republik.</p>','Bhinneka Tunggal Ika → kitab Sutasoma, Mpu Tantular.',2),
  ('twk-sejarah','TWK','Sejarah pergerakan & proklamasi',4,'<p>Tonggak penting:</p><ul><li><b>1908</b> — Budi Utomo, awal kebangkitan nasional.</li><li><b>1928</b> — <span class=''hl''>Sumpah Pemuda</span>.</li><li><b>1945</b> — BPUPKI lalu PPKI; Proklamasi <span class=''hl''>17 Agustus 1945</span> oleh Soekarno–Hatta.</li></ul>','1908 bangkit · 1928 Sumpah Pemuda · 1945 Proklamasi.',3),
  ('twk-lembaga','TWK','Lembaga negara & pembagian kekuasaan',4,'<p>Tiga cabang kekuasaan:</p><ul><li><b>Eksekutif</b> — Presiden & Wakil Presiden.</li><li><b>Legislatif</b> — MPR, DPR, DPD.</li><li><b>Yudikatif</b> — <span class=''hl''>MA dan MK</span>, dibantu Komisi Yudisial.</li></ul>','Yudikatif = MA + MK (+ KY). Legislatif = MPR/DPR/DPD.',4),
  ('tiu-deret','TIU','Deret angka: pola selisih & rasio',5,'<p>Cari <b>selisih</b> antar suku. Contoh 2, 6, 12, 20, 30 → selisih 4,6,8,10 (naik 2). Berikutnya +12 = <span class=''hl''>42</span>. Kalau antar suku dikali tetap, itu geometri.</p>','Selisih tetap = aritmetika. Rasio tetap = geometri.',5),
  ('tiu-analogi','TIU','Analogi verbal',4,'<p>Temukan <b>relasi</b> pasangan pertama, lalu terapkan ke pasangan kedua. PENA : PENULIS = KUAS : <span class=''hl''>PELUKIS</span> (alat : penggunanya).</p>','Rumuskan relasinya dalam satu kalimat dulu.',6),
  ('tiu-silogisme','TIU','Silogisme dasar',4,'<p>Perhatikan kata <b>semua</b>, <b>sebagian</b>, <b>tidak</b>. Semua A adalah B; semua B adalah C → maka <span class=''hl''>semua A adalah C</span>. Kesimpulan tak boleh melebihi premis.</p>','''Sebagian'' tidak bisa menjadi ''semua''.',7),
  ('tiu-aritmetika','TIU','Hitung cepat: persen, rata-rata, perbandingan',5,'<p><b>Persen:</b> ''x adalah p% dari N'' → N = x ÷ (p/100). <b>Rata-rata:</b> jumlah ÷ banyak data. <b>Perbandingan:</b> a:b, nilai a = (a/(a+b)) × total, atau skalakan langsung.</p>','Persen: bagi dengan desimalnya. Rata-rata: kembalikan ke jumlah total.',8),
  ('tiu-huruf','TIU','Deret huruf & pola campuran',4,'<p>Ganti huruf jadi <b>nomor urut</b> (A=1 … Z=26), cari polanya, lalu kembalikan ke huruf. A,C,F,J,O → loncat 2,3,4,5 → berikutnya +6 = <span class=''hl''>U</span>.</p>','Ubah huruf ke angka dulu, baru cari pola.',9),
  ('tkp-pelayanan','TKP','Orientasi pelayanan publik',3,'<p>TKP dinilai <b>1–5</b>, tidak ada jawaban salah mutlak. Untuk pelayanan, pilih sikap <span class=''hl''>tenang, solutif, mengutamakan pengguna</span>.</p>','Pelayanan terbaik = tenang + cari solusi tercepat.',10),
  ('tkp-integritas','TKP','Integritas & anti-korupsi',3,'<p>Jawaban bernilai tinggi = jujur, berani menegakkan aturan, tetap membina. <span class=''hl''>Menegur & mendorong perbaikan</span> lebih baik daripada diam atau langsung menghukum.</p>','Integritas = berani benar + membina.',11),
  ('tkp-prioritas','TKP','Mengelola prioritas kerja',3,'<p>Saat tugas menumpuk, <span class=''hl''>menerima lalu menata ulang prioritas</span> adalah respons terbaik — bukan menolak, bukan mengerjakan seadanya.</p>','Adaptif & terorganisir menang.',12),
  ('tkp-adaptasi','TKP','Adaptasi & teknologi baru',3,'<p>Menghadapi sistem/cara kerja baru, sikap terbaik adalah <span class=''hl''>segera belajar dan terbuka pada perubahan</span>, bukan bertahan pada cara lama atau menunggu perintah.</p>','Perubahan datang → belajar duluan, jangan menunggu.',13),
  ('tkp-kerjasama','TKP','Kerja sama & jejaring kerja',3,'<p>Dalam tim: <span class=''hl''>sampaikan pendapat dengan data lalu hormati keputusan bersama</span>, dan tawarkan bantuan saat rekan kesulitan. Hindari memaksakan kehendak maupun diam total.</p>','Berargumen sehat + bantu rekan = skor tinggi.',14)
on conflict (id) do nothing;

-- questions + options
with q as (insert into public.questions (topic,type,q,why,correct,ord) values ('TWK','mcq','Nilai sila keempat Pancasila paling tepat tercermin dalam tindakan…','Sila ke-4: <b>musyawarah untuk mufakat</b>.',1,0) returning id)
insert into public.question_options (question_id,idx,text,points)
select id,0,'Beribadah sesuai agama masing-masing',null from q
union all select id,1,'Menyelesaikan masalah warga lewat musyawarah mufakat',null from q
union all select id,2,'Membayar pajak tepat waktu',null from q
union all select id,3,'Menolong korban bencana',null from q;

with q as (insert into public.questions (topic,type,q,why,correct,ord) values ('TWK','mcq','Rumusan Pancasila yang sah tercantum dalam…','Rumusan sah ada di <b>Pembukaan UUD 1945 alinea ke-4</b>.',1,1) returning id)
insert into public.question_options (question_id,idx,text,points)
select id,0,'Piagam Jakarta',null from q
union all select id,1,'Pembukaan UUD 1945 alinea keempat',null from q
union all select id,2,'Batang tubuh UUD 1945',null from q
union all select id,3,'Ketetapan MPR',null from q;

with q as (insert into public.questions (topic,type,q,why,correct,ord) values ('TWK','mcq','Semboyan Bhinneka Tunggal Ika berasal dari kitab…','Dari kitab <b>Sutasoma</b> karya Mpu Tantular.',1,2) returning id)
insert into public.question_options (question_id,idx,text,points)
select id,0,'Negarakertagama',null from q
union all select id,1,'Sutasoma',null from q
union all select id,2,'Arjunawiwaha',null from q
union all select id,3,'Pararaton',null from q;

with q as (insert into public.questions (topic,type,q,why,correct,ord) values ('TWK','mcq','Teks Proklamasi Kemerdekaan Indonesia dibacakan pada tanggal…','Proklamasi dibacakan <b>17 Agustus 1945</b> oleh Soekarno–Hatta.',0,3) returning id)
insert into public.question_options (question_id,idx,text,points)
select id,0,'17 Agustus 1945',null from q
union all select id,1,'1 Juni 1945',null from q
union all select id,2,'28 Oktober 1928',null from q
union all select id,3,'10 November 1945',null from q;

with q as (insert into public.questions (topic,type,q,why,correct,ord) values ('TWK','mcq','Ikrar Sumpah Pemuda diucapkan pada tahun…','Sumpah Pemuda: <b>28 Oktober 1928</b>.',2,4) returning id)
insert into public.question_options (question_id,idx,text,points)
select id,0,'1908',null from q
union all select id,1,'1920',null from q
union all select id,2,'1928',null from q
union all select id,3,'1945',null from q;

with q as (insert into public.questions (topic,type,q,why,correct,ord) values ('TWK','mcq','Jumlah bulu pada masing-masing sayap Garuda Pancasila adalah…','Sayap <b>17</b> helai → melambangkan tanggal 17 (Agustus).',1,5) returning id)
insert into public.question_options (question_id,idx,text,points)
select id,0,'8',null from q
union all select id,1,'17',null from q
union all select id,2,'19',null from q
union all select id,3,'45',null from q;

with q as (insert into public.questions (topic,type,q,why,correct,ord) values ('TWK','mcq','Bahasa resmi negara menurut UUD 1945 diatur dalam Pasal…','<b>Pasal 36</b>: bahasa negara ialah Bahasa Indonesia.',0,6) returning id)
insert into public.question_options (question_id,idx,text,points)
select id,0,'Pasal 36',null from q
union all select id,1,'Pasal 33',null from q
union all select id,2,'Pasal 29',null from q
union all select id,3,'Pasal 31',null from q;

with q as (insert into public.questions (topic,type,q,why,correct,ord) values ('TWK','mcq','Kekuasaan kehakiman di Indonesia dipegang oleh…','Yudikatif = <b>MA dan MK</b> (dibantu KY).',1,7) returning id)
insert into public.question_options (question_id,idx,text,points)
select id,0,'MPR dan DPR',null from q
union all select id,1,'Mahkamah Agung dan Mahkamah Konstitusi',null from q
union all select id,2,'Presiden',null from q
union all select id,3,'Kejaksaan Agung',null from q;

with q as (insert into public.questions (topic,type,q,why,correct,ord) values ('TWK','mcq','Badan yang bertugas menyelidiki usaha-usaha persiapan kemerdekaan adalah…','<b>BPUPKI</b> menyelidiki persiapan; PPKI yang mempersiapkan kemerdekaan.',1,8) returning id)
insert into public.question_options (question_id,idx,text,points)
select id,0,'PPKI',null from q
union all select id,1,'BPUPKI',null from q
union all select id,2,'KNIP',null from q
union all select id,3,'Volksraad',null from q;

with q as (insert into public.questions (topic,type,q,why,correct,ord) values ('TWK','mcq','Hari Lahir Pancasila diperingati setiap tanggal…','<b>1 Juni</b> — merujuk pidato Soekarno 1 Juni 1945.',0,9) returning id)
insert into public.question_options (question_id,idx,text,points)
select id,0,'1 Juni',null from q
union all select id,1,'17 Agustus',null from q
union all select id,2,'1 Oktober',null from q
union all select id,3,'28 Oktober',null from q;

with q as (insert into public.questions (topic,type,q,why,correct,ord) values ('TIU','mcq','Sinonim yang paling tepat untuk KOLOSAL adalah…','<b>Kolosal</b> = sangat besar → <b>akbar</b>.',1,10) returning id)
insert into public.question_options (question_id,idx,text,points)
select id,0,'Rumit',null from q
union all select id,1,'Akbar',null from q
union all select id,2,'Langka',null from q
union all select id,3,'Kuno',null from q;

with q as (insert into public.questions (topic,type,q,why,correct,ord) values ('TIU','mcq','Antonim yang paling tepat untuk GERSANG adalah…','Gersang (tandus) lawannya <b>subur</b>.',1,11) returning id)
insert into public.question_options (question_id,idx,text,points)
select id,0,'Tandus',null from q
union all select id,1,'Subur',null from q
union all select id,2,'Kering',null from q
union all select id,3,'Kosong',null from q;

with q as (insert into public.questions (topic,type,q,why,correct,ord) values ('TIU','mcq','PENA : PENULIS = KUAS : …','Pola alat : penggunanya → <b>pelukis</b>.',2,12) returning id)
insert into public.question_options (question_id,idx,text,points)
select id,0,'Cat',null from q
union all select id,1,'Kanvas',null from q
union all select id,2,'Pelukis',null from q
union all select id,3,'Lukisan',null from q;

with q as (insert into public.questions (topic,type,q,why,correct,ord) values ('TIU','mcq','Lanjutkan deret angka: 2, 6, 12, 20, 30, …','Selisih 4, 6, 8, 10, 12 → 30 + 12 = <b>42</b>.',2,13) returning id)
insert into public.question_options (question_id,idx,text,points)
select id,0,'38',null from q
union all select id,1,'40',null from q
union all select id,2,'42',null from q
union all select id,3,'44',null from q;

with q as (insert into public.questions (topic,type,q,why,correct,ord) values ('TIU','mcq','Lanjutkan deret: 3, 4, 7, 11, 18, 29, …','Tiap suku = jumlah dua suku sebelumnya → 18 + 29 = <b>47</b>.',2,14) returning id)
insert into public.question_options (question_id,idx,text,points)
select id,0,'40',null from q
union all select id,1,'45',null from q
union all select id,2,'47',null from q
union all select id,3,'50',null from q;

with q as (insert into public.questions (topic,type,q,why,correct,ord) values ('TIU','mcq','Lanjutkan deret huruf: A, C, F, J, O, …','Loncatan 2,3,4,5,6 → O (ke-15) + 6 = ke-21 = <b>U</b>.',1,15) returning id)
insert into public.question_options (question_id,idx,text,points)
select id,0,'T',null from q
union all select id,1,'U',null from q
union all select id,2,'V',null from q
union all select id,3,'W',null from q;

with q as (insert into public.questions (topic,type,q,why,correct,ord) values ('TIU','mcq','Semua pegawai wajib disiplin. Sebagian pegawai adalah lulusan baru. Kesimpulan yang sahih…','Dari ''sebagian pegawai lulusan baru'' → <b>sebagian lulusan baru</b> termasuk pegawai yang wajib disiplin.',1,16) returning id)
insert into public.question_options (question_id,idx,text,points)
select id,0,'Semua lulusan baru disiplin',null from q
union all select id,1,'Sebagian lulusan baru wajib disiplin',null from q
union all select id,2,'Semua yang disiplin adalah lulusan baru',null from q
union all select id,3,'Lulusan baru tidak wajib disiplin',null from q;

with q as (insert into public.questions (topic,type,q,why,correct,ord) values ('TIU','mcq','Sebuah barang seharga Rp240.000 diberi diskon 25%. Harga akhirnya…','Diskon 25% × 240rb = 60rb → <b>Rp180.000</b>.',0,17) returning id)
insert into public.question_options (question_id,idx,text,points)
select id,0,'Rp180.000',null from q
union all select id,1,'Rp200.000',null from q
union all select id,2,'Rp160.000',null from q
union all select id,3,'Rp190.000',null from q;

with q as (insert into public.questions (topic,type,q,why,correct,ord) values ('TIU','mcq','Mobil menempuh 180 km dalam 3 jam. Kecepatan rata-ratanya…','180 ÷ 3 = <b>60 km/jam</b>.',1,18) returning id)
insert into public.question_options (question_id,idx,text,points)
select id,0,'50 km/jam',null from q
union all select id,1,'60 km/jam',null from q
union all select id,2,'55 km/jam',null from q
union all select id,3,'65 km/jam',null from q;

with q as (insert into public.questions (topic,type,q,why,correct,ord) values ('TIU','mcq','Rata-rata 4 bilangan adalah 20. Ditambah satu bilangan, rata-ratanya jadi 25. Bilangan baru itu…','Jumlah awal 80, jumlah baru 125 → selisih <b>45</b>.',1,19) returning id)
insert into public.question_options (question_id,idx,text,points)
select id,0,'40',null from q
union all select id,1,'45',null from q
union all select id,2,'50',null from q
union all select id,3,'35',null from q;

with q as (insert into public.questions (topic,type,q,why,correct,ord) values ('TIU','mcq','Bilangan 30 adalah 15% dari…','30 ÷ 0,15 = <b>200</b>.',1,20) returning id)
insert into public.question_options (question_id,idx,text,points)
select id,0,'150',null from q
union all select id,1,'200',null from q
union all select id,2,'250',null from q
union all select id,3,'300',null from q;

with q as (insert into public.questions (topic,type,q,why,correct,ord) values ('TIU','mcq','Perbandingan umur A : B = 3 : 5. Jika umur B 30 tahun, umur A…','(3/5) × 30 = <b>18 tahun</b>.',1,21) returning id)
insert into public.question_options (question_id,idx,text,points)
select id,0,'15',null from q
union all select id,1,'18',null from q
union all select id,2,'20',null from q
union all select id,3,'12',null from q;

with q as (insert into public.questions (topic,type,q,why,correct,ord) values ('TKP','tkp','Tugas mendadak datang saat pekerjaanmu sedang menumpuk. Kamu…','Respons paling adaptif — <b>menerima lalu atur prioritas</b> — bernilai penuh.',null,22) returning id)
insert into public.question_options (question_id,idx,text,points)
select id,0,'Menolak dengan sopan karena beban sudah penuh',2 from q
union all select id,1,'Menerima, lalu menata ulang prioritas agar semua tepat waktu',5 from q
union all select id,2,'Menerima tapi mengerjakan seadanya',1 from q
union all select id,3,'Minta rekan mengambil alih tugas lama',3 from q;

with q as (insert into public.questions (topic,type,q,why,correct,ord) values ('TKP','tkp','Warga marah karena layanan dianggap lambat. Sikapmu…','Pelayanan publik: tenang dan <b>solutif</b> bernilai tertinggi.',null,23) returning id)
insert into public.question_options (question_id,idx,text,points)
select id,0,'Menjelaskan prosedur dengan tenang sambil mencari solusi tercepat',5 from q
union all select id,1,'Meminta warga bersabar dan menunggu',3 from q
union all select id,2,'Menanggapi dengan nada tinggi',1 from q
union all select id,3,'Mengabaikannya dan melayani yang lain',2 from q;

with q as (insert into public.questions (topic,type,q,why,correct,ord) values ('TKP','tkp','Kamu menemukan rekan memanipulasi data laporan. Kamu…','Integritas: <b>menegur dan mendorong perbaikan</b> paling tinggi.',null,24) returning id)
insert into public.question_options (question_id,idx,text,points)
select id,0,'Diam demi menjaga hubungan',1 from q
union all select id,1,'Menegur dan mendorong perbaikan sesuai aturan',5 from q
union all select id,2,'Ikut saja agar tidak dikucilkan',1 from q
union all select id,3,'Lapor atasan tanpa bicara ke rekan',3 from q;

with q as (insert into public.questions (topic,type,q,why,correct,ord) values ('TKP','tkp','Kantor menerapkan aplikasi baru yang belum kamu kuasai. Kamu…','Sikap <b>adaptif & mau belajar hal baru</b> bernilai penuh.',null,25) returning id)
insert into public.question_options (question_id,idx,text,points)
select id,0,'Tetap memakai cara lama yang sudah kukuasai',2 from q
union all select id,1,'Segera mempelajarinya dan meminta pelatihan bila perlu',5 from q
union all select id,2,'Menunggu sampai diperintah atasan',3 from q
union all select id,3,'Meminta rekan mengerjakan bagianku',1 from q;

with q as (insert into public.questions (topic,type,q,why,correct,ord) values ('TKP','tkp','Dalam rapat tim, pendapatmu berbeda dari mayoritas. Kamu…','Berani <b>beragumen sehat lalu menghormati keputusan</b> paling matang.',null,26) returning id)
insert into public.question_options (question_id,idx,text,points)
select id,0,'Menyampaikan argumen dengan data, lalu menghormati keputusan bersama',5 from q
union all select id,1,'Diam agar tidak menimbulkan keributan',2 from q
union all select id,2,'Tetap memaksakan pendapatku',1 from q
union all select id,3,'Mengikuti saja tanpa menyuarakan pendapat',3 from q;

with q as (insert into public.questions (topic,type,q,why,correct,ord) values ('TKP','tkp','Rekan kerja kesulitan menyelesaikan tugas menjelang tenggat. Kamu…','Kepedulian & kerja sama: <b>menawarkan bantuan</b> bernilai tertinggi.',null,27) returning id)
insert into public.question_options (question_id,idx,text,points)
select id,0,'Fokus pada tugasku sendiri saja',2 from q
union all select id,1,'Menawarkan bantuan sesuai kemampuanku',5 from q
union all select id,2,'Menyarankan ia meminta perpanjangan waktu',3 from q
union all select id,3,'Melapor ke atasan bahwa ia lambat',1 from q;

with q as (insert into public.questions (topic,type,q,why,correct,ord) values ('TKP','tkp','Kamu menemukan prosedur kerja yang tidak efisien. Kamu…','Inisiatif konstruktif — <b>usul perbaikan + solusi</b> — paling tinggi.',null,28) returning id)
insert into public.question_options (question_id,idx,text,points)
select id,0,'Mengusulkan perbaikan disertai solusi kepada atasan',5 from q
union all select id,1,'Menjalankannya apa adanya, bukan urusanku',2 from q
union all select id,2,'Mengeluhkannya kepada rekan-rekan',1 from q
union all select id,3,'Menunggu orang lain yang memperbaikinya',3 from q;
