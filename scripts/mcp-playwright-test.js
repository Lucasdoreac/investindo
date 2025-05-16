const { chromium } = require('@playwright/test');

async function runTest() {
  // Launch browser with DevTools opened
  const browser = await chromium.launch({ 
    headless: false,
    devtools: true  // Abrir com ferramentas de desenvolvedor
  });
  const context = await browser.newContext();
  const page = await context.newPage();

  try {
    console.log('🚀 Iniciando testes da aplicação "Investindo com Sabedoria"');
    
    // Navegação para a URL específica fornecida
    await page.goto('http://localhost:8082/biblioteca');
    console.log('✅ Navegou para http://localhost:8082/biblioteca');
    
    // Aguarda um tempo para garantir que a página está carregada
    await page.waitForTimeout(3000);
    console.log('✅ Aguardou carregamento da página');
    
    // Captura screenshot da página atual
    await page.screenshot({ path: 'screenshot-current-page.png' });
    console.log('📸 Screenshot da página atual capturado');

    // Deixa o navegador aberto para interação manual
    console.log('✅ Navegador aberto para inspeção manual');
    console.log('⚠️ Para encerrar o teste, feche o navegador manualmente');
    
    // Aguarda 60 segundos antes de fechar automaticamente (opcional)
    // await page.waitForTimeout(60000);
    
    // Não fechamos o navegador automaticamente para permitir inspeção
  } catch (error) {
    console.error('❌ Erro durante os testes:', error);
    await page.screenshot({ path: 'screenshot-erro.png' });
  }
  
  // Não fechamos o navegador para permitir inspeção manual
  console.log('🔍 Navegador permanecerá aberto para inspeção manual');
}

// Executa o teste
console.log('🚀 Iniciando testes com MCP Server Playwright');
runTest().catch(err => {
  console.error('❌ Erro fatal:', err);
  process.exit(1);
});
