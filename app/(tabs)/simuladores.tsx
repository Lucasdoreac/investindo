import { StyleSheet, Text, View, TouchableOpacity, ScrollView } from 'react-native';
import { Link } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';

/**
 * Tela de Simuladores do aplicativo "Investindo com Sabedoria"
 * Lista as calculadoras financeiras disponíveis no aplicativo
 */
export default function SimuladoresScreen() {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Simuladores Financeiros</Text>
        <Text style={styles.headerSubtitle}>
          Ferramentas para simular seus investimentos e planejar seu futuro financeiro
        </Text>
      </View>

      <View style={styles.simulatorsContainer}>
        <TouchableOpacity style={styles.simulatorCard}>
          <Link href="/calculadora/juros-compostos" asChild>
            <View style={styles.simulatorContent}>
              <View style={styles.simulatorIconContainer}>
                <FontAwesome name="line-chart" size={32} color="#2E7D32" />
              </View>
              <View style={styles.simulatorTextContainer}>
                <Text style={styles.simulatorTitle}>Calculadora de Juros Compostos</Text>
                <Text style={styles.simulatorDescription}>
                  Veja como seu dinheiro cresce com o tempo graças ao "efeito bola de neve" 
                  dos juros compostos
                </Text>
              </View>
              <FontAwesome name="chevron-right" size={20} color="#999" />
            </View>
          </Link>
        </TouchableOpacity>

        <TouchableOpacity style={styles.simulatorCard}>
          <Link href="/calculadora/comparador" asChild>
            <View style={styles.simulatorContent}>
              <View style={styles.simulatorIconContainer}>
                <FontAwesome name="balance-scale" size={32} color="#2E7D32" />
              </View>
              <View style={styles.simulatorTextContainer}>
                <Text style={styles.simulatorTitle}>Comparador de Investimentos</Text>
                <Text style={styles.simulatorDescription}>
                  Compare diferentes produtos financeiros e descubra qual é o mais adequado 
                  para seus objetivos
                </Text>
              </View>
              <FontAwesome name="chevron-right" size={20} color="#999" />
            </View>
          </Link>
        </TouchableOpacity>

        <TouchableOpacity style={styles.simulatorCard}>
          <Link href="/calculadora/escada-vencimentos" asChild>
            <View style={styles.simulatorContent}>
              <View style={styles.simulatorIconContainer}>
                <FontAwesome name="calendar" size={32} color="#2E7D32" />
              </View>
              <View style={styles.simulatorTextContainer}>
                <Text style={styles.simulatorTitle}>Simulador de Escada de Vencimentos</Text>
                <Text style={styles.simulatorDescription}>
                  Crie uma estratégia de escada de vencimentos para seus investimentos 
                  de renda fixa
                </Text>
              </View>
              <FontAwesome name="chevron-right" size={20} color="#999" />
            </View>
          </Link>
        </TouchableOpacity>

        <TouchableOpacity style={styles.simulatorCard}>
          <Link href="/calculadora/montador-carteira" asChild>
            <View style={styles.simulatorContent}>
              <View style={styles.simulatorIconContainer}>
                <FontAwesome name="pie-chart" size={32} color="#2E7D32" />
              </View>
              <View style={styles.simulatorTextContainer}>
                <Text style={styles.simulatorTitle}>Montador de Carteira</Text>
                <Text style={styles.simulatorDescription}>
                  Monte uma carteira diversificada de acordo com seu perfil de investidor
                </Text>
              </View>
              <FontAwesome name="chevron-right" size={20} color="#999" />
            </View>
          </Link>
        </TouchableOpacity>
      </View>

      <View style={styles.tipsContainer}>
        <Text style={styles.tipsTitle}>Dicas para usar os simuladores</Text>
        
        <View style={styles.tipItem}>
          <FontAwesome name="info-circle" size={20} color="#2E7D32" style={styles.tipIcon} />
          <Text style={styles.tipText}>
            Mesmo pequenos valores investidos regularmente podem crescer significativamente 
            ao longo do tempo
          </Text>
        </View>
        
        <View style={styles.tipItem}>
          <FontAwesome name="info-circle" size={20} color="#2E7D32" style={styles.tipIcon} />
          <Text style={styles.tipText}>
            Lembre-se de considerar a inflação ao planejar investimentos de longo prazo
          </Text>
        </View>
        
        <View style={styles.tipItem}>
          <FontAwesome name="info-circle" size={20} color="#2E7D32" style={styles.tipIcon} />
          <Text style={styles.tipText}>
            Os simuladores são ferramentas educativas e não substituem o aconselhamento 
            financeiro profissional
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    padding: 20,
    backgroundColor: '#E8F5E9',
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#2E7D32',
    marginBottom: 5,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#555',
    lineHeight: 22,
  },
  simulatorsContainer: {
    padding: 15,
  },
  simulatorCard: {
    backgroundColor: 'white',
    borderRadius: 10,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  simulatorContent: {
    padding: 15,
    flexDirection: 'row',
    alignItems: 'center',
  },
  simulatorIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#E8F5E9',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  simulatorTextContainer: {
    flex: 1,
  },
  simulatorTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  simulatorDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  comingSoon: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#FF9800',
    marginTop: 5,
  },
  tipsContainer: {
    margin: 15,
    padding: 15,
    backgroundColor: 'white',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    marginBottom: 30,
  },
  tipsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  tipItem: {
    flexDirection: 'row',
    marginBottom: 12,
    alignItems: 'flex-start',
  },
  tipIcon: {
    marginRight: 10,
    marginTop: 2,
  },
  tipText: {
    flex: 1,
    fontSize: 14,
    color: '#555',
    lineHeight: 20,
  },
});
