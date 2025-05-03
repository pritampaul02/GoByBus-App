import { StyleSheet, Text, View } from 'react-native';
import React, { useEffect } from 'react';
import axiosInstance from '@/api/axios';
import { useAuthStore } from '@/store/useAuthStore';

const AllBus = () => {
  const { token } = useAuthStore();
  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await axiosInstance.get('bus/my-buses', {
          headers: {
            token,
            'Content-Type': 'Application/json',
          },
        });
        console.log('Bus data:', data);
      } catch (error) {
        console.error('Error fetching bus data:', error);
      }
    };

    fetchData();
  }, []); // Empty dependency array to run once on component mount

  return (
    <View>
      <Text>MyBus</Text>
      <Text>MyBus</Text>
    </View>
  );
};

export default AllBus;

const styles = StyleSheet.create({});
