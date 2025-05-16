import React from 'react';
import { Text, View, StyleSheet, ScrollView, Dimensions, Platform, TouchableOpacity } from 'react-native';
import { WebView } from 'react-native-webview';
import { FontAwesome } from '@expo/vector-icons';

// Definição dos tipos de elementos do conteúdo LaTeX
interface LatexTable {
  type: 'table';
  headers?: string[];
  rows: string[][];
  caption?: string;
}

interface LatexFormula {
  type: 'formula';
  content: string;
}

interface LatexHighlight {
  type: 'highlight';
  content: string | LatexElement[];
  style?: 'info' | 'warning' | 'important';
}

interface LatexList {
  type: 'list';
  items: (string | LatexElement | LatexElement[])[];
  ordered?: boolean;
}

interface LatexImage {
  type: 'image';
  svg?: string; // SVG XML content para diagramas e fórmulas
  caption?: string;
}

interface LatexText {
  type: 'text';
  content: string;
  style?: {
    bold?: boolean;
    italic?: boolean;
    size?: 'small' | 'normal' | 'large' | 'heading' | 'title';
    color?: string;
  };
}

interface LatexSection {
  type: 'section';
  title: string;
  level: number; // 1 = chapter, 2 = section, 3 = subsection, etc.
  content: LatexElement[];
}

type LatexElement = LatexText | LatexSection | LatexTable | 
                   LatexFormula | LatexHighlight | LatexList | LatexImage;

interface EnhancedEbookContentProps {
  content: LatexElement[] | string;
  style?: any;
}

/**
 * Componente aprimorado para renderizar conteúdo do eBook com suporte a elementos LaTeX
 * Capaz de lidar com tabelas, fórmulas matemáticas, diagramas e formatação avançada
 */
export default function EnhancedEbookContent({ content, style }: EnhancedEbookContentProps) {
  // Se o conteúdo for string, usa o processamento legado do markdown
  if (typeof content === 'string') {
    return renderMarkdownContent(content, style);
  }
  
  // Se for um array de elementos LaTeX, renderiza cada um
  return (
    <ScrollView 
      style={[styles.container, style]}
      contentContainerStyle={styles.contentContainer}
    >
      {content.map((element, index) => renderElement(element, index))}
    </ScrollView>
  );
}

// Renderiza um elemento LaTeX baseado em seu tipo
function renderElement(element: LatexElement, index: number): React.ReactNode {
  switch (element.type) {
    case 'text':
      return renderText(element, index);
    case 'section':
      return renderSection(element, index);
    case 'table':
      return renderTable(element, index);
    case 'formula':
      return renderFormula(element, index);
    case 'highlight':
      return renderHighlight(element, index);
    case 'list':
      return renderList(element, index);
    case 'image':
      return renderImage(element, index);
    default:
      return null;
  }
}

// Renderiza elemento de texto com formatação
function renderText(element: LatexText, index: number): React.ReactNode {
  const { content, style: textStyle } = element;
  let textStyles = [styles.paragraph];
  
  if (textStyle) {
    if (textStyle.bold) textStyles.push(styles.bold);
    if (textStyle.italic) textStyles.push(styles.italic);
    
    if (textStyle.size === 'small') textStyles.push(styles.small);
    if (textStyle.size === 'large') textStyles.push(styles.large);
    if (textStyle.size === 'heading') textStyles.push(styles.heading);
    if (textStyle.size === 'title') textStyles.push(styles.title);
  }
  
  return (
    <Text key={`text-${index}`} style={textStyles}>
      {content}
    </Text>
  );
}

// Renderiza seção com título e conteúdo
function renderSection(element: LatexSection, index: number): React.ReactNode {
  const { title, level, content } = element;
  
  let titleStyle;
  switch (level) {
    case 1:
      titleStyle = styles.mainTitle;
      break;
    case 2:
      titleStyle = styles.subtitle;
      break;
    case 3:
      titleStyle = styles.subsubtitle;
      break;
    default:
      titleStyle = styles.paragraph;
  }
  
  return (
    <View key={`section-${index}`} style={styles.sectionContainer}>
      <Text style={titleStyle}>{title}</Text>
      <View style={styles.sectionContent}>
        {content.map((item, idx) => renderElement(item, idx))}
      </View>
    </View>
  );
}

