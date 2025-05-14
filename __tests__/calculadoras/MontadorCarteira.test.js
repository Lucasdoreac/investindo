import { render, fireEvent, waitFor } from '@testing-library/react-native';
import MontadorCarteiraScreen from '../../app/calculadora/montador-carteira';

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
    PieChart: (props) => {
      return <View testID="pie-chart" />;
    },
  };
});

describe('Montador de Carteira', () => {
  it('renderiza corretamente com valores padrão', () => {
    const { getByText, getAllByText } = render(<MontadorCarteiraScreen />);
    
    // Verifica se os componentes principais estão presentes
    expect(getByText('Montador de Carteira')).toBeTruthy();
    expect(getByText('Valor da Carteira (opcional)')).toBeTruthy();
    expect(getByText('Seu Perfil de Investidor')).toBeTruthy();
    expect(getByText('Composição da Carteira')).toBeTruthy();
    
    // Verificar se os perfis estão presentes
    expect(getByText('Conservador')).toBeTruthy();
    expect(getByText('Moderado')).toBeTruthy();
    expect(getByText('Arrojado')).toBeTruthy();
  });

  it('permite selecionar perfil de investidor', () => {
    const { getByText } = render(<MontadorCarteiraScreen />);
    
    // Encontrar e clicar no perfil conservador
    const perfilConservador = getByText('Conservador');
    fireEvent.press(perfilConservador);
    
    // Encontrar e clicar no perfil arrojado
    const perfilArrojado = getByText('Arrojado');
    fireEvent.press(perfilArrojado);
    
    // Verificamos apenas se não quebrou ao trocar os perfis
    expect(perfilArrojado).toBeTruthy();
  });

  it('permite atualizar o valor da carteira', () => {
    const { getByPlaceholderText } = render(<MontadorCarteiraScreen />);
    
    // Encontrar o input do valor
    const valorInput = getByPlaceholderText('Exemplo: 10000');
    
    // Atualizar o valor
    fireEvent.changeText(valorInput, '50000');
    
    // Verificar se o valor foi atualizado
    expect(valorInput.props.value).toBe('50000');
  });

  it('mostra alocações conforme o perfil selecionado', () => {
    const { getByText, getAllByText } = render(<MontadorCarteiraScreen />);
    
    // Por padrão, deve exibir algumas alocações
    const total = getByText('Total');
    expect(total).toBeTruthy();
    
    // Deve ter algumas porcentagens
    const porcentagens = getAllByText(/%$/);
    expect(porcentagens.length).toBeGreaterThan(0);
  });

  it('permite reiniciar a carteira', () => {
    const { getByText } = render(<MontadorCarteiraScreen />);
    
    // Encontrar o botão de reiniciar
    const botaoReiniciar = getByText('Reiniciar');
    
    // Clicar no botão
    fireEvent.press(botaoReiniciar);
    
    // Verificamos apenas se não quebrou ao reiniciar
    expect(botaoReiniciar).toBeTruthy();
  });

  it('avalia a aderência ao perfil', () => {
    const { getByText } = render(<MontadorCarteiraScreen />);
    
    // Deve mostrar alguma avaliação de aderência
    const textoAderencia = getByText(/Carteira adequada ao perfil|Ajustes recomendados/);
    expect(textoAderencia).toBeTruthy();
  });
});
