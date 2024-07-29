import React, { useState, useEffect } from "react";
import Papa from "papaparse";
import { Bar } from "react-chartjs-2";
import {
  Chart,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import annotationPlugin from "chartjs-plugin-annotation";

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
  "01": "THÀNH PHỐ HÀ NỘI",
  "02": "THÀNH PHỐ HỒ CHÍ MINH",
  "03": "THÀNH PHỐ HẢI PHÒNG",
  "04": "THÀNH PHỐ ĐÀ NẴNG",
  "05": "TỈNH HÀ GIANG",
  "06": "TỈNH CAO BẰNG",
  "07": "TỈNH LAI CHÂU",
  "08": "TỈNH LÀO CAI",
  "09": "TỈNH TUYÊN QUANG",
  "10": "TỈNH LẠNG SƠN",
  "11": "TỈNH BẮC KẠN",
  "12": "TỈNH THÁI NGUYÊN",
  "13": "TỈNH YÊN BÁI",
  "14": "TỈNH SƠN LA",
  "15": "TỈNH PHÚ THỌ",
  "16": "TỈNH VĨNH PHÚC",
  "17": "TỈNH QUẢNG NINH",
  "18": "TỈNH BẮC GIANG",
  "19": "TỈNH BẮC NINH",
  "21": "TỈNH HẢI DƯƠNG",
  "22": "TỈNH HƯNG YÊN",
  "23": "TỈNH HÒA BÌNH",
  "24": "TỈNH HÀ NAM",
  "25": "TỈNH NAM ĐỊNH",
  "26": "TỈNH THÁI BÌNH",
  "27": "TỈNH NINH BÌNH",
  "28": "TỈNH THANH HÓA",
  "29": "TỈNH NGHỆ AN",
  "30": "TỈNH HÀ TĨNH",
  "31": "TỈNH QUẢNG BÌNH",
  "32": "TỈNH QUẢNG TRỊ",
  "33": "TỈNH THỪA THIÊN - HUẾ",
  "34": "TỈNH QUẢNG NAM",
  "35": "TỈNH QUẢNG NGÃI",
  "36": "TỈNH KON TUM",
  "37": "TỈNH BÌNH ĐỊNH",
  "38": "TỈNH GIA LAI",
  "39": "TỈNH PHÚ YÊN",
  "40": "TỈNH ĐẮK LẮK",
  "41": "TỈNH KHÁNH HÒA",
  "42": "TỈNH LÂM ĐỒNG",
  "43": "TỈNH BÌNH PHƯỚC",
  "44": "TỈNH BÌNH DƯƠNG",
  "45": "TỈNH NINH THUẬN",
  "46": "TỈNH TÂY NINH",
  "47": "TỈNH BÌNH THUẬN",
  "48": "TỈNH ĐỒNG NAI",
  "49": "TỈNH LONG AN",
  "50": "TỈNH ĐỒNG THÁP",
  "51": "TỈNH AN GIANG",
  "52": "TỈNH BÀ RỊA – VŨNG TÀU",
  "53": "TỈNH TIỀN GIANG",
  "54": "TỈNH KIÊN GIANG",
  "55": "THÀNH PHỐ CẦN THƠ",
  "56": "TỈNH BẾN TRE",
  "57": "TỈNH VĨNH LONG",
  "58": "TỈNH TRÀ VINH",
  "59": "TỈNH SÓC TRĂNG",
  "60": "TỈNH BẠC LIÊU",
  "61": "TỈNH CÀ MAU",
  "62": "TỈNH ĐIỆN BIÊN",
  "63": "TỈNH ĐĂK NÔNG",
  "64": "TỈNH HẬU GIANG",
};

const subjectMap: { [key: string]: string } = {
  toan: "toán",
  ngu_van: "ngữ văn",
  ngoai_ngu: "ngoại ngữ",
  vat_li: "vật lí",
  hoa_hoc: "hóa học",
  sinh_hoc: "sinh học",
  lich_su: "lịch sử",
  dia_li: "địa lí",
  gdcd: "GDCD",
};

