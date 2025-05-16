# Estrutura de Conteúdo do eBook "Investindo com Sabedoria"

Este diretório contém o conteúdo organizado do eBook "Investindo com Sabedoria" de Luciana Araujo, dividido em capítulos para facilitar a manutenção e integração no aplicativo.

## Organização dos Arquivos

### Arquivos LaTeX

Os arquivos `.tex` em `assets/content/capitulos-latex/` contêm o conteúdo original do eBook formatado em LaTeX. Cada capítulo está em um arquivo separado:

- `capitulo1.tex` - A Importância de Investir aos Poucos
- `capitulo2.tex` - Ativos X Passivos: Seu Dinheiro Trabalhando Para Você
- `capitulo3.tex` - Fundos de Investimento: Investindo em Conjunto
- `capitulo4.tex` - Impostos sobre Investimentos: Otimizando Resultados
- `capitulo5.tex` - Perfil do Investidor: Autoconhecimento Para Decisões Melhores
- `capitulo6.tex` - Conclusão: Colocando Tudo em Prática

### Arquivos JSON

Os arquivos `.json` em `assets/content/` são as versões convertidas para uso no aplicativo. A estrutura JSON representa os elementos do eBook de forma estruturada para renderização no componente `EnhancedEbookContent`.

## Estrutura JSON

Os arquivos JSON seguem uma estrutura específica que representa os elementos do eBook:

```json
[
  {
    "type": "section",
    "title": "Título do Capítulo",
    "level": 1,
    "content": [
      {
        "type": "section",
        "title": "Título da Seção",
        "level": 2,
        "content": [
          {
            "type": "text",
            "content": "Texto normal",
            "style": {}
          },
          {
            "type": "text",
            "content": "Texto em negrito",
            "style": { "bold": true }
          },
          {
            "type": "list",
            "items": ["Item 1", "Item 2", "Item 3"],
            "ordered": false
          },
          {
            "type": "table",
            "headers": ["Coluna 1", "Coluna 2"],
            "rows": [
              ["Célula 1", "Célula 2"],
              ["Célula 3", "Célula 4"]
            ],
            "caption": "Legenda da tabela"
          },
          {
            "type": "formula",
            "content": "M = P \\cdot (1 + i)^n"
          },
          {
            "type": "highlight",
            "content": "Conteúdo destacado",
            "style": "info"
          },
          {
            "type": "image",
            "svg": "<svg>...</svg>",
            "caption": "Legenda da imagem"
          }
        ]
      }
    ]
  }
]
```

## Script de Conversão

O script `scripts/convert-latex-to-json.js` facilita a conversão dos arquivos LaTeX para o formato JSON. Ele processa os arquivos `.tex` e gera os arquivos `.json` correspondentes na pasta `assets/content/`.

Para executar a conversão:

```bash
node scripts/convert-latex-to-json.js
```

## Integração no Aplicativo

Os arquivos JSON são carregados no componente `BibliotecaScreen.tsx` e renderizados usando o componente `EnhancedEbookContent.tsx` quando o usuário seleciona a "Visualização Avançada".

## Notas sobre Formatação

- **Fórmulas Matemáticas**: Utilizam notação LaTeX e são renderizadas usando KaTeX via WebView.
- **Tabelas**: São convertidas para representação JSON com cabeçalhos e linhas.
- **Listas**: Suportam listas ordenadas (numeradas) e não-ordenadas (com marcadores).
- **Destaques**: Podem ter estilos diferentes (info, warning, important) para representar diferentes tipos de informação.
- **Imagens/Diagramas**: São representados como SVG embutido para garantir alta qualidade e escalabilidade.
