import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import baseURL from '../../../assets/common/baseUrl';
import DropDownPicker from "react-native-dropdown-picker";
import { printToFileAsync } from 'expo-print';
import { shareAsync } from 'expo-sharing';
import { BarChart, PieChart } from 'react-native-chart-kit';

const ResidentChart = () => {
  const [barChartData, setBarChartData] = useState([]);
  const [pieChartData, setPieChartData] = useState([]);
  const [maxCount, setMaxCount] = useState(0);
  const [selectedBranch, setSelectedBranch] = useState('');
  const [users, setUsers] = useState([]);

  const [open, setOpen] = useState(false);
  const [items, setItems] = useState([
    { label: "Both", value: "" },
    { label: "Dormitory", value: "Dormitory" },
    { label: "Hostel", value: "Hostel" },
  ]);

  useEffect(() => {
    fetchDataForBarChart();
    fetchDataForPieChart();
    fetchUsers();
  }, [selectedBranch]);

  const fetchDataForBarChart = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      const response = await axios.get(`${baseURL}/residentChart`, {
        params: {
          branch: selectedBranch 
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = response.data;

      setBarChartData(data);

      const counts = data.map(item => item.count);
      const highestCount = Math.max(...counts);
      setMaxCount(highestCount);
    } catch (error) {
      console.error('Error fetching data for Bar Chart:', error);
    }
  };
  
  const fetchDataForPieChart = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      const response = await axios.get(`${baseURL}/residentTypeChart`, {
        params: {
          branch: selectedBranch 
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = response.data;

      setPieChartData(data);
    } catch (error) {
      console.error('Error fetching data for Pie Chart:', error);
    }
  };
  const fetchUsers = async () => {
    try {
      const token = await AsyncStorage.getItem('token');

      const response = await axios.get(
        `${baseURL}/getResidents?resident_type=&search_query=&branch=${selectedBranch}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(response.data.residents)
      setUsers(response.data.residents);
   
    } catch (error) {
      console.error('Error fetching users:', error.response);
      setLoading(false);
    }
  };
const generatePDF = async () => {
  try {
    let htmlContent = `
      <html>
        <head>
          <title>Resident Chart PDF</title>
        </head>
        <body>
          <h1>Resident Chart</h1>
          <table border="1">
            <thead>
              <tr class="text-dark">
                <th scope="col">TUPT Number</th>
                <th scope="col">Name</th>
                <th scope="col">Type</th>
                <th scope="col">Sex</th>
                <th scope="col">Contacts</th>
                <th scope="col">Room & Bed</th>
              </tr>
            </thead>
            <tbody>
    `;

    // Iterate over each user and add its data to the HTML content
    users.forEach(user => {
      htmlContent += `
        <tr>
          <td>${user.Tuptnum}</td>
          <td>${user.name}</td>
          <td>${user.type}</td>
          <td>${user.sex}</td>
          <td>${user.contacts}</td>
          <td>${user.roomdetails}</td>
        </tr>
      `;
    });

    htmlContent += `
          </tbody>
        </table>
        <h2>Bar Chart</h2>
        ${generateBarChartSVG()}
        <h2>Pie Chart</h2>
        ${generatePieChartSVG()}
      </body>
    </html>
    `;

    // Generate PDF file
    const pdfUri = await printToFileAsync({ html: htmlContent });

    // Share the PDF file
    if (Platform.OS === 'ios' || Platform.OS === 'android') {
      await shareAsync(pdfUri.uri);
    }

    console.log('PDF generated:', pdfUri);
  } catch (error) {
    console.error('Error generating PDF:', error);
  }
};

 
  const getMonthName = (monthNumber) => {
    const months = [
      "Jan", "Feb", "Mar", "Apr", "May", "Jun",
      "Jul", "Aug", "Sept", "Oct", "Nov", "Dec"
    ];
    return months[monthNumber - 1]; 
  };

  const predefinedColors = ['#FF5733', '#C70039', '#900C3F', '#2E4053', '#154360', '#2874A6', '#5499C7'];
  const generateBarChartSVG = () => {
    const barWidth = 30; // Width of each bar
    const barSpacing = 10; // Spacing between bars
    const chartHeight = 220; // Height of the chart
    const chartWidth = (barChartData.length * (barWidth + barSpacing)) - barSpacing; // Total width of the chart
  
    let bars = '';
  
    barChartData.forEach((item, index) => {
      const barHeight = (item.count / maxCount) * chartHeight;
      const x = index * (barWidth + barSpacing);
      const y = chartHeight - barHeight;
  
      bars += `<rect x="${x}" y="${y}" width="${barWidth}" height="${barHeight}" fill="skyblue" />`;
      bars += `<text x="${x + barWidth / 2}" y="${y + 20}" font-size="12" fill="#000" text-anchor="middle">${getMonthName(item.month)}-${item.year}</text>`;
    });
  
    const svgContent = `
      <svg width="${chartWidth}" height="${chartHeight}">
        ${bars}
        <text x="10" y="${chartHeight + 30}" font-size="12" fill="#000">This chart displays the number of residents over time.</text>
      </svg>
    `;
  
    return svgContent;
  };
  
  const generatePieChartSVG = () => {
    const chartHeight = 220; // Height of the chart
    const chartWidth = 300; // Width of the chart
    const radius = Math.min(chartWidth, chartHeight) / 2; // Radius of the pie chart
    const centerX = chartWidth / 2;
    const centerY = chartHeight / 2;
    const legendWidth = 100;
    const legendItemHeight = 20;
    const legendMargin = 5;
    const legendX = chartWidth + 10;
    const legendY = (chartHeight - pieChartData.length * legendItemHeight) / 2;
  
    let slices = '';
    let legendItems = '';
  
    let cumulativeAngle = -Math.PI / 2;
  
    pieChartData.forEach((item, index) => {
      const sliceAngle = (item.count / pieChartData.reduce((acc, val) => acc + val.count, 0)) * (Math.PI * 2);
      const endAngle = cumulativeAngle + sliceAngle;
  
      // Calculate slice coordinates
      const startX = centerX + radius * Math.cos(cumulativeAngle);
      const startY = centerY + radius * Math.sin(cumulativeAngle);
      const endX = centerX + radius * Math.cos(endAngle);
      const endY = centerY + radius * Math.sin(endAngle);
  
      // Generate SVG path for the slice
      const path = `M${centerX},${centerY} L${startX},${startY} A${radius},${radius} 0 ${sliceAngle > Math.PI ? 1 : 0},1 ${endX},${endY} Z`;
  
      slices += `<path d="${path}" fill="${predefinedColors[index % predefinedColors.length]}" />`;
  
      // Generate legend items
      legendItems += `
        <rect x="${legendX}" y="${legendY + index * legendItemHeight}" width="10" height="10" fill="${predefinedColors[index % predefinedColors.length]}" />
        <text x="${legendX + 20}" y="${legendY + index * legendItemHeight + 10}" font-size="12">${item.type}</text>
      `;
  
      cumulativeAngle = endAngle;
    });
    const svgContent = `
      <svg width="${chartWidth + legendWidth}" height="${chartHeight}">
        ${slices}
        <g>
          ${legendItems}
        </g>
        <text x="10" y="${chartHeight + 30}" font-size="12" fill="#000">This chart displays the number of residents based on their type.</text>
      </svg>
    `;
  
    return svgContent;
  };
  
    

  return (
    <View style={styles.container}>
      <View style={styles.pickerContainer}>
        <DropDownPicker
          open={open}
          value={selectedBranch}
          items={items}
          setOpen={setOpen}
          setValue={setSelectedBranch}
          setItems={setItems}
        />
      </View>
      {barChartData.length > 0 ? (
        <>
          <View>
            <BarChart
              data={{
                labels: barChartData.map(item => `${getMonthName(item.month)}-${item.year}`),
                datasets: [
                  {
                    data: barChartData.map(item => item.count),
                  },
                ],
              }}
              width={330}
              height={220}
              chartConfig={{
                backgroundGradientFrom: 'skyblue',
                backgroundGradientTo: 'lightblue',
                decimalPlaces: 0,
                color: (opacity = 1) => `rgba(0, 0, 255, ${opacity})`,
                labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                style: {
                  borderRadius: 16,
                },
                min: 0,
                max: maxCount + 10, 
                stepSize: 10,
              }}
              style={{
                marginVertical: 8,
                borderRadius: 16,
              }}
            />
            <Text style={styles.explanation}>This chart displays the number of residents over time.</Text>
          </View>
          <View>
            <PieChart
              data={pieChartData.map((item, index) => ({
                name: item.type,
                population: item.count,
                color: predefinedColors[index % predefinedColors.length], 
                legendFontColor: '#7F7F7F',
                legendFontSize: 15,
              }))}
              width={300}
              height={220}
              chartConfig={{
                backgroundGradientFrom: '#1E2923',
                backgroundGradientTo: '#08130D',
                color: (opacity = 1) => `rgba(26, 255, 146, ${opacity})`,
              }}
              accessor="population"
              backgroundColor="transparent"
              paddingLeft="15"
              absolute
            />
            <Text style={styles.explanation}>This chart displays the number of residents base on their type.</Text>
          </View>
          <TouchableOpacity onPress={generatePDF} style={styles.button}>
            <Text style={styles.buttonText}>Download PDF</Text>
          </TouchableOpacity>
        </>
      ) : (
        <Text>Loading...</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  pickerContainer: {
    marginHorizontal: 20,
    marginVertical: 10,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    zIndex: 1,
  },
  container: {
    flex: 1,
    alignItems: 'center',
    // justifyContent: 'center',
  },
  button: {
    marginTop: 20,
    backgroundColor: 'blue',
    padding: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
    fontWeight: 'bold',
  },
});

export default ResidentChart;
