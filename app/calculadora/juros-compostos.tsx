import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  TextInput, 
  TouchableOpacity, 
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Modal,
  Dimensions
} from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { LineChart } from 'react-native-chart-kit';

/**
 * Calculadora de Juros Compostos
 * Permite que o usuário simule diferentes cenários de investimento com juros compostos
 */
export default function JurosCompostosScreen() {
  // Estados para os campos de entrada
  const [valorInicial, setValorInicial] = useState('100');
  const [aportesMensais, setAportesMensais] = useState('30');
  const [taxaJuros, setTaxaJuros] = useState('0.5');
  const [periodoAnos, setPeriodoAnos] = useState('10');
  
  // Estados para os cálculos
  const [valorFinal, setValorFinal] = useState(0);
  const [valorTotalInvestido, setValorTotalInvestido] = useState(0);
  const [ganhoComJuros, setGanhoComJuros] = useState(0);
  const [projecaoAnual, setProjecaoAnual] = useState<number[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [projecaoDetalhes, setProjecaoDetalhes] = useState<Array<{ano: number, valor: number, investido: number, juros: number}>>([]);

  // Calcula o resultado quando os inputs mudam
  useEffect(() => {
    calcularJurosCompostos();
  }, [valorInicial, aportesMensais, taxaJuros, periodoAnos]);

  // Função para calcular juros compostos
  const calcularJurosCompostos = () => {
    // Converte as entradas para números
    const principal = Number(valorInicial) || 0;
    const aportes = Number(aportesMensais) || 0;
    const taxa = (Number(taxaJuros) || 0) / 100; // Converte para decimal
    const meses = (Number(periodoAnos) || 0) * 12;
    
    let valorAtual = principal;
    let totalInvestido = principal;
    const projecao = [principal];
    const detalhes = [];
    
    // Calcula para cada mês
    for (let mes = 1; mes <= meses; mes++) {
      valorAtual = valorAtual * (1 + taxa) + aportes;
      totalInvestido += aportes;
      
      // Salva os valores anuais para o gráfico
      if (mes % 12 === 0) {
        projecao.push(valorAtual);
        detalhes.push({
          ano: mes / 12,
          valor: valorAtual,
          investido: totalInvestido,
          juros: valorAtual - totalInvestido
        });
      }
    }
    
    setValorFinal(valorAtual);
    setValorTotalInvestido(totalInvestido);
    setGanhoComJuros(valorAtual - totalInvestido);
    setProjecaoAnual(projecao);
    setProjecaoDetalhes(detalhes);
  };

  // Formata valores monetários
  const formatarDinheiro = (valor: number) => {
    return 'R$ ' + valor.toFixed(2).replace('.', ',').replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  };

  return (
    <KeyboardAvoidingView 
      style={{ flex: 1 }} 
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView style={styles.container}>
        <View style={styles.introContainer}>
          <FontAwesome name="line-chart" size={30} color="#2E7D32" style={styles.introIcon} />
          <Text style={styles.introText}>
            Os juros compostos são a "magia disfarçada de matemática" que fazem seu dinheiro crescer com o tempo. 
            A cada período, os juros se acumulam sobre o valor principal e sobre os juros anteriores.
          </Text>
        </View>
        
        <View style={styles.inputContainer}>
          <Text style={styles.sectionTitle}>Valores de entrada</Text>
          
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Valor inicial (R$)</Text>
            <TextInput
              style={styles.input}
              value={valorInicial}
              onChangeText={setValorInicial}
              keyboardType="numeric"
              placeholder="100"
            />
          </View>
          
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Aportes mensais (R$)</Text>
            <TextInput
              style={styles.input}
              value={aportesMensais}
              onChangeText={setAportesMensais}
              keyboardType="numeric"
              placeholder="30"
            />
          </View>
          
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Taxa de juros mensal (%)</Text>
            <TextInput
              style={styles.input}
              value={taxaJuros}
              onChangeText={setTaxaJuros}
              keyboardType="numeric"
              placeholder="0.5"
            />
          </View>
          
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Período (anos)</Text>
            <TextInput
              style={styles.input}
              value={periodoAnos}
              onChangeText={setPeriodoAnos}
              keyboardType="numeric"
              placeholder="10"
            />
          </View>
        </View>
        
        <View style={styles.resultContainer}>
          <Text style={styles.sectionTitle}>Resultado</Text>
          
          <View style={styles.resultCard}>
            <Text style={styles.resultLabel}>Valor final:</Text>
            <Text style={styles.resultValue}>{formatarDinheiro(valorFinal)}</Text>
          </View>
          
          <View style={styles.resultRow}>
            <View style={styles.resultCardSmall}>
              <Text style={styles.resultLabelSmall}>Total investido:</Text>
              <Text style={styles.resultValueSmall}>{formatarDinheiro(valorTotalInvestido)}</Text>
            </View>
            
            <View style={styles.resultCardSmall}>
              <Text style={styles.resultLabelSmall}>Ganho com juros:</Text>
              <Text style={styles.resultValueSmall}>{formatarDinheiro(ganhoComJuros)}</Text>
            </View>
          </View>
        </View>
        
        {projecaoAnual.length > 1 && (
          <View style={styles.chartContainer}>
            <Text style={styles.sectionTitle}>Evolução do Patrimônio</Text>
            
            <LineChart
              data={{
                labels: Array.from({ length: projecaoAnual.length }, (_, i) => i.toString()),
                datasets: [
                  {
                    data: projecaoAnual,
                    color: () => '#2E7D32', // cor da linha
                    strokeWidth: 2
                  }
                ]
              }}
              width={Dimensions.get('window').width - 30}
              height={220}
              chartConfig={{
                backgroundColor: '#FFFFFF',
                backgroundGradientFrom: '#FFFFFF',
                backgroundGradientTo: '#FFFFFF',
                decimalPlaces: 0,
                color: (opacity = 1) => `rgba(46, 125, 50, ${opacity})`,
                labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                style: {
                  borderRadius: 16
                },
                propsForDots: {
                  r: '6',
                  strokeWidth: '2',
                  stroke: '#2E7D32'
                }
              }}
              bezier
              style={styles.chart}
            />
            
            <TouchableOpacity 
              style={styles.detailsButton}
              onPress={() => setModalVisible(true)}
            >
              <Text style={styles.detailsButtonText}>Ver Detalhes Ano a Ano</Text>
            </TouchableOpacity>
          </View>
        )}
        
        <View style={styles.tipsContainer}>
          <Text style={styles.tipsTitle}>Dicas para investir melhor</Text>
          
          <View style={styles.tipItem}>
            <FontAwesome name="lightbulb-o" size={20} color="#2E7D32" style={styles.tipIcon} />
            <Text style={styles.tipText}>
              Mesmo um pequeno aporte mensal pode gerar um bom patrimônio no longo prazo.
            </Text>
          </View>
          
          <View style={styles.tipItem}>
            <FontAwesome name="lightbulb-o" size={20} color="#2E7D32" style={styles.tipIcon} />
            <Text style={styles.tipText}>
              Considere reinvestir os rendimentos para potencializar o efeito dos juros compostos.
            </Text>
          </View>
          
          <View style={styles.tipItem}>
            <FontAwesome name="lightbulb-o" size={20} color="#2E7D32" style={styles.tipIcon} />
            <Text style={styles.tipText}>
              O tempo é um aliado poderoso: quanto mais cedo começar, maior será o resultado.
            </Text>
          </View>
        </View>
      </ScrollView>
      
      {/* Modal com detalhes anuais */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Detalhes Ano a Ano</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <FontAwesome name="close" size={24} color="#333" />
              </TouchableOpacity>
            </View>
            
            <ScrollView style={styles.modalScrollView}>
              <View style={styles.tableHeader}>
                <Text style={[styles.tableHeaderCell, { flex: 0.5 }]}>Ano</Text>
                <Text style={styles.tableHeaderCell}>Valor Total</Text>
                <Text style={styles.tableHeaderCell}>Investido</Text>
                <Text style={styles.tableHeaderCell}>Juros</Text>
              </View>
              
              {projecaoDetalhes.map((item, index) => (
                <View key={index} style={[styles.tableRow, index % 2 === 0 ? styles.tableRowEven : {}]}>
                  <Text style={[styles.tableCell, { flex: 0.5 }]}>{item.ano}</Text>
                  <Text style={styles.tableCell}>{formatarDinheiro(item.valor)}</Text>
                  <Text style={styles.tableCell}>{formatarDinheiro(item.investido)}</Text>
                  <Text style={styles.tableCell}>{formatarDinheiro(item.juros)}</Text>
                </View>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 15,
  },
  introContainer: {
    backgroundColor: '#E8F5E9',
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  introIcon: {
    marginRight: 15,
  },
  introText: {
    flex: 1,
    fontSize: 14,
    color: '#333',
    lineHeight: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2E7D32',
    marginBottom: 15,
  },
  inputContainer: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  inputGroup: {
    marginBottom: 15,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 5,
    padding: 10,
    fontSize: 16,
  },
  resultContainer: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  resultCard: {
    backgroundColor: '#E8F5E9',
    borderRadius: 8,
    padding: 15,
    marginBottom: 15,
  },
  resultLabel: {
    fontSize: 14,
    color: '#333',
    marginBottom: 5,
  },
  resultValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2E7D32',
  },
  resultRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  resultCardSmall: {
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    padding: 12,
    width: '48%',
  },
  resultLabelSmall: {
    fontSize: 12,
    color: '#333',
    marginBottom: 5,
  },
  resultValueSmall: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  chartContainer: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    alignItems: 'center',
  },
  chart: {
    marginVertical: 10,
    borderRadius: 10,
  },
  detailsButton: {
    backgroundColor: '#2E7D32',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginTop: 10,
  },
  detailsButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14,
  },
  tipsContainer: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 15,
    marginBottom: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  tipsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  tipItem: {
    flexDirection: 'row',
    marginBottom: 10,
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
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '90%',
    maxHeight: '80%',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#EEE',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2E7D32',
  },
  modalScrollView: {
    maxHeight: 400,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#2E7D32',
    paddingVertical: 10,
    paddingHorizontal: 5,
    borderRadius: 5,
    marginBottom: 5,
  },
  tableHeaderCell: {
    flex: 1,
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14,
    textAlign: 'center',
  },
  tableRow: {
    flexDirection: 'row',
    paddingVertical: 8,
    paddingHorizontal: 5,
    borderBottomWidth: 1,
    borderBottomColor: '#EEE',
  },
  tableRowEven: {
    backgroundColor: '#F9F9F9',
  },
  tableCell: {
    flex: 1,
    fontSize: 12,
    textAlign: 'center',
  },
});
