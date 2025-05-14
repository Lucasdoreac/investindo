import React, { useState } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  ScrollView, 
  TouchableOpacity,
  Modal,
  SafeAreaView
} from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import EbookContent from '../../components/EbookContent';

/**
 * Interface para representar um capítulo do eBook
 */
interface Capitulo {
  id: string;
  titulo: string;
  descricao: string;
  conteudo: string;
  icone: keyof typeof FontAwesome.glyphMap;
}

/**
 * Tela de Biblioteca do aplicativo "Investindo com Sabedoria"
 * Apresenta o conteúdo do eBook de forma estruturada
 */
export default function BibliotecaScreen() {
  // Estado para armazenar o capítulo selecionado
  const [capituloSelecionado, setCapituloSelecionado] = useState<Capitulo | null>(null);
  
  // Capítulos do eBook
  const capitulos: Capitulo[] = [
    {
      id: '1',
      titulo: 'A Importância de Investir aos Poucos',
      descricao: 'Por que começar pequeno é uma estratégia poderosa e como construir o hábito de investir',
      conteudo: `# A IMPORTÂNCIA DE INVESTIR AOS POUCOS

## Por que começar pequeno é uma estratégia poderosa
Quando falamos em investimentos, muitas pessoas imaginam executivos de terno, gráficos complexos e grandes quantias de dinheiro. Essa imagem não poderia estar mais distante da realidade. Investir, na sua essência mais pura, significa colocar recursos hoje para colher benefícios no futuro. E para isso, você não precisa começar com milhares de reais.

Investir R$30 por mês pode parecer insignificante quando comparamos com os valores que vemos nos noticiários financeiros. "O que R$30 podem fazer?", você pode se perguntar. A resposta está em um dos princípios mais fascinantes da matemática financeira: os juros compostos.

Para mim, os juros compostos são tipo magia disfarçada de matemática. Quando você investe, mesmo pequenas quantias, seu dinheiro gera rendimentos. Na rodada seguinte, você não está mais investindo apenas os R$30 iniciais, mas também os rendimentos que eles geraram. Com o tempo, esse efeito se multiplica, criando um verdadeiro "efeito bola de neve".

## Construindo o hábito que transforma finanças
O hábito de investir regularmente é como plantar uma semente que, com cuidado constante, se transforma em uma árvore frutífera. Ao estabelecer uma contribuição mensal automática, mesmo pequena, você cria disciplina financeira. Esta disciplina é o que separa quem apenas sonha com liberdade financeira de quem realmente a constrói.

Imagine que você configure um débito automático de R$30 todo dia 5 do mês, direcionado para uma conta de investimentos. Esta simplicidade elimina a necessidade de tomar decisões repetitivas – seu dinheiro já está trabalhando por você antes mesmo que você sinta sua falta. Com o tempo, à medida que sua confiança e situação financeira melhoram, você pode gradualmente aumentar esse valor.

## A satisfação de ver seu patrimônio crescer
Há uma satisfação única em acompanhar o crescimento do seu patrimônio. Lembra da sensação de ver plantas crescerem quando você as cuida diariamente? Ver sua carteira de investimentos crescer proporciona uma sensação semelhante, mas com benefícios ainda mais tangíveis para seu futuro. A cada extrato mensal, você testemunha o poder do tempo e da consistência trabalhando a seu favor.

## A estratégia de "fingir que ganha menos"
Uma das estratégias que mais funcionaram pra mim ao longo dos anos é o que eu chamo de "fingir que ganhei menos do que realmente ganhei". Não sei se fui eu quem inventou isso, mas posso dizer que aplico na prática há muito tempo e mudou completamente minha relação com o dinheiro.

Sempre que eu recebia um aumento, um bônus ou qualquer renda extra, em vez de incorporar aquilo no meu padrão de vida, eu fingia que uma parte nem existia. Por exemplo: se meu salário aumentava R$300, eu deixava R$100 pra mim (porque ninguém é de ferro, né?) e investia os outros R$200 direto. Como eu já vivia sem aquele valor antes, não sentia falta.

Essa tática me ajudou a evitar aquela armadilha comum de "ganhou mais, gasta mais" — a famosa inflação do estilo de vida. E, aos poucos, isso fez meu patrimônio crescer de forma muito mais consistente e tranquila. Não é sobre se privar, mas sobre fazer escolhas conscientes. Cada aumento virou uma oportunidade de investir mais sem mexer no meu conforto atual.

## A verdade sobre enriquecer com investimentos
É importante esclarecer desde o início: ninguém enriquece da noite para o dia apenas investindo. Investimentos são ferramentas poderosas, mas não são fórmulas mágicas.

De vez em quando, você ouvirá histórias inspiradoras de pessoas que multiplicaram seu patrimônio com uma única ação, criptoativo ou oportunidade específica. Essas histórias existem, sim, mas representam exceções — e exceções jamais devem ser confundidas com estratégias confiáveis de longo prazo.

A construção de riqueza genuína está fundamentada em dois pilares essenciais:
1. Trabalho Consistente (desenvolvimento de carreira, qualificação profissional, empreendedorismo)
2. Disciplina Financeira (orçamento consciente, controle de despesas, investimentos regulares)

Aumentar sua capacidade de gerar renda ao longo do tempo — seja por meio de crescimento profissional, empreendedorismo ou outras fontes — é tão fundamental quanto aprender a investir com sabedoria. Um ponto não substitui o outro. Os investimentos potencializam seus esforços, mas não criam riqueza do nada.

Precisamos confrontar uma verdade fundamental: não existem atalhos mágicos para a prosperidade financeira. O mercado financeiro não funciona como um cassino onde você aposta R$1.000 e sai com R$1 milhão no dia seguinte. Quem promete esse tipo de retorno extraordinário está, na melhor das hipóteses, iludido — e na pior das hipóteses, tentando deliberadamente enganá-lo.

### A VERDADEIRA CHAVE PARA CONSTRUIR PATRIMÔNIO
→ Aumentar sua capacidade de ganhar dinheiro
→ Investir consistentemente uma parte do que você ganha

Isso significa que dedicar-se à sua carreira, buscar qualificação profissional contínua e desenvolver possíveis fontes adicionais de renda é tão importante quanto selecionar investimentos adequados ao seu perfil.

Considere este exemplo prático: um profissional que consegue dobrar sua renda — evoluindo de R$3.000 para R$6.000 mensais — e mantém o mesmo padrão de vida conseguirá investir significativamente mais do que alguém estagnado na mesma faixa salarial durante anos, mesmo que o segundo indivíduo possua conhecimento aprofundado sobre todos os produtos financeiros disponíveis no mercado.

Por isso, não se deixe capturar pela ilusão de que existem fórmulas secretas ou estratégias milagrosas que substituem o trabalho genuíno e consistente.

Os milionários que você admira provavelmente não alcançaram esse patamar financeiro através de um único investimento brilhante ou uma jogada de sorte isolada. Eles chegaram onde estão porque dedicaram anos trabalhando com determinação, tomando decisões financeiras inteligentes e mantendo disciplina rigorosa em seus investimentos periódicos. Não existe pulo do gato. Existe persistência.

E acredite: com consistência e paciência, mesmo pequenos aportes mensais têm o poder transformador de reconfigurar completamente sua realidade financeira ao longo dos anos. Esta é a verdadeira magia dos investimentos — não um golpe de sorte instantâneo, mas o poder cumulativo de decisões inteligentes tomadas repetidamente ao longo do tempo.`,
      icone: 'leaf',
    },
    {
      id: '2',
      titulo: 'Ativos vs. Passivos',
      descricao: 'Entenda a diferença entre ativos e passivos e como fazer seu dinheiro trabalhar para você',
      conteudo: `# ATIVOS X PASSIVOS: SEU DINHEIRO TRABALHANDO PARA VOCÊ

Ativo financeiro é tudo aquilo que representa valor e tem o potencial de colocar mais dinheiro no seu bolso — sem você precisar trabalhar ativamente por isso. É basicamente um contrato que promete te trazer benefícios econômicos no futuro.

O grande diferencial dos ativos financeiros é justamente esse: eles fazem o dinheiro trabalhar por você.

Pensa assim: é como plantar uma árvore. Você planta a semente (investe), a árvore cresce com o tempo (seu dinheiro valoriza) e depois ela começa a dar frutos (juros, dividendos, rendimentos). E tudo isso acontece enquanto você vive sua vida: dorme, trabalha, estuda, curte a família.

## A DIFERENÇA QUE MUDA TUDO

### Ativos
- Colocam dinheiro no seu bolso.
- Geram renda ou aumentam de valor com o tempo.
- Trabalham para você 24 horas por dia.

Exemplos: investimentos bem feitos, imóveis que geram aluguel, negócios que dão lucro.

### Passivos
- Tiram dinheiro do seu bolso.
- Geram despesa ou desvalorizam.
- Você precisa trabalhar para sustentar eles.

Exemplos: dívidas caras, carro pessoal que gera gastos, compras por impulso.

Quem constrói riqueza de verdade sabe a diferença entre os dois — e passa a vida aumentando a quantidade de ativos e controlando os passivos.

## POR QUE INVESTIR TRANSFORMA A SUA VIDA?

Investir muda o jogo porque cria um sistema em que dinheiro gera dinheiro. É como ter um funcionário incansável trabalhando para você — 24 horas por dia, 7 dias por semana — sem precisar ficar no seu pé.

Quem investe:
- Multiplica o que tem sem precisar trocar tempo por dinheiro para sempre.
- Protege seu patrimônio da inflação (que corrói o dinheiro parado).
- Constrói uma base para chegar na tão sonhada independência financeira.

Enquanto o dinheiro comum parado perde valor com o tempo, os ativos financeiros crescem, se multiplicam e preservam seu poder de compra.

## A VERDADEIRA MÁGICA

A mágica dos investimentos não está em valores altos nem em golpes de sorte. Está em começar e ser consistente. É o tempo, trabalhando do seu lado, que transforma sementes pequenas em árvores enormes.

Quem planta, colhe. Quem investe cedo e investe sempre, constrói liberdade.

## O QUE É RENDA FIXA?

A renda fixa é uma categoria de investimentos onde, no momento da aplicação, você já sabe qual será a forma de remuneração. Diferentemente da renda variável, onde os ganhos dependem de fatores imprevisíveis como cotações de mercado, na renda fixa existe uma previsibilidade maior sobre como seu dinheiro será remunerado.

O termo "fixa"não significa que o rendimento será sempre o mesmo, mas sim que a regra de remuneração é conhecida desde o início. Na prática, isso significa que ao investir em renda fixa, você estará emprestando seu dinheiro para o emissor do título (banco, governo ou empresa), que se compromete a devolvê-lo com juros após um determinado período.`,
      icone: 'exchange',
    },
    {
      id: '3',
      titulo: 'Fundos de Investimento',
      descricao: 'Como funcionam os fundos e como investir em conjunto para diversificar',
      conteudo: `# FUNDOS DE INVESTIMENTO: INVESTINDO EM CONJUNTO

## O QUE SÃO FUNDOS DE INVESTIMENTO?

Os fundos de investimento funcionam como uma espécie de "condomínio financeiro", onde diversos investidores reúnem seus recursos para investir coletivamente. Esse dinheiro é gerido por um profissional especializado, que toma as decisões de compra e venda de ativos conforme os objetivos estabelecidos no regulamento do fundo.

A grande vantagem desse modelo é permitir que pequenos investidores tenham acesso a estratégias, mercados e ativos que seriam inviáveis individualmente, seja pelo volume mínimo exigido, pela complexidade da gestão ou pela necessidade de diversificação.

## PRINCIPAIS TIPOS DE FUNDOS

### Fundos DI e Renda Fixa
- Fundos DI: Investem quase que exclusivamente em títulos pós-fixados atrelados ao CDI. São os mais conservadores e previsíveis.
- Fundos de Renda Fixa: Aplicam no mínimo 80% do patrimônio em ativos de renda fixa, podendo incluir títulos prefixados, pós-fixados e indexados à inflação.

### Fundos Multimercado
- Podem investir em diferentes mercados (renda fixa, ações, câmbio, derivativos) com maior flexibilidade.
- Existem desde os mais conservadores até os mais arrojados, dependendo da estratégia.
- Sua classificação varia conforme a estratégia: macro, long & short, arbitragem, entre outros.

### Fundos de Ações
- Investem no mínimo 67% do patrimônio em ações.
- Maior potencial de retorno e também maior volatilidade.
- Podem ser ativos (buscam superar um índice) ou passivos (apenas replicam um índice).

### Fundos Imobiliários (FIIs)
- Investem em empreendimentos imobiliários, como shoppings, galpões logísticos, edifícios corporativos ou títulos ligados ao setor.
- Distribuem rendimentos mensais, geralmente isentos de IR para pessoa física.
- São negociados em bolsa, como ações.

### ETFs (Exchange Traded Funds)
- Fundos negociados em bolsa que buscam replicar o desempenho de um índice de referência.
- Combinam a diversificação dos fundos com a liquidez das ações.
- Geralmente têm taxas de administração mais baixas que fundos tradicionais.

## VANTAGENS E DESVANTAGENS

### Vantagens
- Gestão profissional: Especialistas tomam decisões baseadas em pesquisas e análises.
- Diversificação: Mesmo com pouco dinheiro, você consegue diversificar seus investimentos.
- Acesso: Permitem investir em ativos que exigiriam valores altos individualmente.
- Praticidade: Você não precisa acompanhar o mercado diariamente.

### Desvantagens
- Taxas: A maioria cobra taxa de administração, e alguns também cobram taxa de performance.
- Tributação: O come-cotas antecipa 15% ou 20% do IR a cada semestre (maio e novembro).
- Falta de controle: Você não decide diretamente quais ativos comprar ou vender.
- Rentabilidade: Nem sempre superam os índices de referência do mercado.

## COMO ESCOLHER UM FUNDO

Ao selecionar um fundo, considere:

1. Seu perfil e objetivos: O fundo deve estar alinhado com seu perfil de risco e horizonte de investimento.
2. Histórico de rentabilidade: Compare o desempenho com fundos similares e com o benchmark.
3. Taxas: Avalie se as taxas cobradas são compatíveis com a rentabilidade entregue.
4. Gestora: Pesquise a reputação e experiência da gestora no mercado.
5. Patrimônio e liquidez: Fundos muito pequenos podem ter dificuldades operacionais ou encerrar atividades.

Lembre-se: rentabilidade passada não é garantia de rentabilidade futura. O histórico serve apenas como referência, nunca como promessa.`,
      icone: 'users',
    },
    {
      id: '4',
      titulo: 'Impostos sobre Investimentos',
      descricao: 'Entenda como funcionam os impostos e como otimizar seus resultados',
      conteudo: `# IMPOSTOS SOBRE INVESTIMENTOS: OTIMIZANDO RESULTADOS

## IMPOSTO DE RENDA NA RENDA FIXA E FUNDOS

Na maioria dos investimentos em renda fixa e fundos, o IR incide apenas sobre o rendimento (ganho de capital), seguindo a tabela regressiva:

| Prazo de Aplicação | Alíquota de IR |
|---------------------|----------------|
| Até 180 dias        | 22,5%          |
| De 181 a 360 dias   | 20%            |
| De 361 a 720 dias   | 17,5%          |
| Acima de 720 dias   | 15%            |

Exemplo: Se você aplicou R$ 1.000 e resgatou R$ 1.100 após 1 ano, seu rendimento foi de R$ 100. A alíquota de IR será de 20%, ou seja, R$ 20 de imposto. Seu ganho líquido será de R$ 80.

## IOF (IMPOSTO SOBRE OPERAÇÕES FINANCEIRAS)

O IOF incide sobre investimentos de renda fixa resgatados antes de 30 dias:

- A alíquota diminui a cada dia, partindo de 96% (1º dia) até 0% (30º dia).
- Incide apenas sobre o rendimento, não sobre o capital.
- Em fundos, o IOF só é cobrado para resgates feitos em menos de 30 dias.

## RESUMO PRÁTICO

| Investimento | IR | IOF |
|--------------|----|----|
| LCI / LCA | Isento | Isento (carência mínima > 30 dias) |
| CRI / CRA | Isento | Isento (carência mínima > 30 dias) |
| Debênture Incentivada | Isento | Isento (vencimento normalmente longo) |
| Poupança | Isento | Isento |
| FII (rendimentos) | Isento | Não se aplica |
| Fundos de Ações | 15% | Isento |`,
      icone: 'calculator',
    },
    {
      id: '5',
      titulo: 'Perfil do Investidor',
      descricao: 'Autoconhecimento para tomar decisões melhores de investimento',
      conteudo: `# PERFIL DO INVESTIDOR: AUTOCONHECIMENTO PARA DECISÕES MELHORES

## POR QUE CONHECER SEU PERFIL É IMPORTANTE

Conhecer seu perfil de investidor não é apenas uma formalidade bancária, mas um exercício de autoconhecimento que pode ser decisivo para o sucesso da sua estratégia financeira.

Quando você investe conforme seu perfil:
- Evita decisões emocionais em momentos de turbulência
- Consegue manter-se fiel à estratégia no longo prazo
- Reduz a ansiedade e insegurança com os investimentos
- Tem maior probabilidade de atingir seus objetivos financeiros

## OS TRÊS PILARES DO PERFIL DO INVESTIDOR

### Tolerância ao Risco
É a sua capacidade emocional de lidar com perdas temporárias sem tomar decisões precipitadas.

- Baixa tolerância: Você sente desconforto significativo ao ver seu patrimônio reduzido, mesmo temporariamente.
- Média tolerância: Você aceita alguma volatilidade, desde que veja potencial de ganho.
- Alta tolerância: Você consegue manter a calma mesmo diante de oscilações relevantes.

### Horizonte de Tempo
É o prazo que você tem disponível até precisar utilizar os recursos investidos.

- Curto prazo: Menos de 2 anos
- Médio prazo: De 2 a 5 anos
- Longo prazo: Mais de 5 anos

### Objetivos Financeiros
São as finalidades específicas para as quais você está investindo.

- Preservação de capital: Proteger o patrimônio já conquistado
- Renda: Gerar recursos para complementar seu orçamento
- Crescimento: Aumentar seu patrimônio no longo prazo

## OS TRÊS PERFIS CLÁSSICOS

### Perfil Conservador
- Prioridade: Segurança, preservação do patrimônio
- Comportamento: Prefere evitar riscos, mesmo que isso signifique rentabilidade mais baixa
- Indicado para: Reserva de emergência, objetivos de curto prazo, pessoas próximas à aposentadoria
- Alocação típica: 80-100% em renda fixa de baixo risco, 0-20% em investimentos moderados

### Perfil Moderado
- Prioridade: Equilíbrio entre segurança e rentabilidade
- Comportamento: Aceita correr alguns riscos calculados em busca de melhores retornos
- Indicado para: Objetivos de médio prazo, pessoas com alguma experiência em investimentos
- Alocação típica: 50-70% em renda fixa, 30-50% em renda variável diversificada

### Perfil Arrojado
- Prioridade: Maximização dos retornos no longo prazo
- Comportamento: Tolera alta volatilidade em busca de ganhos acima da média
- Indicado para: Objetivos de longo prazo, pessoas jovens e com conhecimento do mercado
- Alocação típica: 20-40% em renda fixa, 60-80% em renda variável

## A TRINDADE IMPOSSÍVEL APLICADA AO PERFIL

Assim como existe uma trindade impossível nos investimentos (segurança, liquidez e rentabilidade), há uma trindade impossível no perfil do investidor:

- Baixo risco + Alta rentabilidade + Curto prazo = Impossível!

Para cada objetivo, você precisará ajustar pelo menos uma dessas variáveis:

- Quer segurança e alta rentabilidade? Precisará de mais tempo (longo prazo).
- Quer segurança em curto prazo? Precisará aceitar menor rentabilidade.
- Quer alta rentabilidade em curto prazo? Precisará assumir mais riscos.

| Objetivo | Você ganha | Você perde |
|----------|------------|------------|
| Segurança + Liquidez | Tranquilidade | Rentabilidade |
| Segurança + Rentabilidade | Crescimento estável | Liquidez |
| Liquidez + Rentabilidade | Agilidade | Segurança |

Observação importante: Mesmo que você tenha um perfil arrojado, isso não significa que pode tomar grandes riscos com objetivos de curto prazo. No curto prazo, o tempo não está do seu lado — e a volatilidade pode te prejudicar.

Por outro lado, o longo prazo permite maior exposição a ativos de risco (como ações), mesmo para investidores mais conservadores, desde que o psicológico esteja preparado para lidar com oscilações.

## ALINHANDO PERFIL, HORIZONTE E PSICOLOGIA

O segredo para investir com tranquilidade está em alinhar:

- Seu perfil psicológico: Como você reage emocionalmente a perdas.
- Seu horizonte de tempo: Quando você precisará do dinheiro.
- Seus objetivos financeiros: O que você quer conquistar.

Regra prática importante: No mundo dos investimentos, o prazo fala mas o emocional grita. Mesmo que você tenha um objetivo de longo prazo, se não tolera oscilações no caminho, talvez precise montar uma estratégia mais conservadora.

Da mesma forma que não adianta ser arrojado com dinheiro que você vai precisar daqui a 6 meses, também não faz sentido investir agressivamente para o longo prazo se você não aguenta ver sua carteira desvalorizar temporariamente.

O equilíbrio ideal está entre o tempo que você tem e o emocional que você suporta. Estratégia boa é aquela que você consegue manter com consistência, sem surtar nas quedas e sem sair do plano na primeira alta.

O tempo é um dos maiores aliados do investidor, mas ele não faz milagres sozinho. Para colher bons frutos lá na frente, é preciso que os investimentos escolhidos estejam em sintonia com dois pilares: seus objetivos financeiros e o seu perfil emocional.

Quando esses três pontos se alinham prazo, objetivo, e psicológico a jornada se torna mais leve, sustentável e, principalmente, eficiente.`,
      icone: 'user-circle',
    },
    {
      id: '6',
      titulo: 'Colocando Tudo em Prática',
      descricao: 'Dicas práticas para começar sua jornada de investimentos',
      conteudo: `# CONCLUSÃO: COLOCANDO TUDO EM PRÁTICA

## OS PILARES DA JORNADA DO INVESTIDOR

Ao longo deste livro, exploramos vários conceitos fundamentais que, juntos, formam a base para uma jornada de investimentos bem-sucedida:

1. Consistência supera valor: Investir R$30 todo mês é melhor que esperar juntar R$5.000 para começar.
2. Equilíbrio entre emoção e razão: Conhecer seu perfil e respeitar seus limites emocionais é tão importante quanto fazer contas de rentabilidade.
3. Diversificação inteligente: Distribuir investimentos entre diferentes classes, prazos e estratégias para reduzir riscos sem sacrificar retornos.
4. Planejamento tributário: Considerar impostos desde o início pode fazer grande diferença no resultado final.
5. Visão de longo prazo: Paciência e persistência são virtudes essenciais para quem investe.

## 20 DICAS PRÁTICAS PARA INVESTIR COM SABEDORIA

### Começando

1. Comece pelos básicos: Antes de qualquer investimento, monte sua reserva de emergência em aplicações seguras e líquidas.
2. Defina objetivos claros: Para cada valor investido, saiba exatamente qual é a finalidade e o prazo previsto.
3. Conheça seu perfil: Faça o teste de perfil do investidor (API) e seja honesto sobre sua tolerância a risco.
4. Invista com regularidade: Estabeleça um valor mensal para investir, mesmo que pequeno, e seja disciplinado.
5. Automatize: Configure débitos automáticos para seus investimentos, antes que o dinheiro "evapore"da conta corrente.

### Construindo sua Carteira

6. Diversifique com propósito: Cada investimento deve ter um papel específico na sua estratégia.
7. Comece pela renda fixa: Para iniciantes, é melhor começar por investimentos mais simples e previsíveis.
8. Respeite seu horizonte: Combine o prazo do investimento com o prazo do seu objetivo.
9. Considere os impostos: Escolha produtos com tratamento tributário mais favorável para cada objetivo.
10. Evite modismos: Não invista no "produto do momento"só porque todos estão falando dele.

### Monitoramento e Ajustes

11. Revise periodicamente: Analise sua carteira a cada 6 meses, mas evite mexer nela a todo momento.
12. Rebalanceie quando necessário: Se um tipo de investimento crescer muito mais que os outros, corrija a proporção para manter sua estratégia.
13. Documente suas decisões: Anote por que você fez cada investimento, isso te ajudará a manter consistência.
14. Atualize seus conhecimentos: O mercado evolui, e sua educação financeira deve acompanhar.
15. Ignore o ruído: Notícias de curto prazo raramente justificam mudanças na sua estratégia.

### Atitudes e Mentalidade

16. Evite a comparação: Cada pessoa tem objetivos e perfis diferentes; compare seu desempenho apenas com suas próprias metas.
17. Lembre-se de que erros acontecem: Todo investidor comete erros; o importante é aprender com eles.
18. Fique atento às emoções: Se um investimento está tirando seu sono, provavelmente ele não é adequado para você.
19. Celebre pequenas vitórias: Reconheça seu progresso, mesmo que pareça modesto no início.
20. Mantenha o foco no longo prazo: A persistência é a chave para construir um patrimônio sólido.

## FRASE FINAL

"A verdadeira liberdade financeira não se encontra em promessas de riqueza fácil, mas no poder de entender o que poucos explicam. Investir não é seguir modismos - é escolher com consciência o que faz sentido pra você. Cada decisão é uma semente, e o tempo é o terreno onde ela frutifica. Só colhe bons frutos quem recusa o óbvio, questiona o que escuta e constrói com propósito. Não caia em promessas fáceis, caia na real. Riqueza de verdade nasce de paciência, estratégia e coragem pra pensar por conta própria."

Boa sorte em sua jornada financeira!`,
      icone: 'check-circle',
    },
  ];

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Biblioteca</Text>
        <Text style={styles.headerSubtitle}>
          Material educacional do eBook "Investindo com Sabedoria"
        </Text>
      </View>
      
      <View style={styles.quoteContainer}>
        <FontAwesome name="quote-left" size={24} color="#2E7D32" style={styles.quoteIcon} />
        <Text style={styles.quoteText}>
          "Investir não é seguir modismos - é escolher com consciência o que faz sentido pra você. 
          Cada decisão é uma semente, e o tempo é o terreno onde ela frutifica."
        </Text>
        <Text style={styles.quoteAuthor}>- Luciana Araujo</Text>
      </View>
      
      <View style={styles.chaptersContainer}>
        {capitulos.map((capitulo) => (
          <TouchableOpacity 
            key={capitulo.id}
            style={styles.chapterCard}
            onPress={() => setCapituloSelecionado(capitulo)}
          >
            <View style={styles.chapterIconContainer}>
              <FontAwesome name={capitulo.icone} size={28} color="#2E7D32" />
            </View>
            <View style={styles.chapterTextContainer}>
              <Text style={styles.chapterTitle}>{capitulo.titulo}</Text>
              <Text style={styles.chapterDescription}>{capitulo.descricao}</Text>
            </View>
            <FontAwesome name="angle-right" size={22} color="#999" />
          </TouchableOpacity>
        ))}
      </View>
      
      <View style={styles.suggestionContainer}>
        <Text style={styles.suggestionTitle}>Sugestões de leitura</Text>
        <Text style={styles.suggestionText}>
          Para iniciantes, recomendamos começar pela ordem dos capítulos, 
          com atenção especial aos conceitos de juros compostos e à diferença 
          entre ativos e passivos.
        </Text>
      </View>
      
      {/* Modal para exibir o conteúdo completo do capítulo */}
      <Modal
        visible={capituloSelecionado !== null}
        animationType="slide"
        onRequestClose={() => setCapituloSelecionado(null)}
      >
        <SafeAreaView style={styles.modalContainer}>
          {capituloSelecionado && (
            <>
              <View style={styles.modalHeader}>
                <TouchableOpacity 
                  style={styles.closeButton}
                  onPress={() => setCapituloSelecionado(null)}
                >
                  <FontAwesome name="arrow-left" size={24} color="#333" />
                </TouchableOpacity>
                <Text style={styles.modalTitle}>{capituloSelecionado.titulo}</Text>
              </View>
              
              <ScrollView style={styles.modalContent}>
                {/* Utilizando o componente EbookContent para renderizar o markdown formatado */}
                <EbookContent content={capituloSelecionado.conteudo} style={styles.contentContainer} />
              </ScrollView>
            </>
          )}
        </SafeAreaView>
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
  quoteContainer: {
    margin: 15,
    padding: 15,
    backgroundColor: '#E8F5E9',
    borderRadius: 10,
    borderLeftWidth: 4,
    borderLeftColor: '#2E7D32',
  },
  quoteIcon: {
    marginBottom: 10,
  },
  quoteText: {
    fontSize: 16,
    fontStyle: 'italic',
    color: '#333',
    lineHeight: 24,
  },
  quoteAuthor: {
    fontSize: 14,
    color: '#666',
    textAlign: 'right',
    marginTop: 10,
  },
  chaptersContainer: {
    padding: 15,
  },
  chapterCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 10,
    marginBottom: 15,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  chapterIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#E8F5E9',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  chapterTextContainer: {
    flex: 1,
  },
  chapterTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  chapterDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  suggestionContainer: {
    margin: 15,
    marginTop: 0,
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
  suggestionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  suggestionText: {
    fontSize: 14,
    color: '#555',
    lineHeight: 20,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#2E7D32',
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    flex: 1,
  },
  modalContent: {
    flex: 1,
    padding: 15,
  },
  contentText: {
    fontSize: 16,
    lineHeight: 24,
    color: '#333',
  },
});
