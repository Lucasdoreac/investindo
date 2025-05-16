const fs = require('fs');
const path = require('path');

/**
 * Script para converter conteúdo LaTeX para formato estruturado JSON
 * Este script processa o LaTeX original e cria arquivos JSON estruturados
 * para uso com o componente EnhancedEbookContent
 */

// Função para converter tabelas LaTeX para formato JSON
function parseTable(tableContent) {
  const rows = [];
  let headers = null;
  let caption = null;
  
  // Extrair caption se existir
  const captionMatch = tableContent.match(/\\caption{(.*?)}/);
  if (captionMatch) {
    caption = captionMatch[1];
  }
  
  // Extrair linhas da tabela
  const bodyContent = tableContent.match(/\\begin{tabular}.*?\n(.*?)\\end{tabular}/s);
  if (!bodyContent) return null;
  
  const lines = bodyContent[1].split('\\\\').filter(line => line.trim());
  
  // Verificar se tem cabeçalho (primeira linha com \hline)
  if (lines[0].includes('\\hline')) {
    headers = lines[0]
      .replace(/\\hline/g, '')
      .split('&')
      .map(cell => cell.trim());
    
    // Remover primeira linha (cabeçalho)
    lines.shift();
  }
  
  // Processar linhas restantes
  for (const line of lines) {
    if (line.trim() === '\\hline') continue;
    
    const cells = line
      .replace(/\\hline/g, '')
      .split('&')
      .map(cell => cell.trim());
      
    rows.push(cells);
  }
  
  return {
    type: 'table',
    headers,
    rows,
    caption
  };
}

// Função para extrair fórmulas LaTeX
function parseFormula(content) {
  return {
    type: 'formula',
    content: content.trim()
  };
}

// Função para extrair listas
function parseList(content, ordered = false) {
  const items = [];
  const itemLines = content.split(ordered ? '\\item' : '\\item').slice(1);
  
  for (const line of itemLines) {
    items.push(line.trim());
  }
  
  return {
    type: 'list',
    items,
    ordered
  };
}

// Função para processar boxes/highlights
function parseHighlight(content, style = 'info') {
  return {
    type: 'highlight',
    content: content.trim(),
    style
  };
}

// Função para processar seções
function parseSection(title, level, content) {
  return {
    type: 'section',
    title: title.trim(),
    level,
    content: parseContent(content) // Processa o conteúdo recursivamente
  };
}