const examGroups = [
  { code: "khoi_A_A00", name: "Khối A00 - Toán, Vật lý, Hóa học" },
  { code: "khoi_A_A01", name: "Khối A01 - Toán, Vật lý, Tiếng Anh" },
  { code: "khoi_A_A05", name: "Khối A05 - Toán, Hoá, học, Lịch sử" },
  { code: "khoi_A_A06", name: "Khối A06 - Toán, Hoá, học, Địa lí" },
  { code: "khoi_A_A08", name: "Khối A08 - Toán, Lịch sử, GDCN" },
  { code: "khoi_A_A10", name: "Khối A10 - Toán, Vật lý, GDCN" },
  { code: "khoi_A_A11", name: "Khối A11 - Toán, Hóa học, GDCN" },
  { code: "khoi_B_B01", name: "Khối B01 - Toán, Sinh học, Lịch sử" },
  { code: "khoi_B_B02", name: "Khối B02 - Toán, Sinh học, Địa lí" },
  { code: "khoi_B_B04", name: "Khối B04 - Toán, Sinh học, GDCN" },
  { code: "khoi_B_B08", name: "Khối B08 - Toán, Sinh học, Tiếng Anh" },
  { code: "khoi_C_C01", name: "Khối C01 - Văn, Toán, Vật lí" },
  { code: "khoi_C_C02", name: "Khối C02 - Văn, Toán, Hóa học" },
  { code: "khoi_C_C03", name: "Khối C03 - Văn, Toán, Lịch sử" },
  { code: "khoi_C_C04", name: "Khối C04 - Văn, Toán, Địa lí" },
  { code: "khoi_C_C05", name: "Khối C05 - Văn, Vật lí, Hóa học" },
  { code: "khoi_C_C06", name: "Khối C06 - Văn, Vật lí, Sinh học" },
  { code: "khoi_C_C08", name: "Khối C08 - Văn, Hóa học, Sinh học" },
  { code: "khoi_C_C09", name: "Khối C09 - Văn, Vật lí, Địa lí" },
  { code: "khoi_C_C10", name: "Khối C10 - Văn, Hóa học, Lịch sử" },
  { code: "khoi_C_C12", name: "Khối C12 - Văn, Sinh học, Lịch sử" },
  { code: "khoi_C_C14", name: "Khối C14 - Văn, Toán, GDCN" },
  { code: "khoi_C_C16", name: "Khối C16 - Văn, Vật lí, GDCN" },
  { code: "khoi_C_C18", name: "Khối C18 - Văn, Sinh học, GDCN" },
  { code: "khoi_C_C19", name: "Khối C19 - Văn, Lịch sử, GDCN" },
  { code: "khoi_C_C20", name: "Khối C20 - Văn, Địa lí, GDCN" },
  { code: "khoi_D_D01", name: "Khối D01 - Toán, Văn , Tiếng Anh" },
  { code: "khoi_D_D11", name: "Khối D11 - Văn, Vật lí, Tiếng Anh" },
  { code: "khoi_D_D12", name: "Khối D12 - Văn, Hóa học, Tiếng Anh" },
  { code: "khoi_D_D13", name: "Khối D13 - Văn, Sinh học, Tiếng Anh" },
  { code: "khoi_D_D14", name: "Khối D14 - Văn, Lịch sử, Tiếng Anh" },
  { code: "khoi_D_D15", name: "Khối D15 - Văn, Địa lí, Tiếng Anh" },
];

const examGroupMap: { [key: string]: string } = {
  khoi_A_A00: "toan - vat_li - hoa_hoc",
  khoi_A_A01: "toan - vat_li - ngoai_ngu",
  khoi_A_A02: "toan - vat_li - sinh_hoc",
  khoi_D_D01: "toan - van_hoc - ngoai_ngu",
  // Map other exam groups to their corresponding subjects
};

