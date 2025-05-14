import React, { useState } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  ScrollView, 
  TouchableOpacity,
  Image,
  Modal,
  SafeAreaView
} from 'react-native';
import { FontAwesome } from '@expo/vector-icons';

/**
 * Interface para representar uma pergunta do questionário
 */
interface Pergunta {
  id: number;
  texto: string;
  opcoes: {
    texto: string;
    pontos: number;
  }[];
}

/**
 * Resultado do perfil com base na pontuação
 */
interface PerfilResultado {
  tipo: 'Conservador' | 'Moderado' | 'Arrojado';
  descricao: string;
  alocacaoSugerida: string;
  icone: keyof typeof FontAwesome.glyphMap;
  cor: string;
}

/**
 * Tela de Perfil do aplicativo "Investindo com Sabedoria"
 * Permite que o usuário faça um questionário para identificar seu perfil de investidor
 */
export default function PerfilScreen() {
  // Estado para controlar o questionário
  const [iniciarQuestionario, setIniciarQuestionario] = useState(false);
  const [perguntaAtual, setPerguntaAtual] = useState(0);
  const [respostas, setRespostas] = useState<number[]>([]);
  const [mostrarResultado, setMostrarResultado] = useState(false);
  
  // Perguntas do questionário baseadas no conteúdo do eBook
  const perguntas: Pergunta[] = [
    {
      id: 1,
      texto: "Quanto tempo você pretende manter seus investimentos antes de precisar do dinheiro?",
      opcoes: [
        { texto: "Menos de 1 ano", pontos: 1 },
        { texto: "Entre 1 e 3 anos", pontos: 2 },
        { texto: "Entre 3 e 5 anos", pontos: 3 },
        { texto: "Mais de 5 anos", pontos: 4 }
      ]
    },
    {
      id: 2,
      texto: "Como você reage quando o mercado financeiro está em queda e seus investimentos perdem valor?",
      opcoes: [
        { texto: "Fico muito preocupado e penso em resgatar tudo", pontos: 1 },
        { texto: "Fico apreensivo, mas espero um pouco antes de tomar qualquer decisão", pontos: 2 },
        { texto: "Mantenho a calma, pois entendo que é parte do ciclo de investimentos", pontos: 3 },
        { texto: "Vejo como uma oportunidade para investir mais, aproveitando os preços baixos", pontos: 4 }
      ]
    },
    {
      id: 3,
      texto: "Qual opção melhor descreve seu objetivo principal ao investir?",
      opcoes: [
        { texto: "Preservar meu capital, aceitando rendimentos menores", pontos: 1 },
        { texto: "Obter rendimentos um pouco acima da inflação com baixo risco", pontos: 2 },
        { texto: "Crescimento do patrimônio a longo prazo, aceitando alguma volatilidade", pontos: 3 },
        { texto: "Maximizar retornos, mesmo que isso implique em riscos maiores", pontos: 4 }
      ]
    },
    {
      id: 4,
      texto: "Qual afirmação melhor representa sua experiência com investimentos?",
      opcoes: [
        { texto: "Nunca investi ou só tenho experiência com poupança", pontos: 1 },
        { texto: "Já investi em alguns produtos de renda fixa como CDBs e Tesouro Direto", pontos: 2 },
        { texto: "Tenho experiência com diversos tipos de investimentos, incluindo fundos", pontos: 3 },
        { texto: "Invisto há anos em vários produtos, incluindo ações e outros ativos de risco", pontos: 4 }
      ]
    },
    {
      id: 5,
      texto: "Você recebeu um bônus inesperado. Como preferiria investir esse valor?",
      opcoes: [
        { texto: "Em investimentos de baixíssimo risco, mesmo com retorno menor", pontos: 1 },
        { texto: "A maior parte em opções seguras e uma pequena parte em ativos de maior risco", pontos: 2 },
        { texto: "Dividiria igualmente entre investimentos seguros e mais arriscados", pontos: 3 },
        { texto: "A maior parte em investimentos de maior potencial de retorno, mesmo com mais risco", pontos: 4 }
      ]
    },
    {
      id: 6,
      texto: "Como você se sentiria se um de seus investimentos perdesse 15% do valor em um mês?",
      opcoes: [
        { texto: "Extremamente desconfortável, provavelmente resgataria tudo", pontos: 1 },
        { texto: "Preocupado, possivelmente resgataria parte do investimento", pontos: 2 },
        { texto: "Um pouco desconfortável, mas manteria o investimento", pontos: 3 },
        { texto: "Entenderia como parte da volatilidade normal e poderia até aproveitar para investir mais", pontos: 4 }
      ]
    },
    {
      id: 7,
      texto: "Qual frase melhor representa sua visão sobre investimentos?",
      opcoes: [
        { texto: "Prefiro segurança a rentabilidade", pontos: 1 },
        { texto: "Um pouco de risco é aceitável para melhorar o rendimento", pontos: 2 },
        { texto: "Estou disposto a assumir riscos calculados por melhores retornos", pontos: 3 },
        { texto: "Alto risco pode trazer alta rentabilidade, e estou confortável com isso", pontos: 4 }
      ]
    },
  ];
  
  // Responder a pergunta atual e avançar para a próxima
  const responderPergunta = (pontos: number) => {
    const novasRespostas = [...respostas, pontos];
    setRespostas(novasRespostas);
    
    // Se for a última pergunta, mostrar resultado
    if (perguntaAtual >= perguntas.length - 1) {
      setMostrarResultado(true);
    } else {
      // Avançar para próxima pergunta
      setPerguntaAtual(perguntaAtual + 1);
    }
  };
  
  // Recomeçar o questionário
  const recomecarQuestionario = () => {
    setRespostas([]);
    setPerguntaAtual(0);
    setMostrarResultado(false);
    setIniciarQuestionario(false);
  };
  
  // Calcular o perfil com base na pontuação
  const calcularPerfil = (): PerfilResultado => {
    const pontuacaoTotal = respostas.reduce((total, pontos) => total + pontos, 0);
    const mediaPontos = pontuacaoTotal / perguntas.length;
    
    if (mediaPontos <= 2) {
      return {
        tipo: 'Conservador',
        descricao: 'Você valoriza a segurança e a preservação do capital. Prefere investimentos estáveis e previsíveis, mesmo que isso signifique rendimentos menores. Sua prioridade é não perder dinheiro.',
        alocacaoSugerida: '80-100% em renda fixa de baixo risco (Tesouro Selic, CDBs de grandes bancos, etc.)\n10-20% em fundos multimercado de baixa volatilidade',
        icone: 'shield',
        cor: '#1565C0' // Azul (mais conservador)
      };
    } else if (mediaPontos <= 3) {
      return {
        tipo: 'Moderado',
        descricao: 'Você busca equilíbrio entre segurança e rentabilidade. Está disposto a assumir algum risco calculado para melhorar seus rendimentos, mas sem exposição excessiva a volatilidade.',
        alocacaoSugerida: '50-70% em renda fixa (mix de CDBs, LCI/LCA, Tesouro Direto)\n20-30% em fundos multimercado\n10-20% em renda variável (ações, FIIs)',
        icone: 'balance-scale',
        cor: '#7B1FA2' // Roxo (perfil intermediário)
      };
    } else {
      return {
        tipo: 'Arrojado',
        descricao: 'Você prioriza o crescimento do patrimônio a longo prazo e está confortável com a volatilidade do mercado. Entende que oscilações fazem parte do processo de investimento e vê quedas como oportunidades.',
        alocacaoSugerida: '20-40% em renda fixa (principalmente para reserva de emergência)\n20-30% em fundos multimercado\n40-60% em renda variável (ações, FIIs, ETFs)',
        icone: 'rocket',
        cor: '#D32F2F' // Vermelho (mais arrojado)
      };
    }
  };
  
  // Obter o perfil atual baseado nas respostas
  const perfilAtual = mostrarResultado ? calcularPerfil() : null;

  return (
    <ScrollView style={styles.container}>
      {!iniciarQuestionario ? (
        // Tela inicial antes de começar o questionário
        <View>
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Perfil do Investidor</Text>
            <Text style={styles.headerSubtitle}>
              Descubra qual é o seu perfil e receba recomendações personalizadas
            </Text>
          </View>
          
          <View style={styles.introContainer}>
            <FontAwesome name="user-circle" size={60} color="#2E7D32" style={styles.introIcon} />
            <Text style={styles.introTitle}>Você conhece seu perfil de investidor?</Text>
            <Text style={styles.introText}>
              Investir de acordo com seu perfil é essencial para manter uma estratégia consistente 
              e atingir seus objetivos financeiros. O questionário a seguir irá ajudá-lo a 
              identificar seu perfil com base na sua tolerância ao risco, horizonte de tempo 
              e objetivos.
            </Text>
          </View>
          
          <View style={styles.perfisContainer}>
            <Text style={styles.perfisTitle}>Os três perfis básicos</Text>
            
            <View style={styles.perfilCard}>
              <View style={[styles.perfilIconContainer, { backgroundColor: '#E3F2FD' }]}>
                <FontAwesome name="shield" size={24} color="#1565C0" />
              </View>
              <View style={styles.perfilTextContainer}>
                <Text style={styles.perfilTipo}>Conservador</Text>
                <Text style={styles.perfilDescricao}>
                  Prioriza segurança e preservação do capital, com baixa tolerância a riscos. Prefere investimentos 
                  estáveis mesmo com retornos menores.
                </Text>
              </View>
            </View>
            
            <View style={styles.perfilCard}>
              <View style={[styles.perfilIconContainer, { backgroundColor: '#F3E5F5' }]}>
                <FontAwesome name="balance-scale" size={24} color="#7B1FA2" />
              </View>
              <View style={styles.perfilTextContainer}>
                <Text style={styles.perfilTipo}>Moderado</Text>
                <Text style={styles.perfilDescricao}>
                  Busca equilíbrio entre segurança e rentabilidade. Aceita certa volatilidade 
                  para obter retornos mais atrativos.
                </Text>
              </View>
            </View>
            
            <View style={styles.perfilCard}>
              <View style={[styles.perfilIconContainer, { backgroundColor: '#FFEBEE' }]}>
                <FontAwesome name="rocket" size={24} color="#D32F2F" />
              </View>
              <View style={styles.perfilTextContainer}>
                <Text style={styles.perfilTipo}>Arrojado</Text>
                <Text style={styles.perfilDescricao}>
                  Foco em maximizar retornos a longo prazo. Alta tolerância a riscos e 
                  volatilidade, priorizando crescimento do patrimônio.
                </Text>
              </View>
            </View>
          </View>
          
          <TouchableOpacity 
            style={styles.startButton}
            onPress={() => setIniciarQuestionario(true)}
          >
            <Text style={styles.startButtonText}>Iniciar Questionário</Text>
          </TouchableOpacity>
          
          <View style={styles.tipsContainer}>
            <Text style={styles.tipsTitle}>Dicas importantes</Text>
            
            <View style={styles.tipItem}>
              <FontAwesome name="lightbulb-o" size={20} color="#2E7D32" style={styles.tipIcon} />
              <Text style={styles.tipText}>
                Responda com sinceridade - não há respostas "certas" ou "erradas".
              </Text>
            </View>
            
            <View style={styles.tipItem}>
              <FontAwesome name="lightbulb-o" size={20} color="#2E7D32" style={styles.tipIcon} />
              <Text style={styles.tipText}>
                Seu perfil pode mudar ao longo do tempo, conforme seus objetivos, conhecimento e 
                situação financeira evoluem.
              </Text>
            </View>
            
            <View style={styles.tipItem}>
              <FontAwesome name="lightbulb-o" size={20} color="#2E7D32" style={styles.tipIcon} />
              <Text style={styles.tipText}>
                Lembre-se da "trindade impossível": segurança, liquidez e rentabilidade - 
                escolha apenas dois.
              </Text>
            </View>
          </View>
        </View>
      ) : mostrarResultado ? (
        // Tela de resultado
        <View>
          <View style={[styles.resultHeader, { backgroundColor: perfilAtual?.cor }]}>
            <FontAwesome name={perfilAtual?.icone} size={60} color="white" style={styles.resultIcon} />
            <Text style={styles.resultTitle}>Seu perfil é</Text>
            <Text style={styles.resultPerfil}>{perfilAtual?.tipo}</Text>
          </View>
          
          <View style={styles.resultContainer}>
            <Text style={styles.resultSectionTitle}>Características do seu perfil</Text>
            <Text style={styles.resultDescription}>{perfilAtual?.descricao}</Text>
            
            <Text style={styles.resultSectionTitle}>Alocação sugerida</Text>
            <View style={styles.alocacaoContainer}>
              <Text style={styles.alocacaoText}>{perfilAtual?.alocacaoSugerida}</Text>
            </View>
            
            <Text style={styles.resultSectionTitle}>Produtos recomendados</Text>
            <View style={styles.produtosContainer}>
              {perfilAtual?.tipo === 'Conservador' && (
                <>
                  <View style={styles.produtoItem}>
                    <FontAwesome name="check" size={16} color="#2E7D32" style={styles.produtoIcon} />
                    <Text style={styles.produtoText}>Tesouro Selic</Text>
                  </View>
                  <View style={styles.produtoItem}>
                    <FontAwesome name="check" size={16} color="#2E7D32" style={styles.produtoIcon} />
                    <Text style={styles.produtoText}>CDBs de grandes bancos</Text>
                  </View>
                  <View style={styles.produtoItem}>
                    <FontAwesome name="check" size={16} color="#2E7D32" style={styles.produtoIcon} />
                    <Text style={styles.produtoText}>LCI/LCA de baixo risco</Text>
                  </View>
                  <View style={styles.produtoItem}>
                    <FontAwesome name="check" size={16} color="#2E7D32" style={styles.produtoIcon} />
                    <Text style={styles.produtoText}>Fundos DI e de Renda Fixa</Text>
                  </View>
                </>
              )}
              
              {perfilAtual?.tipo === 'Moderado' && (
                <>
                  <View style={styles.produtoItem}>
                    <FontAwesome name="check" size={16} color="#2E7D32" style={styles.produtoIcon} />
                    <Text style={styles.produtoText}>Tesouro Direto (IPCA+, Prefixado)</Text>
                  </View>
                  <View style={styles.produtoItem}>
                    <FontAwesome name="check" size={16} color="#2E7D32" style={styles.produtoIcon} />
                    <Text style={styles.produtoText}>CDBs de médio prazo</Text>
                  </View>
                  <View style={styles.produtoItem}>
                    <FontAwesome name="check" size={16} color="#2E7D32" style={styles.produtoIcon} />
                    <Text style={styles.produtoText}>Fundos Multimercado</Text>
                  </View>
                  <View style={styles.produtoItem}>
                    <FontAwesome name="check" size={16} color="#2E7D32" style={styles.produtoIcon} />
                    <Text style={styles.produtoText}>Fundos Imobiliários (FIIs)</Text>
                  </View>
                </>
              )}
              
              {perfilAtual?.tipo === 'Arrojado' && (
                <>
                  <View style={styles.produtoItem}>
                    <FontAwesome name="check" size={16} color="#2E7D32" style={styles.produtoIcon} />
                    <Text style={styles.produtoText}>Ações de empresas</Text>
                  </View>
                  <View style={styles.produtoItem}>
                    <FontAwesome name="check" size={16} color="#2E7D32" style={styles.produtoIcon} />
                    <Text style={styles.produtoText}>ETFs de índices</Text>
                  </View>
                  <View style={styles.produtoItem}>
                    <FontAwesome name="check" size={16} color="#2E7D32" style={styles.produtoIcon} />
                    <Text style={styles.produtoText}>Fundos de Ações</Text>
                  </View>
                  <View style={styles.produtoItem}>
                    <FontAwesome name="check" size={16} color="#2E7D32" style={styles.produtoIcon} />
                    <Text style={styles.produtoText}>Fundos Multimercado de maior volatilidade</Text>
                  </View>
                </>
              )}
            </View>
            
            <TouchableOpacity 
              style={styles.restartButton}
              onPress={recomecarQuestionario}
            >
              <Text style={styles.restartButtonText}>Refazer Questionário</Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        // Tela do questionário
        <View style={styles.questionContainer}>
          <View style={styles.progressContainer}>
            <View style={styles.progressBar}>
              <View 
                style={[
                  styles.progressFill, 
                  { width: `${((perguntaAtual + 1) / perguntas.length) * 100}%` }
                ]} 
              />
            </View>
            <Text style={styles.progressText}>
              Pergunta {perguntaAtual + 1} de {perguntas.length}
            </Text>
          </View>
          
          <Text style={styles.questionTitle}>{perguntas[perguntaAtual].texto}</Text>
          
          <View style={styles.optionsContainer}>
            {perguntas[perguntaAtual].opcoes.map((opcao, index) => (
              <TouchableOpacity 
                key={index}
                style={styles.optionButton}
                onPress={() => responderPergunta(opcao.pontos)}
              >
                <Text style={styles.optionText}>{opcao.texto}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      )}
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
    fontSize: 24,
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
    margin: 15,
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  introIcon: {
    marginBottom: 15,
  },
  introTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
    textAlign: 'center',
  },
  introText: {
    fontSize: 14,
    color: '#555',
    lineHeight: 20,
    textAlign: 'center',
  },
  perfisContainer: {
    margin: 15,
    padding: 15,
    backgroundColor: 'white',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  perfisTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  perfilCard: {
    flexDirection: 'row',
    marginBottom: 15,
    padding: 10,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    borderLeftWidth: 3,
    borderLeftColor: '#2E7D32',
  },
  perfilIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  perfilTextContainer: {
    flex: 1,
  },
  perfilTipo: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  perfilDescricao: {
    fontSize: 14,
    color: '#555',
    lineHeight: 20,
  },
  startButton: {
    backgroundColor: '#2E7D32',
    padding: 15,
    margin: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  startButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  tipsContainer: {
    margin: 15,
    padding: 15,
    backgroundColor: '#E8F5E9',
    borderRadius: 10,
    marginBottom: 30,
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
    color: '#444',
    lineHeight: 20,
  },
  // Estilos para o questionário
  questionContainer: {
    padding: 15,
    backgroundColor: 'white',
    margin: 15,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  progressContainer: {
    marginBottom: 20,
  },
  progressBar: {
    height: 8,
    backgroundColor: '#E0E0E0',
    borderRadius: 4,
    marginBottom: 5,
  },
  progressFill: {
    height: 8,
    backgroundColor: '#2E7D32',
    borderRadius: 4,
  },
  progressText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'right',
  },
  questionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
    lineHeight: 24,
  },
  optionsContainer: {
    marginBottom: 15,
  },
  optionButton: {
    backgroundColor: '#F5F5F5',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  optionText: {
    fontSize: 16,
    color: '#333',
  },
  // Estilos para o resultado
  resultHeader: {
    padding: 30,
    alignItems: 'center',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  resultIcon: {
    marginBottom: 10,
  },
  resultTitle: {
    fontSize: 18,
    color: 'white',
    marginBottom: 5,
  },
  resultPerfil: {
    fontSize: 30,
    fontWeight: 'bold',
    color: 'white',
  },
  resultContainer: {
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
  resultSectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 15,
    marginBottom: 10,
  },
  resultDescription: {
    fontSize: 16,
    color: '#444',
    lineHeight: 22,
    marginBottom: 15,
  },
  alocacaoContainer: {
    backgroundColor: '#F5F5F5',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
  },
  alocacaoText: {
    fontSize: 15,
    color: '#333',
    lineHeight: 22,
  },
  produtosContainer: {
    marginBottom: 20,
  },
  produtoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  produtoIcon: {
    marginRight: 10,
  },
  produtoText: {
    fontSize: 15,
    color: '#333',
  },
  restartButton: {
    backgroundColor: '#757575',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  restartButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
