import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  ScrollView, 
  TouchableOpacity, 
  TextInput,
  Modal,
  FlatList,
  Alert,
  Dimensions
} from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { PieChart } from 'react-native-chart-kit';

/**
 * Interface para representar um tipo de ativo da carteira
 */
interface TipoAtivo {
  id: string;
  nome: string;
  perfil: 'Conservador' | 'Moderado' | 'Arrojado';
  cor: string;
  descricao: string;
  recomendado: {
    conservador: [number, number]; // [min%, max%]
    moderado: [number, number];
    arrojado: [number, number];
  };
  exemplos: string[];
}

/**
 * Interface para representar uma alocação na carteira do usuário
 */
interface Alocacao {
  id: string;
  tipoAtivoId: string;
  percentual: number;
  nome: string;
}

/**
 * Tela do Montador de Carteira
 * Permite que o usuário monte uma carteira de investimentos diversificada
 * baseada em seu perfil de investidor e objetivos financeiros
 */
export default function MontadorCarteiraScreen() {
  // Estado para controlar o valor total da carteira (opcional para o usuário)
  const [valorTotal, setValorTotal] = useState('');
  
  // Estado para controlar o perfil de investidor selecionado
  const [perfilSelecionado, setPerfilSelecionado] = useState<'Conservador' | 'Moderado' | 'Arrojado'>('Moderado');
  
  // Estado para controlar as alocações da carteira
  const [alocacoes, setAlocacoes] = useState<Alocacao[]>([]);
  
  // Estado para controlar a edição de uma alocação
  const [alocacaoEditando, setAlocacaoEditando] = useState<Alocacao | null>(null);
  
  // Estados para modais
  const [tipoAtivoSelecionado, setTipoAtivoSelecionado] = useState<TipoAtivo | null>(null);
  const [modalTipoAtivoVisible, setModalTipoAtivoVisible] = useState(false);
  const [modalEditarAlocacaoVisible, setModalEditarAlocacaoVisible] = useState(false);
  
  // Estado para o nome da alocação ao editar/adicionar
  const [nomeAlocacao, setNomeAlocacao] = useState('');
  
  // Estado para o percentual da alocação ao editar/adicionar
  const [percentualAlocacao, setPercentualAlocacao] = useState('');
  
  // Tipos de ativos disponíveis para compor a carteira
  const tiposAtivos: TipoAtivo[] = [
    {
      id: '1',
      nome: 'Renda Fixa Pós-Fixada',
      perfil: 'Conservador',
      cor: '#4CAF50', // Verde
      descricao: 'Títulos com rentabilidade atrelada a indexadores como CDI ou Selic. Ideal para reserva de emergência e objetivos de curto prazo.',
      recomendado: {
        conservador: [50, 80],
        moderado: [30, 50],
        arrojado: [10, 30]
      },
      exemplos: ['Tesouro Selic', 'CDBs pós-fixados', 'LCI/LCA pós-fixadas', 'Fundos DI']
    },
    {
      id: '2',
      nome: 'Renda Fixa Prefixada',
      perfil: 'Conservador',
      cor: '#8BC34A', // Verde claro
      descricao: 'Títulos com taxa de juros definida no momento da aplicação. Interessante em cenários de queda de juros futura.',
      recomendado: {
        conservador: [0, 20],
        moderado: [5, 20],
        arrojado: [0, 15]
      },
      exemplos: ['Tesouro Prefixado', 'CDBs prefixados', 'LCI/LCA prefixadas']
    },
    {
      id: '3',
      nome: 'Renda Fixa Inflação',
      perfil: 'Moderado',
      cor: '#CDDC39', // Verde-amarelado
      descricao: 'Títulos atrelados à inflação mais um juro real. Excelente para objetivos de médio e longo prazo.',
      recomendado: {
        conservador: [0, 30],
        moderado: [10, 30],
        arrojado: [5, 20]
      },
      exemplos: ['Tesouro IPCA+', 'CDBs IPCA+', 'Debêntures IPCA+']
    },
    {
      id: '4',
      nome: 'Fundos Multimercado',
      perfil: 'Moderado',
      cor: '#FFC107', // Âmbar
      descricao: 'Fundos que investem em diferentes mercados (renda fixa, ações, câmbio). Buscam retorno acima do CDI com volatilidade controlada.',
      recomendado: {
        conservador: [0, 15],
        moderado: [10, 25],
        arrojado: [10, 30]
      },
      exemplos: ['Multimercados Macro', 'Multimercados Long & Short', 'Multimercados Quantitativos']
    },
    {
      id: '5',
      nome: 'Fundos Imobiliários',
      perfil: 'Moderado',
      cor: '#FF9800', // Laranja
      descricao: 'Fundos que investem em imóveis ou papéis relacionados ao setor imobiliário. Geram renda mensal isenta de IR para pessoa física.',
      recomendado: {
        conservador: [0, 10],
        moderado: [5, 15],
        arrojado: [5, 20]
      },
      exemplos: ['FIIs de Tijolo (shoppings, escritórios)', 'FIIs de Papel (CRIs)', 'FIIs de Fundos']
    },
    {
      id: '6',
      nome: 'Ações Nacionais',
      perfil: 'Arrojado',
      cor: '#F44336', // Vermelho
      descricao: 'Participação em empresas listadas na B3. Maior potencial de retorno a longo prazo, com maior volatilidade.',
      recomendado: {
        conservador: [0, 10],
        moderado: [10, 25],
        arrojado: [20, 50]
      },
      exemplos: ['Ações individuais', 'Fundos de ações', 'ETFs de índices']
    },
    {
      id: '7',
      nome: 'Ações Internacionais',
      perfil: 'Arrojado',
      cor: '#E91E63', // Rosa
      descricao: 'Exposição a empresas listadas em bolsas internacionais. Oferece diversificação geográfica e proteção cambial.',
      recomendado: {
        conservador: [0, 5],
        moderado: [0, 15],
        arrojado: [10, 30]
      },
      exemplos: ['BDRs', 'ETFs internacionais', 'Fundos de ações internacionais']
    },
  ];
  
  // Efeito para inicializar a carteira com alocações padrão baseadas no perfil
  useEffect(() => {
    gerarCarteiraPadrao();
  }, [perfilSelecionado]);
  
  // Função para gerar uma carteira padrão baseada no perfil selecionado
  const gerarCarteiraPadrao = () => {
    // Limpa as alocações existentes
    setAlocacoes([]);
    
    // Define alocações padrão de acordo com o perfil
    const novasAlocacoes: Alocacao[] = [];
    
    if (perfilSelecionado === 'Conservador') {
      novasAlocacoes.push({
        id: Date.now().toString() + '1',
        tipoAtivoId: '1', // Renda Fixa Pós-Fixada
        percentual: 60,
        nome: 'Tesouro Selic'
      });
      novasAlocacoes.push({
        id: Date.now().toString() + '2',
        tipoAtivoId: '2', // Renda Fixa Prefixada
        percentual: 15,
        nome: 'CDB Prefixado'
      });
      novasAlocacoes.push({
        id: Date.now().toString() + '3',
        tipoAtivoId: '3', // Renda Fixa Inflação
        percentual: 15,
        nome: 'Tesouro IPCA+'
      });
      novasAlocacoes.push({
        id: Date.now().toString() + '4',
        tipoAtivoId: '4', // Fundos Multimercado
        percentual: 10,
        nome: 'Fundo Multimercado'
      });
    } 
    else if (perfilSelecionado === 'Moderado') {
      novasAlocacoes.push({
        id: Date.now().toString() + '1',
        tipoAtivoId: '1', // Renda Fixa Pós-Fixada
        percentual: 35,
        nome: 'CDBs e LCIs'
      });
      novasAlocacoes.push({
        id: Date.now().toString() + '2',
        tipoAtivoId: '3', // Renda Fixa Inflação
        percentual: 20,
        nome: 'Tesouro IPCA+'
      });
      novasAlocacoes.push({
        id: Date.now().toString() + '3',
        tipoAtivoId: '4', // Fundos Multimercado
        percentual: 20,
        nome: 'Fundos Multimercado'
      });
      novasAlocacoes.push({
        id: Date.now().toString() + '4',
        tipoAtivoId: '5', // Fundos Imobiliários
        percentual: 10,
        nome: 'FIIs de Escritórios'
      });
      novasAlocacoes.push({
        id: Date.now().toString() + '5',
        tipoAtivoId: '6', // Ações Nacionais
        percentual: 15,
        nome: 'ETF do Ibovespa'
      });
    }
    else if (perfilSelecionado === 'Arrojado') {
      novasAlocacoes.push({
        id: Date.now().toString() + '1',
        tipoAtivoId: '1', // Renda Fixa Pós-Fixada
        percentual: 20,
        nome: 'Reserva de Emergência'
      });
      novasAlocacoes.push({
        id: Date.now().toString() + '2',
        tipoAtivoId: '4', // Fundos Multimercado
        percentual: 15,
        nome: 'Fundos Multimercado'
      });
      novasAlocacoes.push({
        id: Date.now().toString() + '3',
        tipoAtivoId: '5', // Fundos Imobiliários
        percentual: 15,
        nome: 'FIIs Diversos'
      });
      novasAlocacoes.push({
        id: Date.now().toString() + '4',
        tipoAtivoId: '6', // Ações Nacionais
        percentual: 35,
        nome: 'Ações Nacionais'
      });
      novasAlocacoes.push({
        id: Date.now().toString() + '5',
        tipoAtivoId: '7', // Ações Internacionais
        percentual: 15,
        nome: 'BDRs'
      });
    }
    
    setAlocacoes(novasAlocacoes);
  };
  
  // Função para adicionar uma nova alocação à carteira
  const adicionarAlocacao = (tipoAtivoId: string) => {
    // Verifica se o percentual é um número válido
    const percentual = parseFloat(percentualAlocacao);
    if (isNaN(percentual) || percentual <= 0 || percentual > 100) {
      Alert.alert('Erro', 'Por favor, insira um percentual válido entre 1 e 100.');
      return;
    }
    
    // Verifica se o nome da alocação foi preenchido
    if (!nomeAlocacao) {
      Alert.alert('Erro', 'Por favor, dê um nome para esta alocação.');
      return;
    }
    
    // Verifica se o total da carteira não excede 100%
    const totalAtual = alocacoes.reduce((soma, alocacao) => soma + alocacao.percentual, 0);
    if (totalAtual + percentual > 100) {
      Alert.alert('Erro', `O total da carteira não pode exceder 100%. Restante disponível: ${(100 - totalAtual).toFixed(1)}%`);
      return;
    }
    
    // Adiciona a nova alocação
    const novaAlocacao: Alocacao = {
      id: Date.now().toString(),
      tipoAtivoId,
      percentual,
      nome: nomeAlocacao
    };
    
    setAlocacoes([...alocacoes, novaAlocacao]);
    setModalTipoAtivoVisible(false);
    setModalEditarAlocacaoVisible(false);
    setNomeAlocacao('');
    setPercentualAlocacao('');
  };
  
  // Função para atualizar uma alocação existente
  const atualizarAlocacao = () => {
    if (!alocacaoEditando) return;
    
    // Verifica se o percentual é um número válido
    const percentual = parseFloat(percentualAlocacao);
    if (isNaN(percentual) || percentual <= 0 || percentual > 100) {
      Alert.alert('Erro', 'Por favor, insira um percentual válido entre 1 e 100.');
      return;
    }
    
    // Verifica se o nome da alocação foi preenchido
    if (!nomeAlocacao) {
      Alert.alert('Erro', 'Por favor, dê um nome para esta alocação.');
      return;
    }
    
    // Verifica se o total da carteira não excede 100%
    const totalAtual = alocacoes.reduce((soma, alocacao) => {
      if (alocacao.id === alocacaoEditando.id) return soma; // Exclui a alocação atual do cálculo
      return soma + alocacao.percentual;
    }, 0);
    
    if (totalAtual + percentual > 100) {
      Alert.alert('Erro', `O total da carteira não pode exceder 100%. Restante disponível: ${(100 - totalAtual).toFixed(1)}%`);
      return;
    }
    
    // Atualiza a alocação
    const novasAlocacoes = alocacoes.map(alocacao => {
      if (alocacao.id === alocacaoEditando.id) {
        return {
          ...alocacao,
          percentual,
          nome: nomeAlocacao
        };
      }
      return alocacao;
    });
    
    setAlocacoes(novasAlocacoes);
    setModalEditarAlocacaoVisible(false);
    setAlocacaoEditando(null);
    setNomeAlocacao('');
    setPercentualAlocacao('');
  };
  
  // Função para remover uma alocação da carteira
  const removerAlocacao = (id: string) => {
    setAlocacoes(alocacoes.filter(alocacao => alocacao.id !== id));
    setModalEditarAlocacaoVisible(false);
    setAlocacaoEditando(null);
  };
  
  // Função para abrir o modal de edição de uma alocação existente
  const editarAlocacao = (alocacao: Alocacao) => {
    setAlocacaoEditando(alocacao);
    setNomeAlocacao(alocacao.nome);
    setPercentualAlocacao(alocacao.percentual.toString());
    setModalEditarAlocacaoVisible(true);
  };
  
  // Função para abrir o modal de seleção de tipo de ativo
  const abrirModalTipoAtivo = (tipoAtivo: TipoAtivo) => {
    setTipoAtivoSelecionado(tipoAtivo);
    setNomeAlocacao('');
    setPercentualAlocacao('');
    setModalTipoAtivoVisible(true);
  };
  
  // Formatar valores monetários
  const formatarDinheiro = (valor: number) => {
    return 'R$ ' + valor.toFixed(2).replace('.', ',').replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  };
  
  // Obter cor de um tipo de ativo pelo ID
  const getCorAtivo = (id: string): string => {
    const tipo = tiposAtivos.find(t => t.id === id);
    return tipo ? tipo.cor : '#CCCCCC';
  };
  
  // Obter nome de um tipo de ativo pelo ID
  const getNomeAtivo = (id: string): string => {
    const tipo = tiposAtivos.find(t => t.id === id);
    return tipo ? tipo.nome : '';
  };
  
  // Verifica se o total da carteira está dentro do intervalo recomendado para o perfil
  const verificarAderenciaPerfil = (): {aderente: boolean, mensagem: string} => {
    // Calcula o percentual total por tipo de ativo
    const totaisPorTipo: {[key: string]: number} = {};
    
    tiposAtivos.forEach(tipo => {
      totaisPorTipo[tipo.id] = 0;
    });
    
    alocacoes.forEach(alocacao => {
      totaisPorTipo[alocacao.tipoAtivoId] += alocacao.percentual;
    });
    
    // Verifica se cada tipo está dentro do intervalo recomendado
    let tiposForaRecomendacao: {nome: string, atual: number, min: number, max: number}[] = [];
    
    tiposAtivos.forEach(tipo => {
      const percentualAtual = totaisPorTipo[tipo.id] || 0;
      const [min, max] = tipo.recomendado[perfilSelecionado.toLowerCase() as keyof typeof tipo.recomendado];
      
      // Se o tipo tiver alguma alocação ou tiver mínimo recomendado > 0
      if (percentualAtual > 0 || min > 0) {
        if (percentualAtual < min || percentualAtual > max) {
          tiposForaRecomendacao.push({
            nome: tipo.nome,
            atual: percentualAtual,
            min,
            max
          });
        }
      }
    });
    
    if (tiposForaRecomendacao.length === 0) {
      return {
        aderente: true,
        mensagem: `Sua carteira está bem alinhada ao perfil ${perfilSelecionado}.`
      };
    } else {
      const sugestoes = tiposForaRecomendacao.map(tipo => {
        if (tipo.atual < tipo.min) {
          return `${tipo.nome}: Aumente de ${tipo.atual}% para pelo menos ${tipo.min}%`;
        } else {
          return `${tipo.nome}: Reduza de ${tipo.atual}% para no máximo ${tipo.max}%`;
        }
      }).join('\n');
      
      return {
        aderente: false,
        mensagem: `Sua carteira tem alguns desvios do perfil ${perfilSelecionado}:\n${sugestoes}`
      };
    }
  };
  
  // Calcular o total da carteira
  const totalCarteira = alocacoes.reduce((soma, alocacao) => soma + alocacao.percentual, 0);
  
  // Preparar dados para o gráfico de pizza
  const dadosGrafico = alocacoes.map(alocacao => {
    return {
      name: alocacao.nome,
      percentage: alocacao.percentual,
      color: getCorAtivo(alocacao.tipoAtivoId),
      legendFontColor: '#333',
      legendFontSize: 12
    };
  });
  
  // Verificar aderência ao perfil
  const aderenciaPerfil = verificarAderenciaPerfil();

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Montador de Carteira</Text>
        <Text style={styles.headerSubtitle}>
          Monte sua carteira de investimentos de acordo com seu perfil
        </Text>
      </View>
      
      <View style={styles.introContainer}>
        <FontAwesome name="pie-chart" size={30} color="#2E7D32" style={styles.introIcon} />
        <Text style={styles.introText}>
          Uma carteira diversificada reduz riscos e ajusta sua estratégia aos seus objetivos. 
          Selecione seu perfil de investidor e distribua seus recursos entre diferentes classes de ativos.
        </Text>
      </View>
      
      <View style={styles.valorContainer}>
        <Text style={styles.sectionTitle}>Valor da Carteira (opcional)</Text>
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Valor total a investir (R$)</Text>
          <TextInput
            style={styles.input}
            value={valorTotal}
            onChangeText={setValorTotal}
            keyboardType="numeric"
            placeholder="Exemplo: 10000"
          />
        </View>
      </View>
      
      <View style={styles.perfilContainer}>
        <Text style={styles.sectionTitle}>Seu Perfil de Investidor</Text>
        <View style={styles.perfilOptions}>
          <TouchableOpacity 
            style={[
              styles.perfilButton,
              perfilSelecionado === 'Conservador' && styles.perfilButtonActive,
              { borderColor: '#1565C0' }
            ]}
            onPress={() => setPerfilSelecionado('Conservador')}
          >
            <FontAwesome 
              name="shield" 
              size={24} 
              color={perfilSelecionado === 'Conservador' ? '#1565C0' : '#999'} 
              style={styles.perfilIcon} 
            />
            <Text 
              style={[
                styles.perfilText,
                perfilSelecionado === 'Conservador' && styles.perfilTextActive,
                { color: perfilSelecionado === 'Conservador' ? '#1565C0' : '#999' }
              ]}
            >
              Conservador
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[
              styles.perfilButton,
              perfilSelecionado === 'Moderado' && styles.perfilButtonActive,
              { borderColor: '#7B1FA2' }
            ]}
            onPress={() => setPerfilSelecionado('Moderado')}
          >
            <FontAwesome 
              name="balance-scale" 
              size={24} 
              color={perfilSelecionado === 'Moderado' ? '#7B1FA2' : '#999'} 
              style={styles.perfilIcon} 
            />
            <Text 
              style={[
                styles.perfilText,
                perfilSelecionado === 'Moderado' && styles.perfilTextActive,
                { color: perfilSelecionado === 'Moderado' ? '#7B1FA2' : '#999' }
              ]}
            >
              Moderado
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[
              styles.perfilButton,
              perfilSelecionado === 'Arrojado' && styles.perfilButtonActive,
              { borderColor: '#D32F2F' }
            ]}
            onPress={() => setPerfilSelecionado('Arrojado')}
          >
            <FontAwesome 
              name="rocket" 
              size={24} 
              color={perfilSelecionado === 'Arrojado' ? '#D32F2F' : '#999'} 
              style={styles.perfilIcon} 
            />
            <Text 
              style={[
                styles.perfilText,
                perfilSelecionado === 'Arrojado' && styles.perfilTextActive,
                { color: perfilSelecionado === 'Arrojado' ? '#D32F2F' : '#999' }
              ]}
            >
              Arrojado
            </Text>
          </TouchableOpacity>
        </View>
      </View>
      
      <View style={styles.carteiraContainer}>
        <View style={styles.carteiraTitleRow}>
          <Text style={styles.sectionTitle}>Composição da Carteira</Text>
          <TouchableOpacity 
            style={styles.resetButton}
            onPress={gerarCarteiraPadrao}
          >
            <FontAwesome name="refresh" size={16} color="#2E7D32" />
            <Text style={styles.resetButtonText}>Reiniciar</Text>
          </TouchableOpacity>
        </View>
        
        {/* Gráfico de pizza */}
        {alocacoes.length > 0 && (
          <View style={styles.chartContainer}>
            <PieChart
              data={dadosGrafico}
              width={Dimensions.get('window').width - 50}
              height={220}
              chartConfig={{
                backgroundColor: '#FFFFFF',
                backgroundGradientFrom: '#FFFFFF',
                backgroundGradientTo: '#FFFFFF',
                color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
              }}
              accessor="percentage"
              backgroundColor="transparent"
              paddingLeft="10"
              absolute={false}
            />
          </View>
        )}
        
        {/* Lista de alocações */}
        <View style={styles.alocacoesContainer}>
          <View style={styles.alocacaoHeaderRow}>
            <Text style={styles.alocacaoHeaderNome}>Ativo</Text>
            <Text style={styles.alocacaoHeaderTipo}>Tipo</Text>
            <Text style={styles.alocacaoHeaderPercentual}>%</Text>
            <Text style={styles.alocacaoHeaderValor}>Valor</Text>
          </View>
          
          {alocacoes.map((alocacao) => (
            <TouchableOpacity 
              key={alocacao.id}
              style={styles.alocacaoItem}
              onPress={() => editarAlocacao(alocacao)}
            >
              <View style={[styles.alocacaoColor, { backgroundColor: getCorAtivo(alocacao.tipoAtivoId) }]} />
              <Text style={styles.alocacaoNome} numberOfLines={1}>{alocacao.nome}</Text>
              <Text style={styles.alocacaoTipo} numberOfLines={1}>{getNomeAtivo(alocacao.tipoAtivoId)}</Text>
              <Text style={styles.alocacaoPercentual}>{alocacao.percentual}%</Text>
              <Text style={styles.alocacaoValor}>
                {valorTotal ? formatarDinheiro(parseFloat(valorTotal) * alocacao.percentual / 100) : '-'}
              </Text>
            </TouchableOpacity>
          ))}
          
          {/* Total */}
          <View style={styles.alocacaoTotalRow}>
            <Text style={styles.alocacaoTotalLabel}>Total</Text>
            <Text style={[
              styles.alocacaoTotalPercentual,
              totalCarteira === 100 ? styles.alocacaoTotalPercentualOk : styles.alocacaoTotalPercentualWarning
            ]}>
              {totalCarteira}%
            </Text>
            <Text style={styles.alocacaoTotalValor}>
              {valorTotal ? formatarDinheiro(parseFloat(valorTotal)) : '-'}
            </Text>
          </View>
        </View>
        
        {/* Botão para adicionar nova alocação */}
        {totalCarteira < 100 && (
          <View style={styles.addAlocacaoContainer}>
            <Text style={styles.addAlocacaoTitle}>Adicionar Ativo à Carteira</Text>
            <View style={styles.tiposAtivosGrid}>
              {tiposAtivos.map((tipo) => (
                <TouchableOpacity 
                  key={tipo.id}
                  style={[styles.tipoAtivoButton, { borderColor: tipo.cor }]}
                  onPress={() => abrirModalTipoAtivo(tipo)}
                >
                  <View style={[styles.tipoAtivoColor, { backgroundColor: tipo.cor }]} />
                  <Text style={styles.tipoAtivoName}>{tipo.nome}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}
        
        {/* Avaliação da aderência ao perfil */}
        <View style={[
          styles.aderenciaContainer,
          aderenciaPerfil.aderente ? styles.aderenciaOk : styles.aderenciaWarning
        ]}>
          <View style={styles.aderenciaHeader}>
            <FontAwesome 
              name={aderenciaPerfil.aderente ? "check-circle" : "exclamation-triangle"} 
              size={22} 
              color={aderenciaPerfil.aderente ? "#2E7D32" : "#F57F17"} 
              style={styles.aderenciaIcon} 
            />
            <Text style={[
              styles.aderenciaTitle,
              { color: aderenciaPerfil.aderente ? "#2E7D32" : "#F57F17" }
            ]}>
              {aderenciaPerfil.aderente ? "Carteira adequada ao perfil" : "Ajustes recomendados"}
            </Text>
          </View>
          <Text style={styles.aderenciaText}>{aderenciaPerfil.mensagem}</Text>
        </View>
      </View>
      
      <View style={styles.tipsContainer}>
        <Text style={styles.tipsTitle}>Dicas de Diversificação</Text>
        
        <View style={styles.tipItem}>
          <FontAwesome name="lightbulb-o" size={20} color="#2E7D32" style={styles.tipIcon} />
          <Text style={styles.tipText}>
            Diversifique entre diferentes tipos de ativos para reduzir o risco geral da carteira.
          </Text>
        </View>
        
        <View style={styles.tipItem}>
          <FontAwesome name="lightbulb-o" size={20} color="#2E7D32" style={styles.tipIcon} />
          <Text style={styles.tipText}>
            Mantenha parte da carteira em ativos de maior liquidez para necessidades inesperadas.
          </Text>
        </View>
        
        <View style={styles.tipItem}>
          <FontAwesome name="lightbulb-o" size={20} color="#2E7D32" style={styles.tipIcon} />
          <Text style={styles.tipText}>
            Reavalie sua carteira periodicamente (a cada 3-6 meses) para mantê-la alinhada ao seu perfil.
          </Text>
        </View>
        
        <View style={styles.tipItem}>
          <FontAwesome name="lightbulb-o" size={20} color="#2E7D32" style={styles.tipIcon} />
          <Text style={styles.tipText}>
            Lembre-se da "Trindade Impossível": segurança, liquidez e rentabilidade - escolha apenas dois.
          </Text>
        </View>
      </View>
      
      {/* Modal para adicionar/editar alocação */}
      <Modal
        visible={modalTipoAtivoVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalTipoAtivoVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            {tipoAtivoSelecionado && (
              <>
                <View style={styles.modalHeader}>
                  <Text style={styles.modalTitle}>{tipoAtivoSelecionado.nome}</Text>
                  <TouchableOpacity 
                    style={styles.closeButton}
                    onPress={() => setModalTipoAtivoVisible(false)}
                  >
                    <FontAwesome name="times" size={20} color="#333" />
                  </TouchableOpacity>
                </View>
                
                <View style={styles.modalBody}>
                  <Text style={styles.modalDescription}>{tipoAtivoSelecionado.descricao}</Text>
                  
                  <Text style={styles.modalSubtitle}>Exemplos:</Text>
                  <View style={styles.exemplosList}>
                    {tipoAtivoSelecionado.exemplos.map((exemplo, index) => (
                      <View key={index} style={styles.exemploItem}>
                        <FontAwesome name="circle" size={8} color={tipoAtivoSelecionado.cor} style={styles.exemploIcon} />
                        <Text style={styles.exemploText}>{exemplo}</Text>
                      </View>
                    ))}
                  </View>
                  
                  <Text style={styles.modalSubtitle}>Recomendação para seu perfil:</Text>
                  <View style={styles.recomendacaoContainer}>
                    <Text style={styles.recomendacaoText}>
                      {tipoAtivoSelecionado.recomendado[perfilSelecionado.toLowerCase() as keyof typeof tipoAtivoSelecionado.recomendado][0]}% - {tipoAtivoSelecionado.recomendado[perfilSelecionado.toLowerCase() as keyof typeof tipoAtivoSelecionado.recomendado][1]}% da carteira
                    </Text>
                  </View>
                  
                  <View style={styles.inputGroup}>
                    <Text style={styles.inputLabel}>Nome do investimento</Text>
                    <TextInput
                      style={styles.input}
                      value={nomeAlocacao}
                      onChangeText={setNomeAlocacao}
                      placeholder="Ex: Tesouro Selic 2029"
                    />
                  </View>
                  
                  <View style={styles.inputGroup}>
                    <Text style={styles.inputLabel}>Percentual da carteira (%)</Text>
                    <TextInput
                      style={styles.input}
                      value={percentualAlocacao}
                      onChangeText={setPercentualAlocacao}
                      keyboardType="numeric"
                      placeholder="Ex: 25"
                    />
                  </View>
                  
                  <TouchableOpacity 
                    style={[styles.addButton, { backgroundColor: tipoAtivoSelecionado.cor }]}
                    onPress={() => adicionarAlocacao(tipoAtivoSelecionado.id)}
                  >
                    <Text style={styles.addButtonText}>Adicionar à Carteira</Text>
                  </TouchableOpacity>
                </View>
              </>
            )}
          </View>
        </View>
      </Modal>
      
      {/* Modal para editar alocação existente */}
      <Modal
        visible={modalEditarAlocacaoVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalEditarAlocacaoVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            {alocacaoEditando && (
              <>
                <View style={styles.modalHeader}>
                  <Text style={styles.modalTitle}>Editar Alocação</Text>
                  <TouchableOpacity 
                    style={styles.closeButton}
                    onPress={() => setModalEditarAlocacaoVisible(false)}
                  >
                    <FontAwesome name="times" size={20} color="#333" />
                  </TouchableOpacity>
                </View>
                
                <View style={styles.modalBody}>
                  <Text style={styles.modalSubtitle}>Tipo de Ativo:</Text>
                  <Text style={styles.modalTipoAtivo}>{getNomeAtivo(alocacaoEditando.tipoAtivoId)}</Text>
                  
                  <View style={styles.inputGroup}>
                    <Text style={styles.inputLabel}>Nome do investimento</Text>
                    <TextInput
                      style={styles.input}
                      value={nomeAlocacao}
                      onChangeText={setNomeAlocacao}
                      placeholder="Ex: Tesouro Selic 2029"
                    />
                  </View>
                  
                  <View style={styles.inputGroup}>
                    <Text style={styles.inputLabel}>Percentual da carteira (%)</Text>
                    <TextInput
                      style={styles.input}
                      value={percentualAlocacao}
                      onChangeText={setPercentualAlocacao}
                      keyboardType="numeric"
                      placeholder="Ex: 25"
                    />
                  </View>
                  
                  <View style={styles.modalButtonsRow}>
                    <TouchableOpacity 
                      style={[styles.deleteButton]}
                      onPress={() => removerAlocacao(alocacaoEditando.id)}
                    >
                      <Text style={styles.deleteButtonText}>Remover</Text>
                    </TouchableOpacity>
                    
                    <TouchableOpacity 
                      style={[styles.updateButton]}
                      onPress={atualizarAlocacao}
                    >
                      <Text style={styles.updateButtonText}>Atualizar</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </>
            )}
          </View>
        </View>
      </Modal>
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
    backgroundColor: '#2E7D32',
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 5,
  },
  headerSubtitle: {
    fontSize: 16,
    color: 'white',
    opacity: 0.9,
  },
  introContainer: {
    backgroundColor: '#E8F5E9',
    borderRadius: 10,
    padding: 15,
    margin: 15,
    marginBottom: 10,
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
  valorContainer: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 15,
    margin: 15,
    marginBottom: 10,
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
  perfilContainer: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 15,
    margin: 15,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  perfilOptions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  perfilButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderWidth: 2,
    borderColor: '#DDD',
    borderRadius: 10,
    marginHorizontal: 5,
    backgroundColor: 'white',
  },
  perfilButtonActive: {
    backgroundColor: '#F5F5F5',
    borderWidth: 2,
  },
  perfilIcon: {
    marginBottom: 5,
  },
  perfilText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#999',
  },
  perfilTextActive: {
    color: '#333',
  },
  carteiraContainer: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 15,
    margin: 15,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  carteiraTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  resetButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    borderRadius: 5,
    backgroundColor: '#E8F5E9',
  },
  resetButtonText: {
    fontSize: 12,
    color: '#2E7D32',
    marginLeft: 5,
  },
  chartContainer: {
    alignItems: 'center',
    marginBottom: 15,
  },
  alocacoesContainer: {
    marginBottom: 15,
  },
  alocacaoHeaderRow: {
    flexDirection: 'row',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#EEE',
    backgroundColor: '#F5F5F5',
    borderRadius: 5,
    paddingHorizontal: 10,
  },
  alocacaoHeaderNome: {
    flex: 2,
    fontSize: 12,
    fontWeight: 'bold',
    color: '#666',
  },
  alocacaoHeaderTipo: {
    flex: 2,
    fontSize: 12,
    fontWeight: 'bold',
    color: '#666',
  },
  alocacaoHeaderPercentual: {
    flex: 1,
    fontSize: 12,
    fontWeight: 'bold',
    color: '#666',
    textAlign: 'center',
  },
  alocacaoHeaderValor: {
    flex: 2,
    fontSize: 12,
    fontWeight: 'bold',
    color: '#666',
    textAlign: 'right',
  },
  alocacaoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#EEE',
    paddingHorizontal: 10,
  },
  alocacaoColor: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 5,
  },
  alocacaoNome: {
    flex: 2,
    fontSize: 14,
    color: '#333',
  },
  alocacaoTipo: {
    flex: 2,
    fontSize: 12,
    color: '#666',
  },
  alocacaoPercentual: {
    flex: 1,
    fontSize: 14,
    color: '#333',
    textAlign: 'center',
  },
  alocacaoValor: {
    flex: 2,
    fontSize: 14,
    color: '#333',
    textAlign: 'right',
  },
  alocacaoTotalRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#DDD',
    marginTop: 10,
    paddingHorizontal: 10,
  },
  alocacaoTotalLabel: {
    flex: 4,
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  alocacaoTotalPercentual: {
    flex: 1,
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2E7D32',
    textAlign: 'center',
  },
  alocacaoTotalPercentualOk: {
    color: '#2E7D32',
  },
  alocacaoTotalPercentualWarning: {
    color: '#F57F17',
  },
  alocacaoTotalValor: {
    flex: 2,
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'right',
  },
  addAlocacaoContainer: {
    marginTop: 15,
    marginBottom: 10,
  },
  addAlocacaoTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  tiposAtivosGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  tipoAtivoButton: {
    width: '48%',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderRadius: 5,
    backgroundColor: 'white',
  },
  tipoAtivoColor: {
    width: 15,
    height: 15,
    borderRadius: 7.5,
    marginRight: 10,
  },
  tipoAtivoName: {
    fontSize: 12,
    color: '#333',
    flex: 1,
  },
  aderenciaContainer: {
    padding: 15,
    borderRadius: 5,
    marginTop: 10,
  },
  aderenciaOk: {
    backgroundColor: '#E8F5E9',
  },
  aderenciaWarning: {
    backgroundColor: '#FFF3E0',
  },
  aderenciaHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  aderenciaIcon: {
    marginRight: 10,
  },
  aderenciaTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  aderenciaText: {
    fontSize: 14,
    color: '#333',
    lineHeight: 20,
  },
  tipsContainer: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 15,
    margin: 15,
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
    backgroundColor: 'white',
    borderRadius: 10,
    width: '90%',
    maxHeight: '80%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#EEE',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
  },
  closeButton: {
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalBody: {
    padding: 15,
  },
  modalDescription: {
    fontSize: 14,
    color: '#333',
    lineHeight: 20,
    marginBottom: 15,
  },
  modalSubtitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  modalTipoAtivo: {
    fontSize: 14,
    color: '#333',
    marginBottom: 15,
  },
  exemplosList: {
    marginBottom: 15,
  },
  exemploItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  exemploIcon: {
    marginRight: 10,
  },
  exemploText: {
    fontSize: 14,
    color: '#333',
  },
  recomendacaoContainer: {
    backgroundColor: '#F5F5F5',
    padding: 10,
    borderRadius: 5,
    marginBottom: 15,
  },
  recomendacaoText: {
    fontSize: 14,
    color: '#333',
    fontWeight: 'bold',
  },
  addButton: {
    backgroundColor: '#2E7D32',
    padding: 12,
    borderRadius: 5,
    alignItems: 'center',
  },
  addButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  modalButtonsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  deleteButton: {
    backgroundColor: '#F44336',
    padding: 12,
    borderRadius: 5,
    alignItems: 'center',
    flex: 1,
    marginRight: 10,
  },
  deleteButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  updateButton: {
    backgroundColor: '#2E7D32',
    padding: 12,
    borderRadius: 5,
    alignItems: 'center',
    flex: 2,
  },
  updateButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
