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
  'ma_ngoai_ngu': 'Mã ngoại ngữ'
};

const ScoreChecker: React.FC = () => {
  const [studentId, setStudentId] = useState('');
  const [studentScore, setStudentScore] = useState<StudentScore | null>(null);
  const [data, setData] = useState<StudentScore[]>([]);
  const [chartData, setChartData] = useState<any>(null);
  const [chartTitle, setChartTitle] = useState<string>('');

  const [selectedSubject, setSelectedSubject] = useState<string>('toan');

  useEffect(() => {
    fetch('/diem_thi_thpt_2024.csv')
      .then(response => response.text())
      .then(text => {
        Papa.parse(text, {
          header: true,
          complete: (results) => {
            setData(results.data as StudentScore[]);
          },
        });
      });
  }, []);

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

    const scoreDistribution: { [key: string]: number } = {};

    for (let i = 0; i <= 10; i += step) {
      const score = i.toFixed(2);
      scoreDistribution[score] = 0;
    }

    scores.forEach(score => {
      const specificScore = score;
      const scoreKey = specificScore.toFixed(2);
      if (scoreDistribution.hasOwnProperty(scoreKey)) {
        scoreDistribution[scoreKey] = (scoreDistribution[scoreKey] || 0) + 1;
      }
    });

    return scoreDistribution;
  };

  const handleStatistics = () => {
    if (!studentScore) return;

    const scoreDistribution = generateScoreDistribution(selectedSubject);
    const studentScoreValue = parseFloat(studentScore[selectedSubject] || '0');

    const backgroundColors = Object.keys(scoreDistribution).map(key => {
      return parseFloat(key) === studentScoreValue ? 'rgba(255, 99, 132, 0.6)' : 'rgba(75, 192, 192, 0.2)';
    });

    const borderColors = Object.keys(scoreDistribution).map(key => {
      return parseFloat(key) === studentScoreValue ? 'rgba(255, 99, 132, 1)' : 'rgba(75, 192, 192, 1)';
    });

    const chartData = {
      labels: Object.keys(scoreDistribution),
      datasets: [
        {
          label: 'Phổ điểm',
          data: Object.values(scoreDistribution),
          backgroundColor: backgroundColors,
          borderColor: borderColors,
          borderWidth: 1,
        }
      ],
    };

    setChartTitle(subjectMap[selectedSubject] || selectedSubject);
    setChartData(chartData);
  };

  const getProvinceName = (sbd: string) => {
    const provinceCode = sbd.slice(0, 2);
    return provinceMap[provinceCode] || 'Không xác định';
  };

  const chartOptions = {
    scales: {
      x: {
        type: 'category',
        ticks: {
          min: 0,
          max: 10,
          stepSize: 0.25,
        },
      },
    },
    plugins: {
      annotation: {
        annotations: studentScore ? [
          {
            type: 'box',
            xMin: studentScore ? parseFloat(studentScore[selectedSubject] || '0').toFixed(2) : '0',
            xMax: studentScore ? parseFloat(studentScore[selectedSubject] || '0').toFixed(2) : '0',
            backgroundColor: 'rgba(255, 99, 132, 0.25)',
            borderColor: 'rgba(255, 99, 132, 1)',
            borderWidth: 2,
            label: {
              enabled: true,
              content: 'Điểm của bạn',
              position: 'center',
              color: 'rgba(255, 99, 132, 1)',
              backgroundColor: 'rgba(255, 255, 255, 0.8)',
              font: {
                style: 'bold',
              },
            },
          },
        ] : [],
      },
    },
  };

  return (
    <div className="container mt-5 text-center">
      <h1 className="text-center mb-4">Tra cứu điểm THPTQG 2024</h1>
      <div className="mb-3">
        <input
          type="text"
          placeholder="Nhập số báo danh"
          value={studentId}
          onChange={(e) => setStudentId(e.target.value)}
          className="form-control"
        />
      </div>
      <button onClick={handleSearch} className="btn btn-primary mb-4">
        Tra cứu
      </button>
      {studentScore && (
        <div className="table-responsive">
          <table className="table table-bordered table-striped">
            <thead className="table-light">
              <tr>
                <th>Môn học</th>
                <th>Điểm</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Số báo danh</td>
                <td>{studentScore.sbd}</td>
              </tr>
              <tr>
                <td>Tỉnh thành</td>
                <td>{getProvinceName(studentScore.sbd)}</td>
              </tr>
              {Object.keys(subjectMap).map(key => (
                <tr key={key}>
                  <td>{subjectMap[key]}</td>
                  <td>{studentScore[key]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {studentScore && (
        <div>
          <div className="mb-3">
            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="form-select"
            >
              {Object.keys(subjectMap).map(key => (
                <option key={key} value={key}>{subjectMap[key]}</option>
              ))}
            </select>
          </div>
          <button onClick={handleStatistics} className="btn btn-primary mb-4">
            Xem phổ điểm
          </button>
          {chartData && (
            <div>
              <h3 className="text-center mb-4">{chartTitle}</h3>
              <Bar data={chartData} options={chartOptions} />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ScoreChecker;
