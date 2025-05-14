import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  ScrollView, 
  TextInput,
  TouchableOpacity,
  FlatList,
  Modal
} from 'react-native';
import { FontAwesome } from '@expo/vector-icons';

/**
 * Interface para representar um termo do glossário
 */
interface TermoGlossario {
  id: string;
  termo: string;
  definicao: string;
  categoria: string;
}

/**
 * Tela de Glossário do aplicativo "Investindo com Sabedoria"
 * Apresenta os termos financeiros com explicações simples
 */
export default function GlossarioScreen() {
  // Estado para controlar os termos, filtragem e exibição
  const [termosFiltrados, setTermosFiltrados] = useState<TermoGlossario[]>([]);
  const [pesquisa, setPesquisa] = useState('');
  const [categoriaAtiva, setCategoriaAtiva] = useState('Todos');
  const [termoSelecionado, setTermoSelecionado] = useState<TermoGlossario | null>(null);
  
  // Lista de termos do glossário baseados no conteúdo do eBook
  const termosGlossario: TermoGlossario[] = [
    {
      id: '1',
      termo: 'Juros Compostos',
      definicao: 'É o cálculo de juros sobre juros, onde os rendimentos são incorporados ao capital inicial a cada período. Conhecido como "magia disfarçada de matemática", é o princípio que permite que pequenos investimentos se multipliquem substancialmente ao longo do tempo.',
      categoria: 'Conceitos Fundamentais'
    },
    {
      id: '2',
      termo: 'Ativos',
      definicao: 'São bens ou direitos que colocam dinheiro no seu bolso, seja através de valorização ou geração de renda. Exemplos incluem investimentos financeiros, imóveis alugados e negócios lucrativos.',
      categoria: 'Conceitos Fundamentais'
    },
    {
      id: '3',
      termo: 'Passivos',
      definicao: 'São obrigações ou bens que tiram dinheiro do seu bolso, gerando despesas ou desvalorização. Exemplos incluem dívidas, bens que geram despesas contínuas sem retorno (como carros de luxo) e compras impulsivas.',
      categoria: 'Conceitos Fundamentais'
    },
    {
      id: '4',
      termo: 'Trindade Impossível dos Investimentos',
      definicao: 'Conceito que explica que, em investimentos, é impossível obter simultaneamente segurança, liquidez e alta rentabilidade. É necessário escolher apenas dois desses atributos, abrindo mão do terceiro.',
      categoria: 'Conceitos Fundamentais'
    },
    {
      id: '5',
      termo: 'Renda Fixa',
      definicao: 'Categoria de investimentos onde, no momento da aplicação, já se conhece a forma de remuneração. O investidor "empresta" dinheiro para o emissor (banco, governo, empresa) em troca de juros.',
      categoria: 'Tipos de Investimentos'
    },
    {
      id: '6',
      termo: 'Renda Variável',
      definicao: 'Categoria de investimentos cujo retorno não pode ser previsto no momento da aplicação, pois depende de fatores de mercado. Inclui ações, fundos de ações, entre outros.',
      categoria: 'Tipos de Investimentos'
    },
    {
      id: '7',
      termo: 'CDI',
      definicao: 'Certificado de Depósito Interbancário, é a taxa utilizada nas operações entre bancos e serve como referência para diversos investimentos em renda fixa. Está intimamente ligada à taxa Selic.',
      categoria: 'Indicadores'
    },
    {
      id: '8',
      termo: 'Selic',
      definicao: 'Taxa básica de juros da economia brasileira, definida pelo Banco Central. Influencia todas as demais taxas de juros do país e serve como referência para investimentos.',
      categoria: 'Indicadores'
    },
    {
      id: '9',
      termo: 'IPCA',
      definicao: 'Índice Nacional de Preços ao Consumidor Amplo, é o indicador oficial de inflação no Brasil. Mede a variação do custo de vida para famílias com renda de até 40 salários mínimos.',
      categoria: 'Indicadores'
    },
    {
      id: '10',
      termo: 'Tesouro Direto',
      definicao: 'Programa do Governo Federal que permite a qualquer pessoa comprar títulos públicos, "emprestando" dinheiro ao governo em troca de juros. É considerado um dos investimentos mais seguros do mercado.',
      categoria: 'Tipos de Investimentos'
    },
    {
      id: '11',
      termo: 'CDB',
      definicao: 'Certificado de Depósito Bancário, é um título emitido por bancos no qual o investidor "empresta" dinheiro à instituição em troca de uma remuneração (juros). Conta com a proteção do FGC até R$ 250 mil por CPF e instituição.',
      categoria: 'Tipos de Investimentos'
    },
    {
      id: '12',
      termo: 'LCI/LCA',
      definicao: 'Letra de Crédito Imobiliário (LCI) e Letra de Crédito do Agronegócio (LCA) são títulos de renda fixa emitidos por instituições financeiras, destinados a financiar o setor imobiliário e o agronegócio, respectivamente. São isentos de Imposto de Renda para pessoa física.',
      categoria: 'Tipos de Investimentos'
    },
    {
      id: '13',
      termo: 'FGC',
      definicao: 'Fundo Garantidor de Créditos, é uma entidade privada que protege depositantes e investidores no âmbito do sistema financeiro. Garante até R$ 250 mil por CPF e instituição financeira em caso de quebra da instituição.',
      categoria: 'Proteções'
    },
    {
      id: '14',
      termo: 'Liquidez',
      definicao: 'Facilidade com que um investimento pode ser convertido em dinheiro sem perda significativa de valor. Investimentos com alta liquidez podem ser resgatados rapidamente.',
      categoria: 'Conceitos Fundamentais'
    },
    {
      id: '15',
      termo: 'Volatilidade',
      definicao: 'Medida da variação do preço de um ativo em determinado período. Alta volatilidade significa grandes oscilações de preço, o que geralmente está associado a maior risco.',
      categoria: 'Conceitos Fundamentais'
    },
    {
      id: '16',
      termo: 'Perfil de Investidor',
      definicao: 'Classificação baseada na tolerância ao risco, horizonte de tempo e objetivos financeiros do investidor. Geralmente dividido em conservador, moderado e arrojado, ajuda a direcionar a estratégia de investimentos mais adequada.',
      categoria: 'Conceitos Fundamentais'
    },
    {
      id: '17',
      termo: 'Fundos de Investimento',
      definicao: 'Condomínio financeiro que reúne recursos de diversos investidores para aplicação coletiva em uma carteira de ativos. É gerido por profissionais e permite acesso a mercados e estratégias que seriam inviáveis individualmente.',
      categoria: 'Tipos de Investimentos'
    },
    {
      id: '18',
      termo: 'Fundos DI',
      definicao: 'Tipo de fundo de investimento que aplica quase a totalidade de seus recursos em títulos pós-fixados atrelados ao CDI. São os mais conservadores entre os fundos, com baixo risco e previsibilidade.',
      categoria: 'Tipos de Investimentos'
    },
    {
      id: '19',
      termo: 'Fundos Multimercado',
      definicao: 'Fundos de investimento que podem investir em diferentes mercados (renda fixa, ações, câmbio, derivativos) com maior flexibilidade. Existem desde os mais conservadores até os mais arrojados, dependendo da estratégia.',
      categoria: 'Tipos de Investimentos'
    },
    {
      id: '20',
      termo: 'FIIs',
      definicao: 'Fundos de Investimento Imobiliário são fundos que investem em empreendimentos imobiliários, como shoppings, galpões logísticos, edifícios corporativos ou títulos ligados ao setor. Distribuem rendimentos mensais, geralmente isentos de IR para pessoa física.',
      categoria: 'Tipos de Investimentos'
    },
    {
      id: '21',
      termo: 'ETFs',
      definicao: 'Exchange Traded Funds são fundos negociados em bolsa que buscam replicar o desempenho de um índice de referência. Combinam a diversificação dos fundos com a liquidez das ações, e geralmente têm taxas de administração mais baixas que fundos tradicionais.',
      categoria: 'Tipos de Investimentos'
    },
    {
      id: '22',
      termo: 'IR Regressivo',
      definicao: 'Sistema de tributação de Imposto de Renda aplicado a investimentos em renda fixa e fundos, onde a alíquota diminui conforme o tempo de aplicação aumenta. Varia de 22,5% (até 180 dias) a 15% (acima de 720 dias).',
      categoria: 'Impostos'
    },
    {
      id: '23',
      termo: 'IOF',
      definicao: 'Imposto sobre Operações Financeiras, incide sobre investimentos de renda fixa resgatados antes de 30 dias. A alíquota diminui a cada dia, partindo de 96% (1º dia) até 0% (30º dia), e incide apenas sobre o rendimento.',
      categoria: 'Impostos'
    },
    {
      id: '24',
      termo: 'Come-cotas',
      definicao: 'Mecanismo de antecipação do IR em fundos de investimento, onde ocorre a redução automática da quantidade de cotas para pagar o imposto. Acontece semestralmente (maio e novembro) com alíquota de 15% ou 20%, dependendo do tipo de fundo.',
      categoria: 'Impostos'
    },
    {
      id: '25',
      termo: 'Escada de Vencimentos',
      definicao: 'Estratégia de investimento em renda fixa que consiste em distribuir os recursos em títulos com diferentes datas de vencimento, proporcionando liquidez parcial programada sem abrir mão totalmente da rentabilidade de prazos mais longos. Por exemplo, em vez de aplicar R$ 10.000 em um único CDB com vencimento em 2 anos, você dividiria em partes menores com vencimentos escalonados (ex: 6 meses, 1 ano, 1,5 ano e 2 anos), permitindo reinvestir ou usar o dinheiro conforme sua necessidade a cada vencimento, além de se proteger contra oscilações nas taxas de juros.',
      categoria: 'Estratégias'
    },
    {
      id: '26',
      termo: 'Taxa Prefixada',
      definicao: 'Uma forma de remuneração em investimentos de renda fixa onde a taxa de rendimento já é conhecida no momento da aplicação, independentemente de como as taxas de juros se comportarão no futuro. É ideal para momentos em que se espera queda nas taxas de juros, mas pode representar desvantagem se as taxas subirem muito, deixando o investidor "preso" a um rendimento menor que o mercado.',
      categoria: 'Indicadores'
    },
    {
      id: '27',
      termo: 'Taxa Pós-fixada',
      definicao: 'Uma forma de remuneração em investimentos de renda fixa onde o rendimento varia conforme as oscilações de um indexador, geralmente o CDI ou a Selic. É ideal para momentos de alta ou estabilidade nas taxas de juros, protegendo o investidor de perdas quando a Selic sobe.',
      categoria: 'Indicadores'
    },
  ];
  
  // Categorias disponíveis para filtro
  const categorias = ['Todos', 'Conceitos Fundamentais', 'Tipos de Investimentos', 'Indicadores', 'Impostos', 'Proteções', 'Estratégias'];
  
  // Filtrar termos com base na pesquisa e categoria selecionada
  useEffect(() => {
    // Filtro por pesquisa
    let termosFiltradosPorPesquisa = termosGlossario;
    if (pesquisa !== '') {
      termosFiltradosPorPesquisa = termosGlossario.filter(termo => 
        termo.termo.toLowerCase().includes(pesquisa.toLowerCase()) || 
        termo.definicao.toLowerCase().includes(pesquisa.toLowerCase())
      );
    }
    
    // Filtro por categoria
    if (categoriaAtiva !== 'Todos') {
      termosFiltradosPorPesquisa = termosFiltradosPorPesquisa.filter(termo => 
        termo.categoria === categoriaAtiva
      );
    }
    
    // Ordenar alfabeticamente
    termosFiltradosPorPesquisa.sort((a, b) => a.termo.localeCompare(b.termo));
    
    setTermosFiltrados(termosFiltradosPorPesquisa);
  }, [pesquisa, categoriaAtiva]);
  
  // Renderizar um termo na lista
  const renderTermo = ({ item }: { item: TermoGlossario }) => (
    <TouchableOpacity 
      style={styles.termoItem}
      onPress={() => setTermoSelecionado(item)}
    >
      <View style={styles.termoHeader}>
        <Text style={styles.termoTitulo}>{item.termo}</Text>
        <View style={styles.categoriaTag}>
          <Text style={styles.categoriaTagText}>{item.categoria}</Text>
        </View>
      </View>
      
      <Text style={styles.termoPreview} numberOfLines={2}>
        {item.definicao}
      </Text>
      
      <Text style={styles.verMais}>Ver mais</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Glossário Financeiro</Text>
        <Text style={styles.headerSubtitle}>
          Termos financeiros explicados de forma simples
        </Text>
      </View>
      
      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <FontAwesome name="search" size={20} color="#999" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Pesquisar termos..."
            value={pesquisa}
            onChangeText={setPesquisa}
          />
          {pesquisa !== '' && (
            <TouchableOpacity onPress={() => setPesquisa('')}>
              <FontAwesome name="times-circle" size={20} color="#999" />
            </TouchableOpacity>
          )}
        </View>
      </View>
      
      <View style={styles.categoriasContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoriasContent}
        >
          {categorias.map((categoria) => (
            <TouchableOpacity
              key={categoria}
              style={[
                styles.categoriaChip,
                categoriaAtiva === categoria && styles.categoriaChipActive
              ]}
              onPress={() => setCategoriaAtiva(categoria)}
            >
              <Text 
                style={[
                  styles.categoriaChipText,
                  categoriaAtiva === categoria && styles.categoriaChipTextActive
                ]}
              >
                {categoria}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
      
      <FlatList
        data={termosFiltrados}
        renderItem={renderTermo}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <FontAwesome name="search" size={40} color="#CCC" style={styles.emptyIcon} />
            <Text style={styles.emptyText}>Nenhum termo encontrado com os filtros atuais.</Text>
          </View>
        }
      />
      
      {/* Modal com detalhes do termo */}
      <Modal
        visible={termoSelecionado !== null}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setTermoSelecionado(null)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {termoSelecionado?.termo}
              </Text>
              <TouchableOpacity 
                style={styles.closeButton}
                onPress={() => setTermoSelecionado(null)}
              >
                <FontAwesome name="times" size={20} color="#333" />
              </TouchableOpacity>
            </View>
            
            <View style={styles.modalCategoriaContainer}>
              <View style={styles.modalCategoriaTag}>
                <Text style={styles.modalCategoriaText}>
                  {termoSelecionado?.categoria}
                </Text>
              </View>
            </View>
            
            <ScrollView style={styles.modalBody}>
              <Text style={styles.modalDefinicao}>
                {termoSelecionado?.definicao}
              </Text>
              
              {/* Termos relacionados (exemplo estático) */}
              {termoSelecionado?.categoria === 'Tipos de Investimentos' && (
                <View style={styles.relacionadosContainer}>
                  <Text style={styles.relacionadosTitulo}>Termos relacionados:</Text>
                  <View style={styles.relacionadosChips}>
                    <TouchableOpacity 
                      style={styles.relacionadoChip}
                      onPress={() => {
                        const termoRenda = termosGlossario.find(t => t.termo === 'Renda Fixa');
                        if (termoRenda) {
                          setTermoSelecionado(termoRenda);
                        }
                      }}
                    >
                      <Text style={styles.relacionadoChipText}>Renda Fixa</Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                      style={styles.relacionadoChip}
                      onPress={() => {
                        const termoLiquidez = termosGlossario.find(t => t.termo === 'Liquidez');
                        if (termoLiquidez) {
                          setTermoSelecionado(termoLiquidez);
                        }
                      }}
                    >
                      <Text style={styles.relacionadoChipText}>Liquidez</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              )}
              
              {termoSelecionado?.categoria === 'Impostos' && (
                <View style={styles.relacionadosContainer}>
                  <Text style={styles.relacionadosTitulo}>Termos relacionados:</Text>
                  <View style={styles.relacionadosChips}>
                    <TouchableOpacity 
                      style={styles.relacionadoChip}
                      onPress={() => {
                        const termo = termosGlossario.find(t => t.termo === 'Come-cotas');
                        if (termo) {
                          setTermoSelecionado(termo);
                        }
                      }}
                    >
                      <Text style={styles.relacionadoChipText}>Come-cotas</Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                      style={styles.relacionadoChip}
                      onPress={() => {
                        const termo = termosGlossario.find(t => t.termo === 'IR Regressivo');
                        if (termo) {
                          setTermoSelecionado(termo);
                        }
                      }}
                    >
                      <Text style={styles.relacionadoChipText}>IR Regressivo</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              )}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
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
  searchContainer: {
    padding: 15,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#EEE',
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    paddingHorizontal: 15,
    height: 45,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  categoriasContainer: {
    backgroundColor: 'white',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#EEE',
  },
  categoriasContent: {
    paddingHorizontal: 15,
  },
  categoriaChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: '#F0F0F0',
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  categoriaChipActive: {
    backgroundColor: '#E8F5E9',
    borderColor: '#2E7D32',
  },
  categoriaChipText: {
    fontSize: 14,
    color: '#666',
  },
  categoriaChipTextActive: {
    color: '#2E7D32',
    fontWeight: 'bold',
  },
  listContainer: {
    padding: 15,
    paddingBottom: 30,
  },
  termoItem: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  termoHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  termoTitulo: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
  },
  categoriaTag: {
    backgroundColor: '#F0F0F0',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
    marginLeft: 10,
  },
  categoriaTagText: {
    fontSize: 10,
    color: '#666',
  },
  termoPreview: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginBottom: 10,
  },
  verMais: {
    fontSize: 12,
    color: '#2E7D32',
    fontWeight: 'bold',
    textAlign: 'right',
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 30,
  },
  emptyIcon: {
    marginBottom: 15,
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
    textAlign: 'center',
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
    fontSize: 20,
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
  modalCategoriaContainer: {
    paddingHorizontal: 15,
    paddingVertical: 5,
  },
  modalCategoriaTag: {
    backgroundColor: '#E8F5E9',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 4,
    alignSelf: 'flex-start',
  },
  modalCategoriaText: {
    fontSize: 12,
    color: '#2E7D32',
    fontWeight: 'bold',
  },
  modalBody: {
    padding: 15,
    maxHeight: 400,
  },
  modalDefinicao: {
    fontSize: 16,
    color: '#333',
    lineHeight: 24,
    marginBottom: 20,
  },
  relacionadosContainer: {
    marginTop: 10,
  },
  relacionadosTitulo: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  relacionadosChips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  relacionadoChip: {
    backgroundColor: '#F0F0F0',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginRight: 8,
    marginBottom: 8,
  },
  relacionadoChipText: {
    fontSize: 14,
    color: '#2E7D32',
  },
});
