import React, { useEffect, useState } from 'react';
import { View, Text } from 'react-native';
import { BarChart } from 'react-native-chart-kit';
import baseURL from '../../assets/common/baseUrl';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const ChartComponent = () => {
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    // Call your API or fetch data here
    fetchData();
  }, []);

  const getAuthToken = async () => {
    return AsyncStorage.getItem('token');
  };

  const fetchData = async () => {
    try {
      // Replace the URL with the actual API endpoint
      const token = await getAuthToken();
      const response = await axios.get(`${baseURL}/residentChart`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = response.data;

      console.log('API Response:', response);
      setChartData(data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  return (
    <View>
      {chartData.length > 0 ? (
        <BarChart
          data={{
            labels: labels,
            datasets: [
              {
                data: chartData,
              },
            ],
          }}
          width={300}
          height={220}
          yAxisLabel=""
          chartConfig={{
            backgroundGradientFrom: '#fff',
            backgroundGradientTo: '#fff',
            decimalPlaces: 0,
            color: (opacity = 1) => `rgba(0, 0, 255, ${opacity})`,
            labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
            style: {
              borderRadius: 16,
            },
            barPercentage: 0.7, // Adjust the width of the bars
            categoryPercentage: 0.8, // Adjust the spacing between bars
          }}
          style={{
            marginVertical: 8,
            borderRadius: 16,
          }}
        />
      ) : (
        <Text>Loading...</Text>
      )}
    </View>
  );
};

export default ChartComponent;