// Renderiza tabela
function renderTable(element: LatexTable, index: number): React.ReactNode {
  const { headers, rows, caption } = element;
  
  return (
    <View key={`table-${index}`} style={styles.tableContainer}>
      {headers && (
        <View style={styles.tableRow}>
          {headers.map((header, idx) => (
            <View key={`header-${idx}`} style={styles.tableHeaderCell}>
              <Text style={styles.tableHeaderText}>{header}</Text>
            </View>
          ))}
        </View>
      )}
      
      {rows.map((row, rowIdx) => (
        <View 
          key={`row-${rowIdx}`} 
          style={[
            styles.tableRow,
            rowIdx % 2 === 0 ? styles.tableRowEven : styles.tableRowOdd
          ]}
        >
          {row.map((cell, cellIdx) => (
            <View key={`cell-${rowIdx}-${cellIdx}`} style={styles.tableCell}>
              <Text style={styles.tableCellText}>{cell}</Text>
            </View>
          ))}
        </View>
      ))}
      
      {caption && (
        <Text style={styles.tableCaption}>{caption}</Text>
      )}
    </View>
  );
}

// Renderiza fórmula matemática usando WebView com KaTeX ou texto simples para web
function renderFormula(element: LatexFormula, index: number): React.ReactNode {
  const { content } = element;
  
  // Verificar se estamos na plataforma web
  const isWeb = Platform.OS === 'web';
  
  if (isWeb) {
    // Renderização simplificada para plataforma web
    return (
      <View key={`formula-${index}`} style={styles.formulaContainer}>
        <Text style={styles.formulaText}>
          {content}
        </Text>
        <Text style={styles.formulaNote}>
          (Fórmula matemática: visualização completa disponível no aplicativo móvel)
        </Text>
      </View>
    );
  }
  
  // Configura HTML com KaTeX para renderizar a fórmula (para plataformas nativas)
  // Melhorado com tratamento de erros e fallback
  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/KaTeX/0.16.9/katex.min.css">
        <script src="https://cdnjs.cloudflare.com/ajax/libs/KaTeX/0.16.9/katex.min.js"></script>
        <style>
          body {
            margin: 0;
            padding: 0;
            display: flex;
            justify-content: center;
            background-color: transparent;
            overflow: hidden;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
          }
          .formula-container {
            padding: 8px 0;
            width: 100%;
            text-align: center;
          }
          .error-message {
            color: #666;
            font-style: italic;
            padding: 10px;
            border-left: 3px solid #c00;
            margin: 10px 0;
            background-color: #f8f8f8;
          }
        </style>
      </head>
      <body>
        <div class="formula-container" id="formula"></div>
        <script>
          document.addEventListener('DOMContentLoaded', function() {
            try {
              // Verificar se KaTeX está disponível
              if (typeof katex === 'undefined') {
                throw new Error('KaTeX não está disponível');
              }
              
              // Renderizar a fórmula
              katex.render("${content.replace(/"/g, '\\"')}", document.getElementById('formula'), {
                throwOnError: false,
                displayMode: true
              });
            } catch (error) {
              // Fallback para quando KaTeX falhar
              document.getElementById('formula').innerHTML = 
                '<div class="error-message">Fórmula matemática: <br/><code>${content.replace(/"/g, '\\"')}</code></div>';
              console.error('Erro ao renderizar fórmula LaTeX:', error);
            } finally {
              // Ajusta altura do WebView
              const height = document.body.scrollHeight;
              window.ReactNativeWebView.postMessage(height.toString());
            }
          });
        </script>
      </body>
    </html>
  `;

  const [webViewHeight, setWebViewHeight] = React.useState(50);
  
  // Calcula altura da fórmula quando o WebView enviar a mensagem
  const onMessage = (event: any) => {
    const height = parseInt(event.nativeEvent.data);
    if (!isNaN(height)) {
      setWebViewHeight(height);
    }
  };
  
  const [hasError, setHasError] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(true);

  // Função para lidar com erros no WebView
  const handleError = () => {
    setHasError(true);
    setIsLoading(false);
  };

  // Função para recarregar o WebView
  const reloadWebView = () => {
    setHasError(false);
    setIsLoading(true);
  };

  return (
    <View key={`formula-${index}`} style={styles.formulaContainer}>
      {isLoading && (
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Carregando fórmula...</Text>
        </View>
      )}
      
      {hasError ? (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Não foi possível renderizar a fórmula matemática.</Text>
          <Text style={styles.formulaText}>{content}</Text>
          <TouchableOpacity style={styles.reloadButton} onPress={reloadWebView}>
            <Text style={styles.reloadButtonText}>Tentar novamente</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <WebView
          source={{ html }}
          style={[styles.formulaWebView, { height: webViewHeight }]}
          scrollEnabled={false}
          onMessage={onMessage}
          onError={handleError}
          onHttpError={handleError}
          onLoad={() => setIsLoading(false)}
          originWhitelist={['*']}
          backgroundColor="transparent"
        />
      )}
    </View>
  );
}

// Renderiza destaque (caixa colorida com conteúdo)
function renderHighlight(element: LatexHighlight, index: number): React.ReactNode {
  const { content, style: highlightStyle = 'info' } = element;
  
  let containerStyle = [styles.highlightContainer];
  let iconName: any = 'info-circle';
  
  switch (highlightStyle) {
    case 'info':
      containerStyle.push(styles.highlightInfo);
      iconName = 'info-circle';
      break;
    case 'warning':
      containerStyle.push(styles.highlightWarning);
      iconName = 'exclamation-triangle';
      break;
    case 'important':
      containerStyle.push(styles.highlightImportant);
      iconName = 'exclamation-circle';
      break;
  }
  
  return (
    <View key={`highlight-${index}`} style={containerStyle}>
      <View style={styles.highlightIconContainer}>
        <FontAwesome name={iconName} size={20} color="#2E7D32" />
      </View>
      <View style={styles.highlightContent}>
        {typeof content === 'string' ? (
          <Text style={styles.highlightText}>{content}</Text>
        ) : (
          content.map((item, idx) => renderElement(item, idx))
        )}
      </View>
    </View>
  );
}

// Renderiza listas ordenadas ou não-ordenadas
function renderList(element: LatexList, index: number): React.ReactNode {
  const { items, ordered = false } = element;
  
  return (
    <View key={`list-${index}`} style={styles.listContainer}>
      {items.map((item, idx) => (
        <View key={`item-${idx}`} style={styles.listItemContainer}>
          <View style={styles.listBullet}>
            {ordered ? (
              <Text style={styles.listBulletText}>{idx + 1}.</Text>
            ) : (
              <Text style={styles.listBulletText}>•</Text>
            )}
          </View>
          <View style={styles.listItemContent}>
            {typeof item === 'string' ? (
              <Text style={styles.listItemText}>{item}</Text>
            ) : (
              // Verificação segura para garantir que item é um array antes de chamar .map()
              Array.isArray(item) ? (
                item.map((subItem, subIdx) => renderElement(subItem, subIdx))
              ) : (
                // Se não for string nem array, renderiza como elemento individual
                renderElement(item, 0)
              )
            )}
          </View>
        </View>
      ))}
    </View>
  );
}

// Renderiza imagens e diagramas SVG
function renderImage(element: LatexImage, index: number): React.ReactNode {
  const { svg, caption } = element;
  
  // Se for um SVG, renderiza via WebView ou via componente alternativo para web
  if (svg) {
    // Verificar se estamos na plataforma web
    const isWeb = Platform.OS === 'web';
    
    if (isWeb) {
      // Para a web, usamos uma abordagem diferente para SVG
      // Esta é uma renderização simplificada - na plataforma web mostramos apenas uma mensagem
      return (
        <View key={`image-${index}`} style={styles.imageContainer}>
          <View style={styles.placeholderSvg}>
            <Text style={styles.placeholderText}>
              (Diagrama visual disponível no aplicativo móvel)
            </Text>
          </View>
          {caption && <Text style={styles.imageCaption}>{caption}</Text>}
        </View>
      );
    }
    
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>
            body {
              margin: 0;
              padding: 0;
              display: flex;
              justify-content: center;
              background-color: transparent;
              overflow: hidden;
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
            }
            svg {
              max-width: 100%;
              height: auto;
            }
            .error-message {
              color: #666;
              font-style: italic;
              padding: 10px;
              border-left: 3px solid #c00;
              margin: 10px 0;
              background-color: #f8f8f8;
              text-align: center;
              width: 100%;
            }
          </style>
        </head>
        <body>
          <div id="svg-container">
            ${svg}
          </div>
          <script>
            document.addEventListener('DOMContentLoaded', function() {
              try {
                // Verificar se o SVG foi renderizado corretamente
                const svgElement = document.querySelector('svg');
                if (!svgElement) {
                  throw new Error('SVG não foi renderizado corretamente');
                }
              } catch (error) {
                // Fallback para quando o SVG falhar
                document.getElementById('svg-container').innerHTML = 
                  '<div class="error-message">Não foi possível renderizar o diagrama SVG.</div>';
                console.error('Erro ao renderizar SVG:', error);
              } finally {
                // Ajusta altura do WebView
                const height = document.body.scrollHeight;
                window.ReactNativeWebView.postMessage(height.toString());
              }
            });
          </script>
        </body>
      </html>
    `;

    const [webViewHeight, setWebViewHeight] = React.useState(200);
    
    const onMessage = (event: any) => {
      const height = parseInt(event.nativeEvent.data);
      if (!isNaN(height)) {
        setWebViewHeight(height);
      }
    };
    
    const [hasError, setHasError] = React.useState(false);
    const [isLoading, setIsLoading] = React.useState(true);

    // Função para lidar com erros no WebView
    const handleError = () => {
      setHasError(true);
      setIsLoading(false);
    };

    // Função para recarregar o WebView
    const reloadWebView = () => {
      setHasError(false);
      setIsLoading(true);
    };

    return (
      <View key={`image-${index}`} style={styles.imageContainer}>
        {isLoading && (
          <View style={styles.loadingContainer}>
            <Text style={styles.loadingText}>Carregando diagrama...</Text>
          </View>
        )}
        
        {hasError ? (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>Não foi possível renderizar o diagrama SVG.</Text>
            <TouchableOpacity style={styles.reloadButton} onPress={reloadWebView}>
              <Text style={styles.reloadButtonText}>Tentar novamente</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <WebView
            source={{ html }}
            style={[styles.svgWebView, { height: webViewHeight }]}
            scrollEnabled={false}
            onMessage={onMessage}
            onError={handleError}
            onHttpError={handleError}
            onLoad={() => setIsLoading(false)}
            originWhitelist={['*']}
            backgroundColor="transparent"
          />
        )}
        {caption && <Text style={styles.imageCaption}>{caption}</Text>}
      </View>
    );
  }
  
  return null;
}

