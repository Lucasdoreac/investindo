import { test, expect } from '@playwright/test';

test.describe('Investindo com Sabedoria App', () => {
  test('deve carregar página inicial', async ({ page }) => {
    await page.goto('/');
    
    // Verificar se o título principal está visível
    await expect(page.getByText('Investindo com Sabedoria')).toBeVisible();
  });

  test('navegação para biblioteca deve funcionar', async ({ page }) => {
    await page.goto('/');
    
    // Navegar para a biblioteca
    await page.getByRole('link', { name: /biblioteca/i }).click();
    
    // Verificar se estamos na página certa
    await expect(page.url()).toContain('biblioteca');
    await expect(page.getByText('Biblioteca de Conteúdo')).toBeVisible();
  });

  test('calculadora de juros compostos deve ser funcional', async ({ page }) => {
    await page.goto('/');
    
    // Navegar para a calculadora
    await page.getByRole('link', { name: /simuladores/i }).click();
    await page.getByRole('link', { name: /juros compostos/i }).click();
    
    // Interagir com a calculadora
    await page.getByLabel('Valor inicial').fill('1000');
    await page.getByLabel('Aporte mensal').fill('100');
    await page.getByLabel('Taxa de juros').fill('0.5');
    await page.getByLabel('Período').fill('12');
    
    // Calcular
    await page.getByRole('button', { name: /calcular/i }).click();
    
    // Verificar se o resultado aparece
    await expect(page.getByText(/Valor final/i)).toBeVisible();
  });
});
