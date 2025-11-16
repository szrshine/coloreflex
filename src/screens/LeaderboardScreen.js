import { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  TextInput,
  Modal,
  Alert,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import {
  getLeaderboard,
  getUserName,
  saveUserName,
  getUserRank,
  seedMockData,
} from '../services/leaderboard';

/**
 * Liderlik Tablosu Ekranı
 *
 * Özellikler:
 * - Global liderlik tablosu (en yüksek skorlar)
 * - Kullanıcı ismi girişi (ilk kez)
 * - Kullanıcının sıralaması highlight
 * - Top 100 gösterim
 * - Filtreler: Günlük, Haftalık, Aylık, Tüm Zamanlar
 *
 * TODO (Production için):
 * - Firebase Firestore entegrasyonu
 * - Gerçek zamanlı skor güncelleme
 * - Profil fotoğrafı desteği
 * - Arkadaş sıralaması
 */

export default function LeaderboardScreen({
  onNavigateMenu,
  onTriggerHaptic,
  userScore = 0,
  userName = '',
  onSaveUserName,
}) {
  const [filter, setFilter] = useState('all'); // 'daily', 'weekly', 'monthly', 'all'
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userRank, setUserRank] = useState(null);
  const [nameModalVisible, setNameModalVisible] = useState(false);
  const [tempName, setTempName] = useState('');

  // İlk yükleme - kullanıcı ismini kontrol et
  useEffect(() => {
    initializeLeaderboard();
  }, []);

  // Filtre değiştiğinde leaderboard'u yeniden yükle
  useEffect(() => {
    loadLeaderboard();
  }, [filter]);

  // Leaderboard başlat
  const initializeLeaderboard = async () => {
    // SADECE GELİŞTİRME İÇİN: Mock data oluştur
    // Production'da bu satırı kaldırın
    await seedMockData();

    await checkUserName();
    await loadLeaderboard();
  };

  // Kullanıcı ismini kontrol et
  const checkUserName = async () => {
    try {
      const savedName = await getUserName();
      if (!savedName || savedName === 'Anonim') {
        // İlk kez - isim iste
        setNameModalVisible(true);
      }
    } catch (error) {
      console.error('User name check error:', error);
    }
  };

  // İsim kaydet
  const handleSaveName = async () => {
    if (tempName.trim().length < 2) {
      Alert.alert('Hata', 'İsim en az 2 karakter olmalı');
      return;
    }

    if (tempName.trim().length > 20) {
      Alert.alert('Hata', 'İsim en fazla 20 karakter olabilir');
      return;
    }

    try {
      await saveUserName(tempName.trim());
      if (onSaveUserName) {
        onSaveUserName(tempName.trim());
      }
      setNameModalVisible(false);
      if (onTriggerHaptic) onTriggerHaptic('success');
    } catch (error) {
      console.error('Save name error:', error);
    }
  };

  // Leaderboard yükle
  const loadLeaderboard = async () => {
    setLoading(true);

    try {
      // Leaderboard'u servis fonksiyonu ile yükle
      const data = await getLeaderboard(filter, 100);

      // userName yerine name key'i kullan (UI ile uyumlu)
      const formattedData = data.map(entry => ({
        rank: entry.rank,
        name: entry.userName,
        score: entry.score,
        isCurrentUser: false,
      }));

      setLeaderboard(formattedData);

      // Kullanıcının sıralamasını bul
      if (userScore > 0) {
        const rank = await getUserRank(userScore, filter);
        setUserRank(rank);

        // Kullanıcıyı highlight et
        const savedName = await getUserName();
        const updatedData = formattedData.map(entry => ({
          ...entry,
          isCurrentUser: entry.name === savedName,
        }));
        setLeaderboard(updatedData);
      }
    } catch (error) {
      console.error('Leaderboard load error:', error);
    } finally {
      setLoading(false);
    }
  };

  // Filtre değiştir
  const changeFilter = (newFilter) => {
    setFilter(newFilter);
    if (onTriggerHaptic) onTriggerHaptic('light');
  };

  // Leaderboard item render
  const renderLeaderboardItem = ({ item, index }) => {
    const isTop3 = item.rank <= 3;
    const isCurrentUser = item.isCurrentUser;

    // Medal emoji
    let medal = '';
    if (item.rank === 1) medal = '🥇';
    else if (item.rank === 2) medal = '🥈';
    else if (item.rank === 3) medal = '🥉';

    return (
      <View
        style={[
          styles.leaderboardItem,
          isCurrentUser && styles.currentUserItem,
          isTop3 && styles.top3Item,
        ]}
      >
        <Text style={[styles.rankText, isTop3 && styles.top3Rank]}>
          {medal || `#${item.rank}`}
        </Text>
        <Text
          style={[
            styles.nameText,
            isCurrentUser && styles.currentUserText,
            isTop3 && styles.top3Name,
          ]}
          numberOfLines={1}
        >
          {item.name}
          {isCurrentUser && ' (Sen)'}
        </Text>
        <Text style={[styles.scoreText, isTop3 && styles.top3Score]}>
          {item.score}
        </Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar style="light" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => {
            if (onTriggerHaptic) onTriggerHaptic('light');
            onNavigateMenu();
          }}
        >
          <Text style={styles.backButtonText}>← Geri</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Liderlik Tablosu</Text>
        <View style={styles.placeholder} />
      </View>

      {/* Filtreler */}
      <View style={styles.filterContainer}>
        <TouchableOpacity
          style={[styles.filterButton, filter === 'daily' && styles.filterButtonActive]}
          onPress={() => changeFilter('daily')}
        >
          <Text style={[styles.filterText, filter === 'daily' && styles.filterTextActive]}>
            Günlük
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.filterButton, filter === 'weekly' && styles.filterButtonActive]}
          onPress={() => changeFilter('weekly')}
        >
          <Text style={[styles.filterText, filter === 'weekly' && styles.filterTextActive]}>
            Haftalık
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.filterButton, filter === 'monthly' && styles.filterButtonActive]}
          onPress={() => changeFilter('monthly')}
        >
          <Text style={[styles.filterText, filter === 'monthly' && styles.filterTextActive]}>
            Aylık
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.filterButton, filter === 'all' && styles.filterButtonActive]}
          onPress={() => changeFilter('all')}
        >
          <Text style={[styles.filterText, filter === 'all' && styles.filterTextActive]}>
            Tümü
          </Text>
        </TouchableOpacity>
      </View>

      {/* Kullanıcı sıralaması */}
      {userRank && (
        <View style={styles.userRankContainer}>
          <Text style={styles.userRankText}>
            Senin Sıralaman: #{userRank}
          </Text>
        </View>
      )}

      {/* Leaderboard listesi */}
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#007AFF" />
          <Text style={styles.loadingText}>Yükleniyor...</Text>
        </View>
      ) : (
        <FlatList
          data={leaderboard}
          keyExtractor={(item, index) => `${item.rank}-${index}`}
          renderItem={renderLeaderboardItem}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>Henüz skor yok</Text>
              <Text style={styles.emptySubtext}>İlk sıralayan sen ol!</Text>
            </View>
          }
        />
      )}

      {/* İsim girişi modal */}
      <Modal
        visible={nameModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => {}}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Hoş Geldin!</Text>
            <Text style={styles.modalText}>
              Liderlik tablosunda görünmek için bir isim seç
            </Text>
            <TextInput
              style={styles.nameInput}
              placeholder="İsmini gir..."
              placeholderTextColor="#999"
              value={tempName}
              onChangeText={setTempName}
              maxLength={20}
              autoFocus
            />
            <TouchableOpacity
              style={styles.saveButton}
              onPress={handleSaveName}
            >
              <Text style={styles.saveButtonText}>Kaydet</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A0E27',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  backButton: {
    padding: 10,
  },
  backButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#007AFF',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  placeholder: {
    width: 60,
  },
  filterContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 20,
    gap: 10,
  },
  filterButton: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 20,
    backgroundColor: '#1C2541',
    alignItems: 'center',
  },
  filterButtonActive: {
    backgroundColor: '#007AFF',
  },
  filterText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#8E9AAF',
  },
  filterTextActive: {
    color: '#FFFFFF',
  },
  userRankContainer: {
    marginHorizontal: 20,
    marginBottom: 15,
    padding: 15,
    backgroundColor: '#1C2541',
    borderRadius: 15,
    borderWidth: 2,
    borderColor: '#007AFF',
  },
  userRankText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  leaderboardItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1C2541',
    padding: 15,
    borderRadius: 15,
    marginBottom: 10,
  },
  currentUserItem: {
    backgroundColor: '#2A3F5F',
    borderWidth: 2,
    borderColor: '#007AFF',
  },
  top3Item: {
    backgroundColor: '#2D3561',
  },
  rankText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#8E9AAF',
    width: 50,
  },
  top3Rank: {
    fontSize: 24,
    color: '#FFD700',
  },
  nameText: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginLeft: 10,
  },
  currentUserText: {
    color: '#007AFF',
  },
  top3Name: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  scoreText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#00D4FF',
  },
  top3Score: {
    fontSize: 20,
    color: '#FFD700',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#8E9AAF',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 100,
  },
  emptyText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 10,
  },
  emptySubtext: {
    fontSize: 16,
    color: '#8E9AAF',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#1C2541',
    borderRadius: 20,
    padding: 30,
    width: '85%',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 10,
  },
  modalText: {
    fontSize: 16,
    color: '#8E9AAF',
    textAlign: 'center',
    marginBottom: 20,
  },
  nameInput: {
    width: '100%',
    backgroundColor: '#0A0E27',
    borderRadius: 15,
    padding: 15,
    fontSize: 16,
    color: '#FFFFFF',
    marginBottom: 20,
    borderWidth: 2,
    borderColor: '#007AFF',
  },
  saveButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 25,
  },
  saveButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
});
