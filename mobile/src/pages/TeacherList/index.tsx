import React, { useState, useEffect } from 'react';
import { View, Text, TextInput } from 'react-native';
import {
  ScrollView,
  BorderlessButton,
  RectButton,
} from 'react-native-gesture-handler';
import { Feather } from '@expo/vector-icons';
import api from '../../services/api';
import AsyncStorage from '@react-native-community/async-storage';

import PageHeader from '../../components/PageHeader';
import TeacherItem, { Teacher } from '../../components/TeacherItem';

import styles from './styles';
import { useFocusEffect } from '@react-navigation/native';

const TeacherList: React.FC = () => {
  const [teachers, setTeachers] = useState([]);
  const [favorites, setFavorites] = useState<number[]>([]);
  const [isFiltersVisible, setIsFilterVisible] = useState(false);

  const [subject, setSubject] = useState('');
  const [week_day, setWeekDay] = useState('');
  const [time, setTime] = useState('');

  function loadFavorites() {
    AsyncStorage.getItem('favorites').then((response) => {
      if (response) {
        const favoredTeachers = JSON.parse(response);
        const favoredTeachersId = favoredTeachers.map((teacher: Teacher) => {
          return teacher.id;
        });

        setFavorites(favoredTeachersId);
      }
    });
  }

  useFocusEffect(() => {
    loadFavorites();
  });

  function handleToggleFilterVisible() {
    setIsFilterVisible(!isFiltersVisible);
  }

  async function handleFilterSubmit() {
    loadFavorites();

    const response = await api.get('classes', {
      params: {
        subject,
        week_day,
        time,
      },
    });

    setIsFilterVisible(false);

    setTeachers(response.data);
  }

  return (
    <View style={styles.container}>
      <PageHeader
        title='Proffys Disponíveis'
        headerRight={
          <BorderlessButton onPress={handleToggleFilterVisible}>
            <Feather name='filter' size={20} color='#fff' />
          </BorderlessButton>
        }
      >
        {isFiltersVisible && (
          <View style={styles.searchForm}>
            <Text style={styles.label}>Matéria</Text>
            <TextInput
              style={styles.input}
              value={subject}
              onChangeText={(text) => setSubject(text)}
              placeholder='Qual a matéria?'
              placeholderTextColor='#c1bccc'
            />

            <View style={styles.inputGroup}>
              <View style={styles.inputBlock}>
                <Text style={styles.label}>Dia da semana</Text>
                <TextInput
                  style={styles.input}
                  value={week_day}
                  onChangeText={(text) => setWeekDay(text)}
                  placeholder='Qual o dia?'
                  placeholderTextColor='#c1bccc'
                />
              </View>

              <View style={styles.inputBlock}>
                <Text style={styles.label}>Horário</Text>
                <TextInput
                  style={styles.input}
                  value={time}
                  onChangeText={(text) => setTime(text)}
                  placeholder='Qual Horário?'
                  placeholderTextColor='#c1bccc'
                />
              </View>
            </View>

            <RectButton
              onPress={handleFilterSubmit}
              style={styles.submitButton}
            >
              <Text style={styles.submitButtonText}>Filtrar</Text>
            </RectButton>
          </View>
        )}
      </PageHeader>

      <ScrollView
        style={styles.teacherList}
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 16 }}
      >
        {teachers.map((teacher: Teacher) => {
          return (
            <TeacherItem
              key={teacher.id}
              teacher={teacher}
              favored={favorites.includes(teacher.id)}
            />
          );
        })}
      </ScrollView>
    </View>
  );
};

export default TeacherList;
