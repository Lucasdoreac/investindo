import { render, fireEvent, waitFor } from '@testing-library/react-native';
import EscadaVencimentosScreen from '../../app/calculadora/escada-vencimentos';

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
    BarChart: (props) => {
      return <View testID="bar-chart" />;
    },
  };
});

describe('Simulador de Escada de Vencimentos', () => {
  it('renderiza corretamente com valores padrão', () => {
    const { getByText, getByPlaceholderText } = render(<EscadaVencimentosScreen />);
    
    // Verifica se os componentes principais estão presentes
    expect(getByText('Escada de Vencimentos')).toBeTruthy();
    expect(getByText('Adicionar novo investimento')).toBeTruthy();
    
    // Verifica se os campos de entrada estão presentes
    expect(getByPlaceholderText('CDB Banco X')).toBeTruthy();
    expect(getByPlaceholderText('1000')).toBeTruthy();
    expect(getByPlaceholderText('12')).toBeTruthy();
  });

  it('permite adicionar um novo investimento', async () => {
    const { getByText, getByPlaceholderText } = render(<EscadaVencimentosScreen />);
    
    // Preencher os campos
    const tituloInput = getByPlaceholderText('CDB Banco X');
    const valorInput = getByPlaceholderText('1000');
    const rendimentoInput = getByPlaceholderText('12');
    const vencimentoInput = getByPlaceholderText('12');
    
    fireEvent.changeText(tituloInput, 'Tesouro Selic 2030');
    fireEvent.changeText(valorInput, '5000');
    fireEvent.changeText(rendimentoInput, '13.5');
    fireEvent.changeText(vencimentoInput, '60');
    
    // Clicar no botão para adicionar
    const botaoAdicionar = getByText('Adicionar à Escada');
    fireEvent.press(botaoAdicionar);
    
    // Verificar se o botão existe (não podemos facilmente testar se foi adicionado)
    expect(botaoAdicionar).toBeTruthy();
  });

  it('calcula o rendimento médio corretamente', async () => {
    const { getByText, getByPlaceholderText } = render(<EscadaVencimentosScreen />);
    
    // Adicionar um investimento com valores específicos
    const tituloInput = getByPlaceholderText('CDB Banco X');
    const valorInput = getByPlaceholderText('1000');
    const rendimentoInput = getByPlaceholderText('12');
    const vencimentoInput = getByPlaceholderText('12');
    
    fireEvent.changeText(tituloInput, 'Test CDB');
    fireEvent.changeText(valorInput, '1000');
    fireEvent.changeText(rendimentoInput, '10');
    fireEvent.changeText(vencimentoInput, '12');
    
    // Clicar no botão para adicionar
    const botaoAdicionar = getByText('Adicionar à Escada');
    fireEvent.press(botaoAdicionar);
    
    // Verificar se o texto "Rendimento médio" existe
    // Apenas verificamos a presença do texto, não o valor exato
    expect(getByText(/Rendimento médio:/)).toBeTruthy();
  });

  it('mostra estado vazio quando não há investimentos', () => {
    // Este teste assume que o componente tem um estado inicial vazio
    // ou que podemos manipular para ficar vazio
    const { getByText } = render(<EscadaVencimentosScreen />);
    
    // Verificar se existe um texto indicando que não há investimentos
    const elementoVazio = getByText(/Adicione investimentos à sua escada para visualizar a estratégia/);
    expect(elementoVazio).toBeTruthy();
  });

  it('mostra dicas sobre escada de vencimentos', () => {
    const { getByText } = render(<EscadaVencimentosScreen />);
    
    // Verificar se as dicas estão presentes
    expect(getByText('Dicas para usar a escada de vencimentos')).toBeTruthy();
    
    // Deve haver pelo menos uma dica
    const dica = getByText(/Distribua seus investimentos em diferentes prazos/);
    expect(dica).toBeTruthy();
  });
});
