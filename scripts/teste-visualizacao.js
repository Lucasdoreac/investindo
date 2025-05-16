/**
 * Teste para verificar a funcionalidade de alternância entre visualizações no eBook
 * Este script usa Selenium WebDriver para automatizar o teste da interface
 * 
 * Para executar:
 * 1. Certifique-se de que o app esteja rodando em http://localhost:8081/biblioteca
 * 2. Execute: node scripts/teste-visualizacao.js
 */

const { Builder, By, until } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');

async function runTest() {
  // Configurar o driver do Chrome
  const options = new chrome.Options();
  const driver = await new Builder()
    .forBrowser('chrome')
    .setChromeOptions(options)
    .build();

  try {
    console.log('Iniciando teste de visualização do eBook...');
    
    // 1. Navegar para a página da biblioteca
    await driver.get('http://localhost:8081/biblioteca');
    console.log('✅ Navegou para a página da biblioteca');
    
    // 2. Clicar no primeiro capítulo
    await driver.wait(until.elementLocated(By.css('[data-testid="capitulo-1"]')), 5000);
    await driver.findElement(By.css('[data-testid="capitulo-1"]')).click();
    console.log('✅ Clicou no primeiro capítulo');
    
    // 3. Esperar o modal abrir
    await driver.wait(until.elementLocated(By.css('[data-testid="botao-alternar-visualizacao"]')), 5000);
    console.log('✅ Modal aberto com sucesso');
    
    // 4. Verificar se está na visualização padrão ou avançada
    const botaoAlternar = await driver.findElement(By.css('[data-testid="botao-alternar-visualizacao"]'));
    const textoInicial = await botaoAlternar.getText();
    console.log(`Estado inicial do botão: "${textoInicial}"`);
    
    // 5. Clicar no botão para alternar a visualização
    await botaoAlternar.click();
    await driver.sleep(1000); // Pequena pausa para animações
    console.log('✅ Clicou no botão de alternar visualização');
    
    // 6. Verificar se o texto do botão mudou
    const textoAposClique = await botaoAlternar.getText();
    console.log(`Estado após clique: "${textoAposClique}"`);
    
    if (textoInicial !== textoAposClique) {
      console.log('✅ O botão mudou de estado corretamente');
    } else {
      console.error('❌ O botão NÃO mudou de estado');
    }
    
    // 7. Clicar novamente para voltar ao estado original
    await botaoAlternar.click();
    await driver.sleep(1000);
    
    // 8. Verificar se voltou ao estado original
    const textoFinal = await botaoAlternar.getText();
    console.log(`Estado final do botão: "${textoFinal}"`);
    
    if (textoFinal === textoInicial) {
      console.log('✅ O botão voltou ao estado original');
    } else {
      console.error('❌ O botão NÃO voltou ao estado original');
    }
    
    // 9. Fechar o modal
    await driver.findElement(By.css('[data-testid="botao-fechar"]')).click();
    await driver.sleep(500);
    console.log('✅ Fechou o modal');
    
    console.log('\nTeste concluído com sucesso!');
    
  } catch (error) {
    console.error('Erro durante o teste:', error);
  } finally {
    await driver.quit();
  }
}

runTest().catch(console.error);
