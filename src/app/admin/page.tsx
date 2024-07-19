"use client";
import { useRouter } from "next/navigation";
import { Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

import React, { useState, useEffect } from 'react';
import Papa from 'papaparse';
import { Bar } from 'react-chartjs-2';
import { Chart, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import annotationPlugin from 'chartjs-plugin-annotation';

Chart.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface StudentScore {
  sbd: string;
  toan: string;
  ngu_van: string;
  ngoai_ngu: string;
  vat_li: string;
  hoa_hoc: string;
  sinh_hoc: string;
  lich_su: string;
  dia_li: string;
  gdcd: string;
  ma_ngoai_ngu: string;
}

const provinceMap: { [key: string]: string } = {
  '01': 'THÀNH PHỐ HÀ NỘI',
  '02': 'THÀNH PHỐ HỒ CHÍ MINH',
  '03': 'THÀNH PHỐ HẢI PHÒNG',
  '04': 'THÀNH PHỐ ĐÀ NẴNG',
  '05': 'TỈNH HÀ GIANG',
  '06': 'TỈNH CAO BẰNG',
  '07': 'TỈNH LAI CHÂU',
  '08': 'TỈNH LÀO CAI',
  '09': 'TỈNH TUYÊN QUANG',
  '10': 'TỈNH LẠNG SƠN',
  '11': 'TỈNH BẮC KẠN',
  '12': 'TỈNH THÁI NGUYÊN',
  '13': 'TỈNH YÊN BÁI',
  '14': 'TỈNH SƠN LA',
  '15': 'TỈNH PHÚ THỌ',
  '16': 'TỈNH VĨNH PHÚC',
  '17': 'TỈNH QUẢNG NINH',
  '18': 'TỈNH BẮC GIANG',
  '19': 'TỈNH BẮC NINH',
  '21': 'TỈNH HẢI DƯƠNG',
  '22': 'TỈNH HƯNG YÊN',
  '23': 'TỈNH HÒA BÌNH',
  '24': 'TỈNH HÀ NAM',
  '25': 'TỈNH NAM ĐỊNH',
  '26': 'TỈNH THÁI BÌNH',
  '27': 'TỈNH NINH BÌNH',
  '28': 'TỈNH THANH HÓA',
  '29': 'TỈNH NGHỆ AN',
  '30': 'TỈNH HÀ TĨNH',
  '31': 'TỈNH QUẢNG BÌNH',
  '32': 'TỈNH QUẢNG TRỊ',
  '33': 'TỈNH THỪA THIÊN - HUẾ',
  '34': 'TỈNH QUẢNG NAM',
  '35': 'TỈNH QUẢNG NGÃI',
  '36': 'TỈNH KON TUM',
  '37': 'TỈNH BÌNH ĐỊNH',
  '38': 'TỈNH GIA LAI',
  '39': 'TỈNH PHÚ YÊN',
  '40': 'TỈNH ĐẮK LẮK',
  '41': 'TỈNH KHÁNH HÒA',
  '42': 'TỈNH LÂM ĐỒNG',
  '43': 'TỈNH BÌNH PHƯỚC',
  '44': 'TỈNH BÌNH DƯƠNG',
  '45': 'TỈNH NINH THUẬN',
  '46': 'TỈNH TÂY NINH',
  '47': 'TỈNH BÌNH THUẬN',
  '48': 'TỈNH ĐỒNG NAI',
  '49': 'TỈNH LONG AN',
  '50': 'TỈNH ĐỒNG THÁP',
  '51': 'TỈNH AN GIANG',
  '52': 'TỈNH BÀ RỊA – VŨNG TÀU',
  '53': 'TỈNH TIỀN GIANG',
  '54': 'TỈNH KIÊN GIANG',
  '55': 'THÀNH PHỐ CẦN THƠ',
  '56': 'TỈNH BẾN TRE',
  '57': 'TỈNH VĨNH LONG',
  '58': 'TỈNH TRÀ VINH',
  '59': 'TỈNH SÓC TRĂNG',
  '60': 'TỈNH BẠC LIÊU',
  '61': 'TỈNH CÀ MAU',
  '62': 'TỈNH ĐIỆN BIÊN',
  '63': 'TỈNH ĐĂK NÔNG',
  '64': 'TỈNH HẬU GIANG',
};

const subjectMap: { [key: string]: string } = {
  'toan': 'toán',
  'ngu_van': 'ngữ văn',
  'ngoai_ngu': 'ngoại ngữ',
  'vat_li': 'vật lí',
  'hoa_hoc': 'hóa học',
  'sinh_hoc': 'sinh học',
  'lich_su': 'lịch sử',
  'dia_li': 'địa lí',
  'gdcd': 'GDCD',
};

const examGroups = [
  { code: 'khoi_A_A00', name: 'Khối A00 - Toán, Vật lý, Hóa học' },
  { code: 'khoi_A_A01', name: 'Khối A01 - Toán, Vật lý, Tiếng Anh' },
  { code: 'khoi_A_A02', name: 'Khối A02 - Toán, Vật lí , Sinh học' },
  // Thêm các khối thi khác ở đây
];

const examGroupMap: { [key: string]: string } = {
  'khoi_A_A00': 'toan - vat_li - hoa_hoc',
  'khoi_A_A01': 'toan - vat_li - ngoai_ngu',
  'khoi_A_A02': 'toan - vat_li - sinh_hoc',
  // Liên kết các khối thi khác với các môn học tương ứng
};

const ScoreChecker: React.FC = () => {
  const [studentId, setStudentId] = useState('');
  const [studentScore, setStudentScore] = useState<StudentScore | null>(null);
  const [data, setData] = useState<StudentScore[]>([]);
  const [chartData, setChartData] = useState<any>(null);
  const [chartTitle, setChartTitle] = useState<string>('');
  const [selectedSubject, setSelectedSubject] = useState<string>('toan');
  const [selectedExamGroup, setSelectedExamGroup] = useState<string>(examGroups[0].code); // Mặc định là khối thi đầu tiên
  const [showSubjectDistribution, setShowSubjectDistribution] = useState<boolean>(true); // Theo dõi phân phối theo môn học cụ thể hoặc khối thi
  const [nationalRanking, setNationalRanking] = useState<number | null>(null);
  const [provinceRanking, setProvinceRanking] = useState<number | null>(null);
  const [higherThan, setHigherThan] = useState<number | null>(null);
  const [lowerThan, setLowerThan] = useState<number | null>(null);
  const [percentage, setPercentage] = useState<number | null>(null);

  useEffect(() => {
    fetch('/diem_thi_thpt_2024.csv')
      .then(response => response.text())
      .then(text => {
        const result = Papa.parse<StudentScore>(text, { header: true }).data;
        setData(result);
      });
  }, []);

  useEffect(() => {
    handleStatistics();
  }, [showSubjectDistribution, selectedSubject, selectedExamGroup]);

  const handleSearch = () => {
    let sbd = studentId;
    if (sbd.length === 7) {
      sbd = '0' + sbd;
    }
    const student = data.find((d) => d.sbd === sbd);
    setStudentScore(student || null);
  };

  const generateScoreDistribution = (subject: string) => {
    const scores = data
      .map(d => parseFloat(d[subject]))
      .filter(score => !isNaN(score) && score !== null && score !== undefined);
  
    const stepMap: { [key: string]: number } = {
      'toan': 0.2,
      'ngu_van': 0.25,
      'ngoai_ngu': 0.2,
    };
  
    const step = stepMap[subject] || 0.25;
    const maxScore = Math.max(...scores);
    const bins = Math.ceil(maxScore / step);
    const distribution = new Array(bins).fill(0);

    scores.forEach(score => {
      const index = Math.floor(score / step);
      distribution[index]++;
    });

    const labels = distribution.map((_, index) => (index * step).toFixed(2) + '-' + ((index + 1) * step).toFixed(2));
    return { labels, distribution };
  };

  const generateGroupScoreDistribution = (examGroup: string) => {
    const subjects = examGroupMap[examGroup].split(' - ');
    const groupScores = data
      .map(d => {
        const subjectScores = subjects.map(subject => parseFloat(d[subject]));
        if (subjectScores.some(score => isNaN(score))) return null;
        return subjectScores.reduce((sum, score) => sum + score, 0);
      })
      .filter(score => score !== null) as number[];

    const step = 0.1;
    const maxScore = 30;
    const bins = Math.ceil(maxScore / step);
    const distribution = new Array(bins).fill(0);

    groupScores.forEach(score => {
      const index = Math.floor(score / step);
      distribution[index]++;
    });

    const labels = distribution.map((_, index) => (index * step).toFixed(1) + '-' + ((index + 1) * step).toFixed(1));
    return { labels, distribution };
  };

  const handleStatistics = () => {
    if (showSubjectDistribution) {
      const { labels, distribution } = generateScoreDistribution(selectedSubject);
      setChartData({
        labels,
        datasets: [
          {
            label: `Phân phối điểm của môn ${subjectMap[selectedSubject]}`,
            data: distribution,
            backgroundColor: 'rgba(75, 192, 192, 0.6)',
          },
        ],
      });
      setChartTitle(`Phân phối điểm của môn ${subjectMap[selectedSubject]}`);
    } else {
      const { labels, distribution } = generateGroupScoreDistribution(selectedExamGroup);
      setChartData({
        labels,
        datasets: [
          {
            label: `Phân phối điểm của ${examGroups.find(group => group.code === selectedExamGroup)?.name}`,
            data: distribution,
            backgroundColor: 'rgba(153, 102, 255, 0.6)',
          },
        ],
      });
      setChartTitle(`Phân phối điểm của ${examGroups.find(group => group.code === selectedExamGroup)?.name}`);
    }
  };

  const handleToggleDistribution = () => {
    setShowSubjectDistribution(!showSubjectDistribution);
  };

  useEffect(() => {
    if (studentScore) {
      const scores = data.map(d => parseFloat(d[selectedSubject])).filter(score => !isNaN(score));
      const sortedScores = [...scores].sort((a, b) => a - b);
      const studentScoreValue = parseFloat(studentScore[selectedSubject]);

      const rank = sortedScores.indexOf(studentScoreValue) + 1;
      const totalStudents = sortedScores.length;

      setNationalRanking(rank);
      setPercentage(((totalStudents - rank) / totalStudents) * 100);

      const provinceCode = studentScore.sbd.slice(0, 2);
      const provinceStudents = data.filter(d => d.sbd.startsWith(provinceCode));
      const provinceScores = provinceStudents.map(d => parseFloat(d[selectedSubject])).filter(score => !isNaN(score));
      const sortedProvinceScores = [...provinceScores].sort((a, b) => a - b);

      const provinceRank = sortedProvinceScores.indexOf(studentScoreValue) + 1;

      setProvinceRanking(provinceRank);

      const higher = sortedScores.filter(score => score > studentScoreValue).length;
      const lower = sortedScores.filter(score => score < studentScoreValue).length;

      setHigherThan(higher);
      setLowerThan(lower);
    }
  }, [studentScore, selectedSubject]);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Tra cứu điểm thi THPT Quốc gia</h1>
      <div className="mb-4">
        <input
          type="text"
          value={studentId}
          onChange={(e) => setStudentId(e.target.value)}
          placeholder="Nhập số báo danh"
          className="border p-2 mr-2"
        />
        <button onClick={handleSearch} className="bg-blue-500 text-white p-2">
          Tra cứu
        </button>
      </div>
      {studentScore && (
        <div className="mb-4">
          <h2 className="text-xl font-bold">Kết quả tra cứu:</h2>
          <p><strong>Số báo danh:</strong> {studentScore.sbd}</p>
          <p><strong>Toán:</strong> {studentScore.toan}</p>
          <p><strong>Ngữ văn:</strong> {studentScore.ngu_van}</p>
          <p><strong>Ngoại ngữ:</strong> {studentScore.ngoai_ngu}</p>
          <p><strong>Vật lí:</strong> {studentScore.vat_li}</p>
          <p><strong>Hóa học:</strong> {studentScore.hoa_hoc}</p>
          <p><strong>Sinh học:</strong> {studentScore.sinh_hoc}</p>
          <p><strong>Lịch sử:</strong> {studentScore.lich_su}</p>
          <p><strong>Địa lí:</strong> {studentScore.dia_li}</p>
          <p><strong>GDCD:</strong> {studentScore.gdcd}</p>
          <p><strong>Mã ngoại ngữ:</strong> {studentScore.ma_ngoai_ngu}</p>
          <p><strong>Hạng toàn quốc:</strong> {nationalRanking}</p>
          <p><strong>Hạng trong tỉnh:</strong> {provinceRanking}</p>
          <p><strong>Số người cao điểm hơn:</strong> {higherThan}</p>
          <p><strong>Số người thấp điểm hơn:</strong> {lowerThan}</p>
          <p><strong>Tỉ lệ:</strong> {percentage?.toFixed(2)}%</p>
        </div>
      )}
      <div className="mb-4">
        <button onClick={handleToggleDistribution} className="bg-green-500 text-white p-2 mr-2">
          {showSubjectDistribution ? 'Xem phân phối khối thi' : 'Xem phân phối môn học'}
        </button>
        <select
          value={showSubjectDistribution ? selectedSubject : selectedExamGroup}
          onChange={(e) => showSubjectDistribution ? setSelectedSubject(e.target.value) : setSelectedExamGroup(e.target.value)}
          className="border p-2"
        >
          {showSubjectDistribution
            ? Object.keys(subjectMap).map((subject) => (
                <option key={subject} value={subject}>{subjectMap[subject]}</option>
              ))
            : examGroups.map((group) => (
                <option key={group.code} value={group.code}>{group.name}</option>
              ))}
        </select>
      </div>
      {chartData && (
        <div>
          <h2 className="text-xl font-bold mb-4">{chartTitle}</h2>
          <Bar data={chartData} options={{
            responsive: true,
            plugins: {
              legend: {
                position: 'top',
              },
              title: {
                display: true,
                text: chartTitle,
              },
              annotation: {
                annotations: {
                  line1: {
                    type: 'line',
                    xMin: parseFloat(studentScore ? studentScore[selectedSubject] : '0') / (showSubjectDistribution ? stepMap[selectedSubject] || 0.25 : 0.1),
                    xMax: parseFloat(studentScore ? studentScore[selectedSubject] : '0') / (showSubjectDistribution ? stepMap[selectedSubject] || 0.25 : 0.1),
                    borderColor: 'red',
                    borderWidth: 2,
                    label: {
                      content: 'Điểm của bạn',
                      enabled: true,
                      position: 'start',
                    },
                  },
                },
              },
            },
          }} />
        </div>
      )}
    </div>
  );
};

export default ScoreChecker;