// Renderiza conteúdo markdown legado
function renderMarkdownContent(content: string, style: any): React.ReactNode {
  // Dividir o conteúdo em linhas
  const lines = content.split('\n');
  const elements: JSX.Element[] = [];
  
  // Iteramos por cada linha para determinar seu tipo e renderizá-la adequadamente
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    
    // Pular linhas vazias
    if (line === '') continue;
    
    // Verificar se é um título principal
    if (line.startsWith('# ')) {
      elements.push(
        <Text key={i} style={styles.mainTitle}>
          {line.replace('# ', '')}
        </Text>
      );
      continue;
    }
    
    // Verificar se é um subtítulo nível 2
    if (line.startsWith('## ')) {
      elements.push(
        <Text key={i} style={styles.subtitle}>
          {line.replace('## ', '')}
        </Text>
      );
      continue;
    }
    
    // Verificar se é um subtítulo nível 3
    if (line.startsWith('### ')) {
      elements.push(
        <Text key={i} style={styles.subsubtitle}>
          {line.replace('### ', '')}
        </Text>
      );
      continue;
    }
    
    // Verificar se é uma lista com marcadores
    if (line.startsWith('- ') || line.startsWith('• ')) {
      elements.push(
        <View key={i} style={styles.bulletItem}>
          <Text style={styles.bullet}>•</Text>
          <Text style={styles.bulletText}>
            {line.replace(/^[-•]\s/, '')}
          </Text>
        </View>
      );
      continue;
    }
    
    // Verificar se é texto em negrito
    if (line.includes('**') || line.includes('__')) {
      // Processa marcações de negrito
      const parts = line.split(/(\*\*.*?\*\*|__.*?__)/g);
      
      elements.push(
        <Text key={i} style={styles.paragraph}>
          {parts.map((part, idx) => {
            if (part.startsWith('**') && part.endsWith('**')) {
              return <Text key={idx} style={styles.bold}>{part.slice(2, -2)}</Text>;
            }
            if (part.startsWith('__') && part.endsWith('__')) {
              return <Text key={idx} style={styles.bold}>{part.slice(2, -2)}</Text>;
            }
            return part;
          })}
        </Text>
      );
      continue;
    }
    
    // Verificar se é texto em itálico
    if (line.includes('*') || line.includes('_')) {
      // Processa marcações de itálico
      const parts = line.split(/(\*.*?\*|_.*?_)/g);
      
      elements.push(
        <Text key={i} style={styles.paragraph}>
          {parts.map((part, idx) => {
            if (part.startsWith('*') && part.endsWith('*') && !part.startsWith('**')) {
              return <Text key={idx} style={styles.italic}>{part.slice(1, -1)}</Text>;
            }
            if (part.startsWith('_') && part.endsWith('_') && !part.startsWith('__')) {
              return <Text key={idx} style={styles.italic}>{part.slice(1, -1)}</Text>;
            }
            return part;
          })}
        </Text>
      );
      continue;
    }
    
    // Verificar se é uma citação
    if (line.startsWith('> ')) {
      elements.push(
        <View key={i} style={styles.quoteContainer}>
          <Text style={styles.quote}>
            {line.replace('> ', '')}
          </Text>
        </View>
      );
      continue;
    }
    
    // Parágrafo normal
    elements.push(
      <Text key={i} style={styles.paragraph}>
        {line}
      </Text>
    );
  }
  
  return (
    <ScrollView 
      style={[styles.container, style]}
      contentContainerStyle={styles.contentContainer}
    >
      {elements}
    </ScrollView>
  );
}

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  contentContainer: {
    padding: 16,
  },
  // Estilos de texto
  mainTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2E7D32',
    marginBottom: 16,
    marginTop: 8,
  },
  subtitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#2E7D32',
    marginBottom: 14,
    marginTop: 16,
  },
  subsubtitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
    marginTop: 14,
  },
  paragraph: {
    fontSize: 16,
    lineHeight: 24,
    color: '#333',
    marginBottom: 12,
  },
  small: {
    fontSize: 14,
  },
  large: {
    fontSize: 18,
  },
  heading: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
  },
  bold: {
    fontWeight: 'bold',
  },
  italic: {
    fontStyle: 'italic',
  },
  
  // Estilos de seção
  sectionContainer: {
    marginBottom: 20,
  },
  sectionContent: {
    paddingLeft: 5,
  },
  
  // Estilos de tabela
  tableContainer: {
    marginVertical: 15,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    overflow: 'hidden',
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  tableHeaderCell: {
    flex: 1,
    padding: 10,
    backgroundColor: '#f5f5f5',
  },
  tableHeaderText: {
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
  },
  tableCell: {
    flex: 1,
    padding: 10,
  },
  tableCellText: {
    color: '#333',
    textAlign: 'center',
  },
  tableRowEven: {
    backgroundColor: '#fff',
  },
  tableRowOdd: {
    backgroundColor: '#f9f9f9',
  },
  tableCaption: {
    padding: 10,
    fontSize: 14,
    fontStyle: 'italic',
    color: '#666',
    textAlign: 'center',
    borderTopWidth: 1,
    borderTopColor: '#ddd',
  },
  
  // Estilos de fórmula
  formulaContainer: {
    marginVertical: 10,
    width: '100%',
    padding: 10,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#2E7D32',
  },
  formulaWebView: {
    width: '100%',
    backgroundColor: 'transparent',
  },
  formulaText: {
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
    fontSize: 16,
    textAlign: 'center',
    padding: 10,
  },
  formulaNote: {
    fontSize: 12,
    fontStyle: 'italic',
    color: '#666',
    textAlign: 'center',
    marginTop: 5,
  },
  // Estilos para carregamento e erros
  loadingContainer: {
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    fontSize: 14,
    color: '#666',
    fontStyle: 'italic',
  },
  errorContainer: {
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f8f8f8',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  errorText: {
    fontSize: 14,
    color: '#c00',
    marginBottom: 10,
  },
  reloadButton: {
    backgroundColor: '#2E7D32',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 4,
    marginTop: 8,
  },
  reloadButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
  
  // Estilos de destaque
  highlightContainer: {
    flexDirection: 'row',
    marginVertical: 15,
    padding: 15,
    borderRadius: 8,
    borderLeftWidth: 4,
  },
  highlightInfo: {
    backgroundColor: '#E8F5E9',
    borderLeftColor: '#2E7D32',
  },
  highlightWarning: {
    backgroundColor: '#FFF8E1',
    borderLeftColor: '#FFA000',
  },
  highlightImportant: {
    backgroundColor: '#FFEBEE',
    borderLeftColor: '#C62828',
  },
  highlightIconContainer: {
    marginRight: 12,
  },
  highlightContent: {
    flex: 1,
  },
  highlightText: {
    color: '#333',
    fontSize: 16,
    lineHeight: 24,
  },
  
  // Estilos de lista
  listContainer: {
    marginVertical: 10,
  },
  listItemContainer: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  listBullet: {
    width: 20,
    alignItems: 'center',
  },
  listBulletText: {
    fontSize: 16,
    color: '#2E7D32',
  },
  listItemContent: {
    flex: 1,
  },
  listItemText: {
    fontSize: 16,
    lineHeight: 24,
    color: '#333',
  },
  
  // Estilos de imagem
  imageContainer: {
    marginVertical: 15,
    alignItems: 'center',
  },
  svgWebView: {
    width: '100%',
    backgroundColor: 'transparent',
  },
  imageCaption: {
    marginTop: 8,
    fontSize: 14,
    fontStyle: 'italic',
    color: '#666',
    textAlign: 'center',
  },
  placeholderSvg: {
    width: '100%',
    height: 150,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 15,
  },
  placeholderText: {
    color: '#666',
    fontStyle: 'italic',
    textAlign: 'center',
  },
  
  // Estilos legados
  bulletItem: {
    flexDirection: 'row',
    marginBottom: 8,
    paddingLeft: 16,
  },
  bullet: {
    fontSize: 16,
    color: '#2E7D32',
    marginRight: 8,
  },
  bulletText: {
    fontSize: 16,
    lineHeight: 24,
    color: '#333',
    flex: 1,
  },
  quoteContainer: {
    borderLeftWidth: 3,
    borderLeftColor: '#2E7D32',
    paddingLeft: 12,
    marginVertical: 10,
  },
  quote: {
    fontSize: 16,
    fontStyle: 'italic',
    color: '#444',
    lineHeight: 24,
  },
});