// Função principal para processar conteúdo
function parseContent(latexContent) {
  const elements = [];
  
  // Dividir o conteúdo em diferentes tipos de elementos
  const lines = latexContent.split('\n');
  let currentSection = null;
  let sectionContent = '';
  let inTable = false;
  let tableContent = '';
  let inFormula = false;
  let formulaContent = '';
  let inList = false;
  let listContent = '';
  let inBox = false;
  let boxContent = '';
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    
    // Processamento de tabelas
    if (line.includes('\\begin{table}') || line.includes('\\begin{tabular}')) {
      inTable = true;
      tableContent = line;
      continue;
    }
    
    if (inTable) {
      tableContent += '\n' + line;
      if (line.includes('\\end{table}') || line.includes('\\end{tabular}')) {
        inTable = false;
        elements.push(parseTable(tableContent));
      }
      continue;
    }
    
    // Processamento de fórmulas
    if (line.includes('\\begin{equation}') || line.match(/\$\$/)) {
      inFormula = true;
      formulaContent = line.replace('\\begin{equation}', '').replace('$$', '');
      continue;
    }
    
    if (inFormula) {
      formulaContent += '\n' + line;
      if (line.includes('\\end{equation}') || line.match(/\$\$/)) {
        inFormula = false;
        formulaContent = formulaContent.replace('\\end{equation}', '').replace('$$', '');
        elements.push(parseFormula(formulaContent));
      }
      continue;
    }
    
    // Processamento de listas
    if (line.includes('\\begin{itemize}') || line.includes('\\begin{enumerate}')) {
      inList = true;
      listContent = '';
      continue;
    }
    
    if (inList) {
      listContent += '\n' + line;
      if (line.includes('\\end{itemize}') || line.includes('\\end{enumerate}')) {
        inList = false;
        elements.push(parseList(
          listContent, 
          line.includes('\\end{enumerate}')
        ));
      }
      continue;
    }
    
    // Processamento de caixas/destaques
    if (line.includes('\\begin{minipage}') || line.includes('\\fbox{')) {
      inBox = true;
      boxContent = '';
      continue;
    }
    
    if (inBox) {
      boxContent += '\n' + line;
      if (line.includes('\\end{minipage}') || line.includes('}')) {
        inBox = false;
        
        // Determinar o estilo baseado no conteúdo
        let style = 'info';
        if (boxContent.toLowerCase().includes('importante') || 
            boxContent.toLowerCase().includes('atenção')) {
          style = 'important';
        } else if (boxContent.toLowerCase().includes('observação') || 
                  boxContent.toLowerCase().includes('nota')) {
          style = 'warning';
        }
        
        elements.push(parseHighlight(boxContent, style));
      }
      continue;
    }
    
    // Processamento de capítulos e seções
    if (line.match(/\\chapter{(.*?)}/)) {
      const title = line.match(/\\chapter{(.*?)}/)[1];
      
      if (currentSection) {
        elements.push(parseSection(
          currentSection.title, 
          currentSection.level, 
          sectionContent
        ));
      }
      
      currentSection = { title, level: 1 };
      sectionContent = '';
      continue;
    }
    
    if (line.match(/\\section{(.*?)}/)) {
      const title = line.match(/\\section{(.*?)}/)[1];
      
      if (currentSection) {
        elements.push(parseSection(
          currentSection.title, 
          currentSection.level, 
          sectionContent
        ));
      }
      
      currentSection = { title, level: 2 };
      sectionContent = '';
      continue;
    }
    
    if (line.match(/\\subsection{(.*?)}/)) {
      const title = line.match(/\\subsection{(.*?)}/)[1];
      
      if (currentSection) {
        elements.push(parseSection(
          currentSection.title, 
          currentSection.level, 
          sectionContent
        ));
      }
      
      currentSection = { title, level: 3 };
      sectionContent = '';
      continue;
    }
    
    // Se estamos em uma seção, adicionar o conteúdo
    if (currentSection) {
      sectionContent += line + '\n';
    } else {
      // Caso contrário, tratar como texto normal
      if (line.trim()) {
        elements.push({
          type: 'text',
          content: line.trim(),
          style: {}
        });
      }
    }
  }
  
  // Adicionar a última seção se existir
  if (currentSection) {
    elements.push(parseSection(
      currentSection.title, 
      currentSection.level, 
      sectionContent
    ));
  }
  
  return elements;
}

// Função para converter o arquivo LaTeX
function convertLatexFile(inputFilePath, outputFilePath) {
  try {
    const latexContent = fs.readFileSync(inputFilePath, 'utf8');
    const parsed = parseContent(latexContent);
    
    // Converter para JSON e garantir que todas as aspas sejam retas
    const jsonString = JSON.stringify(parsed, null, 2)
      .replace(/[""]/g, '"')  // Substituir aspas curvas por aspas retas
      .replace(/['']/g, "'"); // Substituir apóstrofos curvos por retos
    
    fs.writeFileSync(
      outputFilePath,
      jsonString,
      'utf8'
    );
    
    console.log(`Conversão concluída: ${outputFilePath}`);
  } catch (error) {
    console.error(`Erro ao converter arquivo: ${error.message}`);
  }
}

// Processar arquivos LaTeX do projeto
const inputDir = path.join(__dirname, '..', 'assets', 'latex');
const outputDir = path.join(__dirname, '..', 'assets', 'content');

// Verifica se o diretório de entrada existe, senão cria
if (!fs.existsSync(inputDir)) {
  fs.mkdirSync(inputDir, { recursive: true });
  console.log(`Diretório de entrada criado: ${inputDir}`);
  console.log(`Por favor, coloque seu arquivo LaTeX neste diretório e execute o script novamente.`);
  process.exit(0);
}

// Verifica se o diretório de saída existe, senão cria
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// Converter todos os arquivos .tex ou .latex do diretório de entrada
fs.readdirSync(inputDir)
  .filter(file => file.endsWith('.tex') || file.endsWith('.latex'))
  .forEach(file => {
    const inputFilePath = path.join(inputDir, file);
    const outputFilePath = path.join(
      outputDir, 
      file.replace(/\.(tex|latex)$/, '.json')
    );
    
    convertLatexFile(inputFilePath, outputFilePath);
  });

console.log('Conversão de todos os arquivos concluída.');
