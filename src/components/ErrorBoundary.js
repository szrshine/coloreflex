// Error Boundary Component
// React component'lerindeki hataları yakalar ve kullanıcıya düzgün bir hata ekranı gösterir

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { logError } from '../services/crashReporting';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error) {
    // Hata olduğunda state'i güncelle
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Hatayı logla
    console.error('ErrorBoundary caught an error:', error, errorInfo);

    // Crash reporting servisine gönder
    logError(error, {
      componentStack: errorInfo.componentStack,
      errorBoundary: true,
    });

    // State'i güncelle
    this.setState({
      error,
      errorInfo,
    });
  }

  handleReset = () => {
    // Hatayı temizle ve uygulamayı sıfırla
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });

    // Eğer reset callback prop'u varsa çağır
    if (this.props.onReset) {
      this.props.onReset();
    }
  };

  render() {
    if (this.state.hasError) {
      // Hata ekranını göster
      return (
        <View style={styles.container}>
          <View style={styles.content}>
            <Text style={styles.emoji}>😕</Text>
            <Text style={styles.title}>Bir Şeyler Ters Gitti</Text>
            <Text style={styles.message}>
              Üzgünüz, beklenmeyen bir hata oluştu.{'\n'}
              Lütfen uygulamayı yeniden başlatın.
            </Text>

            {__DEV__ && this.state.error && (
              <View style={styles.errorDetails}>
                <Text style={styles.errorTitle}>Hata Detayları (Sadece Development):</Text>
                <Text style={styles.errorText}>{this.state.error.toString()}</Text>
                {this.state.errorInfo && (
                  <Text style={styles.errorStack}>
                    {this.state.errorInfo.componentStack}
                  </Text>
                )}
              </View>
            )}

            <TouchableOpacity style={styles.button} onPress={this.handleReset}>
              <Text style={styles.buttonText}>Yeniden Başlat</Text>
            </TouchableOpacity>
          </View>
        </View>
      );
    }

    // Hata yoksa normal olarak children'ı render et
    return this.props.children;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a2e',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  content: {
    alignItems: 'center',
    maxWidth: 400,
  },
  emoji: {
    fontSize: 80,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 12,
    textAlign: 'center',
  },
  message: {
    fontSize: 16,
    color: '#ccc',
    textAlign: 'center',
    marginBottom: 30,
    lineHeight: 24,
  },
  button: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 25,
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  errorDetails: {
    backgroundColor: '#2a2a3e',
    padding: 15,
    borderRadius: 8,
    marginTop: 20,
    marginBottom: 10,
    width: '100%',
    maxHeight: 200,
  },
  errorTitle: {
    color: '#ff6b6b',
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  errorText: {
    color: '#ff9999',
    fontSize: 12,
    fontFamily: 'monospace',
    marginBottom: 8,
  },
  errorStack: {
    color: '#ffcccc',
    fontSize: 10,
    fontFamily: 'monospace',
  },
});

export default ErrorBoundary;
