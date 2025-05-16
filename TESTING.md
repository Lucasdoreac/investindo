# Testes End-to-End com MCP Server Playwright

Este documento explica como executar testes End-to-End (E2E) no aplicativo "Investindo com Sabedoria" usando Playwright.

## Pré-requisitos

- NodeJS instalado (versão 16+)
- Navegadores Playwright instalados (executado via `npm run playwright:install`)
- Projeto configurado e dependências instaladas (`npm install`)

## Tipos de Testes

O projeto possui dois tipos de testes E2E:

1. **Testes Padrão do Playwright**: Configurados em `e2e/app.spec.ts`
2. **Testes MCP Server Playwright**: Script personalizado em `scripts/mcp-playwright-test.js`

## Como Executar os Testes

### Passo 1: Iniciar o Servidor de Desenvolvimento

Em um terminal, inicie o servidor Expo:

```bash
cd /Users/lucascardoso/apps/MCP/investindo-com-sabedoria-new
npm run web
```

Aguarde até que o servidor esteja completamente inicializado e o aplicativo esteja disponível em http://localhost:19006

### Passo 2: Escolha o Tipo de Teste

#### Opção 1: Testes MCP Server Playwright

Execute em um novo terminal:

```bash
cd /Users/lucascardoso/apps/MCP/investindo-com-sabedoria-new
npm run test:mcp
```

Estes testes:
- Navegam por todas as abas principais (Início, Simuladores, Biblioteca, etc.)
- Testam a calculadora de juros compostos
- Capturam screenshots em cada etapa para verificação visual
- Exibem logs detalhados no terminal

#### Opção 2: Testes Padrão do Playwright

Execute em um novo terminal:

```bash
cd /Users/lucascardoso/apps/MCP/investindo-com-sabedoria-new
npm run test:e2e
```

Para modo visual/depuração:

```bash
npm run playwright:ui
```

## Arquivos de Screenshots

Os screenshots gerados durante os testes MCP são salvos no diretório raiz do projeto:
- `screenshot-home.png`: Página inicial
- `screenshot-simuladores.png`: Aba Simuladores
- `screenshot-biblioteca.png`: Aba Biblioteca
- `screenshot-perfil.png`: Aba Perfil
- `screenshot-glossario.png`: Aba Glossário
- `screenshot-calculadora-antes.png`: Calculadora antes de preenchimento
- `screenshot-calculadora-resultados.png`: Resultados da calculadora

## Solução de Problemas

Se ocorrerem erros durante os testes:

1. **Verifique se o servidor está rodando** em http://localhost:19006
2. **Examine os screenshots de erro** para entender onde o teste falhou
3. **Verifique logs no terminal** para mensagens de erro específicas
4. **Ajuste os seletores** em `mcp-playwright-test.js` se a interface mudou

## Personalizando os Testes

Para personalizar os testes MCP:
1. Edite `scripts/mcp-playwright-test.js`
2. Ajuste seletores, adiciones novos fluxos de teste ou modifique tempos de espera
3. Adicione novas capturas de screenshots em pontos importantes