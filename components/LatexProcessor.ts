/**
 * Utilitário para processar e converter comandos LaTeX em dados formatados
 * para exibição no componente EnhancedEbookContent
 */

// Tipo de elemento processado
import { LatexElement } from '../types/LatexTypes';

/**
 * Processa um objeto de conteúdo LaTeX e converte comandos para formato estruturado
 * @param content Objeto de conteúdo com possíveis comandos LaTeX
 * @returns Objeto processado com comandos convertidos para formato adequado
 */
export function processLatexCommands(content: any): any {
  // Se o conteúdo for um array
  if (Array.isArray(content)) {
    return content.map(item => processLatexCommands(item));
  }

  // Se o conteúdo for um objeto (verificar se tem tipo 'text')
  if (content && typeof content === 'object' && content.type === 'text') {
    // Processar o texto para remover/substituir comandos LaTeX comuns
    const processedContent = {
      ...content,
      content: processLatexText(content.content),
    };
    
    // Atualizar estilo com base em comandos
    if (content.content.includes('\\textbf{')) {
      processedContent.style = {
        ...processedContent.style,
        bold: true,
      };
    }
    
    if (content.content.includes('\\textit{')) {
      processedContent.style = {
        ...processedContent.style,
        italic: true,
      };
    }
    
    return processedContent;
  }
  
  // Para outros tipos de elementos, retornar como está
  return content;
}

/**
 * Processa texto contendo comandos LaTeX e substitui por equivalentes simples
 * @param text Texto com possíveis comandos LaTeX
 * @returns Texto processado sem comandos LaTeX
 */
function processLatexText(text: string): string {
  // Substituir comandos LaTeX comuns
  let processed = text;
  
  // Ignorar comandos de hipertarget
  processed = processed.replace(/\\hypertarget{.*?}{}/g, '');
  
  // Remover comandos de espaçamento vertical
  processed = processed.replace(/\\vspace{.*?}/g, '');
  
  // Remover comandos de indentação
  processed = processed.replace(/\\noindent/g, '');
  
  // Processar negrito
  processed = processed.replace(/\\textbf{(.*?)}/g, '$1');
  
  // Processar itálico
  processed = processed.replace(/\\textit{(.*?)}/g, '$1');
  
  // Remover comandos de centro
  processed = processed.replace(/\\begin{center}|\\end{center}/g, '');
  
  // Remover comandos de ambiente picture
  processed = processed.replace(/\\begin{picture}.*?\\end{picture}/gs, '[FIGURA]');
  
  // Remover comandos de ambiente minipage
  processed = processed.replace(/\\begin{minipage}.*?\\end{minipage}/gs, '');
  
  // Remover comandos de ambiente itemize/enumerate
  processed = processed.replace(/\\end{itemize}|\\end{enumerate}/g, '');
  
  // Remover comandos de fim de tabela
  processed = processed.replace(/\\end{table}/g, '');
  
  // Remover comandos de caption
  processed = processed.replace(/\\caption{(.*?)}/g, '');
  
  // Remover comandos de label
  processed = processed.replace(/\\label{.*?}/g, '');
  
  // Remover caracteres de escape de underscores
  processed = processed.replace(/\\_/g, '_');
  
  // Remover caracteres de escape de porcentagem
  processed = processed.replace(/\\%/g, '%');
  
  // Remover comandos de subsection/subsubsection
  processed = processed.replace(/\\subsubsection{(.*?)}/g, '$1');
  
  // Remover traços duplos ou triplos LaTeX para traço simples
  processed = processed.replace(/---/g, '—');
  processed = processed.replace(/--/g, '–');
  
  // Substituir comandos makeboxes por seu conteúdo
  processed = processed.replace(/\\makebox\(.*?\){(.*?)}/g, '$1');
  
  // Remover comandos put (usados para desenhar)
  processed = processed.replace(/\\put\(.*?\){.*?}/g, '');
  
  return processed;
}

/**
 * Corrige os nós de lista no objeto JSON para garantir que estejam conectados 
 * às seções corretas e formatados adequadamente
 * @param content Objeto JSON de conteúdo do capítulo
 * @returns Objeto JSON corrigido com listas adequadamente estruturadas
 */
export function fixListStructure(content: any[]): any[] {
  const result: any[] = [];
  let currentSection: any = null;
  
  // Primeiro passo: coletar todas as seções
  for (let i = 0; i < content.length; i++) {
    const item = content[i];
    
    if (item.type === 'section') {
      currentSection = { ...item, content: [...item.content] };
      result.push(currentSection);
    } else if (item.type === 'list') {
      // Se encontrarmos uma lista fora de uma seção, conectá-la à seção anterior
      if (currentSection) {
        // Processar itens de lista para remover comandos LaTeX
        const processedItems = item.items.map((listItem: any) => {
          if (typeof listItem === 'string') {
            return processLatexText(listItem);
          }
          return listItem;
        });
        
        // Adicionar a lista processada à seção atual
        currentSection.content.push({
          type: 'list',
          items: processedItems,
          ordered: item.ordered || false
        });
      } else {
        // Se não houver seção anterior, criar uma seção genérica
        currentSection = {
          type: 'section',
          title: 'Lista',
          level: 3,
          content: [{
            type: 'list',
            items: item.items.map((listItem: any) => {
              if (typeof listItem === 'string') {
                return processLatexText(listItem);
              }
              return listItem;
            }),
            ordered: item.ordered || false
          }]
        };
        result.push(currentSection);
      }
    } else {
      // Outros tipos de elementos são adicionados à seção atual ou ignorados
      if (currentSection) {
        currentSection.content.push(item);
      } else {
        result.push(item);
      }
    }
  }
  
  return result;
}

/**
 * Processa completamente o conteúdo LaTeX para ser exibido corretamente
 * @param content Conteúdo original do capítulo
 * @returns Conteúdo processado pronto para exibição
 */
export function processLatexContent(content: any[]): LatexElement[] {
  // Primeiro fixar a estrutura de listas
  const structureFixed = fixListStructure(content);
  
  // Depois processar comandos LaTeX em todos os textos
  return processLatexCommands(structureFixed);
}