const ScoreChecker: React.FC = () => {
  const [studentId, setStudentId] = useState("");
  const [studentScore, setStudentScore] = useState<StudentScore | null>(null);
  const [data, setData] = useState<StudentScore[]>([]);
  const [groupData, setGroupData] = useState<StudentScore[]>([]);
  const [chartData, setChartData] = useState<any>(null);
  const [chartTitle, setChartTitle] = useState<string>("");
  const [selectedSubject, setSelectedSubject] = useState<string>("toan");
  const [selectedExamGroup, setSelectedExamGroup] = useState<string>(
    examGroups[0].code
  ); // Default to the first exam group
  const [showSubjectDistribution, setShowSubjectDistribution] =
    useState<boolean>(true); // Track subject-specific or group-specific distribution
  const [nationalRanking, setNationalRanking] = useState<number | null>(null);
  const [yourcores, setyourcores] = useState<number | null>(null);
  const [yourgroupcores, setyourgroupcores] = useState<number | null>(null);
  const [provinceRanking, setProvinceRanking] = useState<number | null>(null);
  const [higherThan, setHigherThan] = useState<number | null>(null);
  const [lowerThan, setLowerThan] = useState<number | null>(null);
  const [percentage, setPercentage] = useState<number | null>(null);

  useEffect(() => {
    fetch("/diem_thi_thpt_2024.csv")
      .then((response) => response.text())
      .then((text) => {
        const result = Papa.parse<StudentScore>(text, { header: true }).data;
        setData(result);
      });
  }, []);

  useEffect(() => {
    fetch("/diem_thi_khoi_thpt_2024.csv")
      .then((response) => response.text())
      .then((text) => {
        const result = Papa.parse<StudentScore>(text, { header: true }).data;
        setGroupData(result);
      });
  }, []);

  useEffect(() => {
    handleStatistics();
  }, [showSubjectDistribution, selectedSubject, selectedExamGroup]);

  const handleSearch = () => {
    let sbd = studentId;
    if (sbd.length === 7) {
      sbd = "0" + sbd;
    }
    const student = data.find((d) => d.sbd === sbd);
    setStudentScore(student || null);
  };

  const generateScoreDistribution = (subject: string) => {
    const scores = data
      .map((d) => parseFloat(d[subject]))
      .filter(
        (score) => !isNaN(score) && score !== null && score !== undefined
      );

    const stepMap: { [key: string]: number } = {
      toan: 0.2,
      ngu_van: 0.25,
      ngoai_ngu: 0.2,
    };

    const step = stepMap[subject] || 0.25;
    const maxScore = 10;

    const scoreDistribution: { [key: string]: number } = {};

    for (let i = 0; i <= maxScore; i += step) {
      const score = i.toFixed(2);
      scoreDistribution[score] = 0;
    }

    scores.forEach((score) => {
      const specificScore = score.toFixed(2);
      if (scoreDistribution.hasOwnProperty(specificScore)) {
        scoreDistribution[specificScore] =
          (scoreDistribution[specificScore] || 0) + 1;
      }
    });

    return scoreDistribution;
  };

  //========================================================================================================================================

  const generateGroupScoreDistribution = (groupCode: string) => {
    const scores = groupData
      .map((d) => parseFloat(d[groupCode]))
      .filter(
        (score) => !isNaN(score) && score !== null && score !== undefined
      );

    const step = 0.5;
    const maxScore = 30;

    // Khởi tạo đối tượng để lưu trữ phân bố điểm
    const scoreDistribution: { [key: string]: number } = {};

    // Tạo các bước điểm từ 0 đến 30 với bước 0.5
    for (let i = 0; i <= maxScore; i += step) {
      const score = i.toFixed(1);
      scoreDistribution[score] = 0;
    }

    // Đếm số lượng thí sinh trong từng khoảng điểm
    scores.forEach((score) => {
      const roundedScore = (Math.floor(score / step) * step).toFixed(1);
      if (scoreDistribution.hasOwnProperty(roundedScore)) {
        scoreDistribution[roundedScore] += 1;
      }
    });

    return scoreDistribution;
  };

  //========================================================================================================================================

  const handleStatistics = () => {
    if (!studentScore) return;

    if (showSubjectDistribution) {
      const scoreDistribution = generateScoreDistribution(selectedSubject);
      const studentScoreValue = parseFloat(
        studentScore[selectedSubject] || "0"
      );

      const backgroundColors = Object.keys(scoreDistribution).map((key) => {
        return parseFloat(key) === studentScoreValue
          ? "rgba(255, 99, 132, 0.6)"
          : "rgba(75, 192, 192, 0.2)";
      });

      const borderColors = Object.keys(scoreDistribution).map((key) => {
        return parseFloat(key) === studentScoreValue
          ? "rgba(255, 99, 132, 1)"
          : "rgba(75, 192, 192, 1)";
      });

      const chartData = {
        labels: Object.keys(scoreDistribution),
        datasets: [
          {
            label: "Phổ điểm",
            data: Object.values(scoreDistribution),
            backgroundColor: backgroundColors,
            borderColor: borderColors,
            borderWidth: 1,
          },
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
      const totalCount = sortedScoreEntries.reduce(
        (acc, [score, count]) => acc + count,
        0
      );
      const lowerCount =
        totalCount - higherCount - (scoreDistribution[studentScoreValue] || 0);
      const percent = (higherCount / totalCount) * 100;

      // Province ranking calculation
      const studentProvince = studentScore.sbd.slice(0, 2);
      const provinceScores = data
        .filter((d) => d.sbd.slice(0, 2) === studentProvince)
        .map((d) => parseFloat(d[selectedSubject] || "0"))
        .filter((score) => !isNaN(score))
        .sort((a, b) => b - a);

      const provinceScoreDistribution = provinceScores.reduce((acc, score) => {
        const scoreKey = score.toFixed(2);
        acc[scoreKey] = (acc[scoreKey] || 0) + 1;
        return acc;
      }, {});

      const sortedProvinceScoreEntries = Object.entries(
        provinceScoreDistribution
      )
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

      const provinceTotalCount = sortedProvinceScoreEntries.reduce(
        (acc, [score, count]) => acc + count,
        0
      );
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
      //========================================================================================================================================
      const scoreDistribution =
        generateGroupScoreDistribution(selectedExamGroup);
      // Tìm hàng thí sinh dựa trên ID
      const studentRow = groupData.find((row) => row.sbd === studentId);
      const studentTotalScoreRounded = 0;
      if (studentRow) {
        // Lấy điểm khối của thí sinh dựa trên khối điểm được chọn
        const studentTotalScoreRounded  = studentRow[selectedExamGroup] || "0";
        // Tìm điểm gần nhất với khoảng cách 0.5 
      const closestScore = Math.round(studentTotalScoreRounded * 2) / 2; 
      const studentCount = scoreDistribution[closestScore.toFixed(1)] || 0;
      const sortedScores = Object.keys(scoreDistribution)
        .map(parseFloat)
        .sort((a, b) => b - a);
      const studentRank =
        sortedScores.findIndex((score) => score === closestScore) + 1;

      const totalCount = sortedScores.reduce(
        (acc, key) => acc + scoreDistribution[key.toFixed(1)],
        0
      );
      const higherCount = sortedScores
        .filter((score) => score > closestScore)
        .reduce((acc, key) => acc + scoreDistribution[key.toFixed(1)], 0);

      const lowerCount = sortedScores
        .filter((score) => score < closestScore)
        .reduce((acc, key) => acc + scoreDistribution[key.toFixed(1)], 0);

      const percent = ((totalCount - higherCount) / totalCount) * 100;
      const yourgroupcores = studentTotalScoreRounded;
      setyourgroupcores(yourgroupcores);
      setNationalRanking(studentRank);
      setProvinceRanking(null); // Assuming not tracked at group level
      setHigherThan(higherCount);
      setLowerThan(lowerCount);
      setPercentage(percent);
      const backgroundColors = Object.keys(scoreDistribution).map((key) => {
        const score = parseFloat(key);
        return score === closestScore
          ? "rgba(255, 99, 132, 0.6)"
          : "rgba(75, 192, 192, 0.2)";
      });

      const borderColors = Object.keys(scoreDistribution).map((key) => {
        const score = parseFloat(key);
        return score === closestScore
          ? "rgba(255, 99, 132, 1)"
          : "rgba(75, 192, 192, 1)";
      });

      const chartData = {
        labels: Object.keys(scoreDistribution),
        datasets: [
          {
            label: "Phổ điểm khối",
            data: Object.values(scoreDistribution),
            backgroundColor: backgroundColors,
            borderColor: borderColors,
            borderWidth: 1,
          },
        ],
      };

      setChartTitle(
        examGroups.find((group) => group.code === selectedExamGroup)?.name || ""
      );
      setChartData(chartData);
      
        console.log(
          `Điểm của thí sinh ${studentId} cho khối ${selectedExamGroup}: ${studentTotalScoreRounded }`
        );
      } else {
        console.log(`Không tìm thấy thí sinh với ID ${studentId}`);
        console.log(groupData);

      }

      // // Tìm điểm gần nhất với khoảng cách 0.5 
      // const closestScore = Math.round(studentTotalScoreRounded * 2) / 2; 
      // const studentCount = scoreDistribution[closestScore.toFixed(1)] || 0;
      // const sortedScores = Object.keys(scoreDistribution)
      //   .map(parseFloat)
      //   .sort((a, b) => b - a);
      // const studentRank =
      //   sortedScores.findIndex((score) => score === closestScore) + 1;

      // const totalCount = sortedScores.reduce(
      //   (acc, key) => acc + scoreDistribution[key.toFixed(1)],
      //   0
      // );
      // const higherCount = sortedScores
      //   .filter((score) => score > closestScore)
      //   .reduce((acc, key) => acc + scoreDistribution[key.toFixed(1)], 0);

      // const lowerCount = sortedScores
      //   .filter((score) => score < closestScore)
      //   .reduce((acc, key) => acc + scoreDistribution[key.toFixed(1)], 0);

      // const percent = ((totalCount - higherCount) / totalCount) * 100;

      // setNationalRanking(studentRank);
      // setProvinceRanking(null); // Assuming not tracked at group level
      // setHigherThan(higherCount);
      // setLowerThan(lowerCount);
      // setPercentage(percent);

      
    }
    //========================================================================================================================================
  };

  const getProvinceName = (sbd: string) => {
    const provinceCode = sbd.slice(0, 2);
    return provinceMap[provinceCode] || "Không xác định";
  };

  const chartOptions = {
    scales: {
      x: {
        type: "category",
        ticks: {
          min: 0,
          max: 10,
          stepSize: 0.25,
        },
      },
    },
    plugins: {
      annotation: {
        annotations: studentScore
          ? [
              {
                type: "box",
                xMin: studentScore
                  ? parseFloat(studentScore[selectedSubject] || "0").toFixed(2)
                  : "0",
                xMax: studentScore
                  ? parseFloat(studentScore[selectedSubject] || "0").toFixed(2)
                  : "0",
                backgroundColor: "rgba(255, 99, 132, 0.25)",
                borderColor: "rgba(255, 99, 132, 1)",
                borderWidth: 2,
                label: {
                  enabled: true,
                  content: "Điểm của bạn",
                  position: "center",
                  color: "rgba(255, 99, 132, 1)",
                  backgroundColor: "rgba(255, 255, 255, 0.8)",
                  font: {
                    style: "bold",
                  },
                },
              },
            ]
          : [],
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
              {Object.keys(subjectMap).map((key) => (
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
              value={
                showSubjectDistribution ? selectedSubject : selectedExamGroup
              }
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
                ? Object.keys(subjectMap).map((key) => (
                    <option key={key} value={key}>
                      {subjectMap[key]}
                    </option>
                  ))
                : examGroups.map((group) => (
                    <option key={group.code} value={group.code}>
                      {group.name}
                    </option>
                  ))}
            </select>
          </div>
          <div className="mb-3">
            <button
              className={`btn ${
                showSubjectDistribution ? "btn-primary" : "btn-outline-primary"
              } me-2`}
              onClick={() => {
                setShowSubjectDistribution(true);
                handleStatistics();
              }}
            >
              Phổ điểm môn
            </button>
            <button
              className={`btn ${
                !showSubjectDistribution ? "btn-primary" : "btn-outline-primary"
              } me-2`}
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
                <div class="table-responsive text-lg text-center">
                  <table class="table table-bordered table-striped">
                    <tr>
                      <td className="px-6 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                        Điểm của bạn:
                      </td>
                      <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-500">
                        null
                      </td>
                    </tr>
                    <tr>
                      <td className="px-6 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                        Xếp hạng quốc gia:
                      </td>
                      <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-500">
                        {nationalRanking + 1}
                      </td>
                    </tr>
                    <tr>
                      <td className="px-6 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                        Xếp hạng tỉnh/thành:
                      </td>
                      <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-500">
                        {provinceRanking + 1
                          ? `${provinceRanking + 1} (${
                              provinceMap[studentScore?.sbd.slice(0, 2)]
                            })`
                          : "-"}
                      </td>
                    </tr>
                    <tr>
                      <td className="px-6 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                        Số thí sinh cao điểm hơn:
                      </td>
                      <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-500">
                        {higherThan}
                      </td>
                    </tr>
                    <tr>
                      <td className="px-6 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                        Số thí sinh thấp điểm hơn:
                      </td>
                      <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-500">
                        {lowerThan
                          ? `${lowerThan} (Chiếm ${(100 - percentage).toFixed(
                              2
                            )}%)`
                          : "-"}
                      </td>
                    </tr>
                    <tr>
                      <td className="px-6 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                        Điểm thuộc nhóm:
                      </td>
                      <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-500">
                        {percentage ? `${percentage.toFixed(2)}%` : "-"}
                      </td>
                    </tr>
                  </table>
                </div>
              ) : (
                <div class="table-responsive">
                  <table class="table table-bordered table-striped">
                  <tr>
                      <td className="px-6 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                        Điểm tổ hợp của bạn:
                      </td>
                      <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-500">
                        {yourgroupcores}
                      </td>
                    </tr>
                    <tr>
                      <td className="px-6 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                        Xếp hạng quốc gia:
                      </td>
                      <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-500">
                        {nationalRanking}
                      </td>
                    </tr>
                    <tr>
                      <td className="px-6 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                        Số thí sinh cao hơn:
                      </td>
                      <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-500">
                        {higherThan}
                      </td>
                    </tr>
                    <tr>
                      <td className="px-6 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                        Số thí sinh thấp hơn:
                      </td>
                      <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-500">
                        {lowerThan}
                      </td>
                    </tr>
                    <tr>
                      <td className="px-6 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                        Điểm thuộc nhóm:
                      </td>
                      <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-500">
                        {percentage ? `${percentage.toFixed(2)}%` : "-"}
                      </td>
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
