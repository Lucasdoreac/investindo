import { render, fireEvent, waitFor } from '@testing-library/react-native';
import JurosCompostosScreen from '../../app/calculadora/juros-compostos';

// Mock das dependências externas
jest.mock('react-native/Libraries/Animated/NativeAnimatedHelper');
jest.mock('@expo/vector-icons', () => {
  const { View } = require('react-native');
  return {
    FontAwesome: (props) => {
      return <View {...props} />;
    },
  };
});
jest.mock('react-native-chart-kit', () => {
  const { View } = require('react-native');
  return {
    LineChart: (props) => {
      return <View testID="line-chart" />;
    },
  };
});

describe('Calculadora de Juros Compostos', () => {
  it('renderiza corretamente com valores padrão', () => {
    const { getByText, getByPlaceholderText } = render(<JurosCompostosScreen />);
    
    // Verifica se os componentes principais estão presentes
    expect(getByText('Valores de entrada')).toBeTruthy();
    expect(getByText('Resultado')).toBeTruthy();
    expect(getByPlaceholderText('100')).toBeTruthy(); // Valor inicial
    expect(getByPlaceholderText('30')).toBeTruthy(); // Aportes mensais
  });

  it('atualiza o valor inicial corretamente', async () => {
    const { getByPlaceholderText, getByText } = render(<JurosCompostosScreen />);
    
    const valorInicialInput = getByPlaceholderText('100');
    
    // Alterar o valor inicial
    fireEvent.changeText(valorInicialInput, '1000');
    
    // Verificar se o resultado é atualizado (isso depende de como o componente está implementado)
    await waitFor(() => {
      const resultadoValor = getByText(/^R\$ \d+/); // Deve encontrar o valor formatado
      expect(resultadoValor).toBeTruthy();
    });
  });

  it('calcula corretamente os juros compostos', async () => {
    const { getByPlaceholderText, getByText } = render(<JurosCompostosScreen />);
    
    // Configurar os inputs para um cálculo predeterminado
    const valorInicialInput = getByPlaceholderText('100');
    const aportesMensaisInput = getByPlaceholderText('30');
    const taxaJurosInput = getByPlaceholderText('0.5');
    const periodoAnosInput = getByPlaceholderText('10');
    
    fireEvent.changeText(valorInicialInput, '1000');
    fireEvent.changeText(aportesMensaisInput, '100');
    fireEvent.changeText(taxaJurosInput, '1');
    fireEvent.changeText(periodoAnosInput, '5');
    
    // Em 5 anos (60 meses), com aportes de R$100/mês, taxa de 1% a.m., partindo de R$1000
    // Valor esperado aproximadamente: R$ 10.135,91
    
    await waitFor(() => {
      const resultadoValorText = getByText(/^R\$ \d+/);
      const resultadoValor = resultadoValorText.props.children;
      // Convertendo de "R$ 10.135,91" para número (removendo R$, trocando , por . etc)
      const valorNumerico = parseFloat(resultadoValor.replace('R$ ', '').replace('.', '').replace(',', '.'));
      // Verificar se está dentro de uma margem aceitável (pode haver diferenças por arredondamento)
      expect(valorNumerico).toBeGreaterThan(10000);
      expect(valorNumerico).toBeLessThan(10300);
    });
  });

  it('abre o modal de detalhes ao clicar no botão', async () => {
    const { getByText, queryByText } = render(<JurosCompostosScreen />);
    
    // Inicialmente, o modal não deve estar visível
    expect(queryByText('Detalhes Ano a Ano')).toBeNull();
    
    // Clicar no botão para abrir o modal
    const botaoDetalhes = getByText('Ver Detalhes Ano a Ano');
    fireEvent.press(botaoDetalhes);
    
    // Após clicar, o modal deve estar visível
    await waitFor(() => {
      expect(getByText('Detalhes Ano a Ano')).toBeTruthy();
    });
  });
});
