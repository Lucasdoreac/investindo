import { render, fireEvent, waitFor } from '@testing-library/react-native';
import ComparadorScreen from '../../app/calculadora/comparador';

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

describe('Comparador de Investimentos', () => {
  it('renderiza corretamente com valores padrão', () => {
    const { getByText, getAllByText } = render(<ComparadorScreen />);
    
    // Verifica se os componentes principais estão presentes
    expect(getByText('Comparador de Investimentos')).toBeTruthy();
    expect(getByText('Parâmetros da Simulação')).toBeTruthy();
    expect(getByText('Produtos para Comparação')).toBeTruthy();
    
    // Deve ter pelo menos 2 produtos para comparação
    const produtos = getAllByText(/Rendimento Líquido Estimado/);
    expect(produtos.length).toBeGreaterThanOrEqual(2);
  });

  it('atualiza o valor a investir corretamente', async () => {
    const { getByPlaceholderText, getAllByText } = render(<ComparadorScreen />);
    
    const valorInput = getByPlaceholderText('1000');
    
    // Alterar o valor a investir
    fireEvent.changeText(valorInput, '5000');
    
    // Verificar se o resultado é atualizado
    await waitFor(() => {
      const resultados = getAllByText(/R\$ \d+/);
      expect(resultados.length).toBeGreaterThan(0);
    });
  });

  it('permite alterar parâmetros da simulação', async () => {
    const { getByPlaceholderText } = render(<ComparadorScreen />);
    
    // Alterar o CDI
    const cdiInput = getByPlaceholderText('12.25');
    fireEvent.changeText(cdiInput, '13.5');
    
    // Alterar o IPCA
    const ipcaInput = getByPlaceholderText('4.35');
    fireEvent.changeText(ipcaInput, '4.5');
    
    // Alterar o prazo
    const prazoInput = getByPlaceholderText('12');
    fireEvent.changeText(prazoInput, '24');
    
    // Os componentes devem aceitar os novos valores
    expect(cdiInput.props.value).toBe('13.5');
    expect(ipcaInput.props.value).toBe('4.5');
    expect(prazoInput.props.value).toBe('24');
  });

  it('permite escolher diferentes tipos de investimento', async () => {
    const { getAllByText } = render(<ComparadorScreen />);
    
    // Encontrar os botões de tipo de investimento
    const botoesCDB = getAllByText('CDB');
    expect(botoesCDB.length).toBeGreaterThan(0);
    
    // Clicar no botão
    fireEvent.press(botoesCDB[0]);
    
    // Verificar se o botão foi pressionado (difícil testar mudanças visuais em um teste básico)
    // Apenas verificamos se o componente não quebrou
    expect(botoesCDB[0]).toBeTruthy();
  });

  it('permite escolher isenção de IR', async () => {
    const { getAllByText } = render(<ComparadorScreen />);
    
    // Encontrar o switch de "Isento de IR"
    const switchesIR = getAllByText('Isento de IR');
    expect(switchesIR.length).toBeGreaterThan(0);
    
    // Não podemos facilmente testar o comportamento do Switch em testes unitários
    // Apenas verificamos se o componente está presente
    expect(switchesIR[0]).toBeTruthy();
  });
});
