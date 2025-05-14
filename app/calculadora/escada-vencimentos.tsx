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
  Dimensions,
  FlatList,
  Alert
} from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { BarChart } from 'react-native-chart-kit';
import { useNavigation } from '@react-navigation/native';

/**
 * Interface para representar um investimento na escada de vencimentos
 */
interface Investimento {
  id: string;
  valor: number;
  rendimento: number;
  vencimento: number; // em meses
  titulo: string;
}

/**
 * Simulador de Escada de Vencimentos
 * Permite que o usuário simule uma estratégia de escada de vencimentos para 
 * investimentos em renda fixa.
 */
export default function EscadaVencimentosScreen() {
  // Use o hook de navegação
  const navigation = useNavigation();
  
  // Defina o título da página na montagem do componente (específico para web)
  React.useLayoutEffect(() => {
    if (Platform.OS === 'web') {
      navigation.setOptions({
        title: 'Escada de Vencimentos',
        headerStyle: {
          backgroundColor: '#2E7D32',
        },
        headerTintColor: '#FFFFFF',
      });
    }
  }, [navigation]);
  
  // Estados para os campos de entrada do novo investimento
  const [valorInvestimento, setValorInvestimento] = useState('1000');
  const [rendimentoAnual, setRendimentoAnual] = useState('12');
  const [vencimentoMeses, setVencimentoMeses] = useState('12');
  const [tituloInvestimento, setTituloInvestimento] = useState('');
  
  // Estado para armazenar a lista de investimentos da escada
  const [investimentos, setInvestimentos] = useState<Investimento[]>([]);
  
  // Estado para controlar a exibição do modal
  const [modalVisible, setModalVisible] = useState(false);
  
  // Estado para armazenar o investimento selecionado para edição ou exclusão
  const [investimentoSelecionado, setInvestimentoSelecionado] = useState<Investimento | null>(null);
  
  // Função para adicionar um novo investimento à escada
  const adicionarInvestimento = () => {
    // Validação de campos obrigatórios
    if (!valorInvestimento || !rendimentoAnual || !vencimentoMeses) {
      Alert.alert('Campos obrigatórios', 'Por favor, preencha todos os campos.');
      return;
    }
    
    // Criação do novo investimento
    const novoInvestimento: Investimento = {
      id: Date.now().toString(), // ID único baseado no timestamp
      valor: Number(valorInvestimento),
      rendimento: Number(rendimentoAnual),
      vencimento: Number(vencimentoMeses),
      titulo: tituloInvestimento || `Investimento ${investimentos.length + 1}`
    };
    
    // Adição do novo investimento à lista
    setInvestimentos([...investimentos, novoInvestimento]);
    
    // Limpa os campos
    setTituloInvestimento('');
  };
  
  // Função para remover um investimento da escada
  const removerInvestimento = (id: string) => {
    setInvestimentos(investimentos.filter(inv => inv.id !== id));
    setModalVisible(false);
  };
  
  // Função para abrir o modal com detalhes do investimento
  const abrirDetalhesInvestimento = (investimento: Investimento) => {
    setInvestimentoSelecionado(investimento);
    setModalVisible(true);
  };
  
  // Função para calcular o valor total investido
  const calcularTotalInvestido = () => {
    return investimentos.reduce((total, inv) => total + inv.valor, 0);
  };
  
  // Função para calcular o rendimento médio ponderado
  const calcularRendimentoMedio = () => {
    if (investimentos.length === 0) return 0;
    
    const totalInvestido = calcularTotalInvestido();
    const somaRendimentos = investimentos.reduce((soma, inv) => soma + (inv.valor * inv.rendimento), 0);
    
    return (somaRendimentos / totalInvestido);
  };
  
  // Função para formatar valores monetários
  const formatarDinheiro = (valor: number) => {
    return 'R$ ' + valor.toFixed(2).replace('.', ',').replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  };
  
  // Função para formatar percentuais
  const formatarPercentual = (valor: number) => {
    return valor.toFixed(2).replace('.', ',') + '%';
  };
  
  // Função para obter os dados para o gráfico de barras
  const obterDadosGrafico = () => {
    // Organiza os investimentos por prazo de vencimento
    const investimentosOrdenados = [...investimentos].sort((a, b) => a.vencimento - b.vencimento);
    
    return {
      labels: investimentosOrdenados.map(inv => `${inv.vencimento} meses`),
      datasets: [
        {
          data: investimentosOrdenados.map(inv => inv.valor),
          color: (opacity = 1) => `rgba(46, 125, 50, ${opacity})`,
        }
      ]
    };
  };
  
  return (
    <KeyboardAvoidingView 
      style={{ flex: 1 }} 
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView style={styles.container}>
        <View style={styles.introContainer}>
          <FontAwesome name="calendar" size={30} color="#2E7D32" style={styles.introIcon} />
          <Text style={styles.introText}>
            A estratégia de Escada de Vencimentos consiste em distribuir seus investimentos
            em títulos com diferentes prazos de vencimento, equilibrando rentabilidade e liquidez.
          </Text>
        </View>
        
        <View style={styles.inputContainer}>
          <Text style={styles.sectionTitle}>Adicionar novo investimento</Text>
          
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Título/Descrição</Text>
            <TextInput
              style={styles.input}
              value={tituloInvestimento}
              onChangeText={setTituloInvestimento}
              placeholder="CDB Banco X"
            />
          </View>
          
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Valor (R$)</Text>
            <TextInput
              style={styles.input}
              value={valorInvestimento}
              onChangeText={setValorInvestimento}
              keyboardType="numeric"
              placeholder="1000"
            />
          </View>
          
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Rendimento anual (%)</Text>
            <TextInput
              style={styles.input}
              value={rendimentoAnual}
              onChangeText={setRendimentoAnual}
              keyboardType="numeric"
              placeholder="12"
            />
          </View>
          
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Vencimento (meses)</Text>
            <TextInput
              style={styles.input}
              value={vencimentoMeses}
              onChangeText={setVencimentoMeses}
              keyboardType="numeric"
              placeholder="12"
            />
          </View>
          
          <TouchableOpacity
            style={styles.addButton}
            onPress={adicionarInvestimento}
          >
            <Text style={styles.addButtonText}>Adicionar à Escada</Text>
          </TouchableOpacity>
        </View>
        
        {investimentos.length > 0 ? (
          <View style={styles.resultContainer}>
            <Text style={styles.sectionTitle}>Sua Escada de Vencimentos</Text>
            
            <View style={styles.resultCard}>
              <Text style={styles.resultLabel}>Valor total investido:</Text>
              <Text style={styles.resultValue}>{formatarDinheiro(calcularTotalInvestido())}</Text>
            </View>
            
            <View style={styles.resultRow}>
              <View style={styles.resultCardSmall}>
                <Text style={styles.resultLabelSmall}>Rendimento médio:</Text>
                <Text style={styles.resultValueSmall}>{formatarPercentual(calcularRendimentoMedio())}</Text>
              </View>
              
              <View style={styles.resultCardSmall}>
                <Text style={styles.resultLabelSmall}>Total de investimentos:</Text>
                <Text style={styles.resultValueSmall}>{investimentos.length}</Text>
              </View>
            </View>
            
            <Text style={styles.investimentosTitle}>Investimentos na Escada:</Text>
            
            <FlatList
              data={investimentos}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <TouchableOpacity 
                  style={styles.investimentoItem}
                  onPress={() => abrirDetalhesInvestimento(item)}
                >
                  <View style={styles.investimentoInfo}>
                    <Text style={styles.investimentoTitulo}>{item.titulo}</Text>
                    <Text style={styles.investimentoValor}>{formatarDinheiro(item.valor)}</Text>
                  </View>
                  <View style={styles.investimentoDetalhes}>
                    <Text style={styles.investimentoTexto}>
                      Rendimento: {formatarPercentual(item.rendimento)} a.a.
                    </Text>
                    <Text style={styles.investimentoTexto}>
                      Vencimento: {item.vencimento} meses
                    </Text>
                  </View>
                  <FontAwesome name="chevron-right" size={16} color="#777" />
                </TouchableOpacity>
              )}
              style={styles.investimentosList}
              scrollEnabled={false}
            />
            
            {investimentos.length > 1 && (
              <View style={styles.chartContainer}>
                <Text style={styles.chartTitle}>Distribuição por Vencimento</Text>
                <BarChart
                  data={obterDadosGrafico()}
                  width={Dimensions.get('window').width - 40}
                  height={220}
                  yAxisLabel="R$"
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
                    barPercentage: 0.7,
                  }}
                  style={styles.chart}
                  showValuesOnTopOfBars={true}
                />
              </View>
            )}
          </View>
        ) : (
          <View style={styles.emptyStateContainer}>
            <FontAwesome name="calendar-o" size={50} color="#CCC" />
            <Text style={styles.emptyStateText}>
              Adicione investimentos à sua escada para visualizar a estratégia
            </Text>
          </View>
        )}
        
        <View style={styles.tipsContainer}>
          <Text style={styles.tipsTitle}>Dicas para usar a escada de vencimentos</Text>
          
          <View style={styles.tipItem}>
            <FontAwesome name="lightbulb-o" size={20} color="#2E7D32" style={styles.tipIcon} />
            <Text style={styles.tipText}>
              Distribua seus investimentos em diferentes prazos de vencimento para ter acesso
              regular a recursos sem perder rendimento.
            </Text>
          </View>
          
          <View style={styles.tipItem}>
            <FontAwesome name="lightbulb-o" size={20} color="#2E7D32" style={styles.tipIcon} />
            <Text style={styles.tipText}>
              Títulos com prazos mais longos geralmente oferecem rendimentos maiores. Use-os
              para aumentar a rentabilidade média da sua carteira.
            </Text>
          </View>
          
          <View style={styles.tipItem}>
            <FontAwesome name="lightbulb-o" size={20} color="#2E7D32" style={styles.tipIcon} />
            <Text style={styles.tipText}>
              Ao vencer um título, reavalie as taxas disponíveis no mercado antes de reinvestir
              o recurso em um novo título de longo prazo.
            </Text>
          </View>
        </View>
      </ScrollView>
      
      {/* Modal com detalhes do investimento selecionado */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            {investimentoSelecionado && (
              <>
                <View style={styles.modalHeader}>
                  <Text style={styles.modalTitle}>{investimentoSelecionado.titulo}</Text>
                  <TouchableOpacity onPress={() => setModalVisible(false)}>
                    <FontAwesome name="close" size={24} color="#333" />
                  </TouchableOpacity>
                </View>
                
                <View style={styles.modalDetails}>
                  <View style={styles.modalDetailItem}>
                    <Text style={styles.modalDetailLabel}>Valor investido:</Text>
                    <Text style={styles.modalDetailValue}>{formatarDinheiro(investimentoSelecionado.valor)}</Text>
                  </View>
                  
                  <View style={styles.modalDetailItem}>
                    <Text style={styles.modalDetailLabel}>Rendimento anual:</Text>
                    <Text style={styles.modalDetailValue}>{formatarPercentual(investimentoSelecionado.rendimento)}</Text>
                  </View>
                  
                  <View style={styles.modalDetailItem}>
                    <Text style={styles.modalDetailLabel}>Prazo até o vencimento:</Text>
                    <Text style={styles.modalDetailValue}>{investimentoSelecionado.vencimento} meses</Text>
                  </View>
                  
                  <View style={styles.modalDetailItem}>
                    <Text style={styles.modalDetailLabel}>Valor estimado no vencimento:</Text>
                    <Text style={styles.modalDetailValue}>
                      {formatarDinheiro(
                        investimentoSelecionado.valor * 
                        Math.pow(1 + (investimentoSelecionado.rendimento / 100), investimentoSelecionado.vencimento / 12)
                      )}
                    </Text>
                  </View>
                </View>
                
                <TouchableOpacity
                  style={styles.deleteButton}
                  onPress={() => removerInvestimento(investimentoSelecionado.id)}
                >
                  <Text style={styles.deleteButtonText}>Remover Investimento</Text>
                </TouchableOpacity>
              </>
            )}
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
  addButton: {
    backgroundColor: '#2E7D32',
    padding: 12,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 10,
  },
  addButtonText: {
    color: 'white',
    fontWeight: 'bold',
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
    marginBottom: 15,
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
  investimentosTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  investimentosList: {
    maxHeight: 300,
  },
  investimentoItem: {
    backgroundColor: '#F9F9F9',
    borderRadius: 8,
    padding: 15,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  investimentoInfo: {
    flex: 1,
  },
  investimentoTitulo: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 3,
  },
  investimentoValor: {
    fontSize: 15,
    color: '#2E7D32',
    fontWeight: 'bold',
  },
  investimentoDetalhes: {
    flex: 1,
    marginRight: 10,
  },
  investimentoTexto: {
    fontSize: 13,
    color: '#666',
    marginBottom: 2,
  },
  emptyStateContainer: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 30,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  emptyStateText: {
    fontSize: 16,
    color: '#777',
    textAlign: 'center',
    marginTop: 15,
    lineHeight: 22,
  },
  chartContainer: {
    marginTop: 20,
    backgroundColor: '#F9F9F9',
    borderRadius: 10,
    padding: 15,
    alignItems: 'center',
  },
  chartTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  chart: {
    marginVertical: 10,
    borderRadius: 10,
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
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '90%',
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
  modalDetails: {
    marginBottom: 20,
  },
  modalDetailItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  modalDetailLabel: {
    fontSize: 14,
    color: '#666',
  },
  modalDetailValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
  },
  deleteButton: {
    backgroundColor: '#FF5252',
    padding: 12,
    borderRadius: 5,
    alignItems: 'center',
  },
  deleteButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
