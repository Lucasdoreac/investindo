import React, { useState } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  ScrollView, 
  TouchableOpacity, 
  TextInput,
  Switch,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

/**
 * Tipos de investimentos a comparar
 */
type TipoInvestimento = 'CDB' | 'LCI/LCA' | 'Tesouro Direto' | 'Poupança';

/**
 * Interface para representar um investimento com suas características
 */
interface Investimento {
  tipo: TipoInvestimento;
  rentabilidade: number;
  rentabilidadeTipo: 'prefixado' | 'cdi' | 'ipca';
  liquidez: boolean;
  isento: boolean;
  garantiaFGC: boolean;
}

/**
 * Tela de comparação de investimentos
 * Permite comparar diferentes produtos financeiros
 */
export default function ComparadorScreen() {
  // Use o hook de navegação
  const navigation = useNavigation();
  
  // Defina o título da página na montagem do componente (específico para web)
  React.useLayoutEffect(() => {
    if (Platform.OS === 'web') {
      navigation.setOptions({
        title: 'Comparador de Investimentos',
        headerStyle: {
          backgroundColor: '#2E7D32',
        },
        headerTintColor: '#FFFFFF',
      });
    }
  }, [navigation]);
  
  // Definição inicial dos investimentos a comparar
  const [investimentos, setInvestimentos] = useState<Investimento[]>([
    {
      tipo: 'CDB',
      rentabilidade: 110,
      rentabilidadeTipo: 'cdi',
      liquidez: true,
      isento: false,
      garantiaFGC: true
    },
    {
      tipo: 'LCI/LCA',
      rentabilidade: 92,
      rentabilidadeTipo: 'cdi',
      liquidez: false,
      isento: true,
      garantiaFGC: true
    }
  ]);
  
  // Estado para o valor inicial do investimento
  const [valorInvestimento, setValorInvestimento] = useState('1000');
  // Estado para a taxa CDI
  const [taxaCDI, setTaxaCDI] = useState('12.25');
  // Estado para a taxa IPCA
  const [taxaIPCA, setTaxaIPCA] = useState('4.35');
  // Estado para o prazo em meses
  const [prazoMeses, setPrazoMeses] = useState('12');
  
  /**
   * Atualiza uma propriedade de um investimento
   */
  const atualizarInvestimento = (
    index: number, 
    propriedade: keyof Investimento, 
    valor: any
  ) => {
    const novosInvestimentos = [...investimentos];
    novosInvestimentos[index] = {
      ...novosInvestimentos[index],
      [propriedade]: valor
    };
    setInvestimentos(novosInvestimentos);
  };
  
  /**
   * Adiciona um novo investimento para comparação
   */
  const adicionarInvestimento = () => {
    if (investimentos.length < 3) {
      setInvestimentos([
        ...investimentos,
        {
          tipo: 'Tesouro Direto',
          rentabilidade: 100,
          rentabilidadeTipo: 'cdi',
          liquidez: true,
          isento: false,
          garantiaFGC: false
        }
      ]);
    }
  };
  
  /**
   * Remove um investimento da comparação
   */
  const removerInvestimento = (index: number) => {
    if (investimentos.length > 2) {
      const novosInvestimentos = [...investimentos];
      novosInvestimentos.splice(index, 1);
      setInvestimentos(novosInvestimentos);
    }
  };
  
  /**
   * Calcula o rendimento bruto de um investimento
   */
  const calcularRendimentoBruto = (investimento: Investimento): number => {
    const valor = parseFloat(valorInvestimento) || 0;
    const prazo = parseInt(prazoMeses) || 0;
    const cdi = parseFloat(taxaCDI) || 0;
    const ipca = parseFloat(taxaIPCA) || 0;
    
    let taxaAnual = 0;
    
    switch (investimento.rentabilidadeTipo) {
      case 'cdi':
        taxaAnual = (cdi * investimento.rentabilidade / 100) / 100;
        break;
      case 'prefixado':
        taxaAnual = investimento.rentabilidade / 100;
        break;
      case 'ipca':
        taxaAnual = (ipca + investimento.rentabilidade) / 100;
        break;
    }
    
    const taxaMensal = Math.pow(1 + taxaAnual, 1/12) - 1;
    return valor * Math.pow(1 + taxaMensal, prazo);
  };
  
  /**
   * Calcula o rendimento líquido considerando imposto de renda
   */
  const calcularRendimentoLiquido = (investimento: Investimento): number => {
    const rendimentoBruto = calcularRendimentoBruto(investimento);
    const valorInicial = parseFloat(valorInvestimento) || 0;
    const rendimento = rendimentoBruto - valorInicial;
    
    // Se for isento, retorna o rendimento bruto
    if (investimento.isento) {
      return rendimentoBruto;
    }
    
    // Calcula a alíquota de IR com base no prazo
    const meses = parseInt(prazoMeses) || 0;
    let aliquota = 0;
    
    if (meses <= 6) {
      aliquota = 0.225; // 22.5%
    } else if (meses <= 12) {
      aliquota = 0.20; // 20%
    } else if (meses <= 24) {
      aliquota = 0.175; // 17.5%
    } else {
      aliquota = 0.15; // 15%
    }
    
    const impostoRenda = rendimento * aliquota;
    return rendimentoBruto - impostoRenda;
  };
  
  /**
   * Formata um valor para exibição em moeda
   */
  const formatarDinheiro = (valor: number): string => {
    return 'R$ ' + valor.toFixed(2).replace('.', ',').replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  };
  
  /**
   * Retorna a porcentagem de rendimento relativa ao valor inicial
   */
  const calcularPorcentagemRendimento = (valorFinal: number): string => {
    const valorInicial = parseFloat(valorInvestimento) || 0;
    if (valorInicial === 0) return '0%';
    
    const percentual = ((valorFinal / valorInicial) - 1) * 100;
    return percentual.toFixed(2) + '%';
  };
  
  /**
   * Retorna uma cor indicativa de qual investimento é melhor
   */
  const getCorIndicativa = (index: number): string => {
    if (investimentos.length < 2) return '#2E7D32';
    
    const rendimentos = investimentos.map(calcularRendimentoLiquido);
    const maiorRendimento = Math.max(...rendimentos);
    
    if (calcularRendimentoLiquido(investimentos[index]) === maiorRendimento) {
      return '#2E7D32'; // Verde para o melhor rendimento
    }
    
    return '#757575'; // Cinza para os outros
  };

  return (
    <KeyboardAvoidingView 
      style={{ flex: 1 }} 
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView style={styles.container}>
        <View style={styles.introContainer}>
          <Text style={styles.introTitle}>Comparador de Investimentos</Text>
          <Text style={styles.introText}>
            Compare diferentes produtos financeiros para descobrir qual oferece o melhor rendimento
            para o seu cenário específico.
          </Text>
        </View>
        
        {/* Parâmetros gerais da simulação */}
        <View style={styles.parametrosContainer}>
          <Text style={styles.sectionTitle}>Parâmetros da Simulação</Text>
          
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Valor a investir (R$)</Text>
            <TextInput
              style={styles.input}
              value={valorInvestimento}
              onChangeText={setValorInvestimento}
              keyboardType="numeric"
              placeholder="1000"
            />
          </View>
          
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Taxa CDI anual (%)</Text>
            <TextInput
              style={styles.input}
              value={taxaCDI}
              onChangeText={setTaxaCDI}
              keyboardType="numeric"
              placeholder="12.25"
            />
          </View>
          
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Taxa IPCA anual (%)</Text>
            <TextInput
              style={styles.input}
              value={taxaIPCA}
              onChangeText={setTaxaIPCA}
              keyboardType="numeric"
              placeholder="4.35"
            />
          </View>
          
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Prazo (meses)</Text>
            <TextInput
              style={styles.input}
              value={prazoMeses}
              onChangeText={setPrazoMeses}
              keyboardType="numeric"
              placeholder="12"
            />
          </View>
        </View>
        
        {/* Produtos financeiros a comparar */}
        <View style={styles.produtosContainer}>
          <View style={styles.sectionTitleRow}>
            <Text style={styles.sectionTitle}>Produtos para Comparação</Text>
            {investimentos.length < 3 && (
              <TouchableOpacity 
                style={styles.addButton}
                onPress={adicionarInvestimento}
              >
                <FontAwesome name="plus-circle" size={22} color="#2E7D32" />
              </TouchableOpacity>
            )}
          </View>
          
          {investimentos.map((investimento, index) => (
            <View key={index} style={styles.produtoCard}>
              <View style={styles.produtoHeader}>
                <View style={styles.produtoTipoContainer}>
                  <Text style={styles.produtoTipoLabel}>Tipo:</Text>
                  <View style={styles.pickerContainer}>
                    <TouchableOpacity 
                      style={[
                        styles.pickerButton,
                        investimento.tipo === 'CDB' && styles.pickerButtonActive
                      ]}
                      onPress={() => atualizarInvestimento(index, 'tipo', 'CDB')}
                    >
                      <Text style={[
                        styles.pickerButtonText,
                        investimento.tipo === 'CDB' && styles.pickerButtonTextActive
                      ]}>CDB</Text>
                    </TouchableOpacity>
                    
                    <TouchableOpacity 
                      style={[
                        styles.pickerButton,
                        investimento.tipo === 'LCI/LCA' && styles.pickerButtonActive
                      ]}
                      onPress={() => atualizarInvestimento(index, 'tipo', 'LCI/LCA')}
                    >
                      <Text style={[
                        styles.pickerButtonText,
                        investimento.tipo === 'LCI/LCA' && styles.pickerButtonTextActive
                      ]}>LCI/LCA</Text>
                    </TouchableOpacity>
                    
                    <TouchableOpacity 
                      style={[
                        styles.pickerButton,
                        investimento.tipo === 'Tesouro Direto' && styles.pickerButtonActive
                      ]}
                      onPress={() => atualizarInvestimento(index, 'tipo', 'Tesouro Direto')}
                    >
                      <Text style={[
                        styles.pickerButtonText,
                        investimento.tipo === 'Tesouro Direto' && styles.pickerButtonTextActive
                      ]}>Tesouro</Text>
                    </TouchableOpacity>
                    
                    <TouchableOpacity 
                      style={[
                        styles.pickerButton,
                        investimento.tipo === 'Poupança' && styles.pickerButtonActive
                      ]}
                      onPress={() => atualizarInvestimento(index, 'tipo', 'Poupança')}
                    >
                      <Text style={[
                        styles.pickerButtonText,
                        investimento.tipo === 'Poupança' && styles.pickerButtonTextActive
                      ]}>Poupança</Text>
                    </TouchableOpacity>
                  </View>
                </View>
                
                {investimentos.length > 2 && (
                  <TouchableOpacity 
                    style={styles.removeButton}
                    onPress={() => removerInvestimento(index)}
                  >
                    <FontAwesome name="times-circle" size={20} color="#FF5252" />
                  </TouchableOpacity>
                )}
              </View>
              
              <View style={styles.produtoBody}>
                <View style={styles.rentabilidadeContainer}>
                  <View style={styles.inputGroupSmall}>
                    <Text style={styles.inputLabelSmall}>Rentabilidade</Text>
                    <TextInput
                      style={styles.inputSmall}
                      value={investimento.rentabilidade.toString()}
                      onChangeText={(value) => atualizarInvestimento(
                        index, 
                        'rentabilidade', 
                        parseFloat(value) || 0
                      )}
                      keyboardType="numeric"
                    />
                  </View>
                  
                  <View style={styles.pickerSmallContainer}>
                    <TouchableOpacity 
                      style={[
                        styles.pickerSmallButton,
                        investimento.rentabilidadeTipo === 'cdi' && styles.pickerButtonActive
                      ]}
                      onPress={() => atualizarInvestimento(index, 'rentabilidadeTipo', 'cdi')}
                    >
                      <Text style={[
                        styles.pickerSmallButtonText,
                        investimento.rentabilidadeTipo === 'cdi' && styles.pickerButtonTextActive
                      ]}>% CDI</Text>
                    </TouchableOpacity>
                    
                    <TouchableOpacity 
                      style={[
                        styles.pickerSmallButton,
                        investimento.rentabilidadeTipo === 'prefixado' && styles.pickerButtonActive
                      ]}
                      onPress={() => atualizarInvestimento(index, 'rentabilidadeTipo', 'prefixado')}
                    >
                      <Text style={[
                        styles.pickerSmallButtonText,
                        investimento.rentabilidadeTipo === 'prefixado' && styles.pickerButtonTextActive
                      ]}>% a.a.</Text>
                    </TouchableOpacity>
                    
                    <TouchableOpacity 
                      style={[
                        styles.pickerSmallButton,
                        investimento.rentabilidadeTipo === 'ipca' && styles.pickerButtonActive
                      ]}
                      onPress={() => atualizarInvestimento(index, 'rentabilidadeTipo', 'ipca')}
                    >
                      <Text style={[
                        styles.pickerSmallButtonText,
                        investimento.rentabilidadeTipo === 'ipca' && styles.pickerButtonTextActive
                      ]}>IPCA+</Text>
                    </TouchableOpacity>
                  </View>
                </View>
                
                <View style={styles.switchRow}>
                  <Text style={styles.switchLabel}>Liquidez diária</Text>
                  <Switch
                    value={investimento.liquidez}
                    onValueChange={(value) => atualizarInvestimento(index, 'liquidez', value)}
                    trackColor={{ false: '#CCCCCC', true: '#A5D6A7' }}
                    thumbColor={investimento.liquidez ? '#2E7D32' : '#f4f3f4'}
                  />
                </View>
                
                <View style={styles.switchRow}>
                  <Text style={styles.switchLabel}>Isento de IR</Text>
                  <Switch
                    value={investimento.isento}
                    onValueChange={(value) => atualizarInvestimento(index, 'isento', value)}
                    trackColor={{ false: '#CCCCCC', true: '#A5D6A7' }}
                    thumbColor={investimento.isento ? '#2E7D32' : '#f4f3f4'}
                  />
                </View>
                
                <View style={styles.switchRow}>
                  <Text style={styles.switchLabel}>Garantia FGC</Text>
                  <Switch
                    value={investimento.garantiaFGC}
                    onValueChange={(value) => atualizarInvestimento(index, 'garantiaFGC', value)}
                    trackColor={{ false: '#CCCCCC', true: '#A5D6A7' }}
                    thumbColor={investimento.garantiaFGC ? '#2E7D32' : '#f4f3f4'}
                  />
                </View>
              </View>
              
              <View style={[styles.produtoResultado, { borderColor: getCorIndicativa(index) }]}>
                <Text style={styles.resultadoTitulo}>
                  Rendimento Líquido Estimado
                </Text>
                <Text style={[styles.resultadoValor, { color: getCorIndicativa(index) }]}>
                  {formatarDinheiro(calcularRendimentoLiquido(investimento))}
                </Text>
                <View style={styles.resultadoDetalhes}>
                  <Text style={styles.resultadoDetalheTexto}>
                    Rendimento: {calcularPorcentagemRendimento(calcularRendimentoLiquido(investimento))}
                  </Text>
                  {!investimento.isento && (
                    <Text style={styles.resultadoDetalheTexto}>
                      IR: {(parseInt(prazoMeses) <= 6 ? '22,5%' : 
                            parseInt(prazoMeses) <= 12 ? '20%' : 
                            parseInt(prazoMeses) <= 24 ? '17,5%' : '15%')}
                    </Text>
                  )}
                </View>
              </View>
            </View>
          ))}
        </View>
        
        <View style={styles.observacoesContainer}>
          <Text style={styles.observacoesTitulo}>Observações Importantes</Text>
          
          <View style={styles.observacaoItem}>
            <FontAwesome name="info-circle" size={16} color="#2E7D32" style={{ marginRight: 8 }} />
            <Text style={styles.observacaoTexto}>
              Simulação para fins educacionais. Rendimentos reais podem variar.
            </Text>
          </View>
          
          <View style={styles.observacaoItem}>
            <FontAwesome name="info-circle" size={16} color="#2E7D32" style={{ marginRight: 8 }} />
            <Text style={styles.observacaoTexto}>
              O FGC garante até R$ 250 mil por CPF e instituição financeira.
            </Text>
          </View>
          
          <View style={styles.observacaoItem}>
            <FontAwesome name="info-circle" size={16} color="#2E7D32" style={{ marginRight: 8 }} />
            <Text style={styles.observacaoTexto}>
              Consulte a "Trindade Impossível" dos investimentos: segurança, liquidez e rentabilidade - escolha apenas dois.
            </Text>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  introContainer: {
    backgroundColor: '#2E7D32',
    padding: 20,
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 15,
  },
  introTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 10,
  },
  introText: {
    fontSize: 14,
    color: 'white',
    lineHeight: 20,
  },
  parametrosContainer: {
    backgroundColor: 'white',
    margin: 15,
    padding: 15,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  sectionTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  addButton: {
    padding: 5,
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
  produtosContainer: {
    margin: 15,
    marginTop: 0,
  },
  produtoCard: {
    backgroundColor: 'white',
    borderRadius: 10,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    overflow: 'hidden',
  },
  produtoHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#EEE',
    alignItems: 'center',
  },
  produtoTipoContainer: {
    flex: 1,
  },
  produtoTipoLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  pickerContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  pickerButton: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: '#DDD',
    marginRight: 5,
    marginBottom: 5,
    borderRadius: 4,
  },
  pickerButtonActive: {
    backgroundColor: '#2E7D32',
    borderColor: '#2E7D32',
  },
  pickerButtonText: {
    fontSize: 12,
    color: '#333',
  },
  pickerButtonTextActive: {
    color: 'white',
  },
  removeButton: {
    padding: 5,
  },
  produtoBody: {
    padding: 15,
  },
  rentabilidadeContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginBottom: 15,
  },
  inputGroupSmall: {
    flex: 1,
    marginRight: 10,
  },
  inputLabelSmall: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  inputSmall: {
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 5,
    padding: 8,
    fontSize: 14,
  },
  pickerSmallContainer: {
    flexDirection: 'row',
  },
  pickerSmallButton: {
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: '#DDD',
    marginRight: 5,
    borderRadius: 4,
  },
  pickerSmallButtonText: {
    fontSize: 12,
    color: '#333',
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  switchLabel: {
    fontSize: 14,
    color: '#333',
  },
  produtoResultado: {
    backgroundColor: '#F9F9F9',
    padding: 15,
    borderTopWidth: 1,
    borderTopColor: '#EEE',
    borderLeftWidth: 4,
  },
  resultadoTitulo: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  resultadoValor: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  resultadoDetalhes: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  resultadoDetalheTexto: {
    fontSize: 12,
    color: '#666',
    marginRight: 10,
  },
  observacoesContainer: {
    backgroundColor: '#E8F5E9',
    margin: 15,
    padding: 15,
    borderRadius: 10,
    marginBottom: 30,
  },
  observacoesTitulo: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  observacaoItem: {
    flexDirection: 'row',
    marginBottom: 10,
    alignItems: 'flex-start',
  },
  observacaoTexto: {
    flex: 1,
    fontSize: 14,
    color: '#333',
    lineHeight: 20,
  },
});
