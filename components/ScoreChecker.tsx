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
  { code: 'A00', name: 'Khối A00 - Toán, Vật lý, Hóa học' },
  { code: 'A01', name: 'Khối A01 - Toán, Vật lý, Tiếng Anh' },
  { code: 'A02', name: 'Khối A02 - Toán, Vật lí , Sinh học' },
  // Add other exam groups here
];

const examGroupMap: { [key: string]: string[] } = {
  'A00': ['toan', 'vat_li', 'hoa_hoc'],
  'A01': ['toan', 'vat_li', 'ngoai_ngu'],
  'A02': ['toan', 'vat_li', 'sinh_hoc'],
  // Map other exam groups to their corresponding subjects
};

const ScoreChecker: React.FC = () => {
  const [studentId, setStudentId] = useState('');
  const [studentScore, setStudentScore] = useState<StudentScore | null>(null);
  const [data, setData] = useState<StudentScore[]>([]);
  const [chartData, setChartData] = useState<any>(null);
  const [chartTitle, setChartTitle] = useState<string>('');
  const [selectedSubject, setSelectedSubject] = useState<string>('toan');
  const [selectedExamGroup, setSelectedExamGroup] = useState<string>(examGroups[0].code); // Default to the first exam group
  const [showSubjectDistribution, setShowSubjectDistribution] = useState<boolean>(true); // Track subject-specific or group-specific distribution
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
    const maxScore = 10;
  
    const scoreDistribution: { [key: string]: number } = {};
  
    for (let i = 0; i <= maxScore; i += step) {
      const score = i.toFixed(2);
      scoreDistribution[score] = 0;
    }
  
    scores.forEach(score => {
      const specificScore = score.toFixed(2);
      if (scoreDistribution.hasOwnProperty(specificScore)) {
        scoreDistribution[specificScore] = (scoreDistribution[specificScore] || 0) + 1;
      }
    });
  
    return scoreDistribution;
  };
  
  //========================================================================================================================================
  const generateGroupScoreDistribution = (groupCode: string) => {

    useEffect(() => {
      fetch('/diem_thi_khoi_thpt_2024.csv')
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

    const subjects = examGroupMap[groupCode];
    if (!subjects) {
      console.error(`Subjects not found for group ${groupCode}`);
      return {};
    }
  
    const scoreDistribution: { [key: string]: number } = {};
    const step = 0.1;
    const maxScore = 30;
  
    // Initialize score distribution with all possible scores from 0 to 30 with step 0.1
    for (let i = 0; i <= maxScore; i += step) {
      const scoreKey = i.toFixed(2);
      scoreDistribution[scoreKey] = 0;
    }
  
    // Calculate total scores for each student and populate score distribution
    data.forEach(d => {
      // Check if the student has scores for all subjects in the group
      if (subjects.every(subject => d.hasOwnProperty(subject) && d[subject] !== '' && !isNaN(parseFloat(d[subject])))) {
        const totalScore = subjects.reduce((acc, subject) => {
          const score = parseFloat(d[subject]);
          return isNaN(score) ? acc : acc + score;
        }, 0);
  
        const roundedTotalScore = Math.round(totalScore * 10) / 10; // Round total score to nearest 0.1
        const scoreKey = roundedTotalScore.toFixed(2);
  
        if (scoreDistribution.hasOwnProperty(scoreKey)) {
          scoreDistribution[scoreKey]++;
        }
      } else {
        console.warn(`Student with ID ${d.sbd} does not have valid scores for all subjects in group ${groupCode}`);
      }
    });
  
    // Log score distribution to console
    console.log(`Score distribution for group ${groupCode}:`, scoreDistribution);

    return scoreDistribution;
  };
  
//======================================================================================================================================== 
  
  const handleStatistics = () => {
    if (!studentScore) return;
  
    if (showSubjectDistribution) {
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

      // Tính toán thống kê cho phân phối theo môn học cụ thể
      // Convert scoreDistribution keys to numbers and sort in descending order
      // Convert scoreDistribution to an array of [score, count] pairs and sort by score in descending order
    const sortedScoreEntries = Object.entries(scoreDistribution)
    .map(([score, count]) => [parseFloat(score), count])
    .sort((a, b) => b[0] - a[0]);

    let higherCount = 0;

    // Iterate through sorted scores to find the count of students with higher scores
    for (let i = 0; i < sortedScoreEntries.length; i++) {
      const [score, count] = sortedScoreEntries[i];

      if (score > studentScoreValue) {
        higherCount += count;
      } else {
        break; // Stop once we reach the student's score or lower
      }
    }

    // Calculate lowerCount and percentage
    const totalCount = sortedScoreEntries.reduce((acc, [score, count]) => acc + count, 0);
    const lowerCount = totalCount - higherCount - (scoreDistribution[studentScoreValue] || 0);
    const percent = (higherCount / totalCount) * 100;
    
    // Province ranking calculation
    const studentProvince = studentScore.sbd.slice(0, 2);
    const provinceScores = data
      .filter(d => d.sbd.slice(0, 2) === studentProvince)
      .map(d => parseFloat(d[selectedSubject] || '0'))
      .filter(score => !isNaN(score))
      .sort((a, b) => b - a);

    const provinceScoreDistribution = provinceScores.reduce((acc, score) => {
      const scoreKey = score.toFixed(2);
      acc[scoreKey] = (acc[scoreKey] || 0) + 1;
      return acc;
    }, {});

    const sortedProvinceScoreEntries = Object.entries(provinceScoreDistribution)
      .map(([score, count]) => [parseFloat(score), count])
      .sort((a, b) => b[0] - a[0]);

    let provinceHigherCount = 0;

    // Iterate through sorted province scores to find the count of students with higher scores
    for (let i = 0; i < sortedProvinceScoreEntries.length; i++) {
      const [score, count] = sortedProvinceScoreEntries[i];

      if (score > studentScoreValue) {
        provinceHigherCount += count;
      } else {
        break; // Stop once we reach the student's score or lower
      }
    }

    const provinceTotalCount = sortedProvinceScoreEntries.reduce((acc, [score, count]) => acc + count, 0);
    const provinceLowerCount = sortedProvinceScoreEntries
      .filter(([score]) => score < studentScoreValue)
      .reduce((acc, [score, count]) => acc + count, 0);

    
    setHigherThan(higherCount);
    setNationalRanking(higherCount); // Not using national rank
    setProvinceRanking(provinceHigherCount);
    // setProvinceRanking(null);
    setHigherThan(higherCount);
    setLowerThan(lowerCount);
    setPercentage(percent);
    } else {
      
      const scoreDistribution = generateGroupScoreDistribution(selectedExamGroup);
      const studentTotalScore = Object.keys(studentScore)
        .filter(key => key !== 'sbd' && key !== 'ma_ngoai_ngu')
        .reduce((acc, key) => acc + parseFloat(studentScore[key] || '0'), 0);
  
      const studentTotalScoreRounded = Math.round(studentTotalScore * 10) / 10;
      const studentTotalScoreKey = studentTotalScoreRounded.toFixed(2);
      const studentCount = scoreDistribution[studentTotalScoreKey] || 0;
  
      const sortedScores = Object.keys(scoreDistribution).map(parseFloat).sort((a, b) => b - a);
      const studentRank = sortedScores.findIndex(score => score === studentTotalScoreRounded) + 1;
  
      const totalCount = sortedScores.reduce((acc, key) => acc + scoreDistribution[key], 0);
      const higherCount = sortedScores.filter(score => score > studentTotalScoreRounded)
        .reduce((acc, key) => acc + scoreDistribution[key], 0);
  
      const lowerCount = sortedScores.filter(score => score < studentTotalScoreRounded)
        .reduce((acc, key) => acc + scoreDistribution[key], 0);
  
      const percent = ((totalCount - higherCount) / totalCount) * 100;
  
      setNationalRanking(studentRank);
      setProvinceRanking(null); // Assuming not tracked at group level
      setHigherThan(higherCount);
      setLowerThan(lowerCount);
      setPercentage(percent);
  
      const backgroundColors = Object.keys(scoreDistribution).map(key => {
        const score = parseFloat(key);
        return score === studentTotalScore ? 'rgba(255, 99, 132, 0.6)' : 'rgba(75, 192, 192, 0.2)';
      });
  
      const borderColors = Object.keys(scoreDistribution).map(key => {
        const score = parseFloat(key);
        return score === studentTotalScore ? 'rgba(255, 99, 132, 1)' : 'rgba(75, 192, 192, 1)';
      });
  
      const chartData = {
        labels: Object.keys(scoreDistribution),
        datasets: [
          {
            label: 'Phổ điểm khối',
            data: Object.values(scoreDistribution),
            backgroundColor: backgroundColors,
            borderColor: borderColors,
            borderWidth: 1,
          }
        ],
      };
  
      setChartTitle(examGroups.find(group => group.code === selectedExamGroup)?.name || '');
      setChartData(chartData);
    }
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
              value={showSubjectDistribution ? selectedSubject : selectedExamGroup}
              onChange={(e) => {
                if (showSubjectDistribution) {
                  setSelectedSubject(e.target.value);
                } else {
                  setSelectedExamGroup(e.target.value);
                }
              }}
              className="form-select"
            >
              {showSubjectDistribution
                ? Object.keys(subjectMap).map(key => (
                    <option key={key} value={key}>
                      {subjectMap[key]}
                    </option>
                  ))
                : examGroups.map(group => (
                    <option key={group.code} value={group.code}>
                      {group.name}
                    </option>
                  ))}
            </select>
          </div>
          <div className="mb-3">
            <button
              className={`btn ${showSubjectDistribution ? 'btn-primary' : 'btn-outline-primary'} me-2`}
              onClick={() => {
                setShowSubjectDistribution(true);
                handleStatistics();
              }}
            >
              Phổ điểm môn
            </button>
            <button
              className={`btn ${!showSubjectDistribution ? 'btn-primary' : 'btn-outline-primary'} me-2`}
              onClick={() => {
                setShowSubjectDistribution(false);
                handleStatistics();
              }}
            >
              Phổ điểm khối
            </button>
          </div>
          {chartData && (
            <div className="container mt-5 text-center">
              <h3 className="text-center mb-4">Phổ điểm {chartTitle}</h3>
              <Bar data={chartData} options={chartOptions} />
              <h3 className="text-lg font-bold mt-4">Thống kê chi tiết</h3>
                {showSubjectDistribution ? (
                  <div class="table-responsive text-lg text-center" >
                  <table class="table table-bordered table-striped">
                    <tr>
                      <td className="px-6 py-3 whitespace-nowrap text-sm font-medium text-gray-900">Xếp hạng quốc gia:</td>
                      <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-500">{nationalRanking+1}</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-3 whitespace-nowrap text-sm font-medium text-gray-900">Xếp hạng tỉnh/thành:</td>
                      <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-500">{provinceRanking+1 ? `${provinceRanking+1} (${provinceMap[studentScore?.sbd.slice(0, 2)]})` : '-'}</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-3 whitespace-nowrap text-sm font-medium text-gray-900">Số thí sinh cao điểm hơn:</td>
                      <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-500">{higherThan}</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-3 whitespace-nowrap text-sm font-medium text-gray-900">Số thí sinh thấp điểm hơn:</td>
                      <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-500">{lowerThan ? `${lowerThan} (Chiếm ${(100-percentage).toFixed(2)}%)` : '-'}</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-3 whitespace-nowrap text-sm font-medium text-gray-900">Điểm thuộc nhóm:</td>
                      <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-500">{percentage ? `${percentage.toFixed(2)}%` : '-'}</td>
                    </tr>
                  </table>
                  </div>
                ) : (
                  <div class="table-responsive" >
                  <table class="table table-bordered table-striped">
                    <tr>
                      <td className="px-6 py-3 whitespace-nowrap text-sm font-medium text-gray-900">Xếp hạng quốc gia:</td>
                      <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-500">{nationalRanking}</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-3 whitespace-nowrap text-sm font-medium text-gray-900">Số thí sinh cao hơn:</td>
                      <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-500">{higherThan}</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-3 whitespace-nowrap text-sm font-medium text-gray-900">Số thí sinh thấp hơn:</td>
                      <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-500">{lowerThan}</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-3 whitespace-nowrap text-sm font-medium text-gray-900">Điểm thuộc nhóm:</td>
                      <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-500">{percentage ? `${percentage.toFixed(2)}%` : '-'}</td>
                    </tr>
                    </table>
                  </div>
                )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ScoreChecker;
