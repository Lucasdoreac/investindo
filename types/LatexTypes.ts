/**
 * Definições de tipos para elementos LaTeX no aplicativo
 */

export interface LatexTable {
  type: 'table';
  headers?: string[];
  rows: string[][];
  caption?: string;
}

export interface LatexFormula {
  type: 'formula';
  content: string;
}

export interface LatexHighlight {
  type: 'highlight';
  content: string | LatexElement[];
  style?: 'info' | 'warning' | 'important';
}

export interface LatexList {
  type: 'list';
  items: (string | LatexElement | LatexElement[])[];
  ordered?: boolean;
}

export interface LatexImage {
  type: 'image';
  svg?: string; // SVG XML content para diagramas e fórmulas
  caption?: string;
}

export interface LatexText {
  type: 'text';
  content: string;
  style?: {
    bold?: boolean;
    italic?: boolean;
    size?: 'small' | 'normal' | 'large' | 'heading' | 'title';
    color?: string;
  };
}

export interface LatexSection {
  type: 'section';
  title: string;
  level: number; // 1 = chapter, 2 = section, 3 = subsection, etc.
  content: LatexElement[];
}

export type LatexElement = LatexText | LatexSection | LatexTable | 
                         LatexFormula | LatexHighlight | LatexList | LatexImage;
